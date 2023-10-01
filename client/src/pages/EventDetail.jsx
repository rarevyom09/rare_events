import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/events/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error('Error fetching event details:', error));

    fetch('http://localhost:4000/profile', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user information:', error));
  }, [id]);

  const handleUpdateEvent = (eventId) => {
    setIsLoadingUpdate(true);
    navigate(`/create?eventId=${eventId}`);
  };

  const handleDeleteEvent = () => {
    const accessKey = prompt('Please enter the access key to delete this event:');

    if (accessKey === 'rare') {
      if (window.confirm('Are you sure you want to delete this event? This change is IRREVERSIBLE !!')) {
        fetch(`http://localhost:4000/events/${event._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            if (response.status === 204) {
              console.log('Event deleted successfully');
              window.location.href = '/explore';
            } else {
              console.error('Failed to delete event');
            }
          })
          .catch((error) => console.error('Error deleting event:', error));
      }
    } else {
      alert('Access key is incorrect. Event deletion canceled.');
    }
  };

  if (!event) {
    return (
      <div>
        {/* Loading indicator */}
      </div>
    );
  }

  const showDeleteButton = user && event.createdBy === user._id;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <img src={event.image} alt="Banner" className="w-full max-h-64 object-cover" />

      <div className="flex mt-4">
        <div className="w-2/3 pr-4">
          {/* Left column for description */}
          {/* <h1 className="text-3xl font-semibold mb-4">{event.title}</h1> */}
          <p className="mb-3 font-bold text-gray-900">
            Description
            <hr className='mt-2 bg-black border-1 border-black'/>
          </p>
          <p className="mb-3 text-gray-600">
          {event.description}
          </p>
        </div>
        <div className="w-1/3">
          {/* Right column with card for remaining event details */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-black">
            <p className="mb-3 font-normal text-gray-800">
              Date: {event.date}
            </p>
            <p className="mb-3 font-normal text-gray-800">
              Time: {event.time}
            </p>
            <p className="mb-3 font-normal text-gray-800">
              Location: {event.location}
            </p>
            <p className="mb-3 font-normal text-gray-800">
              Club Name: {event.clubname}
            </p>
            <div className="mt-4">
              <a
                href="/explore"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                Back
              </a>
              {showDeleteButton && (
                <>
                  <button
                    onClick={handleDeleteEvent}
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete Event
                  </button>
                  <button
                    onClick={() => handleUpdateEvent(event._id)}
                    type="button"
                    className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-700"
                  >
                    {isLoadingUpdate ? (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Loading spinner SVG */}
                      </svg>
                    ) : (
                      <FontAwesomeIcon className="mr-1" />
                    )}
                    Update Event
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
