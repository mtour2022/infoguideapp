import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Badge } from 'react-bootstrap';

const TextGroupInputField = ({
  onChange,
  label = 'Organizations',
  caption = "",
  resetKey,
  editingItems = [],
}) => {
  const [inputValue, setInputValue] = useState('');
  const [localItems, setLocalItems] = useState(editingItems);

  // Reset items when resetKey changes
  useEffect(() => {
    if (localItems.length > 0 || inputValue !== '') {
      setLocalItems([]); // Clear items
      setInputValue(''); // Clear input field
      onChange([]); // Ensure parent gets an empty array
    }
  }, [resetKey]);
  

  useEffect(() => {
    if (Array.isArray(editingItems) && !areArraysEqual(localItems, editingItems)) {
      setLocalItems(editingItems);
    }
  }, [editingItems]);
  
  // Helper function to compare two arrays
  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  };
  

  // Update the input value as the user types
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add item when user presses Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !localItems.includes(trimmedValue)) {
        const updatedItems = [...localItems, trimmedValue];
        setLocalItems(updatedItems);
        setInputValue('');
        onChange(updatedItems); // Update the parent state
      }
    }
  };

  // Remove an item from the list
  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = localItems.filter(item => item !== itemToRemove);
    setLocalItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <Form.Group controlId="textGroupInputField mt-4">
      <Form.Label className='label'>{label}</Form.Label>
      {!!caption && <p className='subtitle'>{caption}</p>}
      <Form.Control 
        type="text"
        placeholder={`Type ${label.toLowerCase()} and press Enter`}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Container
          className="mt-3 d-flex flex-wrap"
          style={{ overflow: 'hidden' }}
        >
          {localItems.map((item, index) => (
            <Badge
              key={index}
              bg="light"
              className="me-2 mb-2 text-wrap"
              style={{
                color: "#1F89B2",
                border: "1px solid #1F89B2",
                borderRadius: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
                maxWidth: '100%', // Ensure badge doesn't exceed parent width
                wordBreak: 'break-word', // Break long words to fit within the badge
              }}
            >
              {item}
              <Button
                variant="link"
                size="sm"
                onClick={() => handleRemoveItem(item)}
                style={{
                  color: "#1F89B2",
                  textDecoration: "none",
                  padding: "0 5px",
                }}
              >
                &times;
              </Button>
            </Badge>
          ))}
        </Container>

    </Form.Group>
  );
};

export default TextGroupInputField;
