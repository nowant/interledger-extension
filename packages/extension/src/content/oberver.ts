/**
 *
 */
export class ExtensionLinksTagObserver {
  /**
   *
   */
  public observe(
    element: HTMLElement,
    onAdded: (nodes: HTMLLinkElement[]) => void,
    onRemoved: (nodes: HTMLLinkElement[]) => void,
  ) {
    const observer: MutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            const linkNodes: Node[] = Array.from(mutation.addedNodes)
              .filter((n) => n.nodeName === 'LINK');

            if (linkNodes.length > 0) {
              onAdded(linkNodes as HTMLLinkElement[]);
            }
          }

          if (mutation.removedNodes.length > 0) {
            const linkNodes: Node[] = Array.from(mutation.removedNodes)
              .filter((n) => n.nodeName === 'LINK');

            if (linkNodes.length > 0) {
              onRemoved(linkNodes as HTMLLinkElement[]);
            }
          }
        }
      }
    });

    observer.observe(element, { childList: true });
  }

  /**
   *
   */
  public observeHrefAttribute(
    element: HTMLLinkElement,
    onChanged: () => void
  ) {
    const observer: MutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          onChanged();
        }
      }
    });

    observer.observe(element, { attributes: true, attributeFilter: ['href'] });
  }
}