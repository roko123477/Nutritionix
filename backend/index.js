const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Food = require("./models/food");
const fetch = require("node-fetch");
//import fetch from 'node-fetch';
mongoose.set("strictQuery", true);
const db_url =
  "mongodb+srv://rohitkoner5:roko@cluster0.wapat9h.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_url)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.json({ query: true });
});
app.get("/search/query", async (req, res) => {
  const str = req.query.str;

  const db_data = await Food.find({});
  const foodarr = db_data.filter((obj) => obj.food_name.includes(str));
  if (foodarr.length === 0) {
    try {
      const fetchData = await fetch(
        `https://trackapi.nutritionix.com/v2/search/instant/?query=${str}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-id": "69bdb8bc",
            "x-app-key": "481c8dad73f91dab9886507af702619b",
          },
        }
      );
      const fetchjson = await fetchData.json();
   
       
      fetchjson.common.map(async (obj) => {
        const fetchCalorie = await fetch(
          "https://trackapi.nutritionix.com/v2/natural/nutrients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-app-id": "69bdb8bc",
              "x-app-key": "481c8dad73f91dab9886507af702619b",
            },
            body: JSON.stringify({
              query: obj.food_name,
            }),
          }
        );
        const fetchjsoncalorie = await fetchCalorie.json();
   
          try {
            const foodCart= new Food({
                food_name:obj.food_name,
                photo:obj.photo.thumb,
                calories:fetchjsoncalorie.foods[0].nf_calories
            })

           const doc=await foodCart.save();
           console.log(doc);
          } catch (error) {
            res.json(error)
          }
       
      });
      res.json(fetchjson);
    } catch (error) {
      res.json({ success: false, error: error });
    }
  }
  else{
    res.status(200).json(foodarr);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
