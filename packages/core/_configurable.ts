import { isClient } from '@rcuse/shared'

export interface ConfigurableDocument {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  document?: Document
}

export const defaultDocument = /* #__PURE__ */ isClient ? window.document : undefined
