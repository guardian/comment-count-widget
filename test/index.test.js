import { CommentCount } from '../src/index';
import { inject, clear } from './lib/inject';

describe('Load', function() {
    afterEach(function() {
        clear();
    });

    it('fails', function(done) {
        CommentCount({ fail: true })
        .catch(error => {
            expect(error.message).toMatch(/error loading/i);
            done();
        });
    });

    it('works', function(done) {
        const container = inject('<comment-count></comment-count>');

        CommentCount({ fail: false })
        .then(() => {
            expect(container.querySelector('comment-count').innerText).toBe('42');
        })
        .then(done)
        .catch(done.error);
    });
});
