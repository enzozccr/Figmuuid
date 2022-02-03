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
    const selection = figma.currentPage.selection;

    // Store in the clientStorage, the prefix & suffix
    figma.clientStorage.setAsync('uuidPrefix', msg.prefix);
    figma.clientStorage.setAsync('uuidSuffix', msg.suffix);

    // Rename name(s) of frame(s)
    for (const node of selection) {
      if ("name" in node && node.type === 'FRAME') {
        node.name = msg.prefix + uuidv4() + msg.suffix
      }
    };
    figma.notify(selection.length + " frames renamed", {
      timeout: 500,
    });
  }

  else if (msg.type === 'elementsSelected') {
    figma.ui.postMessage({ pluginMessage: { type: 'elementsSelected', value: isFrameSelected() } });
  }
  else if (msg.type === 'currentPrefix') {
    figma.clientStorage.getAsync("uuidPrefix").then(result => {
      if (result) {
        figma.ui.postMessage({
          pluginMessage: {
            type: 'currentPrefix',
            value: result
          }
        });
      }
    });
  }
  else if (msg.type === 'currentSuffix') {
    figma.clientStorage.getAsync("uuidSuffix").then(result => {
      if (result) {
        figma.ui.postMessage({
          pluginMessage: {
            type: 'currentSuffix',
            value: result
          }
        });
      }
    });
  }
};

figma.on("selectionchange", () => {
  figma.ui.postMessage({ pluginMessage: { type: 'elementsSelected', value: isFrameSelected() } });
})
