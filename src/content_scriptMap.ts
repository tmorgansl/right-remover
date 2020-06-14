const mutationCallback = (mutationsList: MutationRecord[]): void => {
  const isActive = document.querySelector(".isActive");
  for(const mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      if (mutation.target.isSameNode(isActive)) {
        console.log('called!')
      }
    }
  }
}

export const bindMapPageDOM = async (): Promise<void> => {
  const sidePanel = document.querySelector(".mapSidePanel");
  new MutationObserver(mutationCallback).observe(sidePanel, { attributes: true })
}
