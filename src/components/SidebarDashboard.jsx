


// import React, { useState } from 'react';
// import { Container, Row, Col, Nav, Offcanvas, NavDropdown, Button, Collapse} from 'react-bootstrap';
// import { Link, NavLink } from 'react-router-dom';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faDashboard,
//   faBell,
//   faLeaf,
//   faFire,
//   faCalendarDay,
//   faBookReader,
//   faUmbrellaBeach,
//   faBinoculars,
//   faHotel,
//   faLadderWater,
//   faUtensils,
//   faWineGlass,
//   faCoffee,
//   faFlag,
//   faHardHat,
//   faParachuteBox,
//   faPeopleGroup,
//   faCalendarXmark,
//   faShop,
//   faHospital,
//   faDog,
//   faAmbulance,
//   faPassport,
//   faSwimmer,
//   faMoneyCheck,
//   faCalendarCheck,
//   faLanguage,
//   faVideo,
//   faLink,
//   faDigitalTachograph,
//   faPrint,
//   faPlane,
//   faShip,
//   faHatCowboySide,
//   faBarChart,
//   faMedal,
//   faTable,
//   faProjectDiagram,faSignHanging,
//   faHandshake
// } from '@fortawesome/free-solid-svg-icons';


// // Sample content components
// function DashboardHome() {
//     return (
//       <div>
//         <h2>Dashboard</h2>
//         <p>Welcome to the dashboard home page.</p>
//       </div>
//     );
//   }
  
//   function Updates() {
//     return (
//       <div>
//         <h2>Updates</h2>
//         <p>Latest updates will appear here.</p>
//       </div>
//     );
//   }
  
//   function DealsPromotions() {
//     return (
//       <div>
//         <h2>Deals & Promotions</h2>
//         <p>Check out the latest deals and promotions.</p>
//       </div>
//     );
//   }
  
//   function IncomingEvents() {
//     return (
//       <div>
//         <h2>Incoming Events</h2>
//         <p>Here are the upcoming events.</p>
//       </div>
//     );
//   }
  
//   function TourismStories() {
//     return (
//       <div>
//         <h2>Tourism Stories</h2>
//         <p>Read the latest tourism stories.</p>
//       </div>
//     );
//   }
  
//   function HospitalityLodging() {
//     return (
//       <div>
//         <h2>Hospitality & Lodging</h2>
//         <p>Accommodations and resorts information.</p>
//       </div>
//     );
//   }
  
//   function MedicalFacilities() {
//     return (
//       <div>
//         <h2>Medical Facilities</h2>
//         <p>Clinics, hospitals, and veterinary services.</p>
//       </div>
//     );
//   }
  
//   function Essentials() {
//     return (
//       <div>
//         <h2>Essentials</h2>
//         <p>Essential information for tourists.</p>
//       </div>
//     );
//   }
  
//   function TourismData() {
//     return (
//       <div>
//         <h2>Tourism Data</h2>
//         <p>Data and reports on tourism.</p>
//       </div>
//     );
//   }
  
//   function Achievements() {
//     return (
//       <div>
//         <h2>Achievements</h2>
//         <p>Awards, recognitions, and project details.</p>
//       </div>
//     );
//   }
  
//   function SustainableTravel() {
//     return (
//       <div>
//         <h2>Sustainable Travel</h2>
//         <p>Content for Sustainable Travel.</p>
//       </div>
//     );
//   }
  
//   function Complaints() {
//     return (
//       <div>
//         <h2>Complaints</h2>
//         <p>Content for Complaints.</p>
//       </div>
//     );
//   }
  
//   function Feedback() {
//     return (
//       <div>
//         <h2>Feedback</h2>
//         <p>Content for Feedback.</p>
//       </div>
//     );
//   }
  
//   function OurStory() {
//     return (
//       <div>
//         <h2>Our Story</h2>
//         <p>Content for Our Story.</p>
//       </div>
//     );
//   }
  
//   function AboutUs() {
//     return (
//       <div>
//         <h2>About Us</h2>
//         <p>Content for About Us.</p>
//       </div>
//     );
//   }
  

// // Sidebar link with an icon
// function NavlinkIcon({ icon, title, to }) {
//     return (
//       <Nav.Link className="ms-lg-2 mb-2 navlink" as={NavLink} to={to}>
//         <FontAwesomeIcon icon={icon} size="xs" fixedWidth /> {title}
//       </Nav.Link>
//     );
//   }
  
// // Expandable item in the sidebar using Collapse
// function ExpandableNavItem({ title, children, className }) {
//     const [open, setOpen] = useState(false);
  
//     return (
//       <>
//         <Nav.Link
//           as="div"
//           onClick={() => setOpen(!open)}
//           className={className ? className : 'navlink'}
//           style={{ cursor: 'pointer' }}
//         >
//           {title}
//           <span style={{ float: 'right' }}>{open ? '-' : '+'}</span>
//         </Nav.Link>
//         <Collapse in={open}>
//           <div className="ms-3">{children}</div>
//         </Collapse>
//       </>
//     );
//   }

  
// export default function SidebarDashboard({ show, handleClose }) {

