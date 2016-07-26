import { load, update } from '../src/index';

const config = {
    apiBase: '/random',
    apiQuery: 'ids'
};
let COUNT = 0;

logPromise(load(config));

document.querySelector('.add').addEventListener('click', () => {
    const node = document.createElement('div');
    node.innerHTML = `<comment-count discussion="up${++COUNT}">?</comment-count>`;
    document.body.appendChild(node);
});
document.querySelector('.load').addEventListener('click', () => {
    logPromise(load(config));
});
document.querySelector('.update').addEventListener('click', () => {
    logPromise(update(config));
});

function log (text) {
    const node = document.createElement('p');
    node.innerHTML = text;
    document.body.appendChild(node);
}

function logPromise (promise) {
    promise.then(() => {
        log('Comment count loaded successfully');
    })
    .catch(error => {
        log('Error loading comment count: ' + error.message);
    });
}
