import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * BrochureViewer
 * ------------------------------------------------------------------
 * An animated, book-style brochure viewer with a realistic page-turn
 * effect, keyboard / swipe navigation, thumbnail rail, and a loading
 * sequence that preloads every page before the first reveal.
 *
 * Usage:
 *   <BrochureViewer pages={[
 *     { src: "https://...page1.jpg", label: "Welcome" },
 *     { src: "https://...page2.jpg", label: "Destinations" },
 *   ]} title="Tourism Brochure" />
 */

const DEFAULT_PAGES = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/esteem-64c71.firebasestorage.app/o/Brochure%2Ftourism%20brochure%20edited.jpg?alt=media&token=5b0ad7d9-bded-43a8-819b-3cd7d3efdc5f",
    label: "Page 1",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/esteem-64c71.firebasestorage.app/o/Brochure%2Ftourism%20brochure%20edited%20(2).jpg?alt=media&token=d3d8a593-7a14-41fc-bb2a-61103d2e9f4e",
    label: "Page 2",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/esteem-64c71.firebasestorage.app/o/Brochure%2Ftourism%20brochure%20edited%20(1).jpg?alt=media&token=3a6116e8-e1b9-4bb8-90db-be20cb3b376d",
    label: "Page 3",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/esteem-64c71.firebasestorage.app/o/Brochure%2Ftourism%20brochure%20edited%20(3).jpg?alt=media&token=44958e0b-893c-47ce-bd7c-c515039307e7",
    label: "Page 4",
  },
];

function useImagePreloader(pages) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [loadedSrcs, setLoadedSrcs] = useState(() => new Set());

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    if (!pages || pages.length === 0) {
      setReady(true);
      return;
    }

    setProgress(0);
    setReady(false);

    const handleOne = (src) => {
      loadedCount += 1;
      if (!isMounted) return;
      setLoadedSrcs((prev) => new Set(prev).add(src));
      setProgress(Math.round((loadedCount / pages.length) * 100));
      if (loadedCount === pages.length) {
        setReady(true);
      }
    };

    pages.forEach((page) => {
      const img = new Image();
      img.onload = () => handleOne(page.src);
      img.onerror = () => handleOne(page.src);
      img.src = page.src;
    });

    return () => {
      isMounted = false;
    };
  }, [pages]);

  return { progress, ready, loadedSrcs };
}

export default function BrochureViewer({
  pages = DEFAULT_PAGES,
  title = "Tourism Brochure",
  subtitle = "Swipe, click, or use the arrow keys to turn the page",
}) {
  const { progress, ready, loadedSrcs } = useImagePreloader(pages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const flipTimeout = useRef(null);

  const total = pages.length;

  const goTo = useCallback(
    (index) => {
      if (isFlipping || index === currentIndex || index < 0 || index >= total) return;
      setDirection(index > currentIndex ? "next" : "prev");
      setIsFlipping(true);
      clearTimeout(flipTimeout.current);
      flipTimeout.current = setTimeout(() => {
        setCurrentIndex(index);
        setIsFlipping(false);
      }, 380);
    },
    [currentIndex, isFlipping, total]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => () => clearTimeout(flipTimeout.current), []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current > threshold) goPrev();
    else if (touchDeltaX.current < -threshold) goNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const currentPage = pages[currentIndex];

  return (
    <div className="bv-root">
      <div className="bv-glow" aria-hidden="true" />

      {!ready && (
        <div className="bv-loading" role="status" aria-live="polite">
          <div className="bv-loading-book">
            <div className="bv-loading-page bv-loading-page--1" />
            <div className="bv-loading-page bv-loading-page--2" />
            <div className="bv-loading-page bv-loading-page--3" />
            <div className="bv-loading-spine" />
          </div>
          <p className="bv-loading-text">Opening brochure…</p>
          <div className="bv-progress-track">
            <div
              className="bv-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="bv-progress-label">{progress}%</span>
        </div>
      )}

      <div
        className={`bv-viewer ${ready ? "bv-viewer--visible" : ""}`}
        aria-hidden={!ready}
      >
        <header className="bv-header">
          <div>
            <p className="bv-eyebrow">Digital brochure</p>
            <h2 className="bv-title">{title}</h2>
            <p className="bv-subtitle">{subtitle}</p>
          </div>
          <div className="bv-counter">
            <span className="bv-counter-current">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="bv-counter-divider" />
            <span className="bv-counter-total">
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </header>

        <div className="bv-stage">
          <button
            type="button"
            className="bv-nav bv-nav--prev"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous page"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            className="bv-book"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={[
                "bv-page-frame",
                isFlipping ? `bv-page-frame--flip-${direction}` : "",
              ].join(" ")}
              onClick={() => setZoomOpen(true)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${currentPage.label} in full screen`}
              onKeyDown={(e) => {
                if (e.key === "Enter") setZoomOpen(true);
              }}
            >
              <img
                className="bv-page-image"
                src={currentPage.src}
                alt={currentPage.label || `Page ${currentIndex + 1}`}
                draggable={false}
              />
              <div className="bv-page-sheen" />
              <div className="bv-zoom-hint">
                <ZoomIcon /> Tap to enlarge
              </div>
            </div>
          </div>

          <button
            type="button"
            className="bv-nav bv-nav--next"
            onClick={goNext}
            disabled={currentIndex === total - 1}
            aria-label="Next page"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <div className="bv-progressbar" aria-hidden="true">
          <div
            className="bv-progressbar-fill"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        <div className="bv-thumbs" role="tablist" aria-label="Brochure pages">
          {pages.map((page, index) => (
            <button
              key={page.src}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              className={`bv-thumb ${
                index === currentIndex ? "bv-thumb--active" : ""
              }`}
              onClick={() => goTo(index)}
            >
              <span className="bv-thumb-frame">
                {loadedSrcs.has(page.src) ? (
                  <img src={page.src} alt="" draggable={false} />
                ) : (
                  <span className="bv-thumb-skeleton" />
                )}
              </span>
              <span className="bv-thumb-label">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {zoomOpen && (
        <div
          className="bv-lightbox"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={currentPage.label}
        >
          <button
            className="bv-lightbox-close"
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Close full screen view"
          >
            <CloseIcon />
          </button>
          <img
            src={currentPage.src}
            alt={currentPage.label || `Page ${currentIndex + 1}`}
            className="bv-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ direction }) {
  const rotate = direction === "left" ? "rotate(180deg)" : "none";
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: rotate }}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}