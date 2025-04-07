

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  FacebookShareButton,
  EmailShareButton,
  FacebookIcon,
  EmailIcon,
} from 'react-share';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust the import as needed
import FooterCustomized from '../components/footer/Footer';
const ArticleViewComponent = () => {
  const { collectionName, dataId } = useParams(); // Access URL parameters
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const shareUrl = window.location.href;

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

  return (
    <div className="home-section">
      {/* Header Image */}
      {data.headerImage && (
        <Image 
          src={data.headerImage} 
          alt="Header" 
          fluid 
          rounded 
          className="article-headerImage mb-4" 
        />
      )}

      {/* Title */}
      <h2 className="article-title mb-3">{data.title}</h2>

      {/* Share Buttons */}
      <div className="d-flex mb-4 align-items-center gap-3 justify-content-center">
        <FacebookShareButton url={shareUrl}
           quote={data.title} 
           picture={data.headerImage}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <EmailShareButton url={shareUrl}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>

      <div className="my-5"></div>

      {/* Body Sections with alternating image/text */}
      {data.body?.map((section, index) => (
        <Row className="mb-5" key={index}>
          {isVideoUrl(section.image) ? (
            // If the section has a video, take the full row for the video and display body below
            <Col md={12}>
              <video controls fluid className="article-body-video  mb-2">
                <source src={section.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {section.image_source && (
                <small className="text-muted d-block mt-1">Source: {section.image_source}</small>
              )}
              <h5 className="mt-4"><strong>{section.subtitle}</strong></h5>
              <div
                className="section-body"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </Col>
          ) : section.image && section.body ? (
            // If it's an image with text
            <>
              <Col md={5}>
                <Image 
                  src={section.image} 
                  alt="Section" 
                  fluid 
                  rounded 
                  className="article-body-image mb-4"
                />
                {section.image_source && (
                  <small className="text-muted d-block mt-1">Source: {section.image_source}</small>
                )}
              </Col>
              <Col md={7}>
                <h5><strong>{section.subtitle}</strong></h5>
                <div
                  className="section-body"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </Col>
            </>
          ) : section.image ? (
            // If it's only an image
            <Col md={12}>
              <Image 
                src={section.image} 
                alt="Section" 
                fluid 
                rounded 
                className="article-body-image  mb-2"
              />
              {section.image_source && (
                <small className="text-muted d-block mt-1">Source: {section.image_source}</small>
              )}
            </Col>
          ) : section.body ? (
            // If there's no image, just show the body
            <Col md={12}>
              <h5><strong>{section.subtitle}</strong></h5>
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
          <h4 className="mt-5 mb-5 text-center"><strong>Gallery</strong></h4>
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
        <div className="mt-5">
          <h5>References</h5>
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
      <FooterCustomized></FooterCustomized>
    </div>
  );
};

export default ArticleViewComponent;
