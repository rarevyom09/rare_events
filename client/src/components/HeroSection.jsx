import React from 'react';

const HeroSection = () => {
  return (
    <header className="bg-teal-800 text-white p-16 flex flex-col items-center justify-center font-roboto">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold font-roboto mb-4">
          Welcome to Rare Events
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Find and join exciting events in your Campus.
        </p>
        <div className="flex items-center justify-center">
          <a
            href="#"
            className="btn-primary py-2 px-6 border-black border-2 rounded-full text-lg font-semibold hover:bg-teal-700 hover:text-white transition duration-300 ease-in-out"
          >
            Explore Events
          </a>
          <a
            href="#"
            className="btn-secondary py-2 px-6 rounded-full text-lg font-semibold bg-gray-200 text-teal-800 hover:bg-teal-200 hover:text-teal-800 transition duration-300 ease-in-out ml-4"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
