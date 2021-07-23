var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1928251630:AAHgX5MoSBZ3F0PACZyNucztqP2PT_eGUNA'
const bot = new TelegramBot(token, {polling: true});

// bots
let state = 2;
bot.onText(/\/start/, (msg) => {    
    state = 0;
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );  
});


bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai x1|x2|x3|x4 contohnya 9|9|9|9`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2]),
                parseFloat(s[3])
            ]
        ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3]), parseFloat(jres1[0]), parseFloat(jres1[1]), parseFloat(jres1[2]), parseFloat(jres1[3]), parseFloat(jres1[4]), parseFloat(jres1[5]) ])=>{
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y1 yang diprediksi adalah ${jres1[0]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y2 yang diprediksi adalah ${jres1[1]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y3 yang diprediksi adalah ${jres1[2]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y4 yang diprediksi adalah ${jres1[3]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y5 yang diprediksi adalah ${jres1[4]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y6 yang diprediksi adalah ${jres1[5]}`
                ); 
                state = 0;
            })
        })
    }else{
        bot.sendMessage(
        msg.chat.id,
            `Please Click /start`
        );  
        state = 0;
    }
})

// routers
r.get('/predict/:x1/:x2/:x3/:x4', function(req, res, next) {    
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

// routers
r.get('/classify/:x1/:x2/:x3/:x4', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3),
            parseFloat(req.params.x4)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.x1), // string to float
                parseFloat(req.params.x2),
                parseFloat(req.params.x3),
                parseFloat(req.params.x4),
                parseFloat(jres[0]),
                parseFloat(jres[1]),
                parseFloat(jres[2]),
                parseFloat(jres[3]),
                parseFloat(jres[4]),
                parseFloat(jres[5])
            ]
        ).then((jres_)=>{
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
