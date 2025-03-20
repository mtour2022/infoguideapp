import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";

const AddressForm = ({ groupData, setGroupData }) => {
    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState({ name: "", code: "" });
    const [selectedProvince, setSelectedProvince] = useState({ name: "", code: "" });
    const [selectedCity, setSelectedCity] = useState({ name: "", code: "" });
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [street, setStreet] = useState("");
    const [country, setCountry] = useState("Philippines");

    useEffect(() => {
        setCountry("Philippines");
        regions().then(setRegionList);
    }, []);


    

    useEffect(() => {
        if (selectedRegion.code) {
            provinces(selectedRegion.code).then(setProvinceList);
        } else {
            setProvinceList([]);
        }
        setCountry("Philippines");
        setSelectedProvince({ name: "", code: "" });
        setSelectedCity({ name: "", code: "" });
        setSelectedBarangay("");
        setCityList([]);
        setBarangayList([]);
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince.code) {
            cities(selectedProvince.code).then(setCityList);
        } else {
            setCityList([]);
        }
        setCountry("Philippines");
        setSelectedCity({ name: "", code: "" });
        setSelectedBarangay("");
        setBarangayList([]);
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity.code) {
            barangays(selectedCity.code).then(setBarangayList);
        } else {
            setBarangayList([]);
        }
        setCountry("Philippines");
        setSelectedBarangay("");
    }, [selectedCity]);

    const handleRegionChange = (e) => {
        const region = regionList.find(r => r.region_code === e.target.value);
        setSelectedRegion({ name: region.region_name, code: region.region_code });
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                
                region: region.region_name,
                province: "",
                town: "",
                barangay: "",
                street,
            },
        }));
    };

    const handleProvinceChange = (e) => {
        const province = provinceList.find(p => p.province_code === e.target.value);
        setSelectedProvince({ name: province.province_name, code: province.province_code });
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                province: province.province_name,
                town: "",
                barangay: "",
                street,
            },
        }));
    };

    const handleCityChange = (e) => {
        const city = cityList.find(c => c.city_code === e.target.value);
        setSelectedCity({ name: city.city_name, code: city.city_code });
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                town: city.city_name,
                barangay: "",
                street,
            },
        }));
    };

    const handleBarangayChange = (e) => {
        setSelectedBarangay(e.target.value);
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                barangay: e.target.value,
                street,
            },
        }));
    };

    const handleStreetChange = (e) => {
        setStreet(e.target.value);
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                street: e.target.value,
            },
        }));
    };

    const handleCountryChange = () => {
        setCountry("Philippines");
        setGroupData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                country: "Philippines",
            },
        }));
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
                value={selectedRegion.code}
                onChange={handleRegionChange}
            >
                <option value="">Select Region</option>
                {regionList.map((region) => (
                    <option key={region.region_code} value={region.region_code}>
                        {region.region_name}
                    </option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedProvince.code}
                onChange={handleProvinceChange}
                disabled={!selectedRegion.code}
            >
                <option value="">Select Province</option>
                {provinceList.map((province) => (
                    <option key={province.province_code} value={province.province_code}>
                        {province.province_name}
                    </option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedCity.code}
                onChange={handleCityChange}
                disabled={!selectedProvince.code}
            >
                <option value="">Select City/Municipality/Town</option>
                {cityList.map((city) => (
                    <option key={city.city_code} value={city.city_code}>
                        {city.city_name}
                    </option>
                ))}
            </Form.Select>
            <Form.Select
                className="my-3"
                value={selectedBarangay.code}
                onChange={handleBarangayChange}
                disabled={!selectedCity.code}
            >
                <option value="">Select Barangay</option>
                {barangayList.map((bgry) => (
                    <option key={bgry.brgy_code} value={bgry.brgy_name}>
                        {bgry.brgy_name}
                    </option>
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
