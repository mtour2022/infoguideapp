import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";

const AddressForm = ({ groupData, setGroupData, editingItem }) => {
    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [street, setStreet] = useState("");
    const [country, setCountry] = useState("");

    useEffect(() => {
        regions().then(setRegionList);

        if (editingItem && editingItem.address) {
            const { region, province, town, barangay, street, country } = editingItem.address;
            setSelectedRegion(region || "");
            setSelectedProvince(province || "");
            setSelectedCity(town || "");
            setSelectedBarangay(barangay || "");
            setStreet(street || "");
            setCountry(country || "Philippines");

            if (region) {
                provinces(region).then(setProvinceList);
            }
            if (province) {
                cities(province).then(setCityList);
            }
            if (town) {
                barangays(town).then(setBarangayList);
            }
        } else {
            setCountry("Philippines");
        }
    }, [editingItem]);

    const handleRegionChange = (region) => {
        setSelectedRegion(region.region_name);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedBarangay("");
        provinces(region.region_code).then(setProvinceList);
        setGroupData({ ...groupData, address: { ...groupData.address, region: region.region_name, province: "", town: "", barangay: "", street } });
    };

    const handleProvinceChange = (province) => {
        setSelectedProvince(province.province_name);
        setSelectedCity("");
        setSelectedBarangay("");
        cities(province.province_code).then(setCityList);
        setGroupData({ ...groupData, address: { ...groupData.address, province: province.province_name, town: "", barangay: "", street } });
    };

    const handleCityChange = (city) => {
        setSelectedCity(city.city_name);
        setSelectedBarangay("");
        barangays(city.city_code).then(setBarangayList);
        setGroupData({ ...groupData, address: { ...groupData.address, town: city.city_name, barangay: "", street } });
    };

    const handleBarangayChange = (barangay) => {
        setSelectedBarangay(barangay);
        setGroupData({ ...groupData, address: { ...groupData.address, barangay, street } });
    };

    const handleStreetChange = (e) => {
        setStreet(e.target.value);
        setGroupData({ ...groupData, address: { ...groupData.address, street: e.target.value } });
    };

    const handleCountryChange = () => {
        setCountry("Philippines");
        setGroupData({ ...groupData, address: { ...groupData.address, country: "Philippines" } });
    };

    return (
        <Form.Group className="mt-3 mb-3">
            <Form.Label className="label">Local Business Address</Form.Label>
            <Form.Control
                className="mb-3"
                type="text"
                name="address.country"
                placeholder="Country"
                onChange={handleCountryChange}
                value={country}
                readOnly
            />
            <Form.Select
                className="my-3"
                value={selectedRegion}
                onChange={(e) => handleRegionChange(regionList.find(r => r.region_name === e.target.value))}
            >
                <option value="">Select Region</option>
                {regionList.map((region) => (
                    <option key={region.region_code} value={region.region_name}>{region.region_name}</option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(provinceList.find(p => p.province_name === e.target.value))}
                disabled={!selectedRegion}
            >
                <option value="">Select Province</option>
                {provinceList.map((province) => (
                    <option key={province.province_code} value={province.province_name}>{province.province_name}</option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedCity}
                onChange={(e) => handleCityChange(cityList.find(c => c.city_name === e.target.value))}
                disabled={!selectedProvince}
            >
                <option value="">Select City/Municipality/Town</option>
                {cityList.map((city) => (
                    <option key={city.city_code} value={city.city_name}>{city.city_name}</option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedBarangay}
                onChange={(e) => handleBarangayChange(e.target.value)}
                disabled={!selectedCity}
            >
                <option value="">Select Barangay</option>
                {barangayList.map((barangay) => (
                    <option key={barangay.brgy_code} value={barangay.brgy_name}>{barangay.brgy_name}</option>
                ))}
            </Form.Select>
            <Form.Control
                className="my-3"
                type="text"
                name="address.street"
                placeholder="Street Name / Zone (Optional)"
                value={street}
                onChange={handleStreetChange}
            />
        </Form.Group>
    );
};

export default AddressForm;
