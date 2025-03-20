import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "react-bootstrap";

const HeaderImageDropzone = ({ storyForm, setStoryForm, editingItem, dropzoneName = "dropzone-container-small", previewName = "dropzone-uploaded-image-small" }) => {
    
    const onBodyImageDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStoryForm((prev) => ({
                ...prev,
                headerImage: file,
            }));
        }
    }, [setStoryForm]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onBodyImageDrop,
        accept: "image/png, image/jpeg, image/jpg",
    });

    const imagePreview = storyForm.headerImage instanceof File
        ? URL.createObjectURL(storyForm.headerImage)
        : storyForm.headerImage || editingItem || null;

    return (
        <Container 
            {...getRootProps()} 
            className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
        >
            <input {...getInputProps()} accept="image/*" />
            {imagePreview && storyForm.headerImage ? (
                <img
                    src={imagePreview}
                    alt="Header Image Preview"
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

export default HeaderImageDropzone;



// import React, { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { Container } from "react-bootstrap";

// const HeaderImageDropzone = ({ storyForm, setStoryForm, editingItem, dropzoneName = "dropzone-container-small", previewName = "dropzone-uploaded-image-small" }) => {
    
//     const onBodyImageDrop = useCallback((acceptedFiles) => {
//         const file = acceptedFiles[0];
//         if (file) {
//             setStoryForm((prev) => ({
//                 ...prev,
//                 headerImage: file,
//             }));
//         }
//     }, [setStoryForm]);

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop: onBodyImageDrop,
//         accept: "image/png, image/jpeg, image/jpg",
//     });

//     const imagePreview = storyForm.headerImage instanceof File
//         ? URL.createObjectURL(storyForm.headerImage)
//         : storyForm.headerImage || editingItem || null;

    

//     return (
//         <Container 
//             {...getRootProps()} 
//             className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
//         >
//             <input {...getInputProps()} accept="image/*" />
//             {imagePreview ? (
//                 <img
//                     src={imagePreview}
//                     alt="Header Image Preview"
//                     className={previewName}
//                 />
//             ) : (
//                 <p className="text-muted">
//                     Drag & Drop Image Here or{" "}
//                     <span className="text-primary text-decoration-underline">Choose File</span>
//                 </p>
//             )}
//         </Container>
//     );
// };

// export default HeaderImageDropzone;

