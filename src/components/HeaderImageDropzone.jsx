import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "react-bootstrap";

const HeaderMediaDropzone = ({ storyForm, setStoryForm, editingItem, dropzoneName = "dropzone-container-small", previewName = "dropzone-uploaded-media-small" }) => {
    
    const onMediaDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStoryForm((prev) => ({
                ...prev,
                headerMedia: file,
            }));
        }
    }, [setStoryForm]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onMediaDrop,
        accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
    });

    const mediaPreview = storyForm.headerMedia instanceof File
        ? URL.createObjectURL(storyForm.headerMedia)
        : storyForm.headerMedia || editingItem || null;

    return (
        <Container 
            {...getRootProps()} 
            className={`${dropzoneName} text-center w-100 ${mediaPreview ? "border-success" : ""}`}
        >
            <input {...getInputProps()} accept="image/*,video/*" />
            {mediaPreview && storyForm.headerMedia ? (
                storyForm.headerMedia.type.startsWith("video/") ? (
                    <video controls className={previewName}>
                        <source src={mediaPreview} type={storyForm.headerMedia.type} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img
                        src={mediaPreview}
                        alt="Header Media Preview"
                        className={previewName}
                    />
                )
            ) : (
                <p className="text-muted">
                    Drag & Drop Image/Video Here or {" "}
                    <span className="text-primary text-decoration-underline">Choose File</span>
                </p>
            )}
        </Container>
    );
};

export default HeaderMediaDropzone;
