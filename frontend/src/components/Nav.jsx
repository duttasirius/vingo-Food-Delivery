import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Nav = () => {
  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-20 fixed top-0 z-[9999] bg-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-red-400">VINGO</h1>

      <div className="md:w-[60%] lg:w[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5">
        <div>
          <FaLocationDot size={25} className="text-red-400" />
          <div>Kolkata</div>
        </div>
        <div>
          <FaSearch />
          <input type="text" placeholder="Search Your Favorite Food Here !!!" />
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Nav;
