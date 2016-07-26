import { load } from '../src/index';
import { inject, clear } from './lib/inject';
import { okResponse } from './lib/network';
import config from './lib/base-config';

describe('Format', function() {
    afterEach(function() {
        clear();
    });

    it('formats the comment count', function(done) {
        const container = inject('<comment-count discussion="format"></comment-count>');

        load(config({
            fetch: okResponse([
                { id: 'format', count: 5000 }
            ]),
            format (count) {
                return 'formatted-' + count;
            }
        }))
        .then(() => {
            expect(container.querySelector('comment-count').innerText).toBe('formatted-5000');
        })
        .then(done)
        .catch(done.error);
    });
});
