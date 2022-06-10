import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";

import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import said from "./../Shapefiles/shapefile";
import { styled } from "@mui/material/styles";
import { flexbox } from "@mui/system";

const MyMap = (props) => {
  const mapRef = useRef(null);
  // const [geojsonFile, setgeojsonFile] = useState("");
  let Layers = [];
  console.log(props.perimetre[0].perimetre.split("%pablo144%"));

  if (props.perimetre[0].perimetre.includes("%pablo144%")) {
    Layers = props.perimetre[0].perimetre.split("%pablo144%");
  } else {
    Layers = props.perimetre[0].perimetre;
  }
  // Layers[0] ? console.log(JSON.parse(Layers[0]).name) : console.log();
  // console.log(props.perimetre[0].perimetre);
  const [colorBackground, setcolorBackground] = useState("");
  const [nomLabel, setnomLabel] = useState("");
  // alert(props.perimetre);
  // setgeojsonFile(props.perimetre);
  // console.dir("kiki " + JSON.stringify(props.perimetre));
  let colorhex = "";
  let colors = [
    "rgba(30, 122, 46, 0.41)",
    "rgba(15 ,136 ,251, 0.41)",
    "rgba(241, 253, 13, 0.41)",
  ];
  const getColor = (i) => {
    if (i > 2) {
      console.log("random color");
      colorhex = hexToRgba(getRandomColor());
    } else {
      colorhex = colors[i];
    }
    return colorhex;
  };
  const test =
    '{"type": "FeatureCollection","features": [{"type": "Feature","properties": {"titre": "aa", "commentaire" : "aaa"},"geometry": {"type": "Polygon","coordinates": [[[-7.369564738805743, 33.67163797334012],[-7.4019133529917465, 33.61066211913657],[-7.45867606227401, 33.673161810241695],[-7.369564738805743, 33.67163797334012]]]}},{"type": "Feature","properties": {"titre": "azaz", "commentaire" : "azazazaz"},"geometry": {"type": "Polygon","coordinates": [[[-7.373226834210898, 33.69296931112196],[-7.369564738805743, 33.641663581252686],[-7.441586199897581, 33.67925691398977],[-7.373226834210898, 33.69296931112196]]]}}]}';

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 0.6,
        }
      : null;
  }
  function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //
    return result
      ? "rgba(" +
          parseInt(result[1], 16) +
          "," +
          parseInt(result[2], 16) +
          "," +
          parseInt(result[3], 16) +
          ",0.41)"
      : null;
  }
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // color += "c9";
    return color;
  }
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

    let renderer = {};
    // tab ? console.log("tab ::" + tab) : console.log();
    let statesLabelClass = new LabelClass();
    // console.log("peri : " + JSON.parse(props.perimetre[0].perimetre).name);

    // URL reference to the blob
    // const url = URL.createObjectURL(blob);
    // console.log(Array.isArray(Layers));
    if (Array.isArray(Layers)) {
      Layers.map((layer, index) => {
        if (JSON.parse(layer).name == "ZONAGE") {
          statesLabelClass = new LabelClass({
            labelExpressionInfo: { expression: "$feature.NAME" },
            symbol: {
              type: "text",
              color: [255, 255, 255, 255], // white
              font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
              haloColor: [0, 0, 0, 255], // black
              haloSize: 1,
            },
          });
        } else if (JSON.parse(layer).name == "EQUIPEMENTS") {
          statesLabelClass = new LabelClass({
            labelExpressionInfo: { expression: "$feature.NOM" },
            symbol: {
              type: "text",
              color: [255, 255, 255, 255], // white
              font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
              haloColor: [0, 0, 0, 255], // black
              haloSize: 1,
            },
          });
        } else {
          statesLabelClass = new LabelClass({
            labelExpressionInfo: { expression: "$feature.nom" },
            symbol: {
              type: "text",
              color: [255, 255, 255, 255], // white
              font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
              haloColor: [0, 0, 0, 255], // black
              haloSize: 1,
            },
          });
        }
        JSON.parse(layer).features.map((graphic) => {
          graphic.geometry.coordinates[0].map((coordonne) =>
            tab.push(coordonne)
          );
        });
        const blob2 = new Blob([layer], {
          type: "application/json",
        });
        const url2 = URL.createObjectURL(blob2);
        const geojsonlayer2 = new GeoJSONLayer({
          url: url2,
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              // color: `${generateColors()}`,
              color: getColor(index),
              outline: {
                width: 1.5,
                color: "black",
              },
              style: "solid",
              // opacity: 0.33,
            },
          },
          popupTemplate: {
            title: "Commentaire",
            content: "Magnitude {fill},,$feature.fill  hit {nom} ",
          },
        });

        geojsonlayer2.labelingInfo = [statesLabelClass];
        mapLayer.add(geojsonlayer2);
      });
    } else {
      if (JSON.parse(Layers).name == "ZONAGE") {
        statesLabelClass = new LabelClass({
          labelExpressionInfo: { expression: "$feature.NAME" },
          symbol: {
            type: "text",
            color: [255, 255, 255, 255], // white
            font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
            haloColor: [0, 0, 0, 255], // black
            haloSize: 1,
          },
        });
      } else if (JSON.parse(Layers).name == "EQUIPEMENTS") {
        statesLabelClass = new LabelClass({
          labelExpressionInfo: { expression: "$feature.NOM" },
          symbol: {
            type: "text",
            color: [255, 255, 255, 255], // white
            font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
            haloColor: [0, 0, 0, 255], // black
            haloSize: 1,
          },
        });
      } else {
        statesLabelClass = new LabelClass({
          labelExpressionInfo: { expression: "$feature.nom" },
          symbol: {
            type: "text",
            color: [255, 255, 255, 255], // white
            font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
            haloColor: [0, 0, 0, 255], // black
            haloSize: 1,
          },
        });
      }
      JSON.parse(Layers).features.map((graphic) => {
        graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
      });
      const blob2 = new Blob([Layers], {
        type: "application/json",
      });
      const url2 = URL.createObjectURL(blob2);
      const geojsonlayer2 = new GeoJSONLayer({
        url: url2,
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            // color: `${generateColors()}`,
            color: getColor(0),
            outline: {
              width: 1.5,
              color: "black",
            },
            style: "solid",
            // opacity: 0.33,
          },
        },
        popupTemplate: {
          title: "Commentaire",
          content: "Magnitude {fill},,$feature.fill  hit {nom} ",
        },
      });

      geojsonlayer2.labelingInfo = [statesLabelClass];
      mapLayer.add(geojsonlayer2);
    }
    Promise.all(tab).then(() => {
      view.goTo({
        center: [tab],
      });
    });

    // mapLayer.add(geojsonlayer2);
    // if (props.perimetre) {
    //   mapLayer.add(geojsonlayer2);
    // }
  }, [Layers]);
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
