import React, { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col, Table, ListGroup } from "react-bootstrap";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const regionCountryData = [
  {
    regionName: "Southeast Asia",
    countries: [
      "Philippines",
      "Thailand",
      "Vietnam",
      "Malaysia",
      "Singapore",
      "Indonesia",
      "Cambodia",
      "Laos",
      "Myanmar",
      "Brunei",
      "Timor-Leste",
    ],
  },
  {
    regionName: "East Asia",
    countries: ["China", "Japan", "South Korea", "North Korea", "Taiwan", "Hong Kong", "Mongolia"],
  },
  {
    regionName: "South Asia",
    countries: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Maldives"],
  },
  {
    regionName: "Central Asia",
    countries: ["Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan"],
  },
  {
    regionName: "Oceania",
    countries: [
      "Australia",
      "New Zealand",
      "Fiji",
      "Papua New Guinea",
      "Samoa",
      "Vanuatu",
      "Tonga",
      "Solomon Islands",
      "Micronesia",
      "Palau",
      "Kiribati",
      "Nauru",
      "Tuvalu",
    ],
  },
  {
    regionName: "Northern Europe",
    countries: [
      "United Kingdom",
      "Ireland",
      "Norway",
      "Sweden",
      "Finland",
      "Denmark",
      "Iceland",
      "Estonia",
      "Latvia",
      "Lithuania",
    ],
  },
  {
    regionName: "Southern Europe",
    countries: [
      "Italy",
      "Spain",
      "Greece",
      "Portugal",
      "Croatia",
      "Malta",
      "Slovenia",
      "Montenegro",
      "Albania",
      "North Macedonia",
    ],
  },
  {
    regionName: "Eastern Europe",
    countries: [
      "Poland",
      "Romania",
      "Ukraine",
      "Hungary",
      "Bulgaria",
      "Serbia",
      "Belarus",
      "Slovakia",
      "Czech Republic",
      "Moldova",
    ],
  },
  {
    regionName: "Western Europe",
    countries: [
      "France",
      "Germany",
      "Netherlands",
      "Belgium",
      "Switzerland",
      "Austria",
      "Luxembourg",
      "Liechtenstein",
      "Monaco",
    ],
  },
  {
    regionName: "North America",
    countries: [
      "United States",
      "Canada",
      "Mexico",
      "Greenland",
      "Bermuda",
    ],
  },
  {
    regionName: "Central America",
    countries: [
      "Belize",
      "Costa Rica",
      "El Salvador",
      "Guatemala",
      "Honduras",
      "Nicaragua",
      "Panama",
    ],
  },
  {
    regionName: "Caribbean",
    countries: [
      "Bahamas",
      "Cuba",
      "Jamaica",
      "Haiti",
      "Dominican Republic",
      "Barbados",
      "Trinidad and Tobago",
      "Saint Lucia",
      "Grenada",
      "Saint Kitts and Nevis",
      "Antigua and Barbuda",
      "Dominica",
      "Saint Vincent and the Grenadines",
    ],
  },
  {
    regionName: "South America",
    countries: [
      "Brazil",
      "Argentina",
      "Chile",
      "Peru",
      "Colombia",
      "Ecuador",
      "Bolivia",
      "Paraguay",
      "Uruguay",
      "Venezuela",
    ],
  },
  {
    regionName: "Middle East",
    countries: [
      "United Arab Emirates",
      "Saudi Arabia",
      "Israel",
      "Qatar",
      "Kuwait",
      "Oman",
      "Jordan",
      "Bahrain",
      "Lebanon",
      "Palestine",
      "Iraq",
      "Syria",
      "Yemen",
      "Iran",
    ],
  },
  {
    regionName: "North Africa",
    countries: ["Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Sudan"],
  },
  {
    regionName: "West Africa",
    countries: [
      "Nigeria",
      "Ghana",
      "Ivory Coast",
      "Senegal",
      "Mali",
      "Niger",
      "Burkina Faso",
      "Togo",
      "Benin",
      "Sierra Leone",
      "Liberia",
      "Gambia",
      "Cape Verde",
      "Guinea",
      "Guinea-Bissau",
    ],
  },
  {
    regionName: "East Africa",
    countries: [
      "Kenya",
      "Tanzania",
      "Uganda",
      "Ethiopia",
      "Somalia",
      "Rwanda",
      "Burundi",
      "Eritrea",
      "Djibouti",
      "Seychelles",
    ],
  },
  {
    regionName: "Central Africa",
    countries: [
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Congo (Brazzaville)",
      "Congo (Kinshasa)",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe",
    ],
  },
  {
    regionName: "Southern Africa",
    countries: [
      "South Africa",
      "Botswana",
      "Namibia",
      "Zimbabwe",
      "Zambia",
      "Mozambique",
      "Malawi",
      "Lesotho",
      "Eswatini",
      "Angola",
      "Madagascar",
      "Mauritius",
      "Comoros",
    ],
  },
];

// Flattened list of all countries for suggestions
const allCountries = regionCountryData.flatMap((r) =>
  r.countries.map((c) => ({ name: c, region: r.regionName }))
);

export default function TouristArrivalsAdmin() {
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [arrivals, setArrivals] = useState("");
  const [records, setRecords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleCountryChange = (value) => {
    setCountry(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setRegion("");
      return;
    }

    const filtered = allCountries.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // limit suggestions
  };

  const handleSuggestionClick = (countryItem) => {
    setCountry(countryItem.name);
    setRegion(countryItem.region);
    setSuggestions([]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!country || !region) {
      alert("Please select a valid country (auto-fills region)");
      return;
    }

    const newRecord = {
      region,
      country,
      year,
      month,
      arrivals,
    };
    setRecords((prev) => [...prev, newRecord]);

    setRegion("");
    setCountry("");
    setYear("");
    setMonth("");
    setArrivals("");
    setSuggestions([]);
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Add Tourist Arrival Record</h5>
          <Form onSubmit={handleAdd}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    type="text"
                    value={region}
                    readOnly
                    placeholder="Auto-selected based on country"
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="position-relative">
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    placeholder="Type to search country..."
                    autoComplete="off"
                  />
                  {suggestions.length > 0 && (
                    <ListGroup
                      className="position-absolute w-100 shadow-sm"
                      style={{
                        zIndex: 10,
                        maxHeight: "150px",
                        overflowY: "auto",
                      }}
                    >
                      {suggestions.map((c, idx) => (
                        <ListGroup.Item
                          key={idx}
                          action
                          onClick={() => handleSuggestionClick(c)}
                        >
                          {c.name} — <small className="text-muted">{c.region}</small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Yearly</option>
                    {[...Array(12).keys()].map((m) => (
                      <option key={m + 1} value={m + 1}>
                        {new Date(0, m).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Arrivals</Form.Label>
              <Form.Control
                type="number"
                value={arrivals}
                onChange={(e) => setArrivals(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Add Record
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Records</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Region</th>
            <th>Country</th>
            <th>Year</th>
            <th>Month</th>
            <th>Arrivals</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, idx) => (
            <tr key={idx}>
              <td>{rec.region}</td>
              <td>{rec.country}</td>
              <td>{rec.year}</td>
              <td>
                {rec.month
                  ? new Date(0, rec.month - 1).toLocaleString("default", {
                      month: "short",
                    })
                  : "Yearly"}
              </td>
              <td>{rec.arrivals}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}