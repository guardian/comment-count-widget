import fastdom from 'fastdom';

export function findElements (Promise, isUpdate, userFilter = () => true) {
    return new Promise(resolve => {
        const shouldProcess = isUpdate ? filterLoaded : () => true;
        const widgets = document.getElementsByTagName('comment-count');
        const nodes = [];
        for (let i = 0, len = widgets.length; i < len; i += 1) {
            const node = widgets[i];
            if (shouldProcess(node) && userFilter(node)) {
                nodes.push(node);
            }
        }
        resolve(nodes);
    });
}

function filterLoaded (node) {
    return node.widgetLoaded !== true;
}

export function getDiscussionId (node) {
    return node.getAttribute('discussion');
}

export function setText (Promise, node, count) {
    return new Promise(resolve => {
        fastdom.write(() => {
            node.textContent = count;
            resolve();
        });
    });
}

export function markLoaded (node) {
    node.widgetLoaded = true;
}
