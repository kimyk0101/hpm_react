import React, { useRef } from "react";
import "../../css/DefaultSlider.css";

const DefaultSlider = ({ children, visibleCount = 3 }) => {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    const containerWidth = sliderRef.current.offsetWidth;
    const cardWidth = containerWidth / visibleCount;
    const scrollValue = cardWidth * visibleCount;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -scrollValue : scrollValue,
      behavior: "smooth",
    });
  };

  const cardWidthPercent = `${100 / visibleCount}%`;

  return (
    <div className="slider-wrapper">
      <button className="slider-btn left" onClick={() => scroll("left")}>
        {"<"}
      </button>

      <div className="slider-track" ref={sliderRef}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${cardWidthPercent}`,
              maxWidth: cardWidthPercent,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      <button className="slider-btn right" onClick={() => scroll("right")}>
        {">"}
      </button>
    </div>
  );
};

export default DefaultSlider;
