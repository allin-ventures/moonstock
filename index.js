

const express = require('express');
const bearerToken = require('express-bearer-token');

const bodyParser = require('body-parser');



if (!process.env.STRIPE_KEY) {
    console.warn("STRIPE KEY IS MISSING")
}

const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = 'mongodb://root:example@localhost:27017';


// Create a new MongoClient
const client = new MongoClient(MONGO_URL);

const stripe = require('stripe')(process.env.STRIPE_KEY);

const yahoo = require('./lib/yahoo.js');

const Store = require('./lib/store.js')


const store = new Store();


client.connect(function (mongoErr) {
    if (mongoErr)
        console.error("CANNOT CONNECT TO MONGO", mongoErr)
    else {
        console.log("Mongo connected")

        store.setClient(client);

        const app = express();
        const portString = process.env.PORT || '3000';
        const port = parseInt(portString, 10);

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))

        // parse application/json
        app.use(bodyParser.json())

        app.use(bearerToken());

        app.get('/ping', (req, res) => res.send('ok'));

        app.post('/createUser', (req, res) => {
            const { email } = req.body;

            console.log("Creating user for email:", email)

            store.createUser({email}).then((user) => {
                
                return res.status(200).json({token: user.token})
            }).catch((err) => {
                return res.status(403).json({
                    error: "FAILED_TO_CREATE",
                    err
                })
            })
     
        })

        app.post('/cc', (req, res) => {

            if (!req.token || req.token !== '5')
                 return res.status(403).json({ error: "UNAUTH" })

            
            const { token, metadata } = req.body;

            metadata["moonstockId"] = 42;

            // if email exists don't   
            stripe.customers.create({
                description: 'Customer for ' + email,
                source: token.tokenId, // obtained with Stripe.js,
                metadata
            }, function (err, customer) {
                // asynchronously called
                if (stripeErr)
                    return res.status(403).json({
                        error: "CC_FAILED"
                    })

                return res.status(200).json({
                    "success": true
                })
                


            });

        })


        app.get('/meta', async (req, res) => {

            console.log("Sending config to app")

            return res.status(200).json({
                stripe: {
                    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
                    merchantId: process.env.STRIPE_MERCHANT_KEY,
                }
            })
        })

        app.get('/next', async (req, res) => {
            if (!req.token)
                return res.status(403).json({ error: "UNAUTH" })

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
                return res.status(403).json({ error: "UNAUTH" })

            const creditCardExists = true;

            if (creditCardExists) {

                const { userToken, symbol, action } = req.body;

                return res.status(200).json({ userToken, symbol, action });

            } else {
                return res.status(403).json({ error: "NO_CC"})
            }

        })

        app.listen(port, () => console.log(`Example app listening on port ${port}!`));

    }

// mongo connect
}, { useNewUrlParser: true })

