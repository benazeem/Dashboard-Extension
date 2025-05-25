import React from "react";
import shoppingSites from "../addmenu/shoppingSites.json";

const ShoppingSites = () => {
  return (
    <div className="w-10px h-10px grid grid-cols-4 gap-8 px-1 py-2 overflow-auto no-scrollbar">
      {shoppingSites.map((site, index) => (
        <a
          key={index}
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-center"
        >
          <img
            src={site.icon}
            alt={site.name}
            className="w-8 h-7 object-contain mb-1.5"
          />
          <span className="text-sm text-gray-700">{site.name}</span>
        </a>
      ))}
    </div>
  );
};

export default ShoppingSites;
