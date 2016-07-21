import { load } from '../src/index';
import { inject, clear } from './lib/inject';
import config from './lib/base-config';

describe('Build URL', function() {
    afterEach(function() {
        clear();
    });
    const ignoreResponse = Promise.resolve({
        ok: true,
        json () {
            return { counts: [] };
        }
    });

    it('does nothing if custom elements are not present', function(done) {
        load(config({
            fetch () {
                return Promise.reject('should not call fetch');
            }
        }))
        .then(done)
        .catch(done.error);
    });

    it('creates an URL for a single custom element', function(done) {
        inject('<comment-count data-discussion-id="one"></comment-count>');

        load(config({
            fetch (path) {
                expect(path).toBe('api?ids=one');

                return ignoreResponse;
            }
        }))
        .then(done)
        .catch(done.error);
    });

    it('creates an URL for multiple custom elements', function(done) {
        inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="/two/"></comment-count>',
            '<comment-count data-discussion-id="/p/3"></comment-count>'
        ]);

        load(config({
            fetch (path) {
                expect(path).toBe('api?ids=one,/two/,/p/3');

                done();
                return ignoreResponse;
            }
        }))
        .then(done)
        .catch(done.error);
    });

    it('filters out some elements from the URL', function(done) {
        inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="two"></comment-count>',
            '<comment-count data-discussion-id="three"></comment-count>'
        ]);

        load(config({
            filter (node) {
                return node.getAttribute('data-discussion-id') !== 'three';
            },
            fetch (path) {
                expect(path).toBe('api?ids=one,two');

                done();
                return ignoreResponse;
            }
        }))
        .then(done)
        .catch(done.error);
    });

    it('does nothing if all elements are filtered out', function(done) {
        inject([
            '<comment-count data-discussion-id="one"></comment-count>',
            '<comment-count data-discussion-id="two"></comment-count>',
            '<comment-count data-discussion-id="three"></comment-count>'
        ]);

        load(config({
            filter () {
                return false;
            },
            fetch () {
                return Promise.reject('should not call fetch');
            }
        }))
        .then(done)
        .catch(done.error);
    });
});
