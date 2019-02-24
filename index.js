const fs = require('fs');

const express = require('express');

const app = express();
const portString = process.env.PORT || '3000';
const port = parseInt(portString, 10);

app.get('/ping', (req, res) => res.send('ok'));

app.get('/next', (req, res) => {
    const sampleImage = fs.readFileSync('google.png');
    const sampleImageEncoded = new Buffer.from(sampleImage).toString('base64');
    const sampleImageUrl = `data:image/png;base64,${sampleImageEncoded}`;
    return res.status(200).json([
        {
            symbol: "GOOG",
            logo: sampleImageUrl,
            predictions: {
                graph: [
                    {x: 1, y: 1},
                    {x: 2, y: 5},
                    {x: 3, y: 4},
                    {x: 4, y: 3},
                ],
                text: "This stock is ok",
            },
        },
    ]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
