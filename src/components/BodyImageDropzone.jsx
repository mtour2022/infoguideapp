const BodyMediaDropzone = ({
    index,
    section,
    onBodyMediaDrop,
    dropzoneName = "dropzone-container-small",
    previewName = "dropzone-uploaded-media-small"
}) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => onBodyMediaDrop(acceptedFiles, index),
        accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
    });

    // Use the new uploaded media if available
    const mediaPreview = section.media
        ? URL.createObjectURL(section.media)
        : null;

    return (
        <Container
            {...getRootProps()}
            className={`${dropzoneName} text-center w-100 ${mediaPreview ? "border-success" : ""}`}
        >
            <input {...getInputProps()} accept="image/*,video/*" />
            {mediaPreview ? (
                section.media.type.startsWith("video/") ? (
                    <video controls className={previewName}>
                        <source src={mediaPreview} type={section.media.type} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img
                        src={mediaPreview}
                        alt="Body Media Preview"
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

export default BodyMediaDropzone;
