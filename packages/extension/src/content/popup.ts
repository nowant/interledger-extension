/**
 *
 */
export class ExtensionPopupView {
  //
  public get element(): HTMLElement | null {
    return this._element;
  }

  //
  private _element: HTMLElement | null = null;

  /**
   *
   */
  public toggle(): void {
    if (this._element) {
      return this.detach();
    }

    this.attach();
  }
  /**
   *
   */
  public attach(): void {
    this._element = document.createElement('extension-app');
    this._element.id = 'interledger-extension-view-id';
    this._element.style.position = 'fixed';
    this._element.style.zIndex = '99999999999999';
    this._element.style.width = '420px';
    this._element.style.height = '130px';
    this._element.style.top = '0px';
    this._element.style.right = '0px';
    this._element.style.padding = '0 20px';
    this._element.style.background = '#fff';
    this._element.style.border = '1px solid #e0c7fd';
    this._element.style.borderBottomLeftRadius = '5px';
    this._element.style.borderTopLeftRadius = '5px';
    document.body.appendChild(this._element);
  }

  /**
   *
   */
  public detach(): void {
    if (this._element) {
      document.body.removeChild(this._element);
      this._element = null;
    }
  }
}