const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
    entry: 'src/index.js',
    plugins: [
        babel({
            exclude: ['node_modules/fastdom/**']
        }),
        nodeResolve({
            jsnext: true,
            main: true,
            preferBuiltins: true
        }),
        commonjs()
    ],
    external: ['fastdom']
};
