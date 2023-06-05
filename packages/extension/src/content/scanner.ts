/**
 *
 */
export class ExtensionLinkTagScanner {
  public scan(): HTMLLinkElement[] {
    return Array.from(document.getElementsByTagName('link'));
  }
}