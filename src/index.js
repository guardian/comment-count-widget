import {
    findElements,
    getDiscussionId,
    setText,
    markLoaded
} from './dom';
import {
    asIdCountMap,
    asJson,
    buildUrl,
    callWith
} from './utils';

export const load = callWith(init, { isUpdate: false });
export const update = callWith(init, { isUpdate: true });

function init ({
    apiBase, apiQuery, fetch, filter, isUpdate, onupdate
} = {}) {
    if (!apiBase || !apiQuery) {
        return Promise.reject(new Error('Missing or invalid `apiBase` or `apiQuery`'));
    } else {
        return findElements(isUpdate, filter)
        .then(nodes => {
            const listIds = nodes.map(getDiscussionId).filter(Boolean);

            if (listIds.length) {
                const url = buildUrl(apiBase, apiQuery, listIds);

                return callApi(fetch || window.fetch, url)
                    .then(counts => updateNodes(nodes, counts, onupdate));
            }
        });
    }
}

function callApi (fetch, url) {
    return fetch(url, { mode: 'cors' })
    .then(asJson)
    .then(asIdCountMap);
}

function updateNodes (nodes, counts, onupdate) {
    return Promise.all(nodes.map(node => {
        markLoaded(node);
        const discussionId = getDiscussionId(node);
        const count = counts[discussionId] || 0;

        const updateAction = count > 0 ? setText : () => Promise.resolve();

        return updateAction(node, count)
            .then(()=> {
                if (onupdate) {
                    onupdate(node, count);
                }
            });
    }));
}
