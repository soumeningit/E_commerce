import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Placeholder for API call
    // try {
    //   const response = await submitContactForm(formData);
    //   if (response.status === 200) {
    //     setFormStatus("success");
    //     setFormData({ name: "", email: "", message: "" });
    //   }
    // } catch (error) {
    //   setFormStatus("error");
    // }

    // Simulate successful submission for demo
    setFormStatus("success");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormStatus(null), 3000);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            We're here to help! Reach out with any questions, feedback, or
            support needs.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send Message
              </button>
            </div>
            {formStatus === "success" && (
              <p className="mt-4 text-green-600 text-center">
                Message sent successfully!
              </p>
            )}
            {formStatus === "error" && (
              <p className="mt-4 text-red-600 text-center">
                Failed to send message. Please try again.
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <FaPhone className="text-indigo-600 text-xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+1 (800) 123-4567</p>
                  <p className="text-gray-500 text-sm">Mon-Fri, 9 AM - 5 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-indigo-600 text-xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <a
                    href="mailto:support@store.com"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    support@store.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-600 text-xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    123 E-Commerce St, Suite 100
                    <br />
                    City, State, 12345, USA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">
              Interactive Map Placeholder (Google Maps API can be integrated
              here)
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Our Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
