import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/kurzy', async (req, res) => {
    const date = req.query.date;
    const url = `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${date}`;

    try {
        const response = await fetch(url);
        const data = await response.text();
        res.setHeader('Access-Control-Allow-Origin', '*'); // Nastavení CORS
        res.send(data);
    } catch (error) {
        res.status(500).send('Error fetching data from ČNB');
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});