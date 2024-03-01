const express = require('express');
const router = express.Router();
const finnhub = require('finnhub');
const api_key = 'your_api_key_here'; // Replace 'your_api_key_here' with your actual API key

// Initialize Finnhub API client
const finnhubClient = new finnhub.DefaultApi();

// Route to fetch and display API data
router.get('/apiData', async (req, res) => {
    try {
        // Example: Fetching stock candles data
        const symbol = 'AAPL'; // Example symbol
        const resolution = 'D'; // Daily resolution
        const from = Math.floor(Date.now() / 1000) - 86400 * 7; // 7 days ago
        const to = Math.floor(Date.now() / 1000); // Current timestamp

        const apiData = await finnhubClient.stockCandles(symbol, resolution, from, to, {}, (error, data, response) => {
            if (error) {
                console.error(error);
                return [];
            }
            return data;
        });

        // Render the EJS file with the API data
        res.render('apiData', { apiData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
