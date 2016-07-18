const injected = [];

export function inject (htmlOrArray) {
    const node = document.createElement('div');
    let newNodes;

    node.id = '__test_node' + injected.length;
    if (typeof htmlOrArray === 'string') {
        node.innerHTML = htmlOrArray;
    } else {
        newNodes = htmlOrArray.map(html => {
            const innerNode = document.createElement('div');
            innerNode.innerHTML = html;
            node.appendChild(innerNode);
            return innerNode;
        });
    }

    document.body.appendChild(node);
    injected.push(node);
    return newNodes || node;
}

export function clear () {
    injected.forEach(node => node.parentNode.removeChild(node));
    injected.length = 0;
}
