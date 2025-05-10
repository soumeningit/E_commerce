import React from "react";

function AboutPage() {
  // Dummy team data
  const teamMembers = [
    {
      name: "Jane Doe",
      role: "Founder & CEO",
      image: "https://via.placeholder.com/150",
      bio: "Jane is passionate about bringing quality products to customers worldwide.",
    },
    {
      name: "John Smith",
      role: "Chief Technology Officer",
      image: "https://via.placeholder.com/150",
      bio: "John leads our tech team to build a seamless shopping experience.",
    },
    {
      name: "Emily Brown",
      role: "Head of Marketing",
      image: "https://via.placeholder.com/150",
      bio: "Emily crafts strategies to connect with our amazing customers.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About Our Store
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            We're dedicated to delivering quality products and exceptional
            customer experiences. Discover our story and what drives us.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Our Story
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Founded in 2020, our e-commerce platform started with a simple
            mission: to make high-quality products accessible to everyone. From
            humble beginnings, we've grown into a trusted name, serving
            customers globally with passion and dedication.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://via.placeholder.com/600x400"
              alt="Our Story"
              className="rounded-lg shadow-md w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Building a Better Shopping Experience
            </h3>
            <p className="text-gray-600">
              We believe in transparency, quality, and customer satisfaction.
              Every product we offer is carefully curated to meet our high
              standards, ensuring you get the best value for your money.
            </p>
            <p className="text-gray-600">
              Our team works tirelessly to innovate and improve, from seamless
              browsing to fast, reliable shipping. We're here to make your
              shopping journey delightful.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            To empower customers with choice, quality, and convenience, while
            fostering a sustainable and inclusive marketplace for all.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Meet Our Team
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our dedicated team is the heart of our success, working together to
            bring you the best shopping experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
              <p className="text-gray-600 mt-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions or need assistance? We're here to help. Reach out to
            us anytime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@store.com"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="bg-white text-indigo-600 px-6(rgb(74, 85, 104)) py-3 rounded-lg shadow hover:bg-gray-100 transition border border-indigo-600"
            >
              Contact Form
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Our Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
