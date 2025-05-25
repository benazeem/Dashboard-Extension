import { useState } from "react";
import {
  Grid2x2,
  Link,
  Heart,
  Monitor,
  ShoppingCart,
  MessageSquareMore,
  Search,
} from "lucide-react";
import AddSite from "../addmenu/AddSite";
import Widgets from "./Widgets";

function Menu() {
  const listyles =
    "text-gray-900 p-1 rounded-lg flex items-center gap-2 hover:bg-gray-200 cursor-pointer w-full";
  const [selectedOption, setSelectedOption] = useState<string>("manual");

  return (
    <div className="w-[600px] h-[400px] rounded-2xl p-2 flex justify-between bg-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="h-full w-[25%] py-4 px-1">
        <h3 className="text-lg pb-2 text-gray-900">Add Shortcut</h3>
        <ul className="flex flex-col items-start gap-3 overflow-scroll h-[90%] no-scrollbar">
          <li className={listyles} onClick={() => setSelectedOption("manual")}>
            <Link />
            Add manually
          </li>
          <li className={listyles} onClick={() => setSelectedOption("widgets")}>
            <Grid2x2 />
            Widgets
          </li>
          <li className={listyles} onClick={() => setSelectedOption("popular")}>
            <Heart />
            Popular
          </li>
          <li className={listyles} onClick={() => setSelectedOption("shopping")}>
            <ShoppingCart />
            Shopping
          </li>
          <li className={listyles} onClick={() => setSelectedOption("social")}>
            <MessageSquareMore />
            Social
          </li>
          <li
            className={listyles}
            onClick={() => setSelectedOption("entertainment")}
          >
            <Monitor />
            Entertainment
          </li>
        </ul>
      </div>

      {/* Right Section */}
<div className="bg-white w-[75%] h-full rounded-2xl flex flex-col p-4 ">
        {/* Search bar */}
        <div className="w-full h-16 bg-white/70 flex items-center justify-center rounded-lg mb-2">
          <div className="w-[90%] p-2 rounded-lg bg-gray-100 flex items-center">
            <Search className="w-6 h-6 mr-1 text-gray-800" />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none text-gray-900 bg-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center overflow-hidden px-2">
          {selectedOption === "manual" && <AddSite />}
          {selectedOption === "widgets" && <Widgets />}
        </div>
      </div>
    </div>
  );
}

export default Menu;
