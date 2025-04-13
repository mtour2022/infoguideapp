
import WeatherNav from '../Weather';

import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo_with_title.png';
import whitelogo from '../../assets/images/logoWhiteText.png';
import { Container, Navbar, Nav, Image, NavDropdown, Form, FormControl, Button, InputGroup, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLeaf, faSearch, faFire, faCalendarDay, faBinoculars, faPersonSwimming, faBars } from '@fortawesome/free-solid-svg-icons';
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
        <Nav className="d-flex justify-content-center">
        {/* <WeatherNav/> */}
        <hr></hr>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/infoguideapp/update/updates`}>
                <FontAwesomeIcon icon={faBell} size="md" className=' pe-2' fixedWidth /> UPDATES
            </Nav.Link> 
            <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar'  as={NavLink} to={`/infoguideapp/update/deals`}>
                <FontAwesomeIcon icon={faFire} size="md" className='  pe-2' fixedWidth /> DEALS
            </Nav.Link>  
            <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar'  as={NavLink} to={`/infoguideapp/update/incomingEvents`}>
                <FontAwesomeIcon icon={faCalendarDay} size="md" className=' pe-2' fixedWidth /> INCOMING EVENTS
        </Nav.Link>

        </Nav>


      </div>
    );
  
  return (
    <div className="navbar-wrapper">
    {/* First Row (Hidden on Scroll) */}
        <div className={`navbar-top ${scrolling ? 'hide' : ''}` }>
          <Container fluid className="d-flex justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/">
              <Image className="ms-lg-2 me-lg-2 logo-top" src={logo} alt="Logo" />
            </Navbar.Brand>

            {/* This div disappears on medium to small screens */}
            <div className="d-none d-xl-flex align-items-center">
              <Form className="d-flex ms-lg-2 me-lg-2" style={{ maxWidth: '200px' }}>
                <InputGroup>
                  <FormControl 
                    type="search" 
                    placeholder="Search" 
                    aria-label="Search" 
                    disabled 
                    style={{ fontSize: '0.8rem', padding: '0.3rem' }} 
                  />
                  <InputGroup.Text style={{ fontSize: '0.8rem' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                </InputGroup>
              </Form>
              <Nav.Link className='ms-lg-2 me-lg-2' id="navlink-top" as={NavLink} to="/">PH</Nav.Link>
              <Nav.Link className='ms-lg-2 me-lg-2' id="navlink-top" as={NavLink} to="/">ENG (US)</Nav.Link>
            </div>
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
            <Nav className="d-flex justify-content-center w-100">
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to={`/infoguideapp/update/updates`}>
                <FontAwesomeIcon icon={faBell} size="md" className='notification' fixedWidth /> UPDATES
            </Nav.Link> 
            <Nav.Link className='ms-lg-2 navlink' as={NavLink}  to={`/infoguideapp/update/deals`}>
                <FontAwesomeIcon icon={faFire} size="md" className='deals' fixedWidth /> DEALS
            </Nav.Link>  
 
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to={`/infoguideapp/update/incomingEvents`}>
                <FontAwesomeIcon icon={faCalendarDay} size="md" className='events' fixedWidth /> EVENTS
            </Nav.Link>
              {/* <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Home</Nav.Link> */}
            <Nav.Link className='ms-lg-2 navlink' size="md" as={NavLink} to={`/infoguideapp/update/stories`}>TOURISM STORIES</Nav.Link>
            <NavDropdown className='ms-lg-2' show={isLargeScreen ? hoveredDropdown === "experience" : undefined}
      onMouseEnter={isLargeScreen ? () => setHoveredDropdown("experience") : undefined}
      onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined}
               title="EXPERIENCE" id="basic-nav-dropdown">
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2' title="HOSPITALITY AND LODGING" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} className=''  to={`/infoguideapp/enterprises/accommodations`} id='basic-nav-dropdown-item'>
                      BORACAY ACCOMMODATIONS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='' id='basic-nav-dropdown-item'>
                      MAINLAND MALAY HOTELS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className=''  id='basic-nav-dropdown-item'>
                      RECREATIONAL RESORTS
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="FOODS AND BEVERAGES" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink}  to={`/infoguideapp/enterprises/restaurants`}  id='basic-nav-dropdown-item'>
                      RESTAURANTS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item'>
                      BARS AND PARTY CLUBS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      CAFES AND COWORKINGS
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  title="TOURISM AND LEISURE" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOUR GUIDES
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TRAVEL AND TOUR OPERATORS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOURIST ACTIVITY PROVIDERS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      EVENT PLANNING COMPANIES
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                    M.I.C.E FACILITIES
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOURISTS AND SPECIALTY SHOPS
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  title="TRANSPORT AND PARKING" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOURIST LAND AND AIR TRANSPORTS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    {/* <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOURIST AIR TRANSPORTS
                    </NavDropdown.Item><NavDropdown.Divider /> */}
                    
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      PASSENGER SHIPS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      PARKING SPACES
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="HEALTH AND WELLNESS" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      SPA AND WELLNESS CENTERS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      GYMS AND FITNESS CENTERS
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ' title="HEALTHCARE"  id="basic-nav-dropdown-title">
                <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">HOSPITALS AND CLINICS</Nav.Link>
              </NavDropdown>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  id="basic-nav-dropdown-title" as={NavLink}   to={`/infoguideapp/enterprises/activities`}>
              <FontAwesomeIcon icon={faPersonSwimming} size="md" fixedWidth /> ACTIVITIES
              </Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  '  id="basic-nav-dropdown-title" as={NavLink}   to={`/infoguideapp/enterprises/attractions`}>
              <FontAwesomeIcon icon={faBinoculars} size="md" fixedWidth /> ATTRACTIONS</Nav.Link>
            </NavDropdown>
            <NavDropdown className='ms-lg-2 me-lg-2 ' show={isLargeScreen ? hoveredDropdown === "essentials" : undefined}
      onMouseEnter={isLargeScreen ? () => setHoveredDropdown("essentials") : undefined}
      onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined} title="ESSENTIALS" id="basic-nav-dropdown">
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  '  id="basic-nav-dropdown-title" as={NavLink}  to={`/infoguideapp/listview/hotlines`} >EMERGENCY HOTLINES</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TOURIST REQUIREMENTS</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TARIFF RATES</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink}  to={`/infoguideapp/listview/ordinances`} >BEACH LAWS</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">CALENDAR OF EVENTS</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">LIFESTYLES AND FACILITIES</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">VIRTUAL TOUR GUIDE</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">HELPFUL LINKS</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TOURIST FAQS</Nav.Link>
            </NavDropdown>
            <Nav.Link className='ms-lg-2 me-lg-2  navlink' as={NavLink}  to={`/infoguideapp/slideshow/sustainableTourism`}>
                <FontAwesomeIcon icon={faLeaf} size="xs" className='sustainable'  fixedWidth /> SUSTAINABLE TOURISM
            </Nav.Link>
            <NavDropdown className='ms-lg-2 me-lg-2 ' show={isLargeScreen ? hoveredDropdown === "others" : undefined}
            onMouseEnter={isLargeScreen ? () => setHoveredDropdown("others") : undefined}
            onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined} title="OTHERS" id="basic-nav-dropdown">
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' id="basic-nav-dropdown-title" as={NavLink} to="/">GALLERY</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' id="basic-nav-dropdown-title" as={NavLink} to="/">TOURISM FRONTLINERS</Nav.Link>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  id="basic-nav-dropdown-title" title="TOURISM DATA">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">TOURISTS ARRIVALS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">CRUISE SHIPS ARRIVALS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">FLIGHT DATA</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">M.I.C.E. REPORTS</Nav.Link>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  '  title="ACHIEVEMENTS" id="basic-nav-dropdown-title">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">AWARDS AND RECOGNITIONS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">TRAVEL EXPOS, EXHIBITS, CONVENTIONS, B2B AND ROADSHOWS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">TOURISM PROJECTS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">TOURISM MARKETS</Nav.Link>
              </NavDropdown>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">ABOUT MALAY-BORACAY</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">ABOUT US</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">FEEDBACK</Nav.Link>
            </NavDropdown>
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">COMPLAINT</Nav.Link>
           
              </Nav>
            </Navbar.Collapse>):
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
