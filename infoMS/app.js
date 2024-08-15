// const express = require('express');
// const bodyParsr = require('body-parser');
// const dotenv = require('dotenv')
const amqp = require("amqplib");

// const app = express();

// app.use(bodyParsr.json("application/json"));

// step 1 : Connect tot the rabbitmq server
// step 2 : Create a new channel
// step 3 : Create the echange
// step 4 : Create the queu
// step 5 : Bind the queu to the exchange
// step 6 : Consume message from the queu


async function consumeMessages(){
 const connection  = await amqp.connect('amqp://localhost');
 const channel = await connection.createChannel();

 await channel.assertExchange('logExchange', 'direct');

 const q = await channel.assertQueue("InfoQueue");

 await channel.bindQueue(q.queue, "logExchange", "Info");

 channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);

    channel.ack(msg);
    
 })
}

consumeMessages();

// const port = process.env.PORT || 3001;

// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
    
// })