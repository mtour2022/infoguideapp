// import logo from'../../assets/images/logo_with_title.png';

// import { Container, Navbar, Nav, Image, NavDropdown, Accordion  } from 'react-bootstrap';
// import { Link, NavLink } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell, faLeaf} from '@fortawesome/free-solid-svg-icons';
// import WeatherNav from '../Weather';
// // import { useAuth } from '../auth/authentication.js';

// export default function AppNavBar() {
//   // const { userLoggedIn } = useAuth();

//   return (
//     <Navbar expand="lg" className='px-4 px-md-10 px-lg-4 navbar'>
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/">
//           <Image className='ms-lg-2 me-lg-2' src={logo} alt="Logo" height="25" />
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             {/* <WeatherNav></WeatherNav> */}
//             <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Home</Nav.Link>
//             <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Tourism Stories</Nav.Link>
//             <NavDropdown className='ms-lg-2 navlink' title="Experience" id="basic-nav-dropdown">
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 navlink' title="Hospitality & Lodging" id="basic-nav-dropdown">
//                     <NavDropdown.Item as={NavLink} className=' navlink-inner'>
//                       Accommodations
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Recreational Resorts
//                     </NavDropdown.Item>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Food & Beverages" id="basic-nav-dropdown">
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Restaurants
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Bars & Party Club
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Cafés and Coworking
//                     </NavDropdown.Item>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Tourism & Leisure" id="basic-nav-dropdown">
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Tour Guides
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Travel & Tour Operators
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Tourist Activity Providers
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Event Planning Companies
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                     M.I.C.E. Facilities
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Event Planning Operators
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Tourist & Specialty Shops
//                     </NavDropdown.Item>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Health & Wellness" id="basic-nav-dropdown">
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Spa & Wellness Centres
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Gyms & Fitness Clubs
//                     </NavDropdown.Item>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Transport & Parking" id="basic-nav-dropdown">
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Tourist Land Transports
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Tourist Air Transports
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Passenger Ships
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} className='navlink-inner'>
//                       Parking Spaces
//                     </NavDropdown.Item>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Healthcare" id="basic-nav-dropdown">
//                 <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Hospitals and Clinics</Nav.Link>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Activities</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Attractions</Nav.Link>
//             </NavDropdown>
//             <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Essentials" id="basic-nav-dropdown">
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Emergency Hotlines</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Map</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Requirements</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Beach Laws</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tariff Rates</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Calendar of Events</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Life Style & Facilities</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Virtual Tour Guide</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Helpful Links</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist FAQ</Nav.Link>
//               {/* <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Printable Materials</Nav.Link> */}
//             </NavDropdown>
//             <Nav.Link className='ms-lg-2 me-lg-2  sustainable' as={NavLink} to="/">
//                 <FontAwesomeIcon icon={faLeaf} size="xs" fixedWidth /> Sustainable Travel
//             </Nav.Link>
//             <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Others" id="basic-nav-dropdown">
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Compaint</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Gallery</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourism Frontliners</Nav.Link>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Tourism Data" id="basic-nav-dropdown">
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Arrivals</Nav.Link>
//                     <NavDropdown.Divider />
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Cruise Ship Arrivals</Nav.Link>
//                     <NavDropdown.Divider />
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Flight Data</Nav.Link>
//                     <NavDropdown.Divider />
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">M.I.C.E. Reports</Nav.Link>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Achievements" id="basic-nav-dropdown">
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Awards & Recognitions</Nav.Link>
//                     <NavDropdown.Divider />
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Travel Expos, Conventions, & B2B</Nav.Link>
//                     <NavDropdown.Divider />
//                     <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourism Projects</Nav.Link>
//               </NavDropdown>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Our Story</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">About Us</Nav.Link>
//               <NavDropdown.Divider />
//               <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Feedback</Nav.Link>

              
//             </NavDropdown>
            
//             <Nav.Link className='ms-lg-2 notification' as={NavLink} to="/">
//                 <FontAwesomeIcon icon={faBell} size="xs" fixedWidth /> Updates
//             </Nav.Link>

