var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1928251630:AAHgX5MoSBZ3F0PACZyNucztqP2PT_eGUNA'
const bot = new TelegramBot(token, {polling: true});



// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /menu to main menu`
    );   
});

bot.onText(/\/menu/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `/predict`
    );   
});

// routers
r.get('/prediction/:x1/:x2/:x3:/x4', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3),
            parseFloat(req.params.x4)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
