import { load, update } from '../src/index';
import { inject, clear } from './lib/inject';

describe('Errors', function() {
    beforeEach(function() {
        inject('<comment-count data-discussion-id="one"></comment-count>');
    });
    afterEach(function() {
        clear();
    });

    const config = { apiBase: 'api', apiQuery: 'ids'};

    it('rejects with error if server is not responding', function(done) {
        load(Object.assign({
            fetch () {
                return Promise.reject(new Error('invalid'));
            }
        }, config))
        .catch(error => {
            expect(error.message).toBe('invalid');
        })
        .then(done)
        .catch(done.error);
    });

    it('rejects with error if server response is not ok', function(done) {
        update(Object.assign({
            fetch () {
                return Promise.resolve({
                    ok: false,
                    statusText: 'error status'
                });
            }
        }, config))
        .catch(error => {
            expect(error.message).toMatch(/error status/i);
        })
        .then(done)
        .catch(done.error);
    });

    it('rejects with error if server response cannot be understood', function(done) {
        load(Object.assign({
            fetch () {
                return Promise.resolve({
                    ok: true,
                    json () {
                        return { banana: 'fruit' };
                    }
                });
            }
        }, config))
        .catch(error => {
            expect(error.message).toMatch(/invalid server response/i);
        })
        .then(done)
        .catch(done.error);
    });
});
