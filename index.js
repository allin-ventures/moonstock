const fs = require('fs');

const express = require('express');

const bearerToken = require('express-bearer-token');

const bodyParser = require('body-parser');

const app = express();
const portString = process.env.PORT || '3000';
const port = parseInt(portString, 10);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(bearerToken());

app.get('/ping', (req, res) => res.send('ok'));

app.get('/next', (req, res) => {

    if (!req.token)
     return res.status(403).json({error: "UNAUTH"})

    const sampleImage = fs.readFileSync('google.png');
    const sampleImageEncoded = new Buffer.from(sampleImage).toString('base64');
    const sampleImageUrl = `data:image/png;base64,${sampleImageEncoded}`;
    return res.status(200).json([
        {
            symbol: "GOOG",
            logo: sampleImageUrl,
            progress: 0.42,
            prediction: {
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


app.post('/action', async (req, res) => {

    if (!req.token)
       return res.status(403).json({error: "UNAUTH"})

    const {userToken, symbol, action} = req.body; 


    return res.status(200).json( {userToken, symbol, action});

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
