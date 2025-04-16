
import WeatherNav from '../Weather';

import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo_with_title.png';
import whitelogo from '../../assets/images/logoWhiteText.png';
import { Container, Navbar, Nav, Image, NavDropdown, Form, FormControl, Button, InputGroup, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLeaf, faSearch, faFire, faCalendarDay, faBinoculars, faPersonSwimming, faBars, faBookOpen, faCompass, faHotel, faFlag, faUtensils, faPlane, faSailboat, faShop, faHome, faShuttleVan, faCross, faAmbulance, faMedal, faStore, faUserGroup, faHeart, faIdCard, faWalking, faLink, faQuestion, faHandPaper } from '@fortawesome/free-solid-svg-icons';
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
        <WeatherNav />
        <hr></hr>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/home`}>
          <FontAwesomeIcon icon={faHome} size="md" className=' pe-2' fixedWidth /> HOME
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/updates`}>
          <FontAwesomeIcon icon={faBell} size="md" className=' pe-2' fixedWidth /> UPDATES
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/deals`}>
          <FontAwesomeIcon icon={faFire} size="md" className='  pe-2' fixedWidth /> DEALS
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/incomingEvents`}>
          <FontAwesomeIcon icon={faCalendarDay} size="md" className=' pe-2' fixedWidth /> INCOMING EVENTS
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/stories`}>
          <FontAwesomeIcon icon={faBookOpen} size="md" className=' pe-2' fixedWidth /> TOURISM STORIES
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/slideshow/sustainableTourism`}>
          <FontAwesomeIcon icon={faLeaf} size="md" className=' pe-2' fixedWidth /> SUSTAINABLE TOURISM
        </Nav.Link>
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>HOSPITALITY AND LODGING</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark'   to={`/enterprises/accommodations`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faHotel} size="md" className=' pe-2' fixedWidth /> BORACAY ACCOMMODATIONS</span>}
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>FOODS AND BEVERAGES</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark'   to={`/enterprises/restaurants`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faUtensils} size="md" className=' pe-2' fixedWidth /> RESTAURANTS</span>}
          </NavDropdown.Item>
        </NavDropdown> 
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>TRANSPORT AND PARKING</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark'  to={`/enterprises/touristLandAndAirTransportOperators`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faShuttleVan} size="md" className=' pe-2' fixedWidth /> LAND AND AIR TRANSPORTS</span>}
          </NavDropdown.Item>
        </NavDropdown> 
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>TOURISM AND LEISURE</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark   my-2'   to={`/enterprises/tourguides`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faFlag} size="md" className=' pe-2' fixedWidth /> TOUR GUIDES</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'   to={`/enterprises/travelAndTourOperators`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faPlane} size="md" className=' pe-2' fixedWidth /> TRAVEL AND TOUR OPERATORS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'   to={`/enterprises/touristActivityProviders`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faSailboat} size="md" className=' pe-2' fixedWidth /> TOURIST ACTIVITY PROVIDERS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/enterprises/touristAndSpecialtyShops`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faShop} size="md" className=' pe-2' fixedWidth /> TOURISTS AND SPECIALTY SHOPS</span>}
          </NavDropdown.Item>
        </NavDropdown> 
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/enterprises/attractions`}>
          <FontAwesomeIcon icon={faCompass} size="md" className=' pe-2' fixedWidth /> ATTRACTIONS
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/enterprises/activities`}>
          <FontAwesomeIcon icon={faPersonSwimming} size="md" className=' pe-2' fixedWidth /> ACTIVITIES
        </Nav.Link>
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>ESSENTIALS</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/listview/hotlines`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faAmbulance} size="md" className=' pe-2' fixedWidth /> EMERGENCY HOTLINES</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/listview/requirements`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faIdCard} size="md" className=' pe-2' fixedWidth /> TOURIST REQUIREMENTS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/update/lifeStyles`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faWalking} size="md" className=' pe-2' fixedWidth /> LIFESTYLES AND FACILITIES</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/update/helpfulLinks`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faLink} size="md" className=' pe-2' fixedWidth /> HELPFUL LINKS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark my-2'   to={`/listview/touristFAQs`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faQuestion} size="md" className=' pe-2' fixedWidth /> TOURIST FAQS</span>}
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/cruiseShips`}>
          <FontAwesomeIcon icon={faSailboat} size="md" className=' pe-2' fixedWidth /> CRUISE SHIP ARRIVALS
        </Nav.Link>
        <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 my-2' title={<span className="text-dark" style={{ fontSize: '0.80rem' }}>ACHIEVEMENTS</span>}
          id="basic-nav-dropdown-title">
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'   to={`/update/awardsAndRecognitions`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faMedal} size="md" className=' pe-2' fixedWidth /> AWARDS AND RECOGNITIONS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'   to={`/update/travelExpos`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faStore} size="md" className=' pe-2' fixedWidth /> TRAVEL EXPOS, EXHIBITS, CONVENTIONS, B2B AND ROADSHOWS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'    to={`/update/tourismProjects`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faUserGroup} size="md" className=' pe-2' fixedWidth /> TOURISM PROJECTS</span>}
          </NavDropdown.Item>
          <NavDropdown.Item as={NavLink} className='text-dark  my-2'    to={`/update/tourismMarkets`} id='basic-nav-dropdown-item'>
          {<span className="text-dark" style={{ fontSize: '0.80rem' }}> <FontAwesomeIcon icon={faHeart} size="md" className=' pe-2' fixedWidth /> TOURISM NICHE</span>}
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/cruiseShips`}>
          <FontAwesomeIcon icon={faHandPaper} size="md" className=' pe-2' fixedWidth /> COMPLAINT FORM
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/cruiseShips`}>
          <FontAwesomeIcon icon={faQuestion} size="md" className=' pe-2' fixedWidth /> ABOUT US
        </Nav.Link>
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to={`/update/cruiseShips`}>
          <FontAwesomeIcon icon={faHandPaper} size="md" className=' pe-2' fixedWidth /> FEEDBACK FORM
        </Nav.Link>
      </Nav>
    </div>
  );

  return (
    <div className="navbar-wrapper">
      {/* First Row (Hidden on Scroll) */}
      <div className={`navbar-top ${scrolling ? 'hide' : ''}`}>
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar.Brand as={Link} to="/">
            <Image className="ms-lg-2 me-lg-2 logo-top" src={logo} alt="Logo" />
          </Navbar.Brand>

          {/* This div disappears on medium to small screens */}
          <div className="d-none d-xl-flex align-items-center">
            <WeatherNav />

            {/* <Form className="d-flex ms-lg-2 me-lg-2" style={{ maxWidth: '200px' }}>
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
              <Nav.Link className='ms-lg-2 me-lg-2' id="navlink-top" as={NavLink} to="/">ENG (US)</Nav.Link> */}
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
                <Nav.Link className='ms-lg-2 navlink' as={NavLink} to={`/update/updates`}>
                  <FontAwesomeIcon icon={faBell} size="md" className='notification' fixedWidth /> UPDATES
                </Nav.Link>
                <Nav.Link className='ms-lg-2 navlink' as={NavLink} to={`/update/deals`}>
                  <FontAwesomeIcon icon={faFire} size="md" className='deals' fixedWidth /> DEALS
                </Nav.Link>

                <Nav.Link className='ms-lg-2 navlink' as={NavLink} to={`/update/incomingEvents`}>
                  <FontAwesomeIcon icon={faCalendarDay} size="md" className='events' fixedWidth /> EVENTS
                </Nav.Link>
                {/* <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Home</Nav.Link> */}
                <Nav.Link className='ms-lg-2 navlink' size="md" as={NavLink} to={`/update/stories`}>TOURISM STORIES</Nav.Link>
                <NavDropdown className='ms-lg-2' show={isLargeScreen ? hoveredDropdown === "experience" : undefined}
                  onMouseEnter={isLargeScreen ? () => setHoveredDropdown("experience") : undefined}
                  onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined}
                  title="EXPERIENCE" id="basic-nav-dropdown">
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2' title="HOSPITALITY AND LODGING" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} className='' to={`/enterprises/accommodations`} id='basic-nav-dropdown-item'>
                      BORACAY ACCOMMODATIONS
                    </NavDropdown.Item>
                    {/*<NavDropdown.Divider />
                     <NavDropdown.Item as={NavLink} className='' id='basic-nav-dropdown-item'>
                      MAINLAND MALAY HOTELS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className=''  id='basic-nav-dropdown-item'>
                      RECREATIONAL RESORTS
                    </NavDropdown.Item> */}
                  </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="FOODS AND BEVERAGES" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} to={`/enterprises/restaurants`} id='basic-nav-dropdown-item'>
                      RESTAURANTS
                    </NavDropdown.Item>
                    {/* <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item'>
                      BARS AND PARTY CLUBS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      CAFES AND COWORKINGS
                    </NavDropdown.Item> */}
                  </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="TOURISM AND LEISURE" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/tourguides`}>
                      TOUR GUIDES
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/travelAndTourOperators`}>
                      TRAVEL AND TOUR OPERATORS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/touristActivityProviders`}>
                      TOURIST ACTIVITY PROVIDERS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    {/* <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      EVENT PLANNING COMPANIES
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                    M.I.C.E FACILITIES
                    </NavDropdown.Item>
                    <NavDropdown.Divider /> */}
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/touristAndSpecialtyShops`}>
                      TOURISTS AND SPECIALTY SHOPS
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="TRANSPORT AND PARKING" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/touristLandAndAirTransportOperators`}>
                      TOURIST LAND AND AIR TRANSPORTS
                    </NavDropdown.Item>
                    {/* <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      PASSENGER SHIPS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      PARKING SPACES
                    </NavDropdown.Item> */}
                  </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="HEALTH AND WELLNESS" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item' to={`/enterprises/spaAndWellnessCentres`}>
                      SPA AND WELLNESS CENTERS
                    </NavDropdown.Item>
                    {/* <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      GYMS AND FITNESS CENTERS
                    </NavDropdown.Item> */}
                  </NavDropdown>
                  {/* <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ' title="HEALTHCARE"  id="basic-nav-dropdown-title">
                <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">HOSPITALS AND CLINICS</Nav.Link>
              </NavDropdown> */}
                  <NavDropdown.Divider />
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' id="basic-nav-dropdown-title" as={NavLink} to={`/enterprises/activities`}>
                    <FontAwesomeIcon icon={faPersonSwimming} size="md" fixedWidth /> ACTIVITIES
                  </Nav.Link>
                  <NavDropdown.Divider />
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/enterprises/attractions`}>
                    <FontAwesomeIcon icon={faBinoculars} size="md" fixedWidth /> ATTRACTIONS</Nav.Link>
                </NavDropdown>
                <NavDropdown className='ms-lg-2 me-lg-2 ' show={isLargeScreen ? hoveredDropdown === "essentials" : undefined}
                  onMouseEnter={isLargeScreen ? () => setHoveredDropdown("essentials") : undefined}
                  onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined} title="ESSENTIALS" id="basic-nav-dropdown">
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/listview/hotlines`} >EMERGENCY HOTLINES</Nav.Link>
                  <NavDropdown.Divider />
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/listview/requirements`}>TOURIST REQUIREMENTS</Nav.Link>
                  <NavDropdown.Divider />
                  {/* <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TARIFF RATES</Nav.Link>
              <NavDropdown.Divider /> */}
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/listview/ordinances`} >BEACH LAWS</Nav.Link>
                  <NavDropdown.Divider />
                  {/* <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">CALENDAR OF EVENTS</Nav.Link>
              <NavDropdown.Divider /> */}
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/update/lifeStyles`}>LIFESTYLES AND FACILITIES</Nav.Link>
                  <NavDropdown.Divider />
                  {/* <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">VIRTUAL TOUR GUIDE</Nav.Link>
              <NavDropdown.Divider /> */}
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/update/helpfulLinks`}>HELPFUL LINKS</Nav.Link>
                  <NavDropdown.Divider />
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to={`/listview/touristFAQs`}>TOURIST FAQS</Nav.Link>
                </NavDropdown>
                <Nav.Link className='ms-lg-2 me-lg-2  navlink' as={NavLink} to={`/slideshow/sustainableTourism`}>
                  <FontAwesomeIcon icon={faLeaf} size="xs" className='sustainable' fixedWidth /> SUSTAINABLE TOURISM
                </Nav.Link>
                <NavDropdown className='ms-lg-2 me-lg-2 ' show={isLargeScreen ? hoveredDropdown === "others" : undefined}
                  onMouseEnter={isLargeScreen ? () => setHoveredDropdown("others") : undefined}
                  onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined} title="OTHERS" id="basic-nav-dropdown">
                  {/* <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' id="basic-nav-dropdown-title" as={NavLink} to="/">GALLERY</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' id="basic-nav-dropdown-title" as={NavLink} to="/">TOURISM FRONTLINERS</Nav.Link>
              <NavDropdown.Divider /> */}
                  {/* <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  id="basic-nav-dropdown-title" title="TOURISM DATA">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">TOURISTS ARRIVALS</Nav.Link>
                    <NavDropdown.Divider />
                   
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">FLIGHT DATA</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to="/">M.I.C.E. REPORTS</Nav.Link>
              </NavDropdown> 
              <NavDropdown.Divider />*/}
                  <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to={`/update/cruiseShips`}>CRUISE SHIPS ARRIVALS</Nav.Link>
                  <NavDropdown.Divider />
                  <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' title="ACHIEVEMENTS" id="basic-nav-dropdown-title">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to={`/update/awardsAndRecognitions`}>AWARDS AND RECOGNITIONS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to={`/update/travelExpos`}>TRAVEL EXPOS, EXHIBITS, CONVENTIONS, B2B AND ROADSHOWS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to={`/update/tourismProjects`}>TOURISM PROJECTS</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id='basic-nav-dropdown-item' as={NavLink} to={`/update/tourismMarkets`}>TOURISM NICHE</Nav.Link>
                  </NavDropdown>
                  {/*<NavDropdown.Divider />
               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">ABOUT MALAY-BORACAY</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">ABOUT US</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">FEEDBACK</Nav.Link> */}
                </NavDropdown>
                <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">COMPLAINT</Nav.Link>

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
