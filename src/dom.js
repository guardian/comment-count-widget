export function findElements (isUpdate, userFilter = () => true) {
    // TODO fastdom?
    const shouldProcess = isUpdate ? filterLoaded : () => true;
    const widgets = document.getElementsByTagName('comment-count');
    const nodes = [];
    for (let i = 0, len = widgets.length; i < len; i += 1) {
        const node = widgets[i];
        if (shouldProcess(node) && userFilter(node)) {
            nodes.push(node);
        }
    }
    return Promise.resolve(nodes);
}

function filterLoaded (node) {
    // TODO something
    return node ? true : true;
}

export function getDiscussionId (node) {
    return node.getAttribute('data-discussion-id');
}

export function setText (node, count) {
    node.innerText = count;
}
