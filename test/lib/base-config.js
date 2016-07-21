const config = { apiBase: 'api', apiQuery: 'ids' };

export default function(override) {
    return Object.assign(override, config);
}
