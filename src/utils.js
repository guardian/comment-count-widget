export function asJson (response) {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }
}

export function asIdCountMap (json) {
    if (json && json.counts && 'length' in json.counts) {
        return json.counts.reduce((map, value) => {
            map[value.id] = value.count;
            return map;
        }, {});
    } else {
        throw new Error('Invalid server response');
    }
}

export function buildUrl (apiBase, apiQuery, listIds) {
    const uniques = {};
    listIds.forEach(id => {
        uniques[id] = true;
    });
    return `${apiBase}?${apiQuery}=${Object.keys(uniques).join(',')}`;
}

export function callWithUpdate (fn, update) {
    return function(params = {}) {
        params.isUpdate = update;
        return fn(params);
    };
}

export function identity (val) {
    return val;
}
