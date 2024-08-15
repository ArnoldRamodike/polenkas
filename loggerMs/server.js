const express = require('express');
const bodyParsr = require('body-parser');
const dotenv = require('dotenv')
const Producer = require('./producer');
const producer = new Producer;

const app = express();

app.use(bodyParsr.json("application/json"));

app.post("/sendLog", async(req, res, next) => {
    await  producer.publishMessage(req.body.logType, req.body.message);
    res.send();
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    
})