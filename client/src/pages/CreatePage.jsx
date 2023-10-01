import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('eventId');

  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    clubname: '',
    image: null, // New field for image file
  });

  // Fetch event details and pre-fill the form fields if eventId is provided
  useEffect(() => {
    if (eventId) {
      fetch(`http://localhost:4000/events/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          // Pre-fill the form fields with event data
          setFormData({
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            clubname: data.clubname,
            image: null, // You may need to update this based on how you handle images
          });
        })
        .catch((error) => console.error('Error fetching event details:', error));
    }
  }, [eventId]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    // If the input is a file input, handle it differently
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0], // Store the first selected file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('clubname', formData.clubname);
    formDataToSend.append('image', formData.image); // Append the image file

    try {
      const token = localStorage.getItem('token');
      let response;

      if (eventId) {
        // If eventId exists, update the event
        response = await fetch(`http://localhost:4000/events/${eventId}/update`, {
          method: 'PUT',
          body: formDataToSend, // Send the FormData object
          credentials: 'include',
          headers: {
            // Add the Authorization header with the token
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        // If eventId doesn't exist, create a new event
        response = await fetch('http://localhost:4000/create-event', {
          method: 'POST',
          body: formDataToSend, // Send the FormData object
          credentials: 'include',
          headers: {
            // Add the Authorization header with the token
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      if (response.ok) {
        // Event created or updated successfully
        console.log(`Event ${eventId ? 'updated' : 'created'} successfully`);
        // You can redirect the user to a success page or perform other actions here.
        navigate('/explore');
      } else {
        // Event creation or update failed
        console.error(`Event ${eventId ? 'update' : 'creation'} failed`);
        // Handle the error or show an error message to the user.
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any network or other errors that may occur during the request.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {eventId ? 'Update Event' : 'Create Event'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-4 col-span-1">
            <label htmlFor="title" className="block text-gray-700">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 col-span-1">
            <label htmlFor="description" className="block text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4 col-span-1">
            <label htmlFor="date" className="block text-gray-700">
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 col-span-1">
            <label htmlFor="time" className="block text-gray-700">
              Time:
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 col-span-2">
            <label htmlFor="location" className="block text-gray-700">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 col-span-2">
            <label htmlFor="clubname" className="block text-gray-700">
              Club Name:
            </label>
            <input
              type="text"
              id="clubname"
              name="clubname"
              value={formData.clubname}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 col-span-2">
            <label htmlFor="image" className="block text-gray-700">
              Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              accept="image/*" // Specify the accepted file types (e.g., images)
              required
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              {eventId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
