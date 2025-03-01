import { Container, Navbar, Nav, Image, NavDropdown, Accordion  } from 'react-bootstrap';
import logo from'../../assets/images/logo_with_title.png';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLeaf} from '@fortawesome/free-solid-svg-icons';
import WeatherNav from '../Weather';
// import { useAuth } from '../auth/authentication.js';





export default function AppNavBar() {
  // const { userLoggedIn } = useAuth();

  return (
    <Navbar expand="lg" className='px-4 px-md-10 px-lg-4 navbar'>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <Image className='ms-lg-2 me-lg-2' src={logo} alt="Logo" height="25" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* <WeatherNav></WeatherNav> */}
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link className='ms-lg-2 navlink' as={NavLink} to="/">Tourism Stories</Nav.Link>
            <NavDropdown className='ms-lg-2 navlink' title="Experience" id="basic-nav-dropdown">
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2 navlink' title="Hospitality & Lodging" id="basic-nav-dropdown">
                    <NavDropdown.Item as={NavLink} className=' navlink-inner'>
                      Accommodations
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Recreational Resorts
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Food & Beverages" id="basic-nav-dropdown">
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Restaurants
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Bars & Party Club
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Cafés and Coworking
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Tourism & Leisure" id="basic-nav-dropdown">
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Tour Guides
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Travel & Tour Operators
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Tourist Activity Providers
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Event Planning Companies
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                    M.I.C.E. Facilities
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Event Planning Operators
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Tourist & Specialty Shops
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Health & Wellness" id="basic-nav-dropdown">
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Spa & Wellness Centres
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Gyms & Fitness Clubs
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Transport & Parking" id="basic-nav-dropdown">
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Tourist Land Transports
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Tourist Air Transports
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Passenger Ships
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} className='navlink-inner'>
                      Parking Spaces
                    </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Healthcare" id="basic-nav-dropdown">
                <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Hospitals and Clinics</Nav.Link>
              </NavDropdown>
                
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Activities</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Attractions</Nav.Link>
              
            </NavDropdown>
            <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Essentials" id="basic-nav-dropdown">
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Emergency Hotlines</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Map</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Requirements</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Beach Laws</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tariff Rates</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Calendar of Events</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Life Style & Facilities</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Virtual Tour Guide</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Helpful Links</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist FAQ</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Printable Materials</Nav.Link>
              

            </NavDropdown>
            <Nav.Link className='ms-lg-2 me-lg-2  sustainable' as={NavLink} to="/">
                <FontAwesomeIcon icon={faLeaf} size="xs" fixedWidth /> Sustainable Travel
            </Nav.Link>
            <NavDropdown className='ms-lg-2 me-lg-2 navlink' title="Others" id="basic-nav-dropdown">
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Compaint</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourism Frontliners</Nav.Link>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Tourism Data" id="basic-nav-dropdown">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourist Arrivals</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Cruise Ship Arrivals</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Flight Data</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">M.I.C.E. Reports</Nav.Link>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' title="Achievements" id="basic-nav-dropdown">
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Awards & Recognitions</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Travel Expos, Conventions, & B2B</Nav.Link>
                    <NavDropdown.Divider />
                    <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Tourism Projects</Nav.Link>
              </NavDropdown>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Our Story</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">About Us</Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link className='ms-lg-2 me-lg-2 ms-md-2 ms-sm-2  navlink' as={NavLink} to="/">Feedback</Nav.Link>

              
            </NavDropdown>
            
            <Nav.Link className='ms-lg-2 notification' as={NavLink} to="/">
                <FontAwesomeIcon icon={faBell} size="xs" fixedWidth /> Updates
            </Nav.Link>

            {/* <Nav.Link className='ms-lg-2 me-lg-2 navlink' as={NavLink} to="/">PH</Nav.Link>
            <Nav.Link className='ms-lg-2 me-lg-2 navlink' as={NavLink} to="/">Eng (US)</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
