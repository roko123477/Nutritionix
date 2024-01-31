import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { fetchFoodByString } from "../api/FoodApi";
const Search = () => {
  const [str, setStr] = useState("");
  const [foodArr, setfoodArr] = useState([]);

  async function fetchfood() {
    const data = await fetchFoodByString(str);
    setfoodArr(data);
  }

  console.log(foodArr);
  const handleSubmit = () => {
    if (str !== "") {
      fetchfood();
    }
  };
  useEffect(()=>{
    if(str==="") {
        setfoodArr([]);
    }
  },[str])

  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen">
        <h1 className="text-black text-3xl font-bold m-4">
          Nutrion<span className="text-green-700">ix</span>
        </h1>
        <div className="flex justify-center items-center">
          <input
            className="p-2 w-96 border border-slate-300 h-12 rounded-lg"
            type="text"
            name="food-search"
            id="food-search"
            placeholder="Search for food calorie.."
            onChange={(e) => setStr(e.target.value)}
          />
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="p-2 text-xl bg-slate-300 h-12 w-12 flex justify-center items-center rounded-lg"
          >
            <CiSearch />
          </button>
        </div>
        <div className="w-[27rem] border border-slate-300 bg-gray-100 rounded-lg flex justify-center items-center flex-col">
          <ul className="flex justify-center items-center w-full flex-col divide-y-2">
            {str &&
              foodArr.map((food, ind) => {
                return (
                  <li
                    key={ind}
                    className="flex justify-between items-center w-full px-3 py-1"
                  >
                    <div className="flex justify-center items-center">
                      <img
                        className="w-14 rounded-lg"
                        src={food.photo}
                        alt=""
                        srcset=""
                      />
                      <h1 className=" font-normal text-lg px-2">
                        {food.food_name}
                      </h1>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                      <h1 className=" font-bold text-lg text-green-700">
                        {food.calories}
                      </h1>
                      <p className=" text-sm text-gray-500">k.cal</p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Search;
