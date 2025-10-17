import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import background2 from "../../assets/background2.png";
import background1 from "../../assets/background1.png";
import backgroundfade from "../../assets/backgroundfade.png";
import FooterCustomized from "../footer/Footer";
import warningFlag from "../../assets/warningFlags.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faCopy } from "@fortawesome/free-solid-svg-icons";
import earthquakepreparedness from "../../assets/earthquakepreparedness.png"
import typoonpreparedness from "../../assets/typoonPreparedness.png"
import fireSafety from "../../assets/firesafety.jpg"

import { Modal, Image } from "react-bootstrap";


export default function TouristEmergencyPreparednessPage() {
    const [hotlines, setHotlines] = useState([]);
    const [ordinances, setOrdinances] = useState([]);
    const [beachFlags, setBeachFlags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Body image modal state
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const openImageModal = (image) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage('');
    };

    const [imageLoading, setImageLoading] = useState(true);

    const handleImageLoad = () => {
        setImageLoading(false);
    };


    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const hotlinesSnap = await getDocs(query(collection(db, "hotlines"), orderBy("name")));
                const ordinancesSnap = await getDocs(query(collection(db, "ordinances"), orderBy("title")));
                // const flagsSnap = await getDocs(collection(db, "beachFlags"));

                setHotlines(hotlinesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setOrdinances(ordinancesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                // setBeachFlags(flagsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const [copiedMsg, setCopiedMsg] = useState("");

    const handleCopy = (num) => {
        navigator.clipboard.writeText(num);
        setCopiedMsg(`Copied: ${num}`);
        setTimeout(() => setCopiedMsg(""), 2000); // hide after 2s
    };


    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${backgroundfade}), url(${background2}), url(${background1})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    minHeight: "100vh",
                }}
                className="p-4"
            >
                <style>{`
        .grid-custom {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 768px) {
          .grid-custom { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1200px) {
          .grid-custom { grid-template-columns: repeat(4, 1fr); }
        }
        .no-round { border-radius: 0 !important; }
        .section-title {
          color: #004080;
          font-weight: 700;
          margin-bottom: 1rem;
          border-left: 5px solid #ffc107;
          padding-left: 0.75rem;
        }
      `}</style>

                <header className="text-center mb-5 mt-5">
                    <h2 className="custom-section-title text-center my-3 text-light">
                        TOURIST EMERGENCY PREPAREDNESS AND SAFETY ESSENTIALS
                    </h2>
                    <small className="text-light">
                        Stay informed, stay safe. Find essential hotlines, beach warnings, and local ordinances below.
                    </small>
                </header>
                {/* --- SAFETY ESSENTIALS --- */}
                {/* --- SAFETY ESSENTIALS --- */}
                <section className="mb-5 mt-5">
                    <h2 className="custom-section-title mb-4 text-white">SAFETY ESSENTIALS</h2>

                    <div className="grid-custom">
                        {/* --- Beach Warning Flags Guide --- */}
                        <div
                            className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round"
                            style={{
                                backgroundColor: "#f5fbff",
                                fontSize: "0.85rem",
                                lineHeight: 1.4,
                            }}
                        >
                            <img
                                src={warningFlag}
                                alt="Beach Warning Flags"
                                onClick={() => openImageModal(warningFlag)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && openImageModal(warningFlag)}
                                style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    marginBottom: "0.75rem",
                                    cursor: "pointer",
                                    transition: "transform 0.18s ease",
                                }}
                                className="no-round"
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.995)")}
                                onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            <p
                                className="fw-bold mb-1"
                                style={{ fontSize: "1.2rem", color: "#333" }}
                            >
                                Beach Warning Flags Guide
                            </p>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                Know what they mean before going into the water. Absence of flags does
                                not assure safe waters.
                            </p>
                        </div>

                        {/* --- Earthquake Preparedness --- */}
                        <div
                            className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round"
                            style={{
                                backgroundColor: "#f5fbff",
                                fontSize: "0.85rem",
                                lineHeight: 1.4,
                            }}
                        >
                            <img
                                src={earthquakepreparedness}
                                alt="Earthquake Preparedness"
                                onClick={() => openImageModal(earthquakepreparedness)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && openImageModal(earthquakepreparedness)}
                                style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    marginBottom: "0.75rem",
                                    cursor: "pointer",
                                    transition: "transform 0.18s ease",
                                }}
                                className="no-round"
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.995)")}
                                onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            <p
                                className="fw-bold mb-1"
                                style={{ fontSize: "1.2rem", color: "#333" }}
                            >
                                Earthquake Preparedness
                            </p>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                Stay calm and protect yourself. Drop, cover, and hold on. Move away
                                from windows and heavy objects until the shaking stops.
                            </p>
                        </div>

                        {/* --- Typhoon Preparedness --- */}
                        <div
                            className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round"
                            style={{
                                backgroundColor: "#f5fbff",
                                fontSize: "0.85rem",
                                lineHeight: 1.4,
                            }}
                        >
                            <img
                                src={typoonpreparedness}
                                alt="Typhoon Preparedness"
                                onClick={() => openImageModal(typoonpreparedness)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && openImageModal(typoonpreparedness)}
                                style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    marginBottom: "0.75rem",
                                    cursor: "pointer",
                                    transition: "transform 0.18s ease",
                                }}
                                className="no-round"
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.995)")}
                                onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            <p
                                className="fw-bold mb-1"
                                style={{ fontSize: "1.2rem", color: "#333" }}
                            >
                                Typhoon Preparedness
                            </p>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                Stay informed of weather updates. Prepare an emergency kit, evacuate
                                early if advised, and avoid flood-prone or low-lying areas.
                            </p>
                        </div>

                        {/* --- Fire Safety & Evacuation --- */}
                        <div
                            className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round"
                            style={{
                                backgroundColor: "#f5fbff",
                                fontSize: "0.85rem",
                                lineHeight: 1.4,
                            }}
                        >
                            <img
                                src={fireSafety}
                                alt="Fire Safety and Evacuation"
                                onClick={() => openImageModal(fireSafety)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && openImageModal(fireSafety)}
                                style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    marginBottom: "0.75rem",
                                    cursor: "pointer",
                                    transition: "transform 0.18s ease",
                                }}
                                className="no-round"
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.995)")}
                                onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            <p className="fw-bold mb-1" style={{ fontSize: "1.2rem", color: "#333" }}>
                                Fire Safety & Evacuation
                            </p>
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                Familiarize yourself with fire exits and emergency routes in your
                                accommodation. Avoid open flames near cottages and unplug devices
                                when not in use. Stay calm and follow evacuation procedures if needed.
                            </p>
                        </div>
                    </div>
                </section>

                {/* HOTLINES */}
                <section className="mb-5 position-relative">
                    <h2 className="custom-section-title mb-4 text-white">
                        EMERGENCY HOTLINES
                    </h2>

                    {/* Notification Toast */}
                    {copiedMsg && (
                        <div className="copy-toast">
                            <FontAwesomeIcon icon={faCopy} className="me-2" />
                            {copiedMsg}
                        </div>
                    )}

                    {loading ? (
                        <p>Loading hotlines...</p>
                    ) : (
                        <>
                            {/* --- QUICK LINKS --- */}
                            <div className="d-flex flex-wrap justify-content-start mb-4 gap-2">
                                {Array.from(new Set(hotlines.map((h) => h.category || "General")))
                                    .sort((a, b) => (a.toLowerCase() === "emergency hotline" ? -1 : b.toLowerCase() === "emergency hotline" ? 1 : 0))
                                    .map((cat, index) => (
                                        <button
                                            key={index}
                                            className="read-more-btn mb-2 mb-md-3"
                                            onClick={() =>
                                                document
                                                    .getElementById(`category-${cat.replace(/\s+/g, "-")}`)
                                                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                                            }
                                        >
                                            <span className="d-none d-md-inline">{cat} →</span>
                                            <span className="d-inline d-md-none">{cat} →</span>
                                        </button>
                                    ))}
                            </div>


                            {/* --- CATEGORIZED HOTLINES --- */}
                            {Array.from(new Set(hotlines.map((h) => h.category || "General")))
                                .sort((a, b) =>
                                    a.toLowerCase() === "emergency hotline"
                                        ? -1
                                        : b.toLowerCase() === "emergency hotline"
                                            ? 1
                                            : 0
                                )
                                .map((cat, i) => {
                                    const filtered = hotlines.filter(
                                        (h) => (h.category || "General") === cat
                                    );

                                    return (
                                        <div
                                            key={i}
                                            id={`category-${cat.replace(/\s+/g, "-")}`}
                                            className="mb-5"
                                        >
                                            <h5
                                                className="fw-bold mb-3 text-light"
                                                style={{ fontSize: "1.4rem" }}
                                            >
                                                {cat.toUpperCase()}
                                            </h5>

                                            <div className="grid-custom">
                                                {filtered.map((h) => (
                                                    <div
                                                        key={h.id}
                                                        className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round hotline-card"
                                                        style={{
                                                            backgroundColor: "#f5fbff",
                                                            fontSize: "0.85rem",
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        {/* Logo */}
                                                        {h.logo && (
                                                            <div className="text-center mb-2">
                                                                <img
                                                                    src={h.logo}
                                                                    alt={h.name}
                                                                    style={{
                                                                        height: "50px",
                                                                        objectFit: "contain",
                                                                    }}
                                                                    className="no-round"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Name */}
                                                        <p
                                                            className="fw-bold mb-1"
                                                            style={{
                                                                fontSize: "1.4rem",
                                                                color: "#333",
                                                            }}
                                                        >
                                                            {h.name}
                                                        </p>

                                                        {/* Address */}
                                                        <p
                                                            className="text-muted mb-1"
                                                            style={{ fontSize: "0.8rem" }}
                                                        >
                                                            {h.address?.town}, {h.address?.province}
                                                        </p>

                                                        {/* Landline */}
                                                        {h.landline?.length > 0 && (
                                                            <div
                                                                className="fw-semibold mb-1"
                                                                style={{
                                                                    fontSize: "0.9rem",
                                                                    color: "#0d6efd",
                                                                }}
                                                            >
                                                                <span className="text-dark fw-bold me-1">Landline:</span>
                                                                {h.landline.map((num, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="d-inline-flex align-items-center ms-2 me-2"
                                                                    >
                                                                        <a
                                                                            href={`tel:${num}`}
                                                                            style={{
                                                                                textDecoration: "none",
                                                                                color: "#0d6efd",
                                                                                fontWeight: "600",
                                                                                marginRight: "6px",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "4px",
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPhone} />
                                                                            {num}
                                                                        </a>
                                                                        <FontAwesomeIcon
                                                                            icon={faCopy}
                                                                            title="Copy number"
                                                                            className="copy-icon"
                                                                            onClick={() => handleCopy(num)}
                                                                        />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}


                                                        {/* Mobile Numbers */}
                                                        {h.mobile?.length > 0 && (
                                                            <div
                                                                className="fw-semibold mb-1"
                                                                style={{
                                                                    fontSize: "0.9rem",
                                                                    color: "#0d6efd",
                                                                }}
                                                            >
                                                                <span className="text-dark fw-bold me-1">Mobile:</span>
                                                                {h.mobile.map((num, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="d-inline-flex align-items-center ms-2 me-2"
                                                                    >
                                                                        <a
                                                                            href={`tel:${num}`}
                                                                            style={{
                                                                                textDecoration: "none",
                                                                                color: "#0d6efd",
                                                                                fontWeight: "600",
                                                                                marginRight: "6px",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "4px",
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPhone} />
                                                                            {num}
                                                                        </a>
                                                                        <FontAwesomeIcon
                                                                            icon={faCopy}
                                                                            title="Copy number"
                                                                            className="copy-icon"
                                                                            onClick={() => handleCopy(num)}
                                                                        />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Satellite */}
                                                        {h.satellite?.length > 0 && (
                                                            <p
                                                                className="fw-semibold mb-1"
                                                                style={{
                                                                    fontSize: "0.9rem",
                                                                    color: "#0d6efd",
                                                                }}
                                                            >
                                                                Satellite: {h.satellite.join(", ")}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                        </>
                    )}
                </section>


                {/* --- ORDINANCES --- */}
                <section className="mb-5">
                    <h2 className="custom-section-title mb-4 text-white">BEACH LAWS</h2>
                    {loading ? (
                        <p>Loading ordinances...</p>
                    ) : (
                        <div className="grid-custom">
                            {ordinances.map((o) => (
                                <div
                                    key={o.id}
                                    className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm no-round"
                                    style={{
                                        backgroundColor: "#f5fbff",
                                        fontSize: "0.85rem",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {o.logo && (
                                        <div className="text-center mb-2">
                                            <img
                                                src={o.logo}
                                                alt={o.title}
                                                style={{ height: "60px", objectFit: "contain" }}
                                                className="no-round"
                                            />
                                        </div>
                                    )}
                                    <p className="text-muted mb-2 fw-bold" style={{ fontSize: "0.8rem" }}>
                                        Ordinance
                                    </p>
                                    <p className="fw-bold mb-1" style={{ fontSize: "1.3rem", color: "#333" }}>
                                        {o.title}
                                    </p>
                                    <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                                        {o.ordinance}
                                    </p>
                                    <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
                                        <div
                                            className="section-body"
                                            dangerouslySetInnerHTML={{ __html: o.description }}
                                        />

                                    </p>
                                    {o.references?.length > 0 && (
                                        <p className="fw-semibold mt-2" style={{ fontSize: "0.8rem", color: "#0d6efd" }}>
                                            References: {o.references.join(", ")}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>


            </div>

            {/* Full Image Modal for Body Image */}
            <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
                <Modal.Body className="gallery-modal d-flex justify-content-center align-items-center">
                    {imageLoading && (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}

                    <Image
                        src={selectedImage}
                        alt="Full View"
                        fluid
                        onLoad={handleImageLoad}
                        style={{ display: imageLoading ? 'none' : 'block' }}
                    />
                </Modal.Body>
            </Modal>

            <FooterCustomized scrollToId=""></FooterCustomized>

        </>
    );
}
