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
    state = 1;
    bot.sendMessage(
        msg.chat.id, 
        `Masukan nilai i dan r dengan format x1|x2|x3|x4 \n
        contohnya: 10|11|12|13`
    );   
});

bot.onText(/\/2/, (msg) => {
    state = 2;
    bot.sendMessage(
        msg.chat.id, 
        "pilih /start untuk kembali ke menu utama"
    );   
});

bot.on('message', (msg) => {
    const text = msg.text.toString().toLowerCase();
    console.log(text);

    if(state == 1){
        let dt = text.split('|');
        bot.sendMessage(
            msg.chat.id, 
            `hasil output dengan nilai x1 (${dt[0]}), x2 (${dt[1]}), x3 (${dt[2]}), x4 (${dt[3]}) adalah y1 (${jres[0]}), y2 (${jres[1]}), y3 (${jres[2]}), y4 (${jres[3]}) y5 (${jres[4]}) dan y6 (${jres[5]}) `
        );

        model.predict(
            [
                parseFloat(dt[0]), // string to float
                parseFloat(dt[1]),
                parseFloat(dt[2]),
                parseFloat(dt[3])
            ]
        ).then((jres) => {
            bot.sendMessage(
                msg.chat.id, 
                `nilai y1 (${jres[0]}), y2 (${jres[1]}), y3 (${jres[2]}), y4 (${jres[3]}) y5 (${jres[4]}) dan y6 (${jres[5]})`
            );
            bot.sendMessage(
                msg.chat.id,
                `<= kembali /2`
            );
        });        
    }

    if(state == 2){
        bot.sendMessage(
            msg.chat.id, 
            "pilih /start untuk ke menu utama"
        );   
    }
})



// routers
r.get('/prediction/:x1/:x2:/x3:/x4', function(req, res, next) {    
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
