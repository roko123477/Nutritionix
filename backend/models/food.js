const mongoose = require('mongoose');

const FoodSchema=new mongoose.Schema({
    food_name:{
        type: 'string',
        required: true
    },
    photo:{
        type: 'string',
        required: true
    },
    calories:{
        type:'Number',
        required: true
    }
});

module.exports=mongoose.model('Food',FoodSchema);