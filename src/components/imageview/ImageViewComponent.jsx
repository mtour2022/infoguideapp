import React from 'react';
import { Modal, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ImageModal = ({ show, onHide, images, modalIndex, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  const imageToDisplay = images[modalIndex];

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="gallery-modal">
      <Modal.Body className="p-0 text-center position-relative">
        <Image src={imageToDisplay} fluid className="w-100" />
        {images.length > 1 && (
          <>
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="gallery-nav-btn left"
              onClick={onPrev}
            />
            <FontAwesomeIcon
              icon={faChevronRight}
              className="gallery-nav-btn right"
              onClick={onNext}
            />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
