import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Row, Col } from "react-bootstrap";
import backgroundfade from "../../assets/backgroundfade.png";

export default function PortScheduleTodayComponent({
  collectionName = "portScheduleToday",
}) {
  const [portInfo, setPortInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortData = async () => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setPortInfo(data);
        }
      } catch (error) {
        console.error("Error fetching port schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortData();
  }, [collectionName]);

  if (loading) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-danger text-start shadow-sm"
        style={{ backgroundColor: "#f5fbff", fontSize: "0.85rem", lineHeight: 1.4 }}
      >
        <p className="text-muted mb-0">Loading port schedule...</p>
      </div>
    );
  }

  if (!portInfo) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-danger text-start shadow-sm"
        style={{ backgroundColor: "#f5fbff", fontSize: "0.85rem", lineHeight: 1.4 }}
      >
        <p className="text-muted mb-0">No schedule available for today.</p>
      </div>
    );
  }

  // ✅ --- Time Parsing Helpers ---
  const parseTimeToMinutes = (t) => {
    if (!t && t !== 0) return null;
    const s = String(t).trim();

    const hhmm24 = s.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmm24) {
      let hh = parseInt(hhmm24[1], 10);
      const mm = parseInt(hhmm24[2], 10);
      if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) return hh * 60 + mm;
    }

    const ampm = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/i);
    if (ampm) {
      let hh = parseInt(ampm[1], 10);
      const mm = ampm[2] ? parseInt(ampm[2], 10) : 0;
      const meridiem = ampm[3] ? ampm[3].toUpperCase() : null;
      if (meridiem === "AM" && hh === 12) hh = 0;
      if (meridiem === "PM" && hh !== 12) hh += 12;
      return hh * 60 + mm;
    }

    return null;
  };

  const formatMinutesTo12Hour = (mins) => {
    if (mins == null) return "—";
    mins = ((mins % 1440) + 1440) % 1440;
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // ✅ --- Logic for 24/7 and Status ---
  const openMin = parseTimeToMinutes(portInfo.openTime);
  const closeMin = parseTimeToMinutes(portInfo.closeTime);
  const isTwentyFourSeven =
    openMin === 0 && closeMin === 0 && openMin !== null && closeMin !== null;

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;
  if (isTwentyFourSeven) {
    isOpen = true;
  } else if (openMin != null && closeMin != null) {
    if (openMin === closeMin) {
      isOpen = false;
    } else if (openMin < closeMin) {
      isOpen = currentMin >= openMin && currentMin < closeMin;
    } else {
      isOpen = currentMin >= openMin || currentMin < closeMin;
    }
  } else {
    isOpen = currentMin >= 5 * 60 && currentMin < 21 * 60;
  }

  const displayStatus = isOpen ? "Open" : "Closed";
  const statusColor = isOpen ? "#28a745" : "#dc3545";

  const operatingHoursDisplay = isTwentyFourSeven
    ? "Operating Hours: 24/7 Open"
    : openMin != null && closeMin != null
    ? `Operating Hours: ${formatMinutesTo12Hour(openMin)} – ${formatMinutesTo12Hour(closeMin)}`
    : `Operating Hours: ${portInfo.openTime || "—"} – ${portInfo.closeTime || "—"}`;

  // ✅ --- UI ---
  return (
   
          <div
            className="px-4 py-3 border-start border-4 border-danger text-start shadow-sm"
            style={{
              backgroundColor: "#f5fbff",
              fontSize: "0.85rem",
              lineHeight: 1.4,
            }}
          >
            <p className="text-muted mb-2 fw-bold" style={{ fontSize: "0.8rem" }}>
              Port Location
            </p>

            <p className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#333" }}>
              {portInfo.location || "Caticlan Jetty Port"}
            </p>

            <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
              {portInfo.locationDetails || "Malay, Aklan, Philippines"}
            </p>

            <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
              Last posted by{" "}
              {portInfo.reference ? (
                <a
                  href={portInfo.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#0d6efd",
                    fontWeight: "600",
                  }}
                >
                  {portInfo.postedBy || "Philippine Coast Guard"}
                </a>
              ) : (
                <strong>{portInfo.postedBy || "Philippine Coast Guard"}</strong>
              )}{" "}
              as of{" "}
              {portInfo.date_posted
  ? new Date(portInfo.date_posted).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  : new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })}

            </p>

            <div className="d-flex align-items-center  justify-content-between" style={{ gap: 0 }}>
              <p
                className="mb-2 text-muted fw-semibold"
                style={{ fontSize: "0.8rem", marginBottom: 0, marginRight: "0.4rem" }}
              >
                {operatingHoursDisplay}
              </p>
              <p
                className="mb-2 fw-semibold"
                style={{ fontSize: "0.8rem", color: statusColor, marginBottom: 0 }}
              >
                Status: {displayStatus}
              </p>
            </div>
          </div>
       
  );
}
