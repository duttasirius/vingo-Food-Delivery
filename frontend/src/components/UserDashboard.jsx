import React, { useRef } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

function UserDashboard() {
  const { currentCity, shopsInMyCity, itemsInMyCity } = useSelector(
    (state) => state.user,
  );

  const cateScrollref = useRef();
  const shopScrollref = useRef();

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -220 : 220,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <Nav />

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 px-4 mt-28">
        {/* ================= CATEGORIES ================= */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Browse Food Categories
        </h1>

        <div className="relative w-full">
          <button
            onClick={() => scrollHandler(cateScrollref, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10"
          >
            <FaChevronCircleLeft />
          </button>

          <div
            ref={cateScrollref}
            className="flex gap-4 overflow-x-auto px-10 pb-2 scroll-smooth"
          >
            {categories.map((cat, index) => (
              <CategoryCard key={index} name={cat.category} image={cat.image} />
            ))}
          </div>

          <button
            onClick={() => scrollHandler(cateScrollref, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10"
          >
            <FaChevronCircleRight />
          </button>
        </div>

        {/* ================= SHOPS ================= */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Best Shops in {currentCity}
        </h1>

        <div className="relative w-full">
          <button
            onClick={() => scrollHandler(shopScrollref, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10"
          >
            <FaChevronCircleLeft />
          </button>

          <div
            ref={shopScrollref}
            className="flex gap-4 overflow-x-auto px-10 pb-2 scroll-smooth"
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard key={index} name={shop.name} image={shop.image} />
            ))}
          </div>

          <button
            onClick={() => scrollHandler(shopScrollref, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10"
          >
            <FaChevronCircleRight />
          </button>
        </div>

        {/* ================= FOOD ITEMS GRID ================= */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Popular Items in {currentCity}
        </h1>

        {/* RESPONSIVE GRID */}
        <div
          className="
          w-full
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-6
        "
        >
          {itemsInMyCity?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
