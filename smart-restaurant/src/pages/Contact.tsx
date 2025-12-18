import React from 'react';

const contactInfo = {
  address: "123 Main Boulevard, Gulberg III, Lahore, Pakistan",
  phone: "+92 42 1234567",
  email: "info@dastarkhwan.com",
  hours: {
    weekday: "11:00 AM - 11:00 PM",
    weekend: "11:00 AM - 12:00 AM"
  }
};

const restaurantLocation = {
  lat: 31.5204,  // Lahore coordinates
  lng: 74.3587,
  zoom: 15
};

const Contact: React.FC = () => {
  return (
    <div>
      {/* Contact page content will go here */}
    </div>
  );
};

export default Contact; 