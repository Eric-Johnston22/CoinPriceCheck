require('dotenv').config();

const axios = require('axios');
const { last } = require('lodash');
const twilioClient = require('twilio')(process.env.twilio_account_sid, process.env.twilio_key)


const myPhone = process.env.PHONE_NUM;

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.coinbase.com/api/v3/brokerage/market/products/BTC-USD',
    headers: { 
        'Content-Type': 'application/json'
    }
};

let lastPrice = null;
function checkBtc()
{
    axios.request(config)
    .then((response) => {

        let currentPrice = parseFloat(response.data.price)
        console.log(`Current Bitcoin price: $${currentPrice}`);

        if (lastPrice !== null && currentPrice < lastPrice){

            let difference = lastPrice - currentPrice;
            console.log("The price of bitcoin has decreased!");

            twilioClient.messages
                .create({
                    body: `Current Bitcoin price: $${currentPrice}\nThe price of Bitcoin has decreased by $${difference.toFixed(2)}!`,
                    from: 'whatsapp:+14155238886',
                    to: myPhone,
                })
                .then((message) => console.log(message.sid));
                }
        lastPrice = currentPrice;
    })
    .catch((error) => {
        console.log(error);
    });
};

twilioClient.messages
    .create({
        body: `Hi this is a test$`,
        from: 'whatsapp:+14155238886',
        to: myPhone,
    })
.then((message) => console.log(message.sid));

checkBtc(); // run function to get initial BTC price
setInterval(checkBtc, 60000)