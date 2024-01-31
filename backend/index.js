const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Food = require("./models/food");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
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

app.get("/search/query", async (req, res) => {
  const str = req.query.str;

  if (!str) {
    res.status(400).json({ msg: "Enter string parameter ||" });
  } else {
    // filtering foodname that includes already filtered names
    const foodarr = await Food.find({ food_name: { $regex: str } });
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
        const fetchjson = await fetchData.json();

        const data = [];
        for (obj of fetchjson.common.slice(0, 5)) {
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

app.listen(3000, () => {
  console.log("listening on port 3000");
});
