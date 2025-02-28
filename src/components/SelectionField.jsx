import React, { useState, useEffect } from "react";
import { Form, Button, Badge, ListGroup } from "react-bootstrap";

const SelectionFieldWidget = ({
  onChange,
  label = "Select Option",
  options = [],
  resetKey,
  editingItems = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState(editingItems);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset selected options and search field when resetKey changes
  useEffect(() => {
      if (setSelectedOptions.length > 0 || setSelectedOptions !== '') {
        setSelectedOptions([]); // Clear items
        setSearch(""); // Clear input field
        onChange([]); // Ensure parent gets an empty array
      }
    }, [resetKey]);


   useEffect(() => {
      if (Array.isArray(editingItems) && !areArraysEqual(selectedOptions, editingItems)) {
        setSelectedOptions(editingItems);
      }
    }, [editingItems]);
    
    // Helper function to compare two arrays
    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => item === arr2[index]);
    };
    



  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (value) {
      setFilteredOptions(
        options.filter((opt) =>
          opt.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  };

  const handleSelect = (type) => {
    if (type && !selectedOptions.includes(type)) {
      const updated = [...selectedOptions, type];
      setSelectedOptions(updated);
      onChange(updated);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const removeOption = (typeToRemove) => {
    const updated = selectedOptions.filter((t) => t !== typeToRemove);
    setSelectedOptions(updated);
    onChange(updated);
  };

  return (
    <Form.Group controlId="selectionFieldWidget">
      <Form.Label className="label">{label}</Form.Label>
      <div style={{ position: "relative" }}>
        <Form.Control
          type="text"
          placeholder={`Search ${label} and click the selected option`}
          value={search}
          onChange={handleSearchChange}
          onFocus={() => {
            setFilteredOptions(options);
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        {showDropdown && (
          <ListGroup
            className="position-absolute w-100 shadow bg-white"
            style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((type, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onMouseDown={() => handleSelect(type)}
                  style={{ cursor: "pointer" }}
                >
                  {type}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item disabled>No matching options</ListGroup.Item>
            )}
          </ListGroup>
        )}
      </div>

      <div className="mt-3 mb-3">
        {selectedOptions.map((type, index) => (
          <Badge
            key={index}
            bg="light"
            className="me-2 mb-2"
            style={{
              color: "#1F89B2",
              border: "1px solid #1F89B2",
              borderRadius: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {type}
            <Button
              variant="link"
              size="sm"
              onClick={() => removeOption(type)}
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
      </div>
    </Form.Group>
  );
};

export default SelectionFieldWidget;
