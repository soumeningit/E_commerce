import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Form() {
  const [fromData, setFromData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "India",
    street: "",
    city: "",
    state: "",
    pin: "",
    comment: false,
    candidate: false,
    offer: false,
    notifications: "",
  });

  // console.log(fromData);

  function changeHandeler(event) {
    const { name, type, checked, value } = event.target;
    setFromData((prevDta) => {
      return {
        ...prevDta,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function btnHandeler(event) {
    event.preventDefault();
    window.localStorage.setItem("fromData", JSON.stringify(fromData));
    console.log(fromData);
  }

  return (
    <div className="flex flex-col items-center mt-2 max-w-[800px] mx-auto gap-y-4 border-none">
      <form
        action="#"
        className="w-[100%] p-20 border border-gray-300 shadow-lg m-0"
      >
        <label htmlFor="firstName" className="ml-4 text-start">
          First Name
        </label>{" "}
        <br />
        <input
          type="text"
          placeholder="Soumen"
          name="firstName"
          id="firstName"
          onChange={changeHandeler}
          value={fromData.firstName}
          className="border border-gray-300  border-b-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="lastName" className="ml-4 text-start">
          Last Name
        </label>{" "}
        <br />
        <input
          type="text"
          name="lastName"
          placeholder="Pal"
          onChange={changeHandeler}
          id="lastName"
          value={fromData.lastName}
          className="border border-gray-300 border-t-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="email" className="ml-4 text-start">
          Email Address
        </label>{" "}
        <br />
        <input
          type="email"
          placeholder="soumen@gmail.com"
          name="email"
          id="email"
          onChange={changeHandeler}
          value={fromData.email}
          className="border border-gray-300  border-b-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="country" className="ml-4 text-start">
          {" "}
          Country
        </label>{" "}
        <br />
        <select
          name="country"
          id="country"
          onChange={changeHandeler}
          value={fromData.country}
          className="border border-gray-300  border-t-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        >
          <option value="india">India</option>
          <option value="usa">Usa</option>
          <option value="canada">Canada</option>
          <option value="switzerland">Switzerland</option>
        </select>
        <br />
        <label htmlFor="street" className="ml-4 text-start">
          Street Address
        </label>{" "}
        <br />
        <input
          type="text"
          placeholder="1234 Main Road"
          value={fromData.street}
          name="street"
          id="street"
          onChange={changeHandeler}
          className="border border-gray-300  border-b-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="city" className="ml-4 text-start">
          City
        </label>{" "}
        <br />
        <input
          type="text"
          placeholder="Chandrokona Town"
          onChange={changeHandeler}
          name="city"
          id="city"
          className="border border-gray-300  border-t-blue-300 focus:border-blue-400  w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="state" className="ml-4 text-start">
          State
        </label>{" "}
        <br />
        <input
          type="text"
          placeholder="West Bengal"
          onChange={changeHandeler}
          name="state"
          id="state"
          className="border border-gray-300  border-b-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <label htmlFor="pin" className="ml-4 text-start">
          Pin Code / Zip Code
        </label>{" "}
        <br />
        <input
          type="text"
          placeholder="721201"
          onChange={changeHandeler}
          name="pin"
          id="pin"
          className="border border-gray-300  border-t-blue-300 focus:border-blue-400 w-[95%] ml-4 p-2 rounded-md outline-none"
        />
        <br />
        <fieldset className="ml-4">
          <legend>By Email</legend>
          <br />
          <input
            type="checkbox"
            name="comment"
            id="comment"
            onChange={changeHandeler}
            checked={fromData.comment}
          />
          <label htmlFor="comment" className="ml-1">
            Comments
          </label>{" "}
          <br />
          <p>
            Comments Get notified when someone post somthing or comment
            something.
          </p>
          <br />
          <input
            type="checkbox"
            name="candidate"
            id="candidate"
            onChange={changeHandeler}
            checked={fromData.candidate}
          />
          <label htmlFor="candidate" className="ml-1">
            Candidate
          </label>{" "}
          <br />
          <p>Candidate Get notified when someone apply for job.</p>
          <br />
          <input
            type="checkbox"
            name="offer"
            id="offer"
            onChange={changeHandeler}
            checked={fromData.offer}
          />
          <label htmlFor="offer" className="ml-1">
            Offers
          </label>{" "}
          <br />
          <p>Offers Get notified when a candidate accepts or reject offer.</p>
        </fieldset>
        <br />
        <fieldset className="ml-4">
          <legend>Push Notifications</legend>
          <p>These are delivered via sms to your mobile phone.</p>

          <br />

          <input
            type="radio"
            name="notifications"
            id="notifications"
            onChange={changeHandeler}
            value="Everything"
            checked={fromData.notifications === "Everything" ? true : false}
          />
          <label htmlFor="notifications" className="ml-1">
            Everything
          </label>

          <br />
          <input
            type="radio"
            name="notifications"
            id="notifications"
            onChange={changeHandeler}
            value="Same-as-email"
            checked={fromData.notifications === "Same-as-email" ? true : false}
          />
          <label htmlFor="notifications" className="ml-1">
            Same as email
          </label>

          <br />
          <input
            type="radio"
            name="notifications"
            id="notifications"
            value="No-push-notification"
            checked={
              fromData.notifications === "No-push-notification" ? true : false
            }
            onChange={changeHandeler}
          />
          <label htmlFor="notifications" className="ml-1">
            No push notification
          </label>
        </fieldset>
        <NavLink to="/">
          <button
            onClick={btnHandeler}
            className="text-white bg-blue-700 hover:bg-blue-500 focus:ring-2
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mt-2 mb-2 ml-4
                    dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Save
          </button>
        </NavLink>
      </form>
    </div>
  );
}

export default Form;
