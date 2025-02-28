import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "react-bootstrap";

const LogoImageDropzone = ({ storyForm, setStoryForm, caption, editingItem, dropzoneName, previewName }) => {
    
    const onBodyImageDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStoryForm((prev) => ({
                ...prev,
                logo: file,
            }));
        }
    }, [setStoryForm]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onBodyImageDrop,
        accept: "image/png, image/jpeg, image/jpg",
    });

    const imagePreview = storyForm.logo instanceof File
        ? URL.createObjectURL(storyForm.logo)
        : storyForm.logo || editingItem || null;

    return (
        <Container 
            {...getRootProps()} 
            className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
        >
            <input {...getInputProps()} accept="image/*" />
            {imagePreview && storyForm.logo ? (
                <img
                    src={imagePreview}
                    alt="Header Image Preview"
                    className={previewName}
                    style={{objectFit: "contain"}}

                />
            ) : (
                <p className="text-muted">
                    {caption}{" "}
                    <span className="text-primary text-decoration-underline">Choose File</span>
                </p>
            )}
        </Container>
    );
};

export default LogoImageDropzone;

