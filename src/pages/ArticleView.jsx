import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FacebookShareButton, EmailShareButton, FacebookIcon, EmailIcon } from 'react-share';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import FooterCustomized from '../components/footer/Footer';
import { parseISO, format } from 'date-fns';
import ImageModal from '../components/imageview/ImageViewComponent'; // Import ImageModal component

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



  const handleImageLoad = () => {
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
      <Row>
        <Col md={12}>
          <a
            className="text-decoration-none d-block mb-5"
            style={{ cursor: "pointer", color: "black" }}
          >
            <span
              onClick={() => navigate(`/infoguideapp/home`)}
              style={{ color: "white", marginRight: "5px", fontSize: "0.90rem" }}
            >
              home
            </span>
            
            <span
              onClick={() =>
                navigate(`/infoguideapp/${collectionName === "sustainableTourism" ? "slideshow" : "update"}/${collectionName}`)
              }
              style={{ color: "white", margin: "0 5px", fontSize: "0.90rem" }}
            >
              / {collectionName}
            </span>
            <span style={{ color: "white", marginLeft: "5px", fontSize: "0.90rem"   }}>/ {data.title}</span>
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

      <Row className="justify-content-center align-items-center">
        <Col md={9}>
          {/* Title */}
          <h2 className="article-title mb-3">{data.title}</h2>
          <div className="d-flex justify-content-center align-items-center mb-2">
            {data.origin && <p className="mb-0">{data.origin.join(', ')} - </p>}
            {data.formattedDateOnly && <p className="mb-0">{formattedDateOnly}</p>}
            {data.name} 
            {data.dateTimeStart && <p className="mb-0">{formattedDateStart}</p>}
          </div>

          {/* Share Buttons */}
          <div className="d-flex mb-4 align-items-center gap-3 justify-content-center">
            <FacebookShareButton url={shareUrl} quote={data.title} picture={data.headerImage}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <EmailShareButton url={shareUrl}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>

          {/* Body Sections */}
          {data.body?.map((section, index) => (
            <Row className="mb-5" key={index}>
              {isVideoUrl(section.image) ? (
                <Col md={12}>
                  <h5 className="mt-4">
                    <strong>{section.subtitle}</strong>
                  </h5>
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
                    <h5>
                      <strong>{section.subtitle}</strong>
                    </h5>
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
                  <h5>
                      <strong>{section.subtitle}</strong>
                    </h5>
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
                  <h5>
                    <strong>{section.subtitle}</strong>
                  </h5>
                  <div
                    className="section-body"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </Col>
              ) : null}
            </Row>
          ))}

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

          {/* Image Modal with Navigation */}
          <ImageModal
            show={showModal}
            onHide={() => setShowModal(false)}
            images={data.images}
            modalIndex={modalIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {/* References */}
          {data.references?.length > 0 && (
            <div className="mt-5">
              <h5 className="ms-3">References</h5>
              <ul>
                {data.references.map((ref, idx) => (
                  <li key={idx}>
                    <a href={ref} target="_blank" rel="noopener noreferrer">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}


          
        </Col>
      </Row>

      {/* Full Image Modal for Body Image */}
      {/* Full Image Modal for Body Image */}
      <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
        <Modal.Body className="gallery-modal">
          {/* Remove Spinner Loader */}
          <Image
            src={selectedImage}
            alt="Full View"
            fluid
            onLoad={handleImageLoad} // Set image loading to false once it's loaded
          />
        </Modal.Body>
      </Modal>


      <FooterCustomized />
    </div>
  );
};

export default ArticleViewComponent;
