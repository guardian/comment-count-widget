const injected = [];

export function inject (html) {
    const node = document.createElement('div');
    node.id = '__test_node' + injected.length;
    node.innerHTML = html;

    document.body.appendChild(node);
    injected.push(node);
    return node;
}

export function clear () {
    injected.forEach(node => node.parentNode.removeChild(node));
}
