const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/prices', async (req, res) => {
  try {
    const r = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano&vs_currencies=usd&include_24hr_change=true');
    res.json(r.data);
  } catch(e) { res.status(500).json({error:'Price fetch failed'}); }
});

app.get('/api/signals', async (req, res) => {
  try {
    const r = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false&price_change_percentage=24h');
    const signals = r.data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      signal: coin.price_change_percentage_24h > 3 ? '🟢 BUY' : coin.price_change_percentage_24h < -3 ? '🔴 SELL' : '🟡 HOLD',
      volume: coin.total_volume
    }));
    res.json(signals);
  } catch(e) { res.status(500).json({error:'Signal fetch failed'}); }
});

app.listen(3000, () => console.log('CryptoLearn running on port 3000'));
