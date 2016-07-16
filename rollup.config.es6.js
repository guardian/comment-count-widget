const base = require('./rollup.base.config');

const config = Object.assign({
    format: 'es',
    dest: 'dist/comment-count.es6.js'
}, base);

export default config;