//             {/* <Nav.Link className='ms-lg-2 me-lg-2 navlink' as={NavLink} to="/">PH</Nav.Link>
//             <Nav.Link className='ms-lg-2 me-lg-2 navlink' as={NavLink} to="/">Eng (US)</Nav.Link> */}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }
import WeatherNav from '../Weather';

import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo_with_title.png';
import whitelogo from '../../assets/images/logoWhiteText.png';
import { Container, Navbar, Nav, Image, NavDropdown, Form, FormControl, Button, InputGroup, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLeaf, faSearch, faFire, faCalendarDay, faBinoculars, faPersonSwimming, faBars } from '@fortawesome/free-solid-svg-icons';

export default function AppNavBar() {
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
        <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar' as={NavLink} to="/">
                <FontAwesomeIcon icon={faBell} size="md" className=' pe-2' fixedWidth /> UPDATES
            </Nav.Link> 
            <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar'  as={NavLink} to="/">
                <FontAwesomeIcon icon={faFire} size="md" className='  pe-2' fixedWidth /> DEALS
            </Nav.Link>  
            <Nav.Link className='ms-lg-2 mb-1' id='basic-nav-sidebar'  as={NavLink} to="/">
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
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">
                <FontAwesomeIcon icon={faBell} size="md" className='notification' fixedWidth /> UPDATES
            </Nav.Link> 
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">
                <FontAwesomeIcon icon={faFire} size="md" className='deals' fixedWidth /> DEALS
            </Nav.Link>  
 
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">
                <FontAwesomeIcon icon={faCalendarDay} size="md" className='events' fixedWidth /> EVENTS
            </Nav.Link>
              {/* <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Home</Nav.Link> */}
            <Nav.Link className='ms-lg-2 navlink' size="md" as={NavLink} to="/">TOURISM STORIES</Nav.Link>
            <NavDropdown className='ms-lg-2' show={isLargeScreen ? hoveredDropdown === "experience" : undefined}
      onMouseEnter={isLargeScreen ? () => setHoveredDropdown("experience") : undefined}
      onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined}
               title="EXPERIENCE" id="basic-nav-dropdown">
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2' title="HOSPITALITY AND LODGING" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} className='' id='basic-nav-dropdown-item'>
                      ACCOMMODATIONS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className=''  id='basic-nav-dropdown-item'>
                      RECREATIONAL RESORTS
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 ' title="FOODS AND BEVERAGES" id="basic-nav-dropdown-title">
                    <NavDropdown.Item as={NavLink} id='basic-nav-dropdown-item'>
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
                      TOURIST LAND TRANSPORTS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink}  id='basic-nav-dropdown-item'>
                      TOURIST AIR TRANSPORTS
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
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
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 '  id="basic-nav-dropdown-title" as={NavLink} to="/">
              <FontAwesomeIcon icon={faPersonSwimming} size="md" fixedWidth /> ACTIVITIES
              </Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  '  id="basic-nav-dropdown-title" as={NavLink} to="/">
              <FontAwesomeIcon icon={faBinoculars} size="md" fixedWidth /> ATTRACTIONS</Nav.Link>
            </NavDropdown>
            <NavDropdown className='ms-lg-2 me-lg-2 ' show={isLargeScreen ? hoveredDropdown === "essentials" : undefined}
      onMouseEnter={isLargeScreen ? () => setHoveredDropdown("essentials") : undefined}
      onMouseLeave={isLargeScreen ? () => setHoveredDropdown(null) : undefined} title="ESSENTIALS" id="basic-nav-dropdown">
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  '  id="basic-nav-dropdown-title" as={NavLink} to="/">EMERGENCY HOTLINES</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TOURIST REQUIREMENTS</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">TARIFF RATES</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  ' id="basic-nav-dropdown-title" as={NavLink} to="/">BEACH LAWS</Nav.Link>
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
            <Nav.Link className='ms-lg-2 me-lg-2  navlink' as={NavLink} to="/">
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
