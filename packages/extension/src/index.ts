import { ExtensionActions } from './actions';

/**
 *
 */
class ExtensionApp extends HTMLElement {
  /**
   *
   */
  public template = `
    <style>
      .extension {
        color: #1F2328;
      }

      .extension__title {
        margin: 20px 0;
        font-size: 24px;
      }

      .extension__result {
        font-size: 16px;
      }

      .extension__highlight {
        color: #8f3aeb;
      }

      .extension__result-found {
        margin-right: 10px;
        color: #8f3aeb;
        font-weight: 600;
      }

      .extension__result-succeeded {
        font-weight: 600;
        color: #41b883;
      }

      .extension__result-errored {
        margin-right: 10px;
        font-weight: 600;
        color: #e34c26;
      }
    </style>

    <div class="extension">
      <h1 class="extension__title">
        Interledger <span class="extension__highlight" >&lt;Link&gt;</span> Scanner
      </h1>
      <div class="extension__result">
        Found
        <span
          id="extension-found"
          class="extension__result-found"
          title="Total links amount"
        ></span>
        Processed
        <span
          id="extension-succeeded"
          class="extension__result-succeeded"
          title="Links loaded successfully"
        ></span> /
        <span
          id="extension-errored"
          class="extension__result-errored"
          title="Links loaded with an error"
        ></span>

        <button
          type="button"
          id="extension-close-btn"
        >close</button>
      </div>
    </div>
  `

  /**
   *
   */
  public set total(value: number) {
    const element: HTMLElement | null = (this.shadowRoot as ShadowRoot).getElementById('extension-found');

    if (element) {
      element.textContent = value.toString();
    }
  }

  /**
   *
   */
  public set succeeded(value: number) {
    const element: HTMLElement | null = (this.shadowRoot as ShadowRoot).getElementById('extension-succeeded');

    if (element) {
      element.textContent = value.toString();
    }
  }

  /**
   *
   */
  public set errored(value: number) {
    const element: HTMLElement | null = (this.shadowRoot as ShadowRoot).getElementById('extension-errored');
    if (element) {
      element.textContent = value.toString();
    }
  }

  /**
   *
   */
  public get closeButton(): HTMLElement | null {
    return (this.shadowRoot as ShadowRoot).getElementById('extension-close-btn');
  }


  /**
   *
   */
  constructor() {
    super();

    window.addEventListener(ExtensionActions.UpdateLinkTagsResult, (event: any) => {
      this.onUpdate(event.detail);
    }, false);
  }

  /**
   *
   */
  public connectedCallback() {
    this.onRender();
    this.onUpdate({ total: 0, succeeded: 0, errored: 0 });
  }

  /**
   *
   */
  public onUpdate(updates: any) {
    const { total, succeeded, errored } = updates;
    this.total = total || 0;
    this.succeeded = succeeded || 0;
    this.errored = errored || 0;
  }

  /**
   *
   */
  public onRender() {
    this.attachShadow({ mode: 'open' });
    (this.shadowRoot as ShadowRoot).innerHTML = this.template;

    this.closeButton?.addEventListener('click', () => {
      const customEvent = new CustomEvent(
        ExtensionActions.CloseExtensionPopup
      );

      window.dispatchEvent(customEvent);
    })
  }
}

customElements.define('extension-app', ExtensionApp);