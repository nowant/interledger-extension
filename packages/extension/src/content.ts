import { ExtensionPopupView } from './content/popup';
import { ExtensionLinkTagScanner } from './content/scanner';
import { ExtensionActions, ExtensionAction } from './actions';
import { ExtensionLinkTagStatus, ExtensionLinkTagsCollection } from './content/collection';
import { ExtensionLinksTagObserver } from './content/oberver';

/**
 *
 */
class ExtensionContentInteractor {
  private _popupView: ExtensionPopupView = new ExtensionPopupView();

  private _scanner: ExtensionLinkTagScanner = new ExtensionLinkTagScanner();

  private _collection: ExtensionLinkTagsCollection = new ExtensionLinkTagsCollection();

  private _observer: ExtensionLinksTagObserver = new ExtensionLinksTagObserver();

  private _port!: chrome.runtime.Port;

  private _tabId!: number;

  /**
   *
   */
  public onInit() {
    this._port = chrome.runtime.connect();

    this._port.onMessage.addListener((action: ExtensionAction) => {
      const tabId: number = action.payload;
      this._tabId = !this._tabId ? tabId : this._tabId;

      if (this._tabId !== tabId) {
        return;
      }

      if (action.type === ExtensionActions.ToggleExtensionPopup) {
        this._popupView.toggle();

        if (!this._collection.has(this._tabId)) {
          this._onScanLinkTagsOnce();
          this._resolveLinkTags(
            this._collection.getAll(this._tabId) || []
          );
        }

        return this._broadcastLinkTagsUpdate();
      }
    });

    window.addEventListener(ExtensionActions.CloseExtensionPopup, () => {
      this._popupView.detach();
    }, false);
  }

  /**
   *
   */
  private _onScanLinkTagsOnce() {
    const tags: HTMLLinkElement[] = this._scanner.scan();
    this._collection.add(this._tabId, tags);
    this._observeLinkTagHrefs(tags);

    this._observer.observe(
      document.head,
      (tags: HTMLLinkElement[]) => {
        this.onAppendLinkTags(tags);
      },
      (tags: HTMLLinkElement[]) => {
        this.onRemoveLinkTags(tags);
      }
    );

    this._observer.observe(
      document.body,
      (tags: HTMLLinkElement[]) => {
        this.onAppendLinkTags(tags);
      },
      (tags: HTMLLinkElement[]) => {
        this.onRemoveLinkTags(tags);
      }
    );
  }

  /**
   *
   */
  private onAppendLinkTags(tags: HTMLLinkElement[] ) {
    this._collection.append(this._tabId, tags);
    const links: ExtensionLinkTagStatus[] | undefined = this._collection.getUnprocessed(this._tabId);
    this._resolveLinkTags(links || []);
    this._observeLinkTagHrefs(tags);
  }

  /**
   *
   */
  private onRemoveLinkTags(tags: HTMLLinkElement[] ) {
    this._collection.remove(this._tabId, tags);
    this._broadcastLinkTagsUpdate();
  }

  /**
   *
   */
  private _broadcastLinkTagsUpdate() {
    const customEvent = new CustomEvent(
      ExtensionActions.UpdateLinkTagsResult,
      {
        detail: {
          total: this._collection.getAll(this._tabId)?.length,
          succeeded: this._collection.getSucceeded(this._tabId)?.length,
          errored: this._collection.getErrored(this._tabId)?.length
        }
      }
    );

    window.dispatchEvent(customEvent);
  }

  /**
   *
   */
  private async _resolveLinkTags(links: ExtensionLinkTagStatus[]): Promise<void> {
    for (const link of links) {
      await this._resolveLinkTag(link);
    }
  }

  /**
   *
   */
  private async _resolveLinkTag(link: ExtensionLinkTagStatus) {
    await window.fetch(link.tag.href)
      .then((response) => {
        this._collection.updateOne(this._tabId, {
          tag: link.tag,
          status: response.status
        });
      })
      .catch(() =>  {
        this._collection.updateOne(this._tabId, {
          tag: link.tag,
          status: 403
        });
      })
      .finally(() => {
        this._broadcastLinkTagsUpdate();
      });
  }

  /**
   *
   */
  private _observeLinkTagHrefs(tags: HTMLLinkElement[]) {
    for (const tag of tags) {
      this._observer.observeHrefAttribute(tag, async () => {
        await this._resolveLinkTag({
          tag,
          status: 0
        })
      })
    }
  }
}

const interactor: ExtensionContentInteractor = new ExtensionContentInteractor();
interactor.onInit();