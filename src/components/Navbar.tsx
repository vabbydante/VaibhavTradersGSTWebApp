// src/components/Navbar.tsx
'use client'; // Ensure this component is client-side only

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons'; // You may need to install react-bootstrap-icons for the gear icon

const MyNavbar = () => {
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo-no-background.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
          Vaibhav Traders
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/about">About</Nav.Link>
            <Nav.Link as={Link} href="/contact">Contact Us</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Dropdown align="end">
              <Dropdown.Toggle as="a" className="nav-link">
                <Gear /> {/* Gear icon for the dropdown */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} href="/products.vt">Products</Dropdown.Item>
                <Dropdown.Item as={Link} href="/countries">Countries</Dropdown.Item>
                <Dropdown.Item as={Link} href="/states">States</Dropdown.Item>
                <Dropdown.Item as={Link} href="/delivery-modes">Delivery Modes</Dropdown.Item>
                <Dropdown.Item as={Link} href="/customers">Customers</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link as={Link} href="/logout" className="ms-3">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
