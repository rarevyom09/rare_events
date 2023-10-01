import React, { useState } from 'react';

const InterestsSelection = ({ selectedInterests, setInterests, onComplete }) => {
  const [interests, setLocalInterests] = useState([]);

  const toggleInterest = (interest) => {
    const updatedInterests = interests.includes(interest)
      ? interests.filter((item) => item !== interest)
      : [...interests, interest];
    setLocalInterests(updatedInterests);
  };

  const handleComplete = () => {
    setInterests(interests);
    onComplete(); // Trigger an action after interests selection (e.g., redirect or something else)
  };

  return (
    <div>
      <h2>Select Your Interests</h2>
      <div className="interests-list">
        {interestOptions.map((interest) => (
          <label key={interest}>
            <input
              type="checkbox"
              value={interest}
              checked={interests.includes(interest)}
              onChange={() => toggleInterest(interest)}
            />
            {interest}
          </label>
        ))}
      </div>
      <button
        onClick={handleComplete}
        className={`py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-full ${
          interests.length > 0
            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white'
            : 'bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        }`}
      >
        Complete
      </button>
    </div>
  );
};

const interestOptions = ['Interest 1', 'Interest 2', 'Interest 3', '...'];

export default InterestsSelection;
