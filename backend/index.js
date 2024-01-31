const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const foodRouter=require("./routes/food");
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

app.use(cors({}));

app.use("/",foodRouter.router);


const port = 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
