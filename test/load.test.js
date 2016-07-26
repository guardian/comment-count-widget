import { load } from '../src/index';
import { inject, clear } from './lib/inject';
import { okResponse } from './lib/network';
import config from './lib/base-config';

describe('Load', function() {
    afterEach(function() {
        clear();
    });

    it('sets the text according to the API', function(done) {
        const container = inject([
            '<comment-count discussion="one"></comment-count>',
            '<comment-count discussion="two"></comment-count>'
        ]);

        load(config({
            fetch: okResponse([
                { id: 'one', count: 10 },
                { id: 'two', count: 5 }
            ])
        }))
        .then(() => {
            expect(container[0].querySelector('comment-count').innerText).toBe('10');
            expect(container[1].querySelector('comment-count').innerText).toBe('5');
        })
        .then(done)
        .catch(done.error);
    });

    it('ignores elements for which there is no comment count', function(done) {
        const container = inject([
            '<comment-count discussion="one"></comment-count>',
            '<comment-count discussion="two"></comment-count>'
        ]);

        load(config({
            fetch: okResponse([
                { id: 'one', count: 120 }
            ])
        }))
        .then(() => {
            expect(container[0].querySelector('comment-count').innerText).toBe('120');
            expect(container[1].querySelector('comment-count').innerText).toBe('');
        })
        .then(done)
        .catch(done.error);
    });
});
