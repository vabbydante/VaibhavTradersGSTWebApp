// src/app/contact/page.tsx
import React from 'react';
import '../../styles/globals.css'; // Ensure your custom styles are imported

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-content">
        <p>Please fill the form below and click on Submit</p>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="shopName">Store/Shop Name</label>
            <input type="text" id="shopName" name="shopName" required />
          </div>
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input type="tel" id="contactNumber" name="contactNumber" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <div className="about-cta">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