//      const [activePage, setActivePage] = useState('dashboard');
    
//       // Determine which component to render based on activePage.
//       const renderContent = () => {
//         switch(activePage) {
//           case 'dashboard': return <DashboardHome />;
//           case 'updates': return <Updates />;
//           case 'deals': return <DealsPromotions />;
//           case 'incoming': return <IncomingEvents />;
//           case 'stories': return <StoryForm />;
//           case 'hospitality': return <HospitalityLodging />;
//           case 'medical': return <MedicalFacilities />;
//           case 'essentials': return <Essentials />;
//           case 'data': return <TourismData />;
//           case 'achievements': return <Achievements />;
//           case 'sustainable': return <SustainableTravel />;
//           case 'complaints': return <Complaints />;
//           case 'feedback': return <Feedback />;
//           case 'ourstory': return <OurStory />;
//           case 'aboutus': return <AboutUs />;
//           // Add additional cases as needed
//           default: return <DashboardHome />;
//         }
//       };
    

//     return (
//       // Offcanvas component for mobile view
//       <Offcanvas show={show} onHide={handleClose} backdrop={false} scroll={true} placement="start">
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Admin Menu</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//         <Nav className="flex-column sidebar">
//                       <NavlinkIcon 
//                         icon={faDashboard} 
//                         title="Dashboard" 
//                         onClick={() => setActivePage('dashboard')}
//                         active={activePage === 'dashboard'}
//                       />
//                       <NavlinkIcon 
//                         icon={faBell} 
//                         title="Updates" 
//                         onClick={() => setActivePage('updates')}
//                         active={activePage === 'updates'}
//                       />
//                       <NavlinkIcon 
//                         icon={faFire} 
//                         title="Deals & Promotions" 
//                         onClick={() => setActivePage('deals')}
//                         active={activePage === 'deals'}
//                       />
//                       <NavlinkIcon 
//                         icon={faCalendarDay} 
//                         title="Incoming Events" 
//                         onClick={() => setActivePage('incoming')}
//                         active={activePage === 'incoming'}
//                       />
//                       <NavlinkIcon 
//                         icon={faBookReader} 
//                         title="Tourism Stories" 
//                         onClick={() => setActivePage('stories')}
//                         active={activePage === 'stories'}
//                       />
        
//                       <ExpandableNavItem title="Experience" className="ms-lg-2 mb-2 navlink">
//                         <ExpandableNavItem title="Hospitality & Lodging" className="ms-lg-2 mb-2 me-lg-2 navlink">
//                           <NavlinkIcon 
//                             icon={faHotel} 
//                             title="Accommodations" 
//                             onClick={() => setActivePage('hospitality')}
//                             active={activePage === 'hospitality'}
//                           />
//                           <NavlinkIcon 
//                             icon={faLadderWater} 
//                             title="Resorts" 
//                             onClick={() => setActivePage('hospitality')}
//                             active={activePage === 'hospitality'}
//                           />
//                         </ExpandableNavItem>
//                         <ExpandableNavItem title="Food & Beverages" className="ms-lg-2 mb-2 me-lg-2 navlink">
//                           <NavlinkIcon 
//                             icon={faUtensils} 
//                             title="Restaurants" 
//                             onClick={() => setActivePage('food')}
//                             active={activePage === 'food'}
//                           />
//                           <NavlinkIcon 
//                             icon={faWineGlass} 
//                             title="Bars & Party Club" 
//                             onClick={() => setActivePage('food')}
//                             active={activePage === 'food'}
//                           />
//                           <NavlinkIcon 
//                             icon={faCoffee} 
//                             title="Cafés & Coworking" 
//                             onClick={() => setActivePage('food')}
//                             active={activePage === 'food'}
//                           />
//                         </ExpandableNavItem>
//                         <ExpandableNavItem title="Experiences" className="ms-lg-2 mb-2 me-lg-2 navlink">
//                           <NavlinkIcon 
//                             icon={faHardHat} 
//                             title="Tour Guides" 
//                             onClick={() => setActivePage('experience/tourguides')}
//                             active={activePage === 'experience/tourguides'}
//                           />
//                           <NavlinkIcon 
//                             icon={faFlag} 
//                             title="Travel & Tour Operators" 
//                             onClick={() => setActivePage('experience/touroperators')}
//                             active={activePage === 'experience/touroperators'}
//                           />
//                           <NavlinkIcon 
//                             icon={faParachuteBox} 
//                             title="Tourist Activity Providers" 
//                             onClick={() => setActivePage('experience/activityproviders')}
//                             active={activePage === 'experience/activityproviders'}
//                           />
//                           <NavlinkIcon 
//                             icon={faPeopleGroup} 
//                             title="M.I.C.E. Facilities" 
//                             onClick={() => setActivePage('experience/mice')}
//                             active={activePage === 'experience/mice'}
//                           />
//                           <NavlinkIcon 
//                             icon={faCalendarXmark} 
//                             title="Event Planning Companies" 
//                             onClick={() => setActivePage('experience/eventplanning')}
//                             active={activePage === 'experience/eventplanning'}
//                           />
//                           <NavlinkIcon 
//                             icon={faShop} 
//                             title="Tourist & Specialty Shops" 
//                             onClick={() => setActivePage('experience/specialtyshops')}
//                             active={activePage === 'experience/specialtyshops'}
//                           />
//                         </ExpandableNavItem>
//                         <ExpandableNavItem title="Medical Facilities" className="ms-lg-2 mb-2 me-lg-2 navlink">
//                           <NavlinkIcon 
//                             icon={faHospital} 
//                             title="Clinics & Hospitals" 
//                             onClick={() => setActivePage('medical')}
//                             active={activePage === 'medical'}
//                           />
//                           <NavlinkIcon 
//                             icon={faDog} 
//                             title="Veterinary Clinics" 
//                             onClick={() => setActivePage('medical/veterinary')}
//                             active={activePage === 'medical/veterinary'}
//                           />
//                         </ExpandableNavItem>
//                         <NavlinkIcon 
//                           icon={faSwimmer} 
//                           title="Activities" 
//                           onClick={() => setActivePage('activities')}
//                           active={activePage === 'activities'}
//                         />
//                         <NavlinkIcon 
//                           icon={faBinoculars} 
//                           title="Attractions" 
//                           onClick={() => setActivePage('attractions')}
//                           active={activePage === 'attractions'}
//                         />
//                       </ExpandableNavItem>
        
