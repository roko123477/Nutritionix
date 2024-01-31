const express = require("express");
const {
  autocompleteController,
  searchQuery,
} = require("../controllers/food.controller");
const router = express.Router();

router
  .get("/autocomplete/query", autocompleteController)
  .get("/search/query", searchQuery);

exports.router=router;