// {storyFormData.body.map((section, index) => (
//     <Row key={index} className="d-flex flex-md-row flex-column">
//         <Container className="empty-container"></Container>
//         <Form.Group className="mb-3 m-0 p-0">
//                 <Form.Label className="label">Subtitle (Optional)</Form.Label>
//                 <Form.Control
//                     type="text"
//                     className="fw-bold"
//                     value={section.subtitle}
//                     onChange={(e) => handleBodyChange(index, "subtitle", e.target.value)}
//                 />
//         </Form.Group>
//         <Col className="col me-lg-2 me-md-1">

//             <Form.Group className="mb-3">
//                 <Form.Label className="label">Image (Optional)</Form.Label>
//                 <Container {...getBodyImageRootProps()} className={`dropzone-container-small text-center w-100 ${section.image ? "border-success" : ""}`}>
//                     <input {...getBodyImageInputProps()} accept="image/*" />
//                     {section.image ? (
//                         <img src={URL.createObjectURL(section.image)} alt="Body Image Preview" className="dropzone-uploaded-image-small" />
//                     ) : (
//                         <p className="text-muted">Drag & Drop Image Here or <span className="text-primary text-decoration-underline">Choose File</span></p>
//                     )}
//                 </Container>
//                 {section.image && (
//                     <Button className="mt-2" variant="outline-danger" onClick={() => removeBodyImage(index)}>
//                         <FontAwesomeIcon icon={faCancel} size="xs" fixedWidth /> Remove Image
//                     </Button>
//                 )}
//             </Form.Group>
//         </Col>
        
//         <Col className="col ms-lg-2 ms-md-1">
            
//             <Form.Group className="mb-3">
//                 <Form.Label className="label">Body</Form.Label>
//                 <Form.Control
//                     as="textarea"
//                     ref={textareaRef}
//                     value={section.body}
//                     onChange={(e) => handleBodyChange(index, "body", e.target.value)}
//                     rows={8}
//                     onInput={handleAutoResize}  // Trigger resizing on input
//                     style={{ resize: 'none' }}  // Disable manual resizing
//                 />
//             </Form.Group>
            
//         </Col>
//         <Container className="mb-4 d-flex justify-content-end">
//                 <Button
//                     variant="outline-danger"
//                     type="button"
//                     onClick={() => deleteBodySection(index)} // Delete button functionality
//                     className="mt-3 w-full"
//                 >
//                     <FontAwesomeIcon icon={faTrash} size="xs" fixedWidth /> Delete Section
//                 </Button>
//         </Container>
        
//     </Row>
    
// ))
// }