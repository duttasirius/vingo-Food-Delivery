function CategoryCard({ name, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-orange-500 shrink-0 overflow-hidden bg-white shadow-2xl shadow-gray-200 hover:shadow-lg transition-shadow relative"
    >
      <img
        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        src={image}
        alt=""
      />

      <div className="absolute bottom-0 left-0 w-full bg-[#ffffff96] px-3 py-2 rounded-t-xl text-center shadow text-sm font-medium backdrop-blur text-gray-800">
        {name}
      </div>
    </div>
  );
}

export default CategoryCard;
