import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch data from your server
    fetch('http://localhost:4000/events')
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of events
        setEvents(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the current index to move to the next event
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000); // Change event every x seconds (x000 milliseconds)

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [events]);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      selectedItem={currentIndex}
      onChange={(index) => setCurrentIndex(index)}
    >
      {events.slice(0, 5).map((event, index) => (
        <div
          key={index}
          className="relative flex w-full h-96 object-cover bg-black" // Adjust the width and height here
          style={{ backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div
            className="w-2/4 p-4 flex flex-col justify-end"
            style={{
              background: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
              padding: '15px',
            }}
          >
            {/* Assuming event object has 'title', 'date', and 'image' properties */}
            <div className='text-white text-9xl font-bold text-left px-9 text-top'>#{index+1}</div>
            <div className="text-white text-6xl font-bold mb-4 text-left px-9">{event.title}</div>
            <div className="text-gray-200 text-xl font-semibold mb-4 text-left px-9">{formatDate(event.date)}</div>
            <div className="block text-left py-1 px-9 mb-2 mr-2">
              <Link
                to={`/event/${event._id}`}
                className="relative inline-flex items-center justify-left p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
              >
                <span className="relative px-9 py-2.5 justify-start transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Explore
                </span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
