import { load, update } from '../src/index';

describe('Validation', function() {
    it('apiBase is mandatory in `load`', function(done) {
        load().catch(error => {
            expect(error.message).toMatch(/missing or invalid.*apibase/i);
            done();
        });
    });

    it('apiBase is mandatory in `update`', function(done) {
        update({ apiBase: '' }).catch(error => {
            expect(error.message).toMatch(/missing or invalid.*apibase/i);
            done();
        });
    });
});
