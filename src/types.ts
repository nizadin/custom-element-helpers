export type UseAttribute = (attributeName: string, defaultValue?: string) => [
  attributeValue: string | undefined,
  setAttribute: (newValueOrCallback: string | ((value?: string) => string)) => void,
];

export type CustomElement = HTMLElement & {
  useAttribute: UseAttribute;
};

export type ObserveAttributeCallback = (
  oldValue: string,
  newValue: string,
  element: CustomElement
) => void;

export type ObservedAttributeCallback = (
  attributeName: string,
  oldValue: string,
  newValue: string,
  element: CustomElement
) => void;

export type CustomElementTemplateParam =
  | string
  | [templateRelativePath: string, modulePath: string]
  | Node

export type CustomElementDefinitionParams = {
  extends?: keyof HTMLElementTagNameMap,
  init?: (element: CustomElement) => void,
  name: string,
  observeAttributes?: Record<string, ObserveAttributeCallback>,
  observedAttributes?: string[],
  onAdopt?: (element: CustomElement) => void,
  onAttributeChange?: ObservedAttributeCallback,
  onConnect?: (element: CustomElement) => void,
  onDisconnect?: (element: CustomElement) => void,
  styles?: CSSStyleSheet | CSSStyleSheet[],
  template?: CustomElementTemplateParam,
};

export type CustomElementDefinition = [
  customElementName: string,
  customElement: CustomElementConstructor,
  options?: ElementDefinitionOptions,
];