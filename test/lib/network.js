export function okResponse (counts) {
    return function() {
        return Promise.resolve({
            ok: true,
            json () {
                return { counts };
            }
        });
    };
}
