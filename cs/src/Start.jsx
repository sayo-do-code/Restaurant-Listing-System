import React from "react";
import {
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as ReactBootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Start.css";

const Start = () => {
  const navigate = useNavigate();
  // const handleNavDropdownSelect = (eventKey) => {
  //   if (eventKey === "admin") {
  //     navigate("/login");
  //   } else if (eventKey === "restaurant") {
  //     navigate("/restaurantLogin");
  //   } else if (eventKey === "customer") {
  //     navigate("/customerlogin");
  //   }
  // };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Navbar.Brand className="logo" href="#home">
          RestroList
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#offerings">Offerings</Nav.Link>
            <Nav.Link href="#why-us">Why Us</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              className="loginDropdown"
              title="Login"
              id="basic-nav-dropdown"
              onSelect={(eventKey) => {
                if (eventKey === "admin") {
                  navigate("/login");
                } else if (eventKey === "restaurant") {
                  navigate("/restaurantLogin");
                } else if (eventKey === "customer") {
                  navigate("/customerlogin");
                }
              }}
            >
              <NavDropdown.Item eventKey="admin">Admin</NavDropdown.Item>
              <NavDropdown.Item eventKey="restaurant">
                Restaurant
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="customer">Customer</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="image-section">
        <Container
          fluid
          className="h-100 d-flex flex-column justify-content-center align-items-center"
        >
          <img
            src="/Images/lp.jpg"
            alt="Background"
            className="background-image"
          />
          <div className="overlay">
            <h3 className="welcome-text">Welcome to RestroList</h3>
            <p className="description-text">
              Explore diverse restaurants in your area and beyond, each offering
              a unique palette of flavors.
            </p>
            <Button
              className="register-button"
              onClick={() => navigate("/getstarted")}
            >
              Register
            </Button>
          </div>
        </Container>
      </div>
      {/* Service Section */}
      <Container id="offerings" className="serviceContainer">
        <h2 className="text-center servideHead">Offerings</h2>
        <Row className="justify-content-center">
          {/* Service Card 1 */}
          <Card className="service-card">
            <Card.Img
              className="imageService"
              variant="top"
              src="/Images/a.jpg"
            />
            <Card.Body>
              <Card.Title>Restaurant Exploration</Card.Title>
              <Card.Text>
                Explore a map of our featured restaurant locations. Our platform
                makes it effortless for you to discover nearby eateries,
                allowing choose based on your location and preferences.
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Service Card 2 */}
          <Card className="service-card">
            <Card.Img
              className="imageService"
              variant="top"
              src="/Images/c.jpg"
            />
            <Card.Body>
              <Card.Title>Dining Atmosphere</Card.Title>
              <Card.Text>
                Find a variety of dining atmospheres, from cozy cafes to elegant
                dining spaces. Discover the perfect ambiance for your dining
                experience, curated just for you.
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Service Card 3 */}
          <Card className="service-card">
            <Card.Img
              className="imageService"
              variant="top"
              src="/Images/i.jpg"
            />
            <Card.Body>
              <Card.Title>Chef in Action</Card.Title>
              <Card.Text>
                Meet the culinary maestros behind the scenes. Our talented chefs
                work their magic, preparing delectable dishes with skill,
                passion, and a touch of artistry.
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Service Card 4 */}
          <Card className="service-card">
            <Card.Img
              className="imageService"
              variant="top"
              src="/Images/d.jpg"
            />
            <Card.Body>
              <Card.Title> Food Selection</Card.Title>
              <Card.Text>
                Dive into a world of culinary delights. Our featured restaurants
                offer a diverse menu of sumptuous dishes, from global cuisines
                to local flavors, satisfying every palate.
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>

      {/*why us section */}
      <Container id="why-us" className="whyUsContainer">
        <h2 className="text-center whyUsHead">Why Us?</h2>
        <Row className="justify-content-center align-items-start">
          <div className="whyUsCardContainer">
            <div className="whyUsCard">
              <h4>Access to Restaurant Information</h4>
              <p>
                Easily access comprehensive information about each restaurant,
                including location, contact details, opening and closing times,
                and descriptions.
              </p>
            </div>
            <div className="whyUsCard">
              <h4>Streamlined Registration Process</h4>
              <p>
                Enjoy a seamless registration process to unlock the full
                potential of our platform. Registered users gain access to
                detailed views of restaurants.
              </p>
            </div>
          </div>
          <div className="whyUsImageContainer">
            <img
              src="/Images/wcu.jpg"
              alt="Why Us Image"
              className="whyUsImage"
            />
          </div>
        </Row>
      </Container>

      {/* Contact Section */}
      <Container id="contact" className="contact-section">
        <h2 className="text-center contactHead">Contact</h2>
        <Row className="justify-content-center alignSM">
          <Col md={4} className="contact-item">
            <img
              src="/Images/facebook.png"
              alt="Facebook Logo"
              className="contact-logo"
            />
            <p>
              Facebook:{" "}
              <a href="https://www.fb.com/restrolist.com">RestroList System</a>
            </p>
          </Col>
          <Col md={4} className="contact-item">
            <img
              src="/Images/twitter.png"
              alt="Twitter Logo"
              className="contact-logo"
            />
            <p>
              Twitter:{" "}
              <a href="https://www.twitter.com/restrolist">@RestroListSyst</a>
            </p>
          </Col>
          <Col md={4} className="contact-item">
            <img
              src="/Images/instagram.png"
              alt="Instagram Logo"
              className="contact-logo"
            />
            <p>
              Instagram:{" "}
              <a href="https://www.instagram.com/restrolist">restro@list_01</a>
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center marginButtom alignSM">
          <Col md={4} className="contact-item">
            <img
              src="/Images/gmail.png"
              alt="Gmail Logo"
              className="contact-logo"
            />
            <p>
              Email:{" "}
              <a href="mailto:info@restrolist.com">restrolist@gmail.com</a>
            </p>
          </Col>
          <Col md={4} className="contact-item">
            <img
              src="/Images/telephone.png"
              alt="Phone Logo"
              className="contact-logo"
            />
            <p>
              Phone: <span className="phoneColor">+977 9812345678</span>
            </p>
          </Col>
          <Col md={4} className="contact-item">
            <img
              src="/Images/placeholder.png"
              alt="Address Logo"
              className="contact-logo"
            />
            <p>
              Address: <span className="addressColor">Chabahil, Kathmandu</span>
            </p>
          </Col>
        </Row>
        {/* Form field and submit button */}
        <Row className="justify-content-start marginButtom">
          <Col md={1}></Col>
          <Col md={3} className="leaveEmailText">
            <p> Or leave your email, we will contact you: </p>
          </Col>
          <Col md={4} className="contact-item">
            <input
              type="text"
              placeholder="Leave your email"
              className="form-control custom-input"
            />
          </Col>
          <Col md={4} className="contact-item">
            <button className="btn btn-primary custom-button">Submit</button>
          </Col>
        </Row>
      </Container>
      {/* Footer Section */}
      <div
        className="footer-section"
        style={{
          backgroundColor: "#47a29b",
          marginTop: "80px",
          paddingTop: "30px",
        }}
      >
        <Container>
          <Row>
            <Col>
              <h5>Policies</h5>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </Col>
            <Col>
              <h5>FAQ</h5>
              <ul>
                <li>General Questions</li>
                <li>Payment Questions</li>
                <li>Account Questions</li>
                <li>Support Questions</li>
              </ul>
            </Col>
            <Col>
              <h5>Get Started</h5>
              <ul>
                <li>Create an Account</li>
                <li>Explore Restaurants</li>
                <li>Place an Order</li>
                <li>Manage Account</li>
              </ul>
            </Col>
            <Col>
              <h5>Videos</h5>
              <ul>
                <li>Restaurant Tours</li>
                <li>Food Preparation</li>
                <li>Customer Testimonials</li>
                <li>Event Highlights</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="scroll-to-top" onClick={scrollToTop}>
        <div className="arrow-up"></div>
      </div>
    </>
  );
};

