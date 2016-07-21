import { load } from '../src/index';
import { inject, clear } from './lib/inject';
import { okResponse } from './lib/network';
import config from './lib/base-config';

describe('Callback', function() {
    afterEach(function() {
        clear();
    });

    it('calls a user callback after setting the widget value', function(done) {
        const container = inject('<comment-count data-discussion-id="one"></comment-count>');
        const onupdate = jasmine.createSpy('onupdate');

        load(config({
            fetch: okResponse([
                { id: 'one', count: 15 }
            ]),
            onupdate
        }))
        .then(() => {
            expect(container.querySelector('comment-count').innerText).toBe('15');
            expect(onupdate).toHaveBeenCalledTimes(1);
            expect(onupdate.calls.argsFor(0)).toEqual([container.querySelector('comment-count'), 15]);
        })
        .then(done)
        .catch(done.error);
    });

    it('does not handle errors in update callback, letting them bubble up', function(done) {
        inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="two"></comment-count>'
        ]);
        const onupdate = jasmine.createSpy('onupdate').and.callFake(() => { throw new Error('In callback'); });

        load(config({
            fetch: okResponse([
                { id: 'one', count: 15 }
            ]),
            onupdate
        }))
        .catch(error => {
            expect(error.message).toMatch(/in callback/i);
        })
        .then(done)
        .catch(done.error);
    });
});
