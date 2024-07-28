// src/app/about/page.tsx
import React from 'react';
import Link from 'next/link';
import '../../styles/globals.css'; // Ensure your custom styles are imported

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <img src='/logo-no-background.png' alt="Logo" style={{ height: '120px' }}></img>
        <br/><br/>
        <h1>About Vaibhav Traders</h1>
        <p>Your trusted partner in trading and logistics solutions.</p>
      </div>
      <div className="about-content">
        <h2>Our Mission</h2>
        <p>
          At Vaibhav Traders, our mission is to provide reliable and efficient trading and logistics services to our clients. We aim to foster long-term relationships by delivering exceptional value and customer service.
        </p>
        <h2>Our Values</h2>
        <p>
          Integrity, commitment, and innovation are at the core of our values. We believe in conducting our business with the highest ethical standards and continuously striving to improve our services.
        </p>
        <h2>Why Choose Us?</h2>
        <p>
          With years of experience in the wholesale industry, we have built a reputation for excellence. We are always ready to go the extra mile to ensure your satisfaction. Choose Vaibhav Traders for a seamless and hassle-free trading experience.
        </p>
        <div className="about-cta">
          <Link href="/contact" passHref>
            <button>Contact Us</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
