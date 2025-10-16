import React, { useEffect, useState } from "react";
import { db } from "../config/firebase"; // adjust path to your firebase.js
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function FacebookLiveStream() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [streamData, setStreamData] = useState(null);

  useEffect(() => {
    // Subscribe to Firestore doc (real-time updates)
    const unsub = onSnapshot(doc(db, "stream", "currentStream"), (docSnap) => {
      if (docSnap.exists()) {
        setStreamData(docSnap.data());
      } else {
        setStreamData(null);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Load Facebook SDK when video URL changes
    if (streamData?.videoUrl) {
      if (!document.getElementById("facebook-jssdk")) {
        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src =
          "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
        document.body.appendChild(script);
      } else {
        if (window.FB) window.FB.XFBML.parse();
      }
    }
  }, [streamData?.videoUrl]);

  const handleError = () => {
    setIsAvailable(false);
  };

  // Hide if inactive or unavailable
  if (!streamData?.active || !isAvailable) return null;

  return (
    <div className="text-center my-5">
      
                            <h2 className="custom-section-title text-center my-3">
                            {streamData.title}
                        </h2>
                <p className="home-section-subtitle mb-1">{streamData.subtitle}</p>
      <div className="video-wrapper">
        <div
          className="fb-video"
          data-href={streamData.videoUrl}
          data-allowfullscreen="true"
          onError={handleError}
        ></div>
      </div>
    </div>
  );
}
