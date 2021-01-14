'use strict';
require('dotenv').config();

// const express = require('express');
const fetch = require('node-fetch');
const {accountSid,authToken,twilioNumber,sendToNumber,autoRun,currency_from,currency_to,currency_amount}= require('./config')


const client = require('twilio')(accountSid, authToken);
const PORT = 3000;
const HOST = '0.0.0.0';


// App
// const app = express();
// let appServer

async function sendMsg(msg) {
    
    return await client.messages
    .create({
        body: msg,
        from: twilioNumber,
        to: `+${sendToNumber}`
    })
    .then(message =>(message))
    .catch(err =>{
        //console.log(err)
        return err
    })

}

async function scrap(from='eur',to='usd',amount=1) {

  return fetch(`https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`)
    .then(res => res.json())
    .then(body => {
      // console.log(body.rates[to])
      return body.rates[to]
    })

}


const run = async()=>{
  console.log('run')
  let result=await scrap(currency_from,currency_to,currency_amount);
  let alertMsg=`XE Currency Alert: ${currency_amount} ${currency_from}/${currency_to} = ${result}`
  sendMsg(alertMsg);
  console.log("message sent : ",alertMsg," - to number: ",sendToNumber)  
  return 0;
}

console.log("autoRun:",autoRun)
if(autoRun=='true' || autoRun==true ){
  console.log('atuo run')
  run()
}else{
  // appServer= app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
}

module.exports={run:run}