# Custom Element Helpers (CEH)

Helper functions for defining custom elements.

## Modules

### `custom-element`

#### `createCustomElementDefinition(params: CustomElementDefinitionParams)`

#### `CustomElementDefinitionParams`

##### `CustomElement` type

```typescript
type CustomElement = HTMLElement & {
  useAttribute: (attributeName: string, defaultValue?: string) => [
    attributeValue: string,
    setValue: (newValueOrCallback: string | (value: string) => string),
  ];
};
```

| Name                 | Type                                                                                          | Description | Default |
|----------------------|-----------------------------------------------------------------------------------------------|-------------|---------|
| `extends`            | `keyof HTMLElementTagNameMap`                                                                 | Tag name of the extended HTML element. | |
| `init`               | `(element: CustomElement) => void`                                                            | Function run at the end of the constructor. | |
| `name`               | `string`                                                                                      | Name of the custom element. | `init` function name |
| `observeAttributes`  | `Record<string, (oldValue: string, newValue: string, element: CustomElement) => void>`        | Object, where keys are attribute names to be observed, and values are callback functions for corresponding attributes. | |
| `observedAttributes` | `string[]`                                                                                    | Array of attribute names to observe. Unlike `observeAttributes`, with this parameter you can't provide callback function directly mapped to specific attribute, instead you have to rely on the `onAttributeChange` callback. So generally, it's recommended to use the `observeAttributes` instead. | |
| `onAdopt`            | `(element: CustomElement) => void`                                                            | Called when element is transferred to other DOM tree. | |
| `onAttributeChange`  | `(attributeName: string, oldValue: string, newValue: string, element: CustomElement) => void` | Called when one of the *observed* attributes changes. | |
| `onConnect`          | `(element: CustomElement) => void`                                                            | Called when element is mounted into the DOM tree. | |
| `onDisconnect`       | `(element: CustomElement) => void`                                                            | Called when element is dismounted from the DOM tree. | |
| `styles`             | `CSSStyleSheet \| CSSStyleSheet[]`                                                            | CSS stylesheets to be attached to the `shadowRoot` of the element. Note, in case of an extended element, `shadowRoot` is not attached, so style sheets will be ignored. | |
| `template`           | `string \| [templateRelativePath: string, moduleURL: string] \| Node`                           | Path to the HTML file with a `template` element or `template` element node. Path can be a tuple, where first value is the relative path to the template file in regards to the module that uses it, and the second value is the URL of the module; or if template file and module file share the same name, then path can be just the module URL. | |