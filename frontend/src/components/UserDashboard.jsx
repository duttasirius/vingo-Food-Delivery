import React, { useRef } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";
import FoodCard from "./FoodCard";

function UserDashboard() {
  const { currentCity, shopsInMyCity, itemsInMyCity } = useSelector(
    (state) => state.user,
  );
  console.log("redux shops:", shopsInMyCity);

  // useRef creates a reference to a DOM element (like a div)
  // We will attach this ref to a scrollable container

  // coming from the dive need to scroll i reference below
  const cateScrollref = useRef();
  const shopScrollref = useRef();

  // Function to scroll the container left or right
  // ref = the scrollable element reference
  // direction = "left" or "right"
  // need to add ref and direction while using this function
  const scrollHandler = (ref, direction) => {
    // Check if the element exists in the DOM
    // (important because ref.current is null before render)
    if (ref.current) {
      // scrollBy moves the container horizontally
      ref.current.scrollBy({
        // If direction is left → move -200px
        // If direction is right → move +200px
        left: direction == "left" ? -200 : 200,

        // smooth animation instead of instant jump
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <Nav />

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 items-center p-4 mt-28">
        <h1 className="text-gray-800 text-2xl sm:text-3xl text-center font-semibold">
          BROWSE THROUGH OUR DIVERSE FOOD CATEGORIES
        </h1>

        {/* PRODUCT CATEGORY UI  */}
        <div className="relative w-full flex justify-center">
          {/* LEFT ARROW */}
          <button
            onClick={() => scrollHandler(cateScrollref, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg z-10"
          >
            <FaChevronCircleLeft />
          </button>

          {/* MAP ITEM  */}
          <div
            className="flex gap-4 overflow-x-auto pb-3  w-fit  px-12"
            // Attach ref to the scrollable container
            ref={cateScrollref}
          >
            {categories.map((cat, index) => (
              <CategoryCard name={cat.category} image={cat.image} key={index} />
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scrollHandler(cateScrollref, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg z-10"
          >
            <FaChevronCircleRight />
          </button>
        </div>

        {/* SHOP DETAILS SHOWING UI */}
        <h1 className="text-gray-800 text-2xl sm:text-3xl text-center font-semibold">
          Browse Through best Shop in {currentCity}
        </h1>

        <div className="relative w-full flex justify-center">
          {/* LEFT ARROW */}
          <button
            onClick={() => scrollHandler(shopScrollref, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg z-10"
          >
            <FaChevronCircleLeft />
          </button>

          {/* MAP ITEM  */}
          <div
            className="flex gap-4 overflow-x-auto pb-3  w-fit  px-12"
            // Attach ref to the scrollable container
            ref={shopScrollref}
          >
            {shopsInMyCity.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scrollHandler(shopScrollref, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg z-10"
          >
            <FaChevronCircleRight />
          </button>
        </div>

        {/* ALL PRODUCT SHOWING UI  */}
        <h1 className="text-gray-800 text-2xl sm:text-3xl text-center font-semibold">
          Suggested Popular Food Items from {currentCity}
        </h1>

        <div className="w-full h-auto flex-wrap justify-center gap-5">
          {itemsInMyCity?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
