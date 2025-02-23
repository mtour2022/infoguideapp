import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard,
  faBell,
  faLeaf,
  faFire,
  faCalendarDay,
  faBookReader,
  faHotel,
  faLadderWater,
  faUtensils,
  faWineGlass,
  faCoffee,
  faAmbulance,
  faHospital,
  faDog,
  faSwimmer,
  faBarChart,
  faMedal,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Button, Nav, Offcanvas, Collapse } from 'react-bootstrap';
import StoryForm from '../components/AddStories';

// Sidebar link component using onClick to set active content.
function NavlinkIcon({ icon, title, onClick, active }) {
  return (
    <Nav.Link 
      className={`ms-lg-2 mb-2 navlink ${active ? 'active' : ''}`} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <FontAwesomeIcon icon={icon} size="xs" fixedWidth /> {title}
    </Nav.Link>
  );
}

// Expandable sidebar item for grouping links.
function ExpandableNavItem({ title, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Nav.Link
        as="div"
        onClick={() => setOpen(!open)}
        className={className || 'navlink'}
        style={{ cursor: 'pointer' }}
      >
        {title}
        <span style={{ float: 'right' }}>{open ? '-' : '+'}</span>
      </Nav.Link>
      <Collapse in={open}>
        <div className="ms-3">
          {children}
        </div>
      </Collapse>
    </>
  );
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Render main content based on activePage
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to the dashboard home page.</p>
          </div>
        );
      case 'updates':
        return (
          <div>
            <h2>Updates</h2>
            <p>Latest updates will appear here.</p>
          </div>
        );
        case 'stories':
            return (
              <div>
                <h2>Tourism Stories to Tell</h2>
                <p>Submission of Articles are thoroughly reviewed first.</p>
                <StoryForm></StoryForm>
                <Container className='empty-container'></Container>
              </div>
            );
      // Add more cases for other pages as needed.
      default:
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to the dashboard home page.</p>
          </div>
        );
    }
  };

  // Sidebar content extracted to reuse in both main sidebar and offcanvas.
  const sidebarContent = (
    <div className="sidebar-sticky p-3">
      <h4>Admin</h4>
      <Nav className="flex-column sidebar">
        <NavlinkIcon
          icon={faDashboard}
          title="Dashboard"
          onClick={() => { setActivePage('dashboard'); handleClose(); }}
          active={activePage === 'dashboard'}
        />
        <NavlinkIcon
          icon={faBell}
          title="Updates"
          onClick={() => { setActivePage('updates'); handleClose(); }}
          active={activePage === 'updates'}
        />
        <NavlinkIcon
          icon={faFire}
          title="Deals & Promotions"
          onClick={() => { setActivePage('deals'); handleClose(); }}
          active={activePage === 'deals'}
        />
        <NavlinkIcon
          icon={faCalendarDay}
          title="Incoming Events"
          onClick={() => { setActivePage('incoming'); handleClose(); }}
          active={activePage === 'incoming'}
        />
        <NavlinkIcon
          icon={faBookReader}
          title="Tourism Stories"
          onClick={() => { setActivePage('stories'); handleClose(); }}
          active={activePage === 'stories'}
        />
        <NavlinkIcon
          icon={faLeaf}
          title="Sustainable Travel"
          onClick={() => { setActivePage('sustainable'); handleClose(); }}
          active={activePage === 'sustainable'}
        />
        <ExpandableNavItem title="Experience" className="ms-lg-2 mb-2 navlink">
          <ExpandableNavItem title="Hospitality & Lodging" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faHotel}
              title="Accommodations"
              onClick={() => { setActivePage('hospitality'); handleClose(); }}
              active={activePage === 'hospitality'}
            />
            <NavlinkIcon
              icon={faLadderWater}
              title="Resorts"
              onClick={() => { setActivePage('hospitality'); handleClose(); }}
              active={activePage === 'hospitality'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="Food & Beverages" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faUtensils}
              title="Restaurants"
              onClick={() => { setActivePage('restaurants'); handleClose(); }}
              active={activePage === 'restaurants'}
            />
            <NavlinkIcon
              icon={faWineGlass}
              title="Bars & Party Club"
              onClick={() => { setActivePage('bars'); handleClose(); }}
              active={activePage === 'bars'}
            />
            <NavlinkIcon
              icon={faCoffee}
              title="Cafés & Coworking"
              onClick={() => { setActivePage('cafes'); handleClose(); }}
              active={activePage === 'cafes'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="Tourism & Leisure" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faUtensils}
              title="Tour Guides"
              onClick={() => { setActivePage('guides'); handleClose(); }}
              active={activePage === 'guides'}
            />
            <NavlinkIcon
              icon={faWineGlass}
              title="Travel & Tours Operators"
              onClick={() => { setActivePage('ttas'); handleClose(); }}
              active={activePage === 'ttas'}
            />
            <NavlinkIcon
              icon={faCoffee}
              title="Tourist Activity Provider"
              onClick={() => { setActivePage('providers'); handleClose(); }}
              active={activePage === 'providers'}
            />
            
            <NavlinkIcon
              icon={faCoffee}
              title="Tourist & Specialty Shops"
              onClick={() => { setActivePage('shops'); handleClose(); }}
              active={activePage === 'shops'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="Health & Wellness" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faUtensils}
              title="Spa & Wellness Centres"
              onClick={() => { setActivePage('spas'); handleClose(); }}
              active={activePage === 'spas'}
            />
            <NavlinkIcon
              icon={faUtensils}
              title="Gyms & Fitness Clubs"
              onClick={() => { setActivePage('gyms'); handleClose(); }}
              active={activePage === 'gyms'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="Transport & Parking" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faCoffee}
              title="Tourist Land Transport"
              onClick={() => { setActivePage('land+transport'); handleClose(); }}
              active={activePage === 'land+transport'}
            />
            <NavlinkIcon
              icon={faCoffee}
              title="AirLines"
              onClick={() => { setActivePage('airlines'); handleClose(); }}
              active={activePage === 'airlines'}
            />
            <NavlinkIcon
              icon={faCoffee}
              title="Passenger Ship Lines"
              onClick={() => { setActivePage('passenger-ships'); handleClose(); }}
              active={activePage === 'passenger-ships'}
            />
            <NavlinkIcon
              icon={faUtensils}
              title="Parking Spaces"
              onClick={() => { setActivePage('parkings'); handleClose(); }}
              active={activePage === 'parkings'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="Medical Facilities" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faUtensils}
              title="Hospitals & Other Clinics"
              onClick={() => { setActivePage('hospitals'); handleClose(); }}
              active={activePage === 'hospitals'}
            />
            <NavlinkIcon
              icon={faUtensils}
              title="Veterinary Clinics"
              onClick={() => { setActivePage('veterinary+clinics'); handleClose(); }}
              active={activePage === 'veterinary+clinics'}
            />
            <NavlinkIcon
              icon={faUtensils}
              title="Dental Clinics"
              onClick={() => { setActivePage('dental+clinics'); handleClose(); }}
              active={activePage === 'dental+clinics'}
            />
          </ExpandableNavItem>
          <NavlinkIcon
            icon={faSwimmer}
            title="Activities"
            onClick={() => { setActivePage('activities'); handleClose(); }}
            active={activePage === 'activities'}
          />
          
        </ExpandableNavItem>
        <ExpandableNavItem title="Essentials" className="ms-lg-2 mb-2 navlink">
            <NavlinkIcon
                icon={faSwimmer}
                title="Emergency Hotlines"
                onClick={() => { setActivePage('hotlines'); handleClose(); }}
                active={activePage === 'hotlines'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Tourist Requirements"
                onClick={() => { setActivePage('requirements'); handleClose(); }}
                active={activePage === 'requirements'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Beach Ordinances"
                onClick={() => { setActivePage('ordinances'); handleClose(); }}
                active={activePage === 'ordinances'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Calendar of Events"
                onClick={() => { setActivePage('events'); handleClose(); }}
                active={activePage === 'events'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Life Style & Facilities"
                onClick={() => { setActivePage('facilities'); handleClose(); }}
                active={activePage === 'facilities'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Helpful Links"
                onClick={() => { setActivePage('links'); handleClose(); }}
                active={activePage === 'links'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Tourist FAQ"
                onClick={() => { setActivePage('faq'); handleClose(); }}
                active={activePage === 'faq'}
            />
            <NavlinkIcon
                icon={faSwimmer}
                title="Printable Materials"
                onClick={() => { setActivePage('materials'); handleClose(); }}
                active={activePage === 'materials'}
            />
        </ExpandableNavItem>
        <ExpandableNavItem title="Toursim Data" className="ms-lg-2 mb-2 navlink">
            <NavlinkIcon
                icon={faBarChart}
                title="Tourist Arrivals"
                onClick={() => { setActivePage('arrivals'); handleClose(); }}
                active={activePage === 'arrivals'}
            />
            <NavlinkIcon
                icon={faBarChart}
                title="Cruise Arrivals"
                onClick={() => { setActivePage('cruises'); handleClose(); }}
                active={activePage === 'cruise'}
            />
            <NavlinkIcon
                icon={faBarChart}
                title="Flights Data"
                onClick={() => { setActivePage('flights'); handleClose(); }}
                active={activePage === 'flights'}
            />
            <NavlinkIcon
                icon={faBarChart}
                title="M.I.C.E. Reports"
                onClick={() => { setActivePage('mice+reports'); handleClose(); }}
                active={activePage === 'mice+reports'}
            />
        </ExpandableNavItem>
        <ExpandableNavItem title="Achievements" className="ms-lg-2 mb-2 navlink">
            <NavlinkIcon
                icon={faMedal}
                title="Awards & Recognitions"
                onClick={() => { setActivePage('awards'); handleClose(); }}
                active={activePage === 'awards'}
            />
            <NavlinkIcon
                icon={faMedal}
                title="Travel Expos, Conventions, & B2B"
                onClick={() => { setActivePage('awards'); handleClose(); }}
                active={activePage === 'awards'}
            />
            <NavlinkIcon
                icon={faMedal}
                title="Tourism Projects"
                onClick={() => { setActivePage('awards'); handleClose(); }}
                active={activePage === 'awards'}
            />
        </ExpandableNavItem>

        
        
        <Nav.Link
          className="ms-lg-2 navlink"
          onClick={() => { setActivePage('complaints'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          Complaints
        </Nav.Link>
        <Nav.Link
          className="ms-lg-2 navlink"
          onClick={() => { setActivePage('feedbacks'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          Feedback
        </Nav.Link>
        
      </Nav>
    </div>
  );

  return (
    <Container fluid>
      <Row>
        {/* Persistent sidebar: Visible only on large screens and up */}
        <Col xs={3} className="p-0 d-none d-lg-block bg-light" style={{ minHeight: '100vh' }}>
          {sidebarContent}
        </Col>

        {/* Main Content Area */}
        <Col xs={12} md={12} lg={9} className="p-4">
          {/* Menu button visible on small and medium screens */}
          <Button variant="primary" className="d-lg-none mb-3" onClick={handleShow}>
            Menu
          </Button>
          {renderContent()}
        </Col>
      </Row>

      {/* Offcanvas Sidebar for small and medium screens */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {sidebarContent}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}
