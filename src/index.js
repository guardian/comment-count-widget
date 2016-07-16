export function CommentCount ({ fail }) {
    return new Promise((resolve, reject) => {
        if (fail) {
            reject(new Error('Error loading comment count'));
        } else {
            const widgets = document.getElementsByTagName('comment-count');
            Array.from(widgets).forEach(fill);
            resolve();
        }
    });
}

function fill (element) {
    element.innerText = 42;
}
