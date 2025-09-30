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
  faHandshake,
  faHardHat,
  faFlag,
  faBullhorn,
  faShopLock,
  faShoppingBag,
  faSpa,
  faDumbbell,
  faBus,
  faPlaneArrival,
  faShippingFast,
  faFerry,
  faParking,
  faTooth,
  faBinoculars,
  faPassport,
  faUmbrellaBeach,
  faLink,
  faWalking,
  faPrint,
  faVideoCamera,
  faShip,
  faPlane,
  faUserGroup,
  faPeopleGroup,
  faCalendarXmark,
  faSignHanging,
  faRibbon,
  faTag,
  faShop,

} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Button, Nav, Offcanvas, Collapse } from 'react-bootstrap';
import StoryForm from '../components/stories/AddStories';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { faCalendarCheck, faCommenting } from '@fortawesome/free-regular-svg-icons';
import StoriesDataTable from '../admin/TableStories';
import AccommodationTable from '../admin/TableAccommodations';
import RecreationalResortTable from '../admin/TableRecreationalResorts';
import EnterprisesTable from '../admin/TableEnterprises';
import UpdateTable from '../admin/TableUpdates';
import DealTable from '../admin/TableDeals';
import IncomingEventTable from '../admin/TableIncomingEvents';
import SustainableTourismTable from '../admin/TableSustainableTourism';
import AttractionTable from '../admin/TableAttractions';
import ActivitiesTable from '../admin/TableActivities';
import HotlineTable from '../admin/TableHotlines';
import RequirementTable from '../admin/TableRequirements';
import OrdinanceTable from '../admin/TableOrdinances';
import TariffRatesForm from '../components/tariffs/TariffRates';
import TariffTable from '../admin/TableTariffs';
import CalendarEventsTable from '../admin/TableCalendarEvents';
import HelpfulLinksTable from '../admin/TableHelpfulLinks';
import LifeStyleTable from '../admin/TableLifeStyles';
import TouristFAQTable from '../admin/TableTouristFAQ';
import VirtualTourGuideTable from '../admin/TableVirtuaTourGuide';
import AwardsAndRecognitionsTable from '../admin/TableAwardsAndRecognitions';
import TravelExposTable from '../admin/TableTravelExpos';
import TourismProjectsTable from '../admin/TableTourismProjects';
import CruiseShipsTable from '../admin/TableCruiseShips';
import TourismMarketsForm from '../components/tourismMarkets/TourismMarket';
import TourismMarketsTable from '../admin/TableTourismMarkets';
import MainlandMalayHotelsTable from '../admin/TableMainlandMalayHotels';
import TourGuideTable from '../admin/TableTourGuides';
import FacebookLiveAdmin from '../components/facebookstream_admin';
import SocialFeedAdmin from '../components/facebookEmbed/FacebookEmbed_Admin';

