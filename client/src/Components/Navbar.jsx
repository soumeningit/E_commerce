import React, { useState } from "react";
import logo from "../image/logo.png";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiShoppingBasket } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLink from "./UserLink";
import user_avtar from "../image/user_avtar.png";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [showUserLink, setShowUserLink] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-astglobalcolor5">
      <div>
        <Link to="/">
          <img src={logo} alt="logo" className="h-24 w-24" />
        </Link>
      </div>
      <div>
        <ul className="flex gap-x-8">
          <NavLink to="/everything">
            <li>Everythings</li>
          </NavLink>

          <NavLink to="/groceries">
            <li>Groceries</li>
          </NavLink>

          <NavLink to="/juice">
            <li>Juice</li>
          </NavLink>
        </ul>
      </div>
      <div className="flex gap-x-4">
        <ul className="flex gap-x-4">
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/about">
            <li>About</li>
          </NavLink>

          <NavLink to="/contact">
            <li>Contact</li>
          </NavLink>
        </ul>
        <NavLink to="/cart">
          <div className="relative">
            <CiShoppingBasket className="font-bold text-2xl" />
            {cart && cart.length > 0 && (
              <span
                className="absolute -top-1 -right-2 bg-green-500 text-xs w-5 h-5 flex
                                justify-center items-center animate-bounce rounded-full text-white"
              >
                {cart.length}
              </span>
            )}
          </div>
        </NavLink>

        <div className="flex flex-row gap-x-2">
          {!token && (
            <NavLink to="/signup">
              <button className="px-2 py-1 rounded-md border border-gary-500 text-md bg-slate-400 text-gray-200 hover:bg-slate-800 transition-all">
                SignUp
              </button>
            </NavLink>
          )}
          {token && (
            <NavLink to="/signout">
              <button className="px-2 py-1 rounded-md border border-gary-500 text-md bg-slate-400 text-gray-200 hover:bg-slate-800 transition-all">
                SignOut
              </button>
            </NavLink>
          )}

          {!token && (
            <NavLink to="/login">
              <button
                className="px-2 py-1 rounded-md border border-gary-500 text-md bg-slate-400
                             text-gray-200 hover:bg-slate-800 transition-all"
              >
                LogIn
              </button>
            </NavLink>
          )}
          {token && (
            <NavLink to="/logout">
              <button
                className="px-2 py-1 rounded-md border border-gary-500 text-md bg-slate-400
                             text-gray-200 hover:bg-slate-800 transition-all"
              >
                LogOut
              </button>
            </NavLink>
          )}
          {token && (
            <div
              onClick={() => setShowUserLink(!showUserLink)}
              className="relative flex items-center rounded-full bg-gray-200 cursor-pointer -translate-y-0.5"
            >
              <img
                src={user_avtar}
                alt="user_avtar"
                className="object-contain items-center w-10 h-10 p-1"
              />
            </div>
          )}
          {showUserLink && <UserLink setShowUserLink={setShowUserLink} />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
