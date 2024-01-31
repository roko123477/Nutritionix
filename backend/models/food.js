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
    },
    occured:{
        type:'Number',
        default:0
    }
});
//FoodSchema.index({food_name:1});
module.exports=mongoose.model('Food',FoodSchema);