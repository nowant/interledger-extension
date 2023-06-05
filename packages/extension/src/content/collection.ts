export interface ExtensionLinkTagStatus {
  tag: HTMLLinkElement,
  status: number
}

export class ExtensionLinkTagsCollection {
  private _linksMap = new Map<number, ExtensionLinkTagStatus[]>;

  /**
   *
   */
  public getAll(id: number): ExtensionLinkTagStatus[] | undefined {
    return this._linksMap.get(id);
  }

  /**
   *
   */
  public getUnprocessed(id: number): ExtensionLinkTagStatus[] | undefined {
    return this._linksMap.get(id)
    ?.filter((link) => {
      return link.status === 0;
    });
  }

  /**
   *
   */
  public getSucceeded(id: number): ExtensionLinkTagStatus[] | undefined {
    return this._linksMap.get(id)
      ?.filter((link) => {
        return link.status >= 200 && link.status < 300;
      });
  }

  /**
   *
   */
  public getErrored(id: number): ExtensionLinkTagStatus[] | undefined {
    return this._linksMap.get(id)
      ?.filter((link) => {
        return link.status >= 300 && link.status < 600;
      });
  }

  /**
   *
   */
  public has(id: number): boolean {
    return this._linksMap.has(id);
  }

  /**
   *
   */
  public hasOne(id: number, link: HTMLLinkElement): ExtensionLinkTagStatus | undefined {
    return this._linksMap.get(id)
      ?.find((storedLink) => {
        return storedLink.tag === link;
      });
  }

  /**
   *
   */
  public add(id: number, links: HTMLLinkElement[]): void {
    if (!this._linksMap.has(id)) {
      const statuses: ExtensionLinkTagStatus[] = links.map((link) => {
        return {
          tag: link,
          status: 0
        };
      });

      this._linksMap.set(id, statuses);
    }
  }

  /**
   *
   */
  public append(id: number, links: HTMLLinkElement[]) {
    const items: ExtensionLinkTagStatus[] | undefined = this._linksMap.get(id);

    if (items && items.length > 0) {
      for (const link of links) {
        items.push({
          tag: link,
          status: 0
        });
      }
    }
  }

  /**
   *
   */
  public updateOne(id: number, link: ExtensionLinkTagStatus) {
    const items: ExtensionLinkTagStatus[] | undefined = this._linksMap.get(id);

    if (items && items.length > 0) {
      const itemIndex: number = items.findIndex((i) => i.tag === link.tag);

      if (itemIndex > -1) {
        items[itemIndex] = link;
      }
    }
  }

  /**
   *
   */
  public remove(id: number, links: HTMLLinkElement[]) {
    const items: ExtensionLinkTagStatus[] | undefined = this._linksMap.get(id);

    if (items && items.length > 0) {
      for (const link of links) {
        const itemIndex: number = items.findIndex((i) => i.tag === link);

        if (itemIndex > -1) {
          items.splice(itemIndex, 1);
        }
      }
    }
  }
}