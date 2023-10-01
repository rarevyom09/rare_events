import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';


function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

const ExplorePage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/events')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false); // Set loading to false when events are fetched
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setIsLoading(false); // Set loading to false on error as well
      });
  }, []);

  const uniqueClubnames = Array.from(new Set(events.map((event) => event.clubname.toLowerCase())));

  const totalSkeletonCards = events.length > 0 ? events.length : 5; // Ensure there's at least 5 skeleton cards

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">Current Events</h1>
      {isLoading ? (
        // Display loading skeletons while fetching events
        // ... (skeleton code remains the same)
        // Display loading skeletons while fetching events
        <div className="space-y-6">
          {Array.from({ length: Math.ceil(totalSkeletonCards / 3) }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-4">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div
                  key={rowIndex * 3 + cardIndex}
                  className="w-64 bg-gray-300 border border-gray-200 rounded-lg shadow-md"
                  style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0f0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientAnimation 1.5s infinite',
                  }}
                >
                  <Skeleton height={200} />
                  <div className="p-4">
                    <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
                    <Skeleton height={12} width={120} style={{ marginBottom: '6px' }} />
                    <Skeleton height={16} width={100} style={{ marginBottom: '6px' }} />
                    <Skeleton height={12} width={80} style={{ marginBottom: '10px' }} />
                    <Skeleton height={30} width={100} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        uniqueClubnames.map((clubname) => (
          <div key={clubname}>
            <h2 className="text-2xl font-bold mb-5">{clubname.toUpperCase()}</h2>
            <div className="overflow-x-auto whitespace-nowrap">
              <div className="inline-flex space-x-4">
                {events
                  .filter((event) => event.clubname.toLowerCase() === clubname)
                  .map((event) => (
                    <div
                      key={event._id}
                      className="w-64 bg-white border border-gray-200 rounded-lg shadow-md mr-4"
                    >
                      <div className="relative">
                        <img
                          className="w-full h-40 object-cover rounded-t-lg shadow-md"
                          src={event.image}
                          alt={event.title}
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-md">
                          {formatDate(event.date)}
                        </div>
                      </div>
                      <div className="p-4">
                        {/* Apply CSS styles for title wrapping */}
                        <h5 className="text-xl font-semibold mb-2 overflow-hidden break-words whitespace-normal">
                          {event.title}
                        </h5>
                        <hr />
                        <span className="text-sm text-gray-700">{event.clubname}</span>
                        <div className="flex mt-4 space-x-3">
                          <Link
                            to={`/event/${event._id}`}
                            className="flex items-center justify-center w-full py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                          >
                            Explore
                          </Link>
                          <a
                            href="#"
                            className="flex items-center justify-center w-full py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                          >
                            Share
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"></span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExplorePage;
