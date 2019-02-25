const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const yahoo = require('./lib/yahoo.js');

const app = express();
const portString = process.env.PORT || '3000';
const port = parseInt(portString, 10);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/ping', (req, res) => res.send('ok'));

app.get('/next', async (req, res) => {
    const sampleImage = fs.readFileSync('google.png');
    const sampleImageEncoded = new Buffer.from(sampleImage).toString('base64');
    const sampleImageUrl = `data:image/png;base64,${sampleImageEncoded}`;
    const samplePrices = await yahoo.getHistoricalPrices('GOOG');
    return res.status(200).json([
        {
            symbol: "GOOG",
            logo: sampleImageUrl,
            progress: 0.42,
            prediction: {
                graph: samplePrices,
                text: "This stock is ok",
            },
        },
    ]);
});


app.post('/action', async (req, res) => {

    const {userToken, symbol, action} = req.body;


    res.body = {userToken, symbol, action};

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
