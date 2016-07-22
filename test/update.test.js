import { load, update } from '../src/index';
import { inject, clear } from './lib/inject';
import { okResponse } from './lib/network';
import config from './lib/base-config';

describe('Update', function() {
    afterEach(function() {
        clear();
    });

    it('updates only the elements added after the last load', function(done) {
        const firstContainer = inject('<comment-count data-discussion-id="before"></comment-count>');
        const loadCallback = jasmine.createSpy('loadCallback');
        const updateCallback = jasmine.createSpy('updateCallback');

        load(config({
            fetch: okResponse([
                { id: 'before', count: 99 }
            ]),
            onupdate: loadCallback
        }))
        .then(() => {
            expect(firstContainer.querySelector('comment-count').innerText).toBe('99');
            expect(loadCallback).toHaveBeenCalledTimes(1);
            expect(loadCallback).toHaveBeenCalledWith(firstContainer.querySelector('comment-count'), 99);
        })
        .then(() => {
            const secondContainer = inject('<comment-count data-discussion-id="after"></comment-count>');

            return update(config({
                fetch: okResponse([
                    { id: 'after', count: 10 }
                ]),
                onupdate: updateCallback
            }))
            .then(() => {
                expect(secondContainer.querySelector('comment-count').innerText).toBe('10');
                expect(updateCallback).toHaveBeenCalledTimes(1);
                expect(updateCallback).toHaveBeenCalledWith(secondContainer.querySelector('comment-count'), 10);
            });
        })
        .then(() => {
            // The first callback doesn't get called again
            expect(loadCallback).toHaveBeenCalledTimes(1);
        })
        .then(done)
        .catch(done.error);
    });

    it('marks widgets with 0 comments as loaded, but not the one filtered out', function(done) {
        const firstContainer = inject([
            '<comment-count data-discussion-id="zero"></comment-count>',
            '<comment-count data-discussion-id="ignore"></comment-count>'
        ]);
        const loadCallback = jasmine.createSpy('loadCallback');
        const updateCallback = jasmine.createSpy('updateCallback');

        load(config({
            fetch: okResponse([]),
            onupdate: loadCallback,
            filter (node) {
                return node.dataset.discussionId !== 'ignore';
            }
        }))
        .then(() => {
            expect(loadCallback).toHaveBeenCalledTimes(1);
        })
        .then(() => {
            const secondContainer = inject('<comment-count data-discussion-id="non-zero"></comment-count>');

            return update(config({
                fetch: okResponse([
                    { id: 'non-zero', count: 10 }
                ]),
                onupdate: updateCallback
                // no filter in update
            }))
            .then(() => {
                expect(secondContainer.querySelector('comment-count').innerText).toBe('10');
                expect(updateCallback).toHaveBeenCalledTimes(2);
                expect(updateCallback).toHaveBeenCalledWith(firstContainer[1].querySelector('comment-count'), 0);
                expect(updateCallback).toHaveBeenCalledWith(secondContainer.querySelector('comment-count'), 10);
            });
        })
        .then(() => {
            // The first callback doesn't get called again
            expect(loadCallback).toHaveBeenCalledTimes(1);
        })
        .then(done)
        .catch(done.error);
    });

    it('loads all elements if the previous load was an error', function(done) {
        const firstContainer = inject('<comment-count data-discussion-id="error"></comment-count>');
        const loadCallback = jasmine.createSpy('loadCallback');
        const updateCallback = jasmine.createSpy('updateCallback');

        load(config({
            fetch () {
                return Promise.reject(new Error('error on load'));
            },
            onupdate: loadCallback
        }))
        .catch(error => {
            expect(error.message).toMatch(/error on load/);
        })
        .then(() => {
            const secondContainer = inject('<comment-count data-discussion-id="update-success"></comment-count>');

            return update(config({
                fetch: okResponse([
                    { id: 'error', count: 4 },
                    { id: 'update-success', count: 3 }
                ]),
                onupdate: updateCallback
            }))
            .then(() => {
                expect(firstContainer.querySelector('comment-count').innerText).toBe('4');
                expect(secondContainer.querySelector('comment-count').innerText).toBe('3');
                expect(updateCallback).toHaveBeenCalledTimes(2);
                expect(updateCallback).toHaveBeenCalledWith(firstContainer.querySelector('comment-count'), 4);
                expect(updateCallback).toHaveBeenCalledWith(secondContainer.querySelector('comment-count'), 3);
            });
        })
        .then(done)
        .catch(done.error);
    });
});
