const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const QRCode = require('qrcode');
const litecoin = require('litecoin');


//Litecoin Wallet JSON-RPC Communication
const client = new litecoin.Client({
  host: 'localhost',
  port: 19332,
  user: 'wafflemakr',
  pass: 'Satoshi.1988+',
  timeout: 30000,
  ssl: false
});


let data = {};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


function getData() {
    request({
        url: 'https://chain.so/api/v2/get_price/LTC/USD',
        json: true
    }, (error, response, body) => {
            data.price = body.data.prices[0].price;
            
    });
}

//Request Blockchain Stats once and refresh every minute
getData();
setInterval(getData, 60000);



app.post('/survey', (req, res) => {
    console.log('Email: ' + req.body.email);
    console.log('Edad: ' + req.body.optionsRadios);
    console.log('Antiguedad: ' + req.body.optionsRadios2);
    console.log('Wallet: ' + req.body.wallet);

    const addy = req.body.wallet;
    const amount = 0.1;

    res.send('Encuesta Enviada! Recibirás tus criptomonedas en unos minutos a la dirección: <strong>' +
    addy + '</strong><br><a href="/">HOME</a>');

    client.sendToAddress(addy, amount, function(err, txid) {
        if (err) console.error(err);
        console.log('Sending to Litecoin Address: ' + addy);
        console.log('Transaction ID: ' + txid);
    });

});


app.get('/', function(req, res) {
    res.render("index", {lastPrice:data.price});
});

app.get('/wallet', function(req, res) {
    res.render("wallet", {lastPrice:data.price, display:"none", newAdd:"", qrcode:''});
});

app.post('/wallet', function(req, res) {
    client.getNewAddress(function(err, addy) {
        if (err) console.error(err);
        console.log('New Litecoin Address: ' + addy);
        qr(addy, (imageUrl) => res.render("wallet", {lastPrice:data.price, newAdd:addy, display:"block", qrcode:imageUrl}));        
    });  
});

function qr(dataQr, x){
    const opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.3
        }
    };

    let image = '';
    
    //const dataQr = "bitcoin:1ArmoryXcfq7TnCSuZa9fQjRYwJ4bkRKfv?amount=0.005";
    QRCode.toDataURL(dataQr, opts, function (err, url) {
        //return "<!DOCTYPE html/><html><head><title>node-qrcode</title></head><body><img src='" 
        //+ url + "'/></body></html>";
        x(url);
    });

    
};

app.get('/about', function(req, res) {
    res.render('about', {lastPrice:data.price});
});

app.get('/balance', function(req, res) {
    res.render('balance', {lastPrice:data.price, display:"none", balance:''});
});

app.post('/balance', function(req, res) {
    const addy = req.body.addr;
    request({
        url: 'https://chain.so/api/v2/get_address_balance/LTCTEST/'+ addy,
        json: true
    }, (error, response, body) => {
        const balance = body.data.confirmed_balance;
        res.render('balance', {lastPrice:data.price, display:"block", balance:balance});  
    });
});

app.get('/ip', function(req, res) {
    console.log(req.ip);
    res.render('ip', { ip:req.ip});
});

app.get('/survey', function(req, res) {
    //console.log(req.ip);
    res.render('survey', {lastPrice:data.price});
});


    


app.get('*', function(req, res) {
    res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));
console.log(port);
