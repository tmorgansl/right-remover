const HIDE_PROPERTY_CLASSNAME = "hidePropertyToggle";

const addHidePropertyToggle = (parent: Element): void => {
  const hidePropertyElement = document.createElement("a");
  hidePropertyElement.textContent = "hello";
  hidePropertyElement.className = HIDE_PROPERTY_CLASSNAME;

  const linkButton = parent.querySelector(".expPropCardPropertyLinkButton");
  linkButton.appendChild(hidePropertyElement);
}

const mutationCallback = (mutationsList: MutationRecord[]): void => {
  for(const mutation of mutationsList) {
    const target = mutation.target as Element;
    if (target.className.includes("isActive")) {
      switch (mutation.type) {
        case "childList":
          mutation.removedNodes.forEach((n: Element) => {
            if (n.className.includes("expandedPropertyCard-placeholder")) {
              addHidePropertyToggle(target);
            }
          })
          break;
        case "attributes":
          if (mutation.attributeName === 'class' && target.querySelector(".expandedPropertyCard-placeholder") == null && target.querySelector("."+HIDE_PROPERTY_CLASSNAME) == null) {
            addHidePropertyToggle(target);
          }
          break;
      }
    }
  }
}

export const bindMapPageDOM = async (): Promise<void> => {
  const sidePanel = document.querySelector(".mapSidePanel");
  new MutationObserver(mutationCallback).observe(sidePanel, { attributes: true, childList: true, subtree:true })
}
