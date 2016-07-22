export function asJson (response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

export function asIdCountMap (json) {
    if (json && json.counts && 'length' in json.counts) {
        const map = {};
        json.counts.forEach(value => {
            map[value.id] = value.count;
        });
        return map;
    } else {
        return Promise.reject(new Error('Invalid server response'));
    }
}

export function buildUrl (apiBase, apiQuery, listIds) {
    return `${apiBase}?${apiQuery}=${listIds.join(',')}`;
}

export function callWith (fn, defaults) {
    return function(params) {
        return fn(Object.assign(defaults, params));
    };
}

export function identity (val) {
    return val;
}
