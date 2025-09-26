import React, { useEffect, useState } from "react";

export default function FacebookLiveStream({ videoUrl }) {
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Load Facebook SDK
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
      document.body.appendChild(script);
    } else {
      if (window.FB) window.FB.XFBML.parse(); // re-parse for hot reload
    }
  }, []);

  const handleError = () => {
    setIsAvailable(false);
  };

  if (!isAvailable) return null;

  return (
    <div className="text-center my-4">
      <div className="video-wrapper">
        <div
          className="fb-video"
          data-href={videoUrl}
          data-allowfullscreen="true"
          onError={handleError}
        ></div>
      </div>
    </div>
  );
}