export default Start;

// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Navbar, Nav } from "react-bootstrap";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Button from "react-bootstrap/Button";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./style.css";

// function Start() {
//   const navigate = useNavigate();

//   return (
//     <div className="landingpage">
//       <div className="image landingPage">
//         <div className="bg-overlay"></div>
//       </div>
//       <div className="container navbar-container">
//         <Navbar className="landingpage_nav" variant="dark">
//           <Navbar.Brand href="/">
//             <h5>RLS || List Your Business</h5>
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse
//             id="basic-navbar-nav"
//             className="justify-content-end"
//           >
//             <Button onClick={(e) => navigate("/login")}>Admin</Button>
//             <span>&nbsp;&nbsp;</span>
//             <Button onClick={(e) => navigate("/restaurantLogin")}>
//               Restaurant
//             </Button>
//             <span>&nbsp;&nbsp;</span>
//             <Button onClick={(e) => navigate("/customerlogin")}>
//               Customer
//             </Button>
//           </Navbar.Collapse>
//         </Navbar>
//       </div>
//       <div className="header_content text-center">
//         <h3>Restaurant Listing Service </h3>
//         <p>Want To List Your Restaurant?</p>
//         <Button
//           style={{ padding: "0.7rem 1rem" }}
//           id="dropdown-basic-button"
//           className="my-custom-dropdown"
//           title="LOGIN"
//           onClick={() => navigate("/getstarted")}
//         >
//           Register
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default Start;
