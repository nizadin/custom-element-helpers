import { useAttribute } from "./hooks.js";
import type { CustomElementDefinition, CustomElementDefinitionParams } from "./types.js";
import { fetchTemplate, formatCustomElementName, getTemplateFetchParams } from "./utils.js";

export async function createCustomElementDefinition({
  extends: baseElement,
  init,
  name,
  observeAttributes,
  observedAttributes,
  onAdopt,
  onAttributeChange,
  onConnect,
  onDisconnect,
  styles,
  template,
}: CustomElementDefinitionParams): Promise<CustomElementDefinition> {
  const templateParamsOrTemplateNode = getTemplateFetchParams(template);

  const elementTemplate = Array.isArray(templateParamsOrTemplateNode)
    ? await fetchTemplate(...templateParamsOrTemplateNode)
    : templateParamsOrTemplateNode;

  const customElementName = formatCustomElementName(name || init?.name);

  if (!customElementName) {
    throw Error(
      "Custom element must have a name. Provide a non-anonymous function with a name as the `init` parameter, or specify the `name` parameter"
    );
  }

  const BaseElement = (
    baseElement
      ? document.createElement(baseElement).constructor
      : HTMLElement
  ) as CustomElementConstructor;

  class CustomElement extends BaseElement {
    constructor() {
      super();

      if (!baseElement) {
        const shadowRoot = this.attachShadow({ mode: 'open' }) as ShadowRoot & {
          adoptedStyleSheets: CSSStyleSheet[];
        };

        if (elementTemplate) {
          shadowRoot.appendChild(elementTemplate);
        }

        if (styles) {
          shadowRoot.adoptedStyleSheets = [styles].flat();
        }
      }

      this.addEventListener = this.addEventListener.bind(this);
      this.querySelector = this.querySelector.bind(this);
      this.useAttribute = this.useAttribute.bind(this);

      init?.(this);
    }

    connectedCallback() {
      onConnect?.(this);
    }

    disconnectedCallback() {
      onDisconnect?.(this)
    }

    adoptedCallback() {
      onAdopt?.(this);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      observeAttributes?.[name]?.(oldValue, newValue, this);
      onAttributeChange?.(name, oldValue, newValue, this);
    }

    useAttribute(attributeName: string, defaultValue?: string) {
      return useAttribute(this, attributeName, defaultValue);
    }

    static get observedAttributes() {
      return [
        ...(observedAttributes ?? []),
        ...(Object.keys(observeAttributes ?? {}).reduce((attributes, attributeName) => [
          ...attributes,
          attributeName
        ], [] as string[])),
      ];
    }
  }

  return [
    customElementName,
    CustomElement,
    baseElement ? { extends: baseElement } : undefined
  ];
};

export async function registerCustomElements(
  ...definitionParams: CustomElementDefinitionParams[]
) {
  for (const params of definitionParams) {
    const [
      name,
      constructorFunction,
      options,
    ] = await createCustomElementDefinition(params);

    customElements.define(name, constructorFunction, options);
  }
}
