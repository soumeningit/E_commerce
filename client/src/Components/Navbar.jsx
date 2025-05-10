import React, { useState } from "react";
import logo from "../image/logo.png";
import { CiShoppingBasket } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLink from "./UserLink";
import user_avtar from "../image/user_avtar.png";
import { searchProduct } from "../Service/Operations/ProductOpern";
import SearchItems from "./SearchItems";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [showUserLink, setShowUserLink] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [showSearchData, setShowSearchData] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await searchProduct("GET", { searchItem: searchQuery });
      if (response.status === 200) {
        setSearchData(response?.data?.data);
        setShowSearchData(true);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  className="h-16 w-16 rounded-full transform hover:scale-110 transition-transform duration-300 cursor-pointer"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                {["everything", "groceries", "juice"].map((item) => (
                  <NavLink
                    key={item}
                    to={`/${item}`}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-green-600 transition-colors duration-300 text-lg font-medium cursor-pointer ${
                        isActive
                          ? "text-green-600 border-b-2 border-green-600"
                          : ""
                      }`
                    }
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center space-x-6">
                {["/", "/about", "/contact"].map((path) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-green-600 transition-colors duration-300 cursor-pointer ${
                        isActive ? "text-green-600" : ""
                      }`
                    }
                  >
                    {path === "/"
                      ? "Home"
                      : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-[15rem]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
                />
                <FaSearch
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              </form>

              <NavLink to="/cart" className="relative group cursor-pointer">
                <CiShoppingBasket className="text-3xl text-gray-700 group-hover:text-green-600 transition-colors duration-300" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {cart.length}
                  </span>
                )}
              </NavLink>

              <div className="flex items-center space-x-3">
                {!token ? (
                  <>
                    <NavLink to="/signup">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Sign Up
                      </button>
                    </NavLink>
                    <NavLink to="/login">
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Log In
                      </button>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/logout">
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Log Out
                      </button>
                    </NavLink>
                    <div
                      onClick={() => setShowUserLink(!showUserLink)}
                      className="relative cursor-pointer"
                    >
                      <img
                        src={user_avtar}
                        alt="user avatar"
                        className="w-12 h-12 rounded-full border-2 border-green-500 hover:border-green-600 transition-all duration-300 transform hover:scale-110"
                      />
                      {showUserLink && (
                        <div className="absolute right-0 z-10">
                          <UserLink setShowUserLink={setShowUserLink} />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-green-600 focus:outline-none cursor-pointer"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-100 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
                />
                <FaSearch
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              </form>

              {["everything", "groceries", "juice", "", "about", "contact"].map(
                (item) => (
                  <NavLink
                    key={item}
                    to={`/${item}`}
                    className={({ isActive }) =>
                      `block text-gray-700 hover:text-green-600 transition-colors duration-300 cursor-pointer ${
                        isActive ? "text-green-600" : ""
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item === ""
                      ? "Home"
                      : item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                )
              )}

              <NavLink
                to="/cart"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CiShoppingBasket className="text-2xl text-gray-700" />
                <span>
                  Cart {cart && cart.length > 0 ? `(${cart.length})` : ""}
                </span>
              </NavLink>

              {!token ? (
                <>
                  <NavLink to="/signup">
                    <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Sign Up
                    </button>
                  </NavLink>
                  <NavLink to="/login">
                    <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Log In
                    </button>
                  </NavLink>
                </>
              ) : (
                <NavLink to="/logout">
                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    Log Out
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
      {showSearchData && searchData.length > 0 && (
        <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-md w-full max-w-md">
          <SearchItems
            data={searchData}
            setShowSearchData={setShowSearchData}
            onClose={() => setShowSearchData(false)}
          />
        </div>
      )}
    </>
  );
}

export default Navbar;
