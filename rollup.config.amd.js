const base = require('./rollup.base.config');

const config = Object.assign({
    format: 'amd',
    dest: 'dist/comment-count.amd.js'
}, base);

export default config;
