import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const MultiImageDropzone = ({ dataForm, setDataForm, caption, dropzoneName, previewName, maxImages = 10 }) => {
  
  // Handle image drop
  const onImageDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setDataForm((prev) => {
        const updatedImages = [...(prev.images || []), ...acceptedFiles];

        // Check if limit exceeded
        if (updatedImages.length > maxImages) {
          Swal.fire({
            icon: "error",
            title: "Upload Limit Exceeded",
            text: `You can only upload up to ${maxImages} images.`,
            confirmButtonColor: "#d33",
          });

          return { ...prev, images: updatedImages.slice(0, maxImages) };
        }

        return { ...prev, images: updatedImages };
      });
    }
  }, [setDataForm, maxImages]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onImageDrop,
    accept: "image/png, image/jpeg, image/jpg",
    multiple: true,
    maxFiles: maxImages - (dataForm.images?.length || 0), // Allow selecting remaining images only
  });

  // Reset function
  const resetImages = () => {
    setDataForm((prev) => ({ ...prev, images: [] }));
  };

  return (
    <Container className="text-center w-100">
      <Row className="d-md-flex flex-md-column flex-lg-row align-items-center">
        <Col md={12} lg={4} className="order-lg-1 order-md-2 col">
          <div 
            {...getRootProps()} 
            className={`${dropzoneName} p-3 border rounded ${dataForm.images?.length ? "border-success" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <input {...getInputProps()} accept="image/*" />
            <p className="text-muted">
              {caption}{" "}
              <span className="text-primary text-decoration-underline">Choose Files</span>
              <br /><strong>{maxImages - (dataForm.images?.length || 0)}</strong> images left to upload
            </p>
          </div>
        </Col>

        <Col md={12} lg={8} className="order-lg-2 order-md-1  col">
          {/* Image Previews */}
          <div 
            className="d-flex flex-wrap justify-content-center align-items-center gap-2 border border-secondary rounded p-2"
            style={{ borderWidth: "1px", minHeight: "200px", flexDirection: dataForm.images.length > 0 ? "row" : "column" }} 
          >
            {dataForm.images?.map((image, index) => {
              const imageURL = image instanceof File ? URL.createObjectURL(image) : image;
              return (
                <div 
                  key={index} 
                  className="position-relative"
                  style={{ 
                    width: "85px", 
                    height: "85px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    overflow: "hidden",
                    border: "1px solid gray",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={imageURL}
                    alt={`Preview ${index + 1}`}
                    className={`${previewName} rounded m-2`}
                    style={{
                      width: "85px",
                      height: "85px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />

                  {/* Remove Single Image Button */}
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                    onClick={() => {
                      setDataForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }));
                    }}
                    style={{ 
                      width: "20px", 
                      height: "20px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      padding: 0, 
                      fontSize: "14px", 
                      lineHeight: "14px",
                      borderRadius: "50%",
                    }}
                  >
                    &times;
                  </Button>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* Reset Button */}
      {dataForm.images?.length > 0 && (
        <Container className="d-flex justify-content-end mb-4">
          <Button variant="outline-danger" className="mt-3" onClick={resetImages}>
            Reset Images
          </Button>
        </Container>
      )}
    </Container>
  );
};

export default MultiImageDropzone;
