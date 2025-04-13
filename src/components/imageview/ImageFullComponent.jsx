import { useState } from 'react';
import { Modal, Image, Spinner } from 'react-bootstrap';

const FullImageModal = ({ showImageModal, closeImageModal, selectedImage }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false); // Image has finished loading
  };

  return (
    <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
      <Modal.Body className="d-flex justify-content-center align-items-center">
        {isLoading && (
          <Spinner animation="border" variant="primary" />
        )}
        <Image
          src={selectedImage}
          alt="Full View"
          fluid
          className="w-100"
          style={{
            objectFit: 'cover', // Ensures the image covers the full modal without white spaces
            height: '100%', // Ensures the image takes the full height of the modal
            visibility: isLoading ? 'hidden' : 'visible', // Hide the image while it's loading
          }}
          onLoad={handleImageLoad} // Trigger handleImageLoad once the image has loaded
        />
      </Modal.Body>
    </Modal>
  );
};

export default FullImageModal;
