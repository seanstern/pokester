import express from 'express';

const app = express();

app.get(
    '/',
    (req, res) => res.send(
        '<html><head></head><body><h1>Hello World</h1></body></html>'
    ),
);

app.listen(5000, () => console.log('server listening on port 5000'));
