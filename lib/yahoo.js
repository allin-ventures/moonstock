const axios = require('axios');

async function getHistoricalPrices(symbol) {
    const response = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/GOOG?range=5d&includePrePost=false&interval=1d&corsDomain=finance.yahoo.com&.trsc=finance'
    );


    const rawPrices = response.data.chart.result[0].indicators.adjclose[0].adjclose;
    const transformedPrices = rawPrices.map((price, idx) => {
        return {x: idx + 1, y: price}
    });
    return transformedPrices;
}

module.exports = {
    getHistoricalPrices
};