// Sidebar link component using onClick to set active content.
function NavlinkIcon({ icon, title, onClick, active }) {
  return (
    <Nav.Link 
      className={`ms-lg-2 mb-2 ${active ? 'active' : ''}`} 
      id="basic-nav-sidebar-item"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <FontAwesomeIcon icon={icon} size="sm" fixedWidth /> {title}
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
        className={className}
        style={{ cursor: 'pointer' }}
        id="basic-nav-sidebar"
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
          <>
            <UpdateTable></UpdateTable>
          </>
        );
      case 'deals':
        return (
          <>
            <DealTable></DealTable>
          </>
        );
      case 'incomingEvents':
        return (
          <>
            <IncomingEventTable></IncomingEventTable>
          </>
        );
        case 'stories':
            return (
              <>
                <StoriesDataTable></StoriesDataTable>
              </>
            );
        case 'sustainableTourism':
          return (
            <>
              <SustainableTourismTable></SustainableTourismTable>
            </>
          );
      case 'accommodations':
        return (
          <>
            <AccommodationTable></AccommodationTable>
          </>
        );
      case 'resorts':
        return (
          <>
            <RecreationalResortTable></RecreationalResortTable>
          </>
        );
      case 'restaurants':
        return (
          <>
            <EnterprisesTable 
            category={"Food & Beverages"}
            subcategory={"restaurants"}
            ></EnterprisesTable>
          </>
        );
      case 'barsAndPartyClubs':
        return (
          <>
            <EnterprisesTable 
            category={"Food & Beverages"}
            subcategory={"barsAndPartyClubs"}
            ></EnterprisesTable>
          </>
        );
      case 'cafeAndCoworking':
        return (
          <>
            <EnterprisesTable 
            category={"Food & Beverages"}
            subcategory={"cafeAndCoworking"}
            ></EnterprisesTable>
          </>
        );
      case 'tourguides':
        return (
          <>
            <TourGuideTable 
           
            ></TourGuideTable>
          </>
        );
      case 'travelAndTourOperators':
        return (
          <>
            <EnterprisesTable 
            category={"Tourism & Leisure"}
            subcategory={"travelAndTourOperators"}
            ></EnterprisesTable>
          </>
        );
      case 'touristActivityProviders':
        return (
          <>
            <EnterprisesTable 
            category={"Tourism & Leisure"}
            subcategory={"touristActivityProviders"}
            ></EnterprisesTable>
          </>
        );
      case 'MICEFacilities':
        return (
          <>
            <EnterprisesTable 
            category={"Tourism & Leisure"}
            subcategory={"MICEFacilities"}
            ></EnterprisesTable>
          </>
        );
      case 'eventsPlanningCompanies':
        return (
          <>
            <EnterprisesTable 
            category={"Tourism & Leisure"}
            subcategory={"eventsPlanningCompanies"}
            ></EnterprisesTable>
          </>
        );
      case 'touristAndSpecialtyShops':
        return (
          <>
            <EnterprisesTable 
            category={"Tourism & Leisure"}
            subcategory={"touristAndSpecialtyShops"}
            ></EnterprisesTable>
          </>
        );
      case 'spaAndWellnessCentres':
        return (
          <>
            <EnterprisesTable 
            category={"Health & Wellness"}
            subcategory={"spaAndWellnessCentres"}
            ></EnterprisesTable>
          </>
        );
      case 'gymnsAndFitnessClubs':
        return (
          <>
            <EnterprisesTable 
            category={"Health & Wellness"}
            subcategory={"gymnsAndFitnessClubs"}
            ></EnterprisesTable>
          </>
        );
      case 'touristLandAndAirTransportOperators':
        return (
          <>
            <EnterprisesTable 
            category={"Transport & Parking"}
            subcategory={"touristLandAndAirTransportOperators"}
            ></EnterprisesTable>
          </>
        );
      // case 'touristAirTransportOperators':
      // return (
      //   <>
      //     <EnterprisesTable 
      //     category={"Transport & Parking"}
      //     subcategory={"touristAirTransportOperators"}
      //     ></EnterprisesTable>
      //   </>
      // );
      case 'passengerShipLines':
      return (
        <>
          <EnterprisesTable 
          category={"Transport & Parking"}
          subcategory={"passengerShipLines"}
          ></EnterprisesTable>
        </>
      );
      case 'parkingSpaces':
      return (
        <>
          <EnterprisesTable 
          category={"Transport & Parking"}
          subcategory={"parkingSpaces"}
          ></EnterprisesTable>
        </>
      );
      case 'hospitalsAndClinics':
      return (
        <>
          <EnterprisesTable 
          category={"Healthcare Facilities"}
          subcategory={"hospitalsAndClinics"}
          ></EnterprisesTable>
        </>
      );
      case 'attractions':
        return (
          <>
            <AttractionTable ></AttractionTable>
          </>
        );
        case 'activities':
          return (
            <>
              <ActivitiesTable ></ActivitiesTable>
            </>
          );
          case 'hotlines':
            return (
              <>
                <HotlineTable ></HotlineTable>
              </>
            );
            case 'requirements':
              return (
                <>
                  <RequirementTable ></RequirementTable>
                </>
              );
        case 'ordinances':
        return (
          <>
            <OrdinanceTable></OrdinanceTable>
          </>
        );
        case 'tariffs':
        return (
          <>
            <TariffTable></TariffTable>
          </>
        );
        case 'calendarEvents':
        return (
          <>
            <CalendarEventsTable></CalendarEventsTable>
          </>
        );
        case 'helpfulLinks':
          return (
            <>
              <HelpfulLinksTable></HelpfulLinksTable>
            </>
          );
          case 'lifeStyles':
            return (
              <>
                <LifeStyleTable></LifeStyleTable>
              </>
            );
            case 'touristFAQs':
              return (
                <>
                  <TouristFAQTable></TouristFAQTable>
                </>
              );
              case 'virtualTourGuides':
                return (
                  <>
                    <VirtualTourGuideTable></VirtualTourGuideTable>
                  </>
                );
                case 'awardsAndRecognitions':
                  return (
                    <>
                      <AwardsAndRecognitionsTable></AwardsAndRecognitionsTable>
                    </>
                  );        
                  case 'travelExpos':
                    return (
                      <>
                        <TravelExposTable></TravelExposTable>
                      </>
                    );  
                    case 'tourismProjects':
                      return (
                        <>
                          <TourismProjectsTable></TourismProjectsTable>
                        </>
                      );  
                      case 'tourismMarkets':
                        return (
                          <>
                            <TourismMarketsTable></TourismMarketsTable>
                          </>
                        );    
                        case 'livestream':
                        return (
                          <>
                            <FacebookLiveAdmin></FacebookLiveAdmin>
                          </>
                        );  
                        case 'socialmedia':
                        return (
                          <>
                            <SocialFeedAdmin></SocialFeedAdmin>
                          </>
                        );           
                                    
                      case 'cruiseShips':
                        return (
                          <>
                            <CruiseShipsTable></CruiseShipsTable>
                          </>
                        );   
                        case 'mainlandMalayHotels':
                          return (
                            <>
                              <MainlandMalayHotelsTable></MainlandMalayHotelsTable>
                            </>
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
    <div className="sidebar-sticky p-3  pt-5">
      <h4>Admin</h4>
      <Nav className="flex-column sidebar">
        <NavlinkIcon
          icon={faDashboard}
          title="DASHBOARD"
          onClick={() => { setActivePage('dashboard'); handleClose(); }}
          active={activePage === 'dashboard'}
        />
        <NavlinkIcon
          icon={faBell}
          title="UPDATES"
          onClick={() => { setActivePage('updates'); handleClose(); }}
          active={activePage === 'updates'}
        />
        <NavlinkIcon
          icon={faFire}
          title="DEALS & PROMOTIONS"
          onClick={() => { setActivePage('deals'); handleClose(); }}
          active={activePage === 'deals'}
        />
        <NavlinkIcon
          icon={faCalendarDay}
          title="INCOMING EVENTS"
          onClick={() => { setActivePage('incomingEvents'); handleClose(); }}
          active={activePage === 'incomingEvents'}
        />
        <NavlinkIcon
          icon={faBookReader}
          title="TOURISM STORIES"
          onClick={() => { setActivePage('stories'); handleClose(); }}
          active={activePage === 'stories'}
        />
        <NavlinkIcon
          icon={faLeaf}
          title="SUSTAINABLE TRAVEL"
          onClick={() => { setActivePage('sustainableTourism'); handleClose(); }}
          active={activePage === 'sustainableTourism'}
        />
        <ExpandableNavItem title="EXPERIENCE" className="ms-lg-2 mb-2">
          <ExpandableNavItem title="HOSPITALITY & LODGING" className="ms-lg-2 mb-2 me-lg-2">
            <NavlinkIcon
              icon={faHotel}
              title="BORACAY ACCOMMODATIONS"
              onClick={() => { setActivePage('accommodations'); handleClose(); }}
              active={activePage === 'accommodations'}
            />
            <NavlinkIcon
              icon={faHotel}
              title="MAINLAND MALAY HOTELS"
              onClick={() => { setActivePage('mainlandMalayHotels'); handleClose(); }}
              active={activePage === 'mainlandMalayHotels'}
            />
            <NavlinkIcon
              icon={faLadderWater}
              title="RECREATIONAL RESORTS"
              onClick={() => { setActivePage('resorts'); handleClose(); }}
              active={activePage === 'resorts'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="FOODS & BEVERAGES" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faUtensils}
              title="RESTAURANTS"
              onClick={() => { setActivePage('restaurants'); handleClose(); }}
              active={activePage === 'restaurants'}
            />
            <NavlinkIcon
              icon={faWineGlass}
              title="BARS & PARTY CLUB"
              onClick={() => { setActivePage('barsAndPartyClubs'); handleClose(); }}
              active={activePage === 'barsAndPartyClubs'}
            />
            <NavlinkIcon
              icon={faCoffee}
              title="CAFES & COWORKING"
              onClick={() => { setActivePage('cafeAndCoworking'); handleClose(); }}
              active={activePage === 'cafeAndCoworking'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="TOURISM & LEISURE" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faBullhorn}
              title="TOUR GUIDES"
              onClick={() => { setActivePage('tourguides'); handleClose(); }}
              active={activePage === 'tourguides'}
            />
            <NavlinkIcon
              icon={faFlag}
              title="TRAVEL & TOUR OPERATORS"
              onClick={() => { setActivePage('travelAndTourOperators'); handleClose(); }}
              active={activePage === 'travelAndTourOperators'}
            />
            <NavlinkIcon
              icon={faSwimmer}
              title="TOURIST ACTIVITY PROVIDER"
              onClick={() => { setActivePage('touristActivityProviders'); handleClose(); }}
              active={activePage === 'touristActivityProviders'}
            />
            <NavlinkIcon
              icon={faPeopleGroup}
              title="M.I.C.E. FACILITIES"
              onClick={() => { setActivePage('MICEFacilities'); handleClose(); }}
              active={activePage === 'MICEFacilities'}
            />
            <NavlinkIcon
              icon={faCalendarXmark}
              title="EVENTS PLANNING COMPANIES"
              onClick={() => { setActivePage('eventsPlanningCompanies'); handleClose(); }}
              active={activePage === 'eventsPlanningCompanies'}
            />
            <NavlinkIcon
              icon={faShoppingBag}
              title="TOURIST & SPECIALTY SHOPS"
              onClick={() => { setActivePage('touristAndSpecialtyShops'); handleClose(); }}
              active={activePage === 'touristAndSpecialtyShops'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="HEATH & WELLNESS" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faSpa}
              title="SPA & WELLNESS CENTERS"
              onClick={() => { setActivePage('spaAndWellnessCentres'); handleClose(); }}
              active={activePage === 'spaAndWellnessCentres'}
            />
            <NavlinkIcon
              icon={faDumbbell}
              title="GYMS & FITNESS CLUBS"
              onClick={() => { setActivePage('gymnsAndFitnessClubs'); handleClose(); }}
              active={activePage === 'gymnsAndFitnessClubs'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="TRANSPORT & PARKING" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faBus}
              title="TOURIST LAND AND AIR TRANSPORT OPERATORS"
              onClick={() => { setActivePage('touristLandAndAirTransportOperators'); handleClose(); }}
              active={activePage === 'touristLandAndAirTransportOperators'}
            />
            {/* <NavlinkIcon
              icon={faPlaneArrival}
              title="TOURIST AIR TRANSPORT OPERATORS"
              onClick={() => { setActivePage('touristAirTransportOperators'); handleClose(); }}
              active={activePage === 'touristAirTransportOperators'}
            /> */}
            <NavlinkIcon
              icon={faFerry}
              title="PASSSENGER SHIP LINES"
              onClick={() => { setActivePage('passengerShipLines'); handleClose(); }}
              active={activePage === 'passengerShipLines'}
            />
            <NavlinkIcon
              icon={faParking}
              title="PARKING SPACES"
              onClick={() => { setActivePage('parkingSpaces'); handleClose(); }}
              active={activePage === 'parkingSpaces'}
            />
          </ExpandableNavItem>
          <ExpandableNavItem title="HEALTHCARE FACILTIES" className="ms-lg-2 mb-2 me-lg-2 navlink">
            <NavlinkIcon
              icon={faHospital}
              title="HOSPITALS & CLINICS"
              onClick={() => { setActivePage('hospitalsAndClinics'); handleClose(); }}
              active={activePage === 'hospitalsAndClinics'}
            />
          </ExpandableNavItem>
          <NavlinkIcon
            icon={faSwimmer}
            title="ACTIVITIES"
            onClick={() => { setActivePage('activities'); handleClose(); }}
            active={activePage === 'activities'}
          />
          <NavlinkIcon
            icon={faBinoculars}
            title="ATTRACTIONS"
            onClick={() => { setActivePage('attractions'); handleClose(); }}
            active={activePage === 'attractions'}
          />
          
        </ExpandableNavItem>
        <ExpandableNavItem title="ESSENTIALS" className="ms-lg-2 mb-2"  id="basic-nav-sidebar-item">
            <NavlinkIcon
                icon={faAmbulance}
                title="EMERGENCY HOTLINES"
                onClick={() => { setActivePage('hotlines'); handleClose(); }}
                active={activePage === 'hotlines'}
            />
            <NavlinkIcon
                icon={faPassport}
                title="TOURIST REQUIREMENTS"
                onClick={() => { setActivePage('requirements'); handleClose(); }}
                active={activePage === 'requirements'}
            />
            <NavlinkIcon
                icon={faUmbrellaBeach}
                title="BEACH ORDINANCES"
                onClick={() => { setActivePage('ordinances'); handleClose(); }}
                active={activePage === 'ordinances'}
            />
            <NavlinkIcon
                icon={faTag}
                title="TARIFF RATES"
                onClick={() => { setActivePage('tariffs'); handleClose(); }}
                active={activePage === 'tariffs'}
            />
            <NavlinkIcon
                icon={faCalendarCheck}
                title="CALENDAR OF EVENTS"
                onClick={() => { setActivePage('calendarEvents'); handleClose(); }}
                active={activePage === 'calendarEvents'}
            />
            <NavlinkIcon
                icon={faLink}
                title="HELPFUL LINKS"
                onClick={() => { setActivePage('helpfulLinks'); handleClose(); }}
                active={activePage === 'helpfulLinks'}
            />
            <NavlinkIcon
                icon={faWalking}
                title="LIFESTYLE & FACILITIES"
                onClick={() => { setActivePage('lifeStyles'); handleClose(); }}
                active={activePage === 'lifeStyles'}
            />
            <NavlinkIcon
                icon={faCommenting}
                title="TOURIST FAQ"
                onClick={() => { setActivePage('touristFAQs'); handleClose(); }}
                active={activePage === 'touristFAQs'}
            />

            <NavlinkIcon
                icon={faVideoCamera}
                title="VIRTUAL TOUR GUIDE"
                onClick={() => { setActivePage('virtualTourGuides'); handleClose(); }}
                active={activePage === 'virtualTourGuides'}
            />
        </ExpandableNavItem>
        <ExpandableNavItem title="TOURISM DATA" className="ms-lg-2 mb-2"  id="basic-nav-sidebar-item">
            <NavlinkIcon
                icon={faBarChart}
                title="TOURIST ARRIVALS"
                onClick={() => { setActivePage('arrivals'); handleClose(); }}
                active={activePage === 'arrivals'}
            />
            <NavlinkIcon
                icon={faShip}
                title="CRUISE SHIPS ARRIVALS"
                onClick={() => { setActivePage('cruiseShips'); handleClose(); }}
                active={activePage === 'cruiseShips'}
            />
            <NavlinkIcon
                icon={faPlane}
                title="FLIGHT DATA"
                onClick={() => { setActivePage('flights'); handleClose(); }}
                active={activePage === 'flights'}
            />
            <NavlinkIcon
                icon={faUserGroup}
                title="M.I.C.E. REPORTS"
                onClick={() => { setActivePage('mice+reports'); handleClose(); }}
                active={activePage === 'mice+reports'}
            />
        </ExpandableNavItem>
        <ExpandableNavItem title="ACHIEVEMENTS" className="ms-lg-2 mb-2"  id="basic-nav-sidebar">
            <NavlinkIcon
                icon={faMedal}
                title="AWARDS & RECOGNITIONS"
                onClick={() => { setActivePage('awardsAndRecognitions'); handleClose(); }}
                active={activePage === 'awardsAndRecognitions'}
            />
            <NavlinkIcon
                icon={faSignHanging}
                title="TRAVEL EXPOS, EXHIBITS, CONFERENCES, CONVENTIONS, B2B & ROADSHOWS"
                onClick={() => { setActivePage('travelExpos'); handleClose(); }}
                active={activePage === 'travelExpos'}
            />
            <NavlinkIcon
                icon={faHandshake}
                title="TOURISM PROJECTS"
                onClick={() => { setActivePage('tourismProjects'); handleClose(); }}
                active={activePage === 'tourismProjects'}
            />
            <NavlinkIcon
                icon={faShop}
                title="TOURISM MARKETS"
                onClick={() => { setActivePage('tourismMarkets'); handleClose(); }}
                active={activePage === 'tourismMarkets'}
            />
        </ExpandableNavItem>
        <Nav.Link
          className="ms-lg-2"
          id="basic-nav-sidebar-item"
          onClick={() => { setActivePage('livestream'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          LIVE STREAM
        </Nav.Link>
        <Nav.Link
          className="ms-lg-2"
          id="basic-nav-sidebar-item"
          onClick={() => { setActivePage('socialmedia'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          SOCIAL MEDIA HIGHLIGHTS
        </Nav.Link>
        <Nav.Link
          className="ms-lg-2"
          id="basic-nav-sidebar-item"
          onClick={() => { setActivePage('complaints'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          COMPLAINTS
        </Nav.Link>
        <Nav.Link
          className="ms-lg-2"
          id="basic-nav-sidebar-item"
          onClick={() => { setActivePage('feedbacks'); handleClose(); }}
          style={{ cursor: 'pointer' }}
        >
          FEEDBACK
        </Nav.Link>
       
        
      </Nav>
    </div>
  );

  return (
    <Container fluid  className="grey-container ">
      <Row>
        {/* Persistent sidebar: Visible only on large screens and up */}
        <Col
          xs={3}
          className="p-0 d-none d-lg-block white-container content-wrapper"
          style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            overflowY: 'auto',
            position: 'sticky',
            top: 0
          }}
        >
          {sidebarContent}
        </Col>

        {/* Main Content Area */}
        <Col xs={12} md={12} lg={9} className="p-4 pt-5">
          {/* Menu button visible on small and medium screens */}
          <Button variant="outline-primary" className="d-lg-none mb-3" onClick={handleShow}>
            Menu
          </Button>
          {renderContent()}
        </Col>
      </Row>

      {/* Offcanvas Sidebar for small and medium screens */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className="d-lg-none content-wrapper">
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
