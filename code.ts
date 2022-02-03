figma.showUI(__html__);

function uuidv4() {
  var d = new Date().getTime();
  var d2 = ((typeof performance !== "undefined") && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function isFrameSelected() {
  let containsFrameNode: boolean = false;
  for (const node of figma.currentPage.selection) {
    containsFrameNode = node.type === 'FRAME';
    if (containsFrameNode) {
      break;
    }
  }
  return containsFrameNode;
}

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-uid') {
    const uuidkey = 'FUN_';
    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
      for (const node of selection) {
        if ("name" in node) {
          node.name = uuidkey + uuidv4()
        }
      };
    } else {
      figma.notify("No frame selected", { timeout: 1500, });
    }
  }
  else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  else if (msg.type === 'elementsSelected') {
    figma.ui.postMessage({ pluginMessage: { type: 'elementsSelected', value: isFrameSelected() } });
  }
};

figma.on("selectionchange", () => {
  figma.ui.postMessage({ pluginMessage: { type: 'elementsSelected', value: isFrameSelected() } });
})
