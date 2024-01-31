
const Food = require("../models/food");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.autocompleteController = async (req, res) => {
  const str = req.query.str;
  try {
    const foodarr = await Food.find({ food_name: { $regex: str } }).limit(5);
    res.status(200).json(foodarr);
  } catch (error) {
    res.json(error);
  }
};

exports.searchQuery = async (req, res) => {
  const str = req.query.str;

  if (!str) {
    res.status(400).json({ msg: "Enter string parameter ||" });
  } else {
    // filtering foodname that includes already filtered names
    const foodarr = await Food.find({ food_name: { $regex: str } }).limit(5);
    // if new name comes
    if (foodarr.length < 5) {
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
            // this is done to avoid duplicate data insertion in db
            var flag = 1;
            for (var food of foodarr) {
              //    console.log(food.food_name,obj.food_name,food.occured)
              if (food.food_name === obj.food_name && food.occured === 1) {
                const foodObjalreadyPresent = new Food({
                  food_name: obj.food_name,
                  occured: 1,
                  photo: obj.photo.thumb,
                  calories: fetchjsoncalorie.foods[0].nf_calories,
                });
                data.push(foodObjalreadyPresent);
                flag = 0;
                break;
              }
            }
            //console.log(flag);
            if (flag === 1) {
              const foodCart = new Food({
                food_name: obj.food_name,
                occured: 1,
                photo: obj.photo.thumb,
                calories: fetchjsoncalorie.foods[0].nf_calories,
              });

              const doc = await foodCart.save();
              data.push(doc);
            }
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
};
