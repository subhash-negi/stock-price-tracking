const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')

const app = express()

app.use(cors())
app.use(morgan("coins"))

var request = require('request')
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(upload.array());

let mData = ""
let coinName = "bitcoin"
let mChart = ""


//routes
app.get("/coins", (req, res) => {
  const url = "https://api.coinranking.com/v2/coins";
  (
    async () => {
    try {
      await fetch(`${url}`, {
        headers: { "X-CMC_PRO_API_KEY": `${process.env.COIN_RANKING_API_KEY}` }
      }).then((response) => response.json())
        .then((json) => {
          console.log(json)
          res.json(json)
        })
    } catch (error) {
      console.log(error)
    }
  })
})
async function resData(coinName){
    var marketData = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
            console.error('error:', error); 
            console.log('statusCode:', response && response.statusCode); 
            console.log('body:', typeof body);
            mData = JSON.parse(body)
        resolve(mData)
        });
    })

    if(marketData){
    var marketChart = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
            console.error('error:', error); 
            console.log('statusCode:', response && response.statusCode); 
            console.log('body:', typeof body);
            mChart = JSON.parse(body)
        resolve(mData)
        });
    })
}
}



app.get('/dashboard', async(req, res) => {
    await resData(coinName)
    res.render('index', { mData,mChart,coinName })
})

app.post('/dashboard', async (req, res) => {
    coinName = req.body.selectCoin;
    console.log(coinName);
    await resData(coinName)
    res.render('index', { mData,mChart,coinName })
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on Port, ${port}`)
})