// RichTextEditor.jsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ index, section, handleBodyChange }) => {
  const [editorValue, setEditorValue] = useState(section.body || '');

  // If the section body changes externally, update the editor state.
  useEffect(() => {
    setEditorValue(section.body || '');
  }, [section.body]);

  const onEditorChange = (content) => {
    setEditorValue(content);
    handleBodyChange(index, 'body', content);
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorValue}
      onChange={onEditorChange}
      style={{ height: '300px'}}  // adjust height as needed
    />
  );
};

export default RichTextEditor;
