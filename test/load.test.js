import { load } from '../src/index';
import { inject, clear } from './lib/inject';

describe('Load', function() {
    afterEach(function() {
        clear();
    });

    const config = { apiBase: 'api', apiQuery: 'ids' };

    it('sets the text according to the API', function(done) {
        const container = inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="two"></comment-count>'
        ]);

        load(Object.assign({
            fetch () {
                return Promise.resolve({
                    ok: true,
                    json () {
                        return {
                            counts: [
                                { id: 'one', count: 10 },
                                { id: 'two', count: 5 }
                            ]
                        };
                    }
                });
            }
        }, config))
        .then(() => {
            expect(container[0].querySelector('comment-count').innerText).toBe('10');
            expect(container[1].querySelector('comment-count').innerText).toBe('5');
        })
        .then(done)
        .catch(done.error);
    });

    it('ignores elements for which there is no comment count', function(done) {
        const container = inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="two"></comment-count>'
        ]);

        load(Object.assign({
            fetch () {
                return Promise.resolve({
                    ok: true,
                    json () {
                        return {
                            counts: [
                                { id: 'one', count: 120 }
                            ]
                        };
                    }
                });
            }
        }, config))
        .then(() => {
            expect(container[0].querySelector('comment-count').innerText).toBe('120');
            expect(container[1].querySelector('comment-count').innerText).toBe('');
        })
        .then(done)
        .catch(done.error);
    });
});
