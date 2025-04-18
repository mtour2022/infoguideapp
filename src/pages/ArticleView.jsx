import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import FooterCustomized from '../components/footer/Footer';
import { parseISO, format } from 'date-fns';
import FullImageModal from '../components/imageview/ImageFullComponent'; // Import ImageModal component
import facebooklogo from "../assets/images/logos/facebooklogo.png";
import instagramlogo from "../assets/images/logos/instagramlogo.png";
import tiktoklogo from "../assets/images/logos/tiktoklogo.png";
import xtwitterlogo from "../assets/images/logos/xtwitterlogo.png";
import youtubelogo from "../assets/images/logos/youtubelogo.png";
import messengerlogo from "../assets/images/logos/messenger-logo.png";
import emaillogo from "../assets/images/logos/google-email-logo.png";
import whatsapplogo from "../assets/images/logos/whats-app-logo.png";

import tripadvisorlogo from "../assets/images/logos/tripadvisorlogo.png";
import googlemaplogo from "../assets/images/logos/googlemaplogo.png";
import DOTlogo from "../assets/images/DepartmentOfTourismAccreditationLogo.png";
import { FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon, WhatsappShareButton, WhatsappIcon } from 'react-share';

const ArticleViewComponent = () => {
  const navigate = useNavigate();
  const { collectionName, dataId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const shareUrl = window.location.href;

  // Gallery modal state
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Body image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  const handleImageClick = (index) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const handlePrev = () => {
    setModalIndex((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setModalIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
  };



  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, collectionName, dataId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data());
        } else {
          console.error('No such document!');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, dataId]);

  const isVideoUrl = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  const isImageUrl = (url) => !isVideoUrl(url);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="text-center my-5">
        <p>Data not found.</p>
      </Container>
    );
  }

  const dateStart = data.dateTimeStart ? parseISO(data.dateTimeStart) : null;
  const formattedDateStart = dateStart ? format(dateStart, 'MMMM dd, yyyy') : null;

  const dateOnly = data.date ? parseISO(data.date) : null;
  const formattedDateOnly = dateOnly ? format(dateOnly, 'MMMM dd, yyyy') : null;

  return (
    <div className="home-section">

      {/* Header Image with Gaussian Blur Background */}
      {data.headerImage && (
        <div
          style={{
            backgroundImage: `url(${data.headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '50%',
            filter: 'blur(10px)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      )}
      <Row className='mt-2'>
        <Col md={12}>
          <a
            className="text-decoration-none d-block mb-3"
            style={{ cursor: "pointer", color: "black" }}
          >
            <span
              onClick={() => navigate(`/home`)}
              style={{ color: "white", fontSize: "0.70rem" }}
            >
              home
            </span>

            <span
              onClick={() =>
                navigate(`/${collectionName === "sustainableTourism" ? "slideshow" : "update"}/${collectionName}`)
              }
              style={{ color: "white", margin: "0 5px", fontSize: "0.70rem" }}
            >
              / {collectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span style={{ color: "white", fontSize: "0.70rem" }}>/ {data.title}</span>
          </a>
        </Col>
      </Row>

      <Image
        src={data.headerImage}
        alt="Header"
        fluid
        rounded
        className="article-headerImage mb-4"
      />

      <Row className="justify-content-center align-items-center row">
        <Col md={9} className='col'>
          {/* Title */}
          <h2 className="article-title mb-3">{data.title}</h2>
          <div className="d-flex justify-content-center align-items-center mb-2 text-start flex-wrap">
            <p className="mb-0 text-center">
              {data.origin?.length > 0 && data.origin.join(', ')}
              {data.origin?.length > 0 && data.formattedDateOnly && ' - '}
              {data.formattedDateOnly && !isNaN(new Date(formattedDateOnly)) && formattedDateOnly}
              {(data.origin || data.formattedDateOnly) && data.name && ' - '}
              {data.name}
              {data.dateTimeStart && !isNaN(new Date(data.dateTimeStart)) && ` - ${formattedDateStart}`}
            </p>
          </div>



          {/* Share Buttons */}
          <div className="d-flex mb-4 align-items-center gap-3 justify-content-center">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.boracayinfoguide.com/read/${collectionName}/${data.id}?image=${data.headerImage}`)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-circle d-flex align-items-center justify-content-center border"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#f0f0f0",
                overflow: "hidden"
              }}
            >
              <img src={facebooklogo} alt="Facebook" style={{ width: "20px", height: "20px" }} />
            </a>


            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(data?.title || '')}&body=${encodeURIComponent(
                `https://www.boracayinfoguide.com/read/${collectionName}/${data.id}&image=${data?.headerImage}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-circle d-flex align-items-center justify-content-center border"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#f0f0f0",
                overflow: "hidden"
              }}
            >
              <img src={emaillogo} alt="Email" style={{ width: "20px", height: "20px" }} />
            </a>

            {/* Twitter (X) */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.boracayinfoguide.com/read/${collectionName}/${data.id}&image=${data?.headerImage}`)}&text=${encodeURIComponent(
                data?.title || 'Check this out!'
              )}&image=${encodeURIComponent(data?.headerImage || '/path/to/default-image.jpg')}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-circle d-flex align-items-center justify-content-center border"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#f0f0f0",
                overflow: "hidden"
              }}
            >
              <img src={xtwitterlogo} alt="X / Twitter" style={{ width: "20px", height: "20px" }} />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                data?.title || 'Check this out!'
              )}%20${encodeURIComponent(
                `https://www.boracayinfoguide.com/read/${collectionName}/${data.id}&image=${data?.headerImage}`
              )}&image=${encodeURIComponent(data?.headerImage)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-circle d-flex align-items-center justify-content-center border"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#f0f0f0",
                overflow: "hidden"
              }}
            >
              <img src={whatsapplogo} alt="WhatsApp" style={{ width: "20px", height: "20px" }} />
            </a>

            {/* Messenger */}
            <a
              href={`fb-messenger://share?link=${encodeURIComponent(
                `https://www.boracayinfoguide.com/read/${collectionName}/${data.id}&image=${data?.headerImage}`
              )}&image=${encodeURIComponent(data?.headerImage || '/path/to/default-image.jpg')}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-circle d-flex align-items-center justify-content-center border"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#f0f0f0",
                overflow: "hidden"
              }}
            >
              <img src={messengerlogo} alt="Messenger" style={{ width: "20px", height: "20px" }} />
            </a>

          </div>




          {/* Body Sections */}
          {data.body?.map((section, index) => (
            <>
            <Row className="mb-5" key={index}>
              {isVideoUrl(section.image) ? (
                <Col md={12}>
                  <h4 className="mt-4">
                    <strong>{section.subtitle}</strong>
                  </h4>
                  <video controls fluid className="article-body-video mt-2 mb-4">
                    <source src={section.image} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {section.image_source && (
                    <small className="text-muted d-block mt-1">Source: {section.image_source}</small>
                  )}

                  <div
                    className="section-body"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </Col>
              ) : section.image && section.body ? (
                <>
                  <Col md={12}>
                    <h4>
                      <strong>{section.subtitle}</strong>
                    </h4>
                    <Image
                      src={section.image}
                      alt="Section"
                      fluid
                      rounded
                      className="article-body-image mt-2 mb-4"
                      onClick={() => openImageModal(section.image)} // Open modal on click
                    />
                    {section.image_source && (
                      <small className="text-muted d-block mt-1 mb-4">Source: {section.image_source}</small>
                    )}
                  </Col>
                  <Col md={12}>

                    <div
                      className="section-body"
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  </Col>
                </>
              ) : section.image ? (
                <Col md={12}>
                  <h4>
                    <strong>{section.subtitle}</strong>
                  </h4>
                  <Image
                    src={section.image}
                    alt="Section"
                    fluid
                    rounded
                    className="article-body-image mt-1"
                    onClick={() => openImageModal(section.image)} // Open modal on click
                  />
                  {section.image_source && (
                    <small className="text-muted d-block mt-1 mb-1">Source: {section.image_source}</small>
                  )}
                </Col>
              ) : section.body ? (
                <Col md={12}>
                  <h4>
                    <strong>{section.subtitle}</strong>
                  </h4>
                  <div
                    className="section-body"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </Col>
              ) : null}
            </Row>

            {/* Image Modal with Navigation */}
<FullImageModal
            showImageModal={showModal}
            closeImageModal={() => setShowModal(false)}
            selectedImage={section.image}
            
          />
          </>
          ))}

          {data.description && (
            <Row>
              <Col md={12}>
                <div
                  className="section-body"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </Col>
            </Row>
          )}


          {/* Image Gallery */}
          {data.images?.length > 0 && (
            <>
              <h4 className="mt-5 mb-5 text-center">
                <strong>Gallery</strong>
              </h4>
              <Row>
                {data.images.map((img, idx) => (
                  <Col md={4} sm={6} xs={12} className="mb-4 article-gallery-col" key={idx}>
                    {isImageUrl(img) ? (
                      <Image
                        src={img}
                        alt={`Gallery ${idx}`}
                        fluid
                        rounded
                        className="article-gallery"
                        onClick={() => handleImageClick(idx)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : isVideoUrl(img) ? (
                      <video controls className="article-gallery-video">
                        <source src={img} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </Col>
                ))}
              </Row>
            </>
          )}

          



          {/* References */}
          {data.references?.length > 0 && (
            <div className="mt-5 mx-2">
              <h5>References</h5>
              <ul>
                {data.references.map((ref, idx) => (
                  <li key={idx}>
                    <a
                      href={ref} target="_blank" rel="noopener noreferrer" className="text-break d-inline-block">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* References */}
          {data.socials?.length > 0 && (
            <div className="mt-5 mx-2">
              <h5>Helpful Links</h5>
              <ul>
                {data.socials.map((ref, idx) => (
                  <li key={idx}>
                    <a href={ref} className="text-break d-inline-block"
                      target="_blank" rel="noopener noreferrer">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.tags?.length > 0 && (
            <div className="mt-5  mx-2">
              <h5>Tags</h5>
              <div >
                {data.tags.map((ref, idx) => {
                  // Remove spaces and capitalize the first letter of each word
                  const formattedTag = ref
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('');

                  return (
                    <span key={idx}>
                      <a
                        href={`https://www.google.com/search?q=%23${formattedTag}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        #{formattedTag}
                      </a>
                      {idx < data.tags.length - 1 && ', '}
                    </span>
                  );
                })}
              </div>
            </div>
          )}






        </Col>
      </Row>

      {/* Full Image Modal for Body Image */}
      {/* Full Image Modal for Body Image */}
      <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
        <Modal.Body className="gallery-modal d-flex justify-content-center align-items-center">
          {imageLoading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}

          <Image
            src={selectedImage}
            alt="Full View"
            fluid
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </Modal.Body>
      </Modal>


      <FooterCustomized />
    </div>
  );
};

export default ArticleViewComponent;
