import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import said from "./../Shapefiles/shapefile";
import { styled } from "@mui/material/styles";
import { flexbox } from "@mui/system";

const MyMap = (props) => {
  const mapRef = useRef(null);
  // const [geojsonFile, setgeojsonFile] = useState("");
  let hamza = props.perimetre;
  // alert(props.perimetre);
  // setgeojsonFile(props.perimetre);
  // console.dir("kiki " + JSON.stringify(props.perimetre));

  const test =
    '{"type": "FeatureCollection","features": [{"type": "Feature","properties": {"titre": "aa", "commentaire" : "aaa"},"geometry": {"type": "Polygon","coordinates": [[[-7.369564738805743, 33.67163797334012],[-7.4019133529917465, 33.61066211913657],[-7.45867606227401, 33.673161810241695],[-7.369564738805743, 33.67163797334012]]]}},{"type": "Feature","properties": {"titre": "azaz", "commentaire" : "azazazaz"},"geometry": {"type": "Polygon","coordinates": [[[-7.373226834210898, 33.69296931112196],[-7.369564738805743, 33.641663581252686],[-7.441586199897581, 33.67925691398977],[-7.373226834210898, 33.69296931112196]]]}}]}';

  useEffect(() => {
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
    // const blob = new Blob([JSON.stringify(said)], {
    //   type: "application/json",
    // });
    const tab = [];
    JSON.parse(props.perimetre[0].perimetre).features.map((graphic) => {
      graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
    });
    tab ? console.log("tab ::" + tab) : console.log();
    const blob2 = new Blob([props.perimetre[0].perimetre], {
      type: "application/json",
    });
    Promise.all(tab).then(() => {
      view.goTo({
        center: [tab],
      });
    });

    // URL reference to the blob
    // const url = URL.createObjectURL(blob);
    const url2 = URL.createObjectURL(blob2);
    // const geojsonlayer = new GeoJSONLayer({
    //   url: url,
    //   renderer: {
    //     type: "simple",
    //     symbol: {
    //       type: "simple-fill", // autocasts as new SimpleFillSymbol()
    //       color: [255, 255, 255, 0.2],
    //       outline: {
    //         width: 1.5,
    //         color: [255, 255, 255],
    //       },
    //       style: "solid",
    //       // opacity: 0.33,
    //     },
    //   },
    // });
    const geojsonlayer2 = new GeoJSONLayer({
      url: url2,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 255, 255, 0.2],
          outline: {
            width: 1.5,
            color: [255, 245, 245],
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
      popupTemplate: {
        title: "Commentaire",
        content:
          "<h4> Type : {titre}</h4>  <h4> Commentaire : {commentaire} </h4>  ",
      },
    });
    // mapLayer.add(geojsonlayer);
    // mapLayer.add(geojsonlayer2);
    if (props.perimetre) {
      mapLayer.add(geojsonlayer2);
    }
  }, [props.perimetre]);
  console.log("outside 2");

  return (
    <>
      <div
        style={{
          margin: "0px 20px ",
          // backgroundColor: "#17a2b887",
          backgroundColor: "#f1f1f1",
          padding: "5px",

          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <div style={{ margin: "30px 50px 10px 50px" }}>
          <h3>{props.perimetre[0].titre}</h3>
        </div>
        <div
          className="map-container"
          style={{
            height: "600px",
            width: "94%",
            margin: " 20px 50px 50px 50px",
          }}
        >
          <div className="map-frame">
            <div ref={mapRef} id="map"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyMap;