//                       <ExpandableNavItem title="Essentials" className="ms-lg-2 mb-2 me-lg-2 navlink">
//                         <NavlinkIcon 
//                           icon={faAmbulance} 
//                           title="Emergency Hotlines" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faPassport} 
//                           title="Tourist Requirements" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faUmbrellaBeach} 
//                           title="Beach Laws" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faMoneyCheck} 
//                           title="Tariff Rates" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faCalendarCheck} 
//                           title="Calendar of Events" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faLanguage} 
//                           title="Life Style & Facilities" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faVideo} 
//                           title="Virtual Tour Guide" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faLink} 
//                           title="Helpful Links" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faDigitalTachograph} 
//                           title="Tourist FAQ" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                         <NavlinkIcon 
//                           icon={faPrint} 
//                           title="Printable Materials" 
//                           onClick={() => setActivePage('essentials')}
//                           active={activePage === 'essentials'}
//                         />
//                       </ExpandableNavItem>
        
//                       <NavlinkIcon 
//                         icon={faLeaf} 
//                         title="Sustainable Travel" 
//                         onClick={() => setActivePage('sustainable')}
//                         active={activePage === 'sustainable'}
//                       />
        
//                       <ExpandableNavItem title="Tourism Data" className="ms-lg-2 mb-2 me-lg-2 ms-md-2 ms-sm-2 navlink">
//                         <NavlinkIcon 
//                           icon={faBarChart} 
//                           title="Tourist Arrivals" 
//                           onClick={() => setActivePage('data')}
//                           active={activePage === 'data'}
//                         />
//                         <NavlinkIcon 
//                           icon={faShip} 
//                           title="Cruise Ships Arrivals" 
//                           onClick={() => setActivePage('data')}
//                           active={activePage === 'data'}
//                         />
//                         <NavlinkIcon 
//                           icon={faPlane} 
//                           title="Flight Data" 
//                           onClick={() => setActivePage('data')}
//                           active={activePage === 'data'}
//                         />
//                         <NavlinkIcon 
//                           icon={faPeopleGroup} 
//                           title="M.I.C.E. Reports" 
//                           onClick={() => setActivePage('data')}
//                           active={activePage === 'data'}
//                         />
//                       </ExpandableNavItem>
        
//                       <ExpandableNavItem title="Achievements" className="ms-lg-2 mb-2 me-lg-2 ms-md-2 ms-sm-2 navlink">
//                         <NavlinkIcon 
//                           icon={faMedal} 
//                           title="Awards & Recognitions" 
//                           onClick={() => setActivePage('achievements')}
//                           active={activePage === 'achievements'}
//                         />
//                         <NavlinkIcon 
//                           icon={faHandshake} 
//                           title="Tourism Projects" 
//                           onClick={() => setActivePage('achievements')}
//                           active={activePage === 'achievements'}
//                         />
//                       </ExpandableNavItem>
        
//                       <Nav.Link className="ms-lg-2 navlink" onClick={() => setActivePage('complaints')}>
//                         Complaints
//                       </Nav.Link>
//                       <Nav.Link className="ms-lg-2 navlink" onClick={() => setActivePage('feedback')}>
//                         Feedback
//                       </Nav.Link>
//                       <Nav.Link className="ms-lg-2 navlink" onClick={() => setActivePage('ourstory')}>
//                         Our Story
//                       </Nav.Link>
//                       <Nav.Link className="ms-lg-2 navlink" onClick={() => setActivePage('aboutus')}>
//                         About Us
//                       </Nav.Link>
//                     </Nav>
//         </Offcanvas.Body>
//       </Offcanvas>
//     );
//   }
  

  