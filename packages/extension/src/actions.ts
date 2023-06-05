export enum ExtensionActions {
  ToggleExtensionPopup = 'TOGGLE_EXTENSION_POPUP',
  CloseExtensionPopup = 'CLOSE_EXTENSION_POPUP',
  UpdateLinkTagsResult = 'UPDATE_LINK_TAGS_RESULT'
}

export interface ExtensionAction {
  type:  ExtensionActions;
  payload: any;
}