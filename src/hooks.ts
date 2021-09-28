import { UseAttribute } from "./types";

function getAttributeValue(
  element: HTMLElement,
  attributeName: string,
  defaultValue?: string
) {
  return element.attributes?.getNamedItem(attributeName)?.value ?? defaultValue;
}

export function useAttribute(
  element: HTMLElement,
  attributeName: string,
  defaultValue?: string
): ReturnType<UseAttribute> {
  const value = getAttributeValue(element, attributeName, defaultValue);

  const setValue = (
    newValueOrCallback: string | ((value?: string) => string)
  ) => {
    if (typeof newValueOrCallback === "function") {
      element.setAttribute?.(
        attributeName,
        newValueOrCallback(getAttributeValue(element, attributeName))
      );
      
      return;
    }

    element.setAttribute?.(attributeName, newValueOrCallback);
  };

  return [value, setValue];
}
