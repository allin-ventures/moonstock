const fs = require('fs');

const express = require('express');
const bearerToken = require('express-bearer-token');

const bodyParser = require('body-parser');

if (!process.env.STRIPE_KEY) {
  console.warn("STRIPE KEY IS MISSING")
}

const stripe = require('stripe')(process.env.STRIPE_KEY);

const yahoo = require('./lib/yahoo.js');

const crypto = require('crypto');

const app = express();
const portString = process.env.PORT || '3000';
const port = parseInt(portString, 10);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(bearerToken());

app.get('/ping', (req, res) => res.send('ok'));

// Make a guard incase env var is not there
const metaConfigGuard = async () => {

    return new Promise( (res, rej) => {
        crypto.randomBytes(48, function(err, buffer) {
            const token = buffer.toString('hex');
           // console.log(token)
            res(token)
        });
    });
    
}


app.get('/meta', async (req, res) => {
    const token = process.env.SECURE_TOKEN || await metaConfigGuard();
    if (!req.token !== token)
     return res.status(403).json({error: "UNAUTH"})

    console.log("Sending config to app")

    return res.state(200).json({
        stripe : {
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            merchantId: process.env.STRIPE_MERCHANT_KEY,
        }
    })
})

app.get('/next', async (req, res) => {
    if (!req.token)
     return res.status(403).json({error: "UNAUTH"})

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

    if (!req.token)
       return res.status(403).json({error: "UNAUTH"})

    const {userToken, symbol, action} = req.body; 

    return res.status(200).json( {userToken, symbol, action});

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
