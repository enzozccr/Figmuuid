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

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-uid') {
    const selection = figma.currentPage.selection;

    // Retrieves prefix and suffix from clientStorage
    const prefix = await figma.clientStorage.getAsync('uuidPrefix');
    const suffix = await figma.clientStorage.getAsync('uuidSuffix');

    // Rename name(s) of frame(s)
    for (const node of selection) {
      if ("name" in node && node.type === 'FRAME') {
        node.name = prefix + uuidv4() + suffix
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
  else if (msg.type === 'set-prefix') {
    const prefix = await figma.clientStorage.getAsync('uuidPrefix');
    if (prefix !== msg.value) {
      await figma.clientStorage.setAsync('uuidPrefix', msg.value);
      figma.notify("Prefix saved!", { timeout: 500, });
    }
  }
  else if (msg.type === 'set-suffix') {
    const suffix = await figma.clientStorage.getAsync('uuidSuffix');
    if (suffix !== msg.value) {
      await figma.clientStorage.setAsync('uuidSuffix', msg.value);
      figma.notify("Suffix saved!", { timeout: 500, });
    }
  }
};

figma.on("selectionchange", () => {
  figma.ui.postMessage({ pluginMessage: { type: 'elementsSelected', value: isFrameSelected() } });
})
