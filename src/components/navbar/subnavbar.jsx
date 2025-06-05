
import WeatherNav from '../Weather';
import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo_with_title.png';
import whitelogo from '../../assets/images/logoWhiteText.png';
import { Container, Navbar, Nav, Image, NavDropdown, Form, FormControl, Button, InputGroup, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLeaf, faSearch, faFire, faCalendarDay, faBinoculars, faPersonSwimming, faBars, faBookOpen, faCompass, faHotel, faFlag, faUtensils, faPlane, faSailboat, faShop, faHome, faShuttleVan, faCross, faAmbulance, faMedal, faStore, faUserGroup, faHeart, faIdCard, faWalking, faLink, faQuestion, faHandPaper, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function AppNavBar() {
  const navigate = useNavigate();

  const [scrolling, setScrolling] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };

    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove both event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sidebar content extracted to reuse in both main sidebar and offcanvas.
  const sidebarContent = (

    <div className="sidebar-sticky  pt-5">
      <Nav className="d-flex justify-content-center mb-5">
      </Nav>
    </div>
  );

  return (
    <div className="navbar-wrapper">
      {/* First Row (Hidden on Scroll) */}
      <div className={`navbar-top ${scrolling ? 'hide' : ''}`}>
        <Container fluid className="d-flex justify-content-between align-items-center">
        </Container>
      </div>


      {/* Second Row (Persistent) */}
      <Navbar expand="xl" className={`app-navbar ${scrolling ? 'scrolled' : ''}`}>
        <Container fluid>
          {!isLargeScreen ? (
            <Button variant="link" onClick={handleShow} className="me-2 text-white">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </Button>

          ) : null}
          {scrolling && (
            <Navbar.Brand as={Link} to="/" className='ps-3'>
              <Image className='ms-lg-2 me-lg-2' src={whitelogo} alt="Logo" height="25" />
            </Navbar.Brand>
          )}
          {isLargeScreen ? (
            <Navbar.Collapse id="basic-navbar-nav">
             <Nav>
              </Nav>
            </Navbar.Collapse>) :
            (
              <Offcanvas show={show} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                  <Image className="ms-lg-2 me-lg-2 logo-top" src={logo} alt="Logo" />
                </Offcanvas.Header>
                <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
              </Offcanvas>
            )}
        </Container>
      </Navbar>

    </div>
  );
}
