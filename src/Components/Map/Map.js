import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import React, { useEffect, useRef } from "react";
import "./Map.css";
import said from "./../Shapefiles/shapefile";
import { styled } from "@mui/material/styles";

const MyMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("inside");
    const graphicsLayer = new GraphicsLayer();
    const mapLayer = new Map({
      basemap: "satellite",
      layers: [graphicsLayer],
    });
    const view = new MapView({
      container: mapRef.current,
      map: mapLayer,
      center: [-7.614392, 33.582764],
      zoom: 11,
    });
    // console.log(JSON.stringify(said, null, 4));
    const blob = new Blob([JSON.stringify(said)], {
      type: "application/json",
    });

    // URL reference to the blob
    const url = URL.createObjectURL(blob);
    const geojsonlayer = new GeoJSONLayer({
      url: url,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 255, 255, 0.2],
          outline: {
            width: 1.5,
            color: [255, 255, 255],
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
    });
    mapLayer.add(geojsonlayer);
  });
  console.log("outside 2");

  return (
    <>
      <div class="map-container">
        <div class="map-frame">
          <div ref={mapRef} id="map"></div>
        </div>
      </div>
    </>
  );
};
export default MyMap;
