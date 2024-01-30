const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//import fetch from 'node-fetch';
mongoose.set("strictQuery", true);
const db_url = "mongodb+srv://rohitkoner5:roko@cluster0.wapat9h.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_url)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
  

const app = express();

app.use(bodyParser.urlencoded({
    extended: true

  }));
app.use(bodyParser.json());

app.get("/",async(req, res) => {
    res.send("hello world!");
})

app.listen(3000,()=>{
    console.log('listening on port 3000');
})