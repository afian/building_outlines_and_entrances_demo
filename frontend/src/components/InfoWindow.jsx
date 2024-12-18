import React from "react";
import { InfoWindow as GInfoWindow } from "@vis.gl/react-google-maps";
import "./InfoWindow.scss";

const InfoWindow = ({ place, anchor, onCloseClick }) => {
  const { name, rating, reviewsCount, categories, address, imageUrl } = place;

  return (
    <GInfoWindow anchor={anchor} onCloseClick={onCloseClick}>
      <div className="info-window">
        <div className="info-window-content">
          {imageUrl && (
            <img src={imageUrl} alt={name} className="info-window-image" />
          )}
          <div className="info-window-details">
            <h2 className="info-window-title">{name}</h2>
            {rating && (
              <div className="info-window-rating">
                <span>{rating}</span>
                <span className="info-window-stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`star ${
                        index < Math.round(rating) ? "filled" : "unfilled"
                      }`}
                    />
                  ))}
                </span>
                <span className="info-window-reviews">({reviewsCount})</span>
              </div>
            )}
            <div className="info-window-category">
              {categories.split(",").map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="info-window-address">{address}</div>
      </div>
    </GInfoWindow>
  );
};

export default InfoWindow;
