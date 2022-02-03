// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'generate-uid') {
        //const acronym = figma.currentPage.name.substring(0,6);
        const uuidkey = 'FUN_';
        // UUID generation formula
        function generateUUID() {
            var d = new Date().getTime(); //Timestamp
            var d2 = ((typeof performance !== "undefined") && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = Math.random() * 16; //random number between 0 and 16
                if (d > 0) { //Use timestamp until depleted
                    r = (d + r) % 16 | 0;
                    d = Math.floor(d / 16);
                }
                else { //Use microseconds since page-load if supported
                    r = (d2 + r) % 16 | 0;
                    d2 = Math.floor(d2 / 16);
                }
                return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
        // Rename selected frames
        for (const node of figma.currentPage.selection) {
            if ("name" in node) {
                node.name = uuidkey + generateUUID();
            }
        }
        ;
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
