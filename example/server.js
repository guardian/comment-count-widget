const express = require('express');
const path = require('path');
const rollupOpts = require('../rollup.base.config');
const rollup = require('rollup');

const app = express();

app.use((req, res, next) => {
    if (/\.js$/.test(req.path)) {
        const fullpath = path.join(__dirname, req.path);
        rollup.rollup({
            entry: fullpath,
            plugins: rollupOpts.plugins,
            treeshake: false
        })
        .then(bundle => bundle.generate({ format: 'iife' }))
        .then(result => {
            res.status(200)
            .type('application/javascript')
            .send(result.code);
        })
        .catch(next);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/random', (req, res) => {
    res.send({
        counts: req.query.ids.split(',').map(id => {
            return {
                id,
                count: Math.floor(Math.random() * 5000)
            };
        })
    });
});

app.listen(4000, () => {
    // eslint-disable-next-line no-console
    console.log('Example ready on http://localhost:4000');
});
