import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

export default function UpcomingEventHighlight({
  collectionName = "incomingEvents",
}) {
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (snapshot.empty) {
          setEventInfo(null);
          return;
        }

        const now = new Date();

        // Map and filter events (exclude "compilation")
        const events = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (e) =>
              e.dateTimeStart &&
              !(
                (e.category &&
                  e.category.toLowerCase().includes("compilation")) ||
                (e.title && e.title.toLowerCase().includes("compilation"))
              )
          );

        if (events.length === 0) {
          setEventInfo(null);
          return;
        }

        // Sort by start date
        const sorted = events.sort(
          (a, b) =>
            new Date(a.dateTimeStart).getTime() -
            new Date(b.dateTimeStart).getTime()
        );

        // Find currently ongoing or nearest upcoming event
        const selected =
          sorted.find(
            (e) =>
              new Date(e.dateTimeStart) <= now &&
              new Date(e.dateTimeEnd) >= now
          ) || sorted.find((e) => new Date(e.dateTimeStart) > now);

        setEventInfo(selected || null);
      } catch (error) {
        console.error("Error fetching event info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [collectionName]);

  // --- Helpers ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // --- UI States ---
  if (loading) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-info shadow-sm"
        style={{ backgroundColor: "#f8fbff", fontSize: "0.85rem" }}
      >
        <p className="text-muted mb-0">Loading event details...</p>
      </div>
    );
  }

  if (!eventInfo) {
    return (
      <div
        className="px-4 py-3 border-start border-4 border-info shadow-sm"
        style={{ backgroundColor: "#f8fbff", fontSize: "0.85rem" }}
      >
        <p className="text-muted mb-0">No upcoming events found.</p>
      </div>
    );
  }

  // --- Determine label ---
  const now = new Date();
  const start = new Date(eventInfo.dateTimeStart);
  const end = new Date(eventInfo.dateTimeEnd);
  const isOngoing = now >= start && now <= end;
  const isToday = start.toDateString() === now.toDateString();

  let dateLabel = "";
  if (isOngoing) {
    dateLabel = "Ongoing today";
  } else if (isToday) {
    dateLabel = "Office today";
  } else if (start > now) {
    dateLabel = `This coming ${formatDate(eventInfo.dateTimeStart)}`;
  } else {
    dateLabel = `${formatDate(eventInfo.dateTimeStart)} – ${formatDate(
      eventInfo.dateTimeEnd
    )}`;
  }

  return (
    <div
      onClick={() => navigate(`/read/incomingEvents/${eventInfo.id}`)}
      className="px-4 py-3 border-start border-4 border-secondary text-start shadow-sm"
      style={{
        backgroundColor: "#f5fbff",
        fontSize: "0.85rem",
        lineHeight: 1.4,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#e9f5ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#f5fbff")}
    >
      <p className="text-muted mb-2 fw-bold" style={{ fontSize: "0.8rem" }}>
        Event Update
      </p>

      <p className="fw-bold mb-2" style={{ fontSize: "1.3rem" }}>
        {eventInfo.title || "Upcoming Event"}
      </p>

      {eventInfo.category && (
        <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
          {eventInfo.category}
        </p>
      )}

      <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
        {dateLabel}
      </p>
    </div>
  );
}
