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
    callWith,
    identity
} from './utils';

export const load = callWith(init, { isUpdate: false });
export const update = callWith(init, { isUpdate: true });

function init ({
    apiBase, apiQuery, fetch = window.fetch, filter, isUpdate, onupdate, format = identity, Promise = window.Promise
} = {}) {
    if (!apiBase || !apiQuery) {
        return Promise.reject(new Error('Missing or invalid `apiBase` or `apiQuery`'));
    } else {
        return findElements(Promise, isUpdate, filter)
        .then(nodes => {
            const listIds = nodes.map(getDiscussionId).filter(Boolean);

            if (listIds.length) {
                const url = buildUrl(apiBase, apiQuery, listIds);

                return callApi(fetch, url)
                    .then(counts => updateNodes(Promise, nodes, counts, format, onupdate));
            }
        });
    }
}

function callApi (fetch, url) {
    return fetch(url, { mode: 'cors' })
    .then(asJson)
    .then(asIdCountMap);
}

function updateNodes (Promise, nodes, counts, format, onupdate) {
    return Promise.all(nodes.map(node => {
        markLoaded(node);
        const discussionId = getDiscussionId(node);
        const count = counts[discussionId] || 0;

        const updateAction = count > 0 ? setText : () => Promise.resolve();

        return updateAction(Promise, node, format(count))
            .then(()=> {
                if (onupdate) {
                    return onupdate(node, count);
                }
            });
    }));
}
