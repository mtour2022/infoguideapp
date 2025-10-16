import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function HolidayTodayComponent({
  collectionName = "holidayToday",
}) {
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (snapshot.empty) {
          setHolidayInfo(null);
          return;
        }

        // Map all holidays
        const holidays = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sort holidays by start date
        const sorted = holidays.sort(
          (a, b) => new Date(a.dateStart) - new Date(b.dateStart)
        );

        // Find relevant holiday
        let selected =
          sorted.find((h) => new Date(h.dateStart) <= today && new Date(h.dateEnd) >= today) || // ongoing holiday
          sorted.find((h) => new Date(h.dateStart) > today) || // next upcoming
          sorted[sorted.length - 1]; // last past one as fallback

        setHolidayInfo(selected || null);
      } catch (error) {
        console.error("Error fetching holiday info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidayData();
  }, [collectionName]);

  if (loading) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm"
        style={{
          backgroundColor: "#fffaf5",
          fontSize: "0.85rem",
          lineHeight: 1.4,
        }}
      >
        <p className="text-muted mb-0">Loading holiday details...</p>
      </div>
    );
  }

  if (!holidayInfo) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-warning text-start shadow-sm"
        style={{
          backgroundColor: "#fffaf5",
          fontSize: "0.85rem",
          lineHeight: 1.4,
        }}
      >
        <p className="text-muted mb-0">No holiday information available today.</p>
      </div>
    );
  }

  // --- Helper functions ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(holidayInfo.dateStart);
  const end = new Date(holidayInfo.dateEnd);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Determine date label
  let dateLabel = "";
  if (start.getTime() === end.getTime()) {
    // Same-day holiday
    if (start.getTime() === today.getTime()) {
      dateLabel = "Today";
    } else if (start > today) {
      dateLabel = `This coming ${formatDate(holidayInfo.dateStart)}`;
    } else {
      dateLabel = formatDate(holidayInfo.dateStart);
    }
  } else {
    // Multi-day holiday
    if (today >= start && today <= end) {
      dateLabel = "Today (Ongoing)";
    } else if (start > today) {
      dateLabel = `This coming ${formatDate(holidayInfo.dateStart)}`;
    } else {
      dateLabel = `${formatDate(holidayInfo.dateStart)} – ${formatDate(
        holidayInfo.dateEnd
      )}`;
    }
  }

  // Format office data
  const timeStart = formatTime(holidayInfo.timeStart);
  const timeEnd = formatTime(holidayInfo.timeEnd);
  const officeStatus = holidayInfo.officeStatus || "Closed";
  const statusColor =
    officeStatus === "Open"
      ? "#28a745"
      : officeStatus === "Half Day"
      ? "#ffc107"
      : "#dc3545";

const isToday =
  new Date(holidayInfo.dateStart).toDateString() ===
  new Date().toDateString();

const operatingHours =
  timeStart && timeEnd
    ? isToday
      ? `Office Hours today: ${timeStart} – ${timeEnd}`
      : `Office Hours on ${formatDate(holidayInfo.dateStart)}: ${timeStart} – ${timeEnd}`
    : isToday
    ? `Office Hours today: 8:00 AM – 5:00 PM`
    : `Office Hours on ${formatDate(holidayInfo.dateStart)}: 8:00 AM – 5:00 PM`;

  return (
    <div
            className="px-4 py-3 border-start border-4 border-primary text-start shadow-sm"
            style={{
              backgroundColor: "#f5fbff",
              fontSize: "0.85rem",
              lineHeight: 1.4,
            }}
          >
      <p className="text-muted mb-2 fw-bold" style={{ fontSize: "0.8rem" }}>
        Holiday Update
      </p>

      <p
        className="fw-bold mb-1"
        style={{ fontSize: "1.5rem", color: "#333" }}
      >
        {holidayInfo.holidayName || "Special Non-Working Holiday"}
      </p>

      <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
        {dateLabel}
      </p>

      <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
        Posted by{" "}
        {holidayInfo.reference ? (
          <a
            href={holidayInfo.reference}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#0d6efd",
              fontWeight: "600",
            }}
          >
            {holidayInfo.postedBy || "Department of Labor and Employment"}
          </a>
        ) : (
          <strong>
            {holidayInfo.postedBy || "Department of Labor and Employment"}
          </strong>
        )}{" "}
        
      </p>

      <div className="d-flex align-items-center justify-content-between">
        {/* <p
          className="mb-2 text-muted fw-semibold"
          style={{ fontSize: "0.8rem", marginBottom: 0 }}
        >
          {operatingHours}
        </p> */}
        <p
  className="mb-2 fw-semibold"
  style={{ fontSize: "0.8rem", color: statusColor, marginBottom: 0 }}
>
  {new Date(holidayInfo.dateStart).toDateString() ===
  new Date().toDateString()
    ? `Office operation today: ${officeStatus}`
    : `Office operation on ${formatDate(holidayInfo.dateStart)}: ${officeStatus}`}
</p>

      </div>
    </div>
  );
}
