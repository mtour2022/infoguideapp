import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "react-bootstrap";


const BodyImageDropzone = ({ index, section, editingItem, handleImageDrop, dropzoneName = "dropzone-container-small", previewName = "dropzone-uploaded-image-small" }) => { 
    

    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => handleImageDrop(acceptedFiles, index),
        accept: "image/png, image/jpeg, image/jpg",
    });

    // Check if the section has a new uploaded image or an existing image URL from editingItem
    const imagePreview = editingItem
        ? (section.image 
            ? URL.createObjectURL(section.image)
            : editingItem.body[index]?.image || null)
        : (section.image ? URL.createObjectURL(section.image) : null);

    return (
        <Container 
            {...getRootProps()} 
            className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
        >
            <input {...getInputProps()} accept="image/*" />
            {imagePreview ? (
                <img
                    src={imagePreview}
                    alt="Body Image Preview"
                    className={previewName}
                />
            ) : (
                <p className="text-muted">
                    Drag & Drop Image Here or{" "}
                    <span className="text-primary text-decoration-underline">Choose File</span>
                </p>
            )}
        </Container>
    );
};

export default BodyImageDropzone;
