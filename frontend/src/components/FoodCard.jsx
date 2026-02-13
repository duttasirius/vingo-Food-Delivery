import React from "react";

function FoodCard({ data }) {
  return (
    <div className="w-[250px] rounded-2xl border-2 border-orange-500 bg-white shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
      <div className="relative w-full h-[170px] flex md:flex-row items-center justify-center bg-white">
        <img
          src={data.image}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          alt=""
        />
      </div>
    </div>
  );
}

export default FoodCard;
