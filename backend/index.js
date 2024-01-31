const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Food = require("./models/food");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
mongoose.set("strictQuery", true);
const db_url = process.env.DB_URL;

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

app.use(
  cors({})
);

app.get("/search/query", async (req, res) => {
  const str = req.query.str;

  if (!str) {
    res.status(400).json({ msg: "Enter string parameter ||" });
  } else {
    // filtering foodname that includes already filtered names
    const foodarr = await Food.find({ food_name: { $regex: str } }).limit(5);
    // if new name comes
    if (foodarr.length === 0) {
      // fetching the details from nutrionix api
      try {
        const fetchData = await fetch(
          `https://trackapi.nutritionix.com/v2/search/instant/?query=${str}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-app-id": process.env.NUTRIONIX_API_ID,
              "x-app-key": process.env.NUTRIONIX_API_KEY,
            },
          }
        );
        // received all the names related name like nut, nutella, nutmeg..
        const fetchjson = await fetchData.json();

        const data = [];
        // looping over first 5 names
        for (obj of fetchjson.common.slice(0, 5)) {
          // doing again a post api call for getting the calories values of each item
          const fetchCalorie = await fetch(
            "https://trackapi.nutritionix.com/v2/natural/nutrients",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-app-id": process.env.NUTRIONIX_API_ID,
                "x-app-key": process.env.NUTRIONIX_API_KEY,
              },
              body: JSON.stringify({
                query: obj.food_name,
              }),
            }
          );
          const fetchjsoncalorie = await fetchCalorie.json();

          try {
            const foodCart = new Food({
              food_name: obj.food_name,
              photo: obj.photo.thumb,
              calories: fetchjsoncalorie.foods[0].nf_calories,
            });

            const doc = await foodCart.save();
            console.log(doc);
            data.push(doc);
          } catch (error) {
            res.json(error);
          }
        }
        res.status(200).json(data);
      } catch (error) {
        res.json({ success: false, error: error });
      }
    } else {
      res.status(200).json(foodarr);
    }
  }
});

const port=5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
