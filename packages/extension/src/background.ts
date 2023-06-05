import { ExtensionActions } from './actions';

/**
 *
 */
class ExtensionBackgroundInteractor {
  /**
   *
   */
  public onInit() {
    chrome.runtime.onConnect.addListener((port) => {
      chrome.action.onClicked.addListener(async() => {
        const [ tab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

        port.postMessage({
          type: ExtensionActions.ToggleExtensionPopup,
          payload: tab.id
        });

        return true;
      });
    });
  }
}

const interactor: ExtensionBackgroundInteractor = new ExtensionBackgroundInteractor();
interactor.onInit();