import React, { useEffect, useState } from "react";

const FacebookFeed = ({ pageUrl }) => {
      const [width, setWidth] = useState(350); // default for small screens

  useEffect(() => {
        // Adjust width based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 1200) setWidth(800); // large screens
      else if (window.innerWidth >= 768) setWidth(600); // tablets
      else setWidth(350); // mobile
    };

    handleResize(); // set initial width
        window.addEventListener("resize", handleResize);

    // Load SDK only once
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Wait until FB SDK is ready, then parse XFBML
    const interval = setInterval(() => {
      if (window.FB && window.FB.XFBML) {
        window.FB.XFBML.parse();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pageUrl]);

  return (
    <div
      style={{
        height: "600px",
        overflowY: "auto",
        borderRadius: "10px",
        border: "1px solid #ccc",
        padding: "10px",
        width: "100%",
        background: "#fff",
      }}
    >
      <div
        className="fb-page"
        data-href={pageUrl}
        data-tabs="timeline"
        data-width={width}
        data-height="600"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Facebook Page</a>
        </blockquote>
      </div>
    </div>
  );
};

export default FacebookFeed;
