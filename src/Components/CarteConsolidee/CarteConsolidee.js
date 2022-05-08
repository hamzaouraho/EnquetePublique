import React, { useEffect, useRef, useState } from "react";
import "./CarteConsolidee.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import axios from "axios";

export default function CarteConsolidee() {
  const [idEtude, setidEtude] = useState();
  const [etudes, setetudes] = useState([]);
  const mapRef = useRef(null);
  const url = "http://127.0.0.1:8000/api/situations";
  const graphicsLayer = new GraphicsLayer();

  const mapLayer = new Map({
    basemap: "satellite",
    layers: [graphicsLayer],
  });

  const createGraphic = (graphic, color) => {
    const blob2 = new Blob([graphic], {
      type: "application/json",
    });
    const url2 = URL.createObjectURL(blob2);
    const geojsonlayer2 = new GeoJSONLayer({
      url: url2,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: hexToRgb(color),
          outline: {
            width: 1.5,
            color: "red",
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
      popupTemplate: {
        title: "Commentaire",
        content: "<h4> Commentaire : {commentaire} </h4>  ",
      },
    });
    // mapLayer.add(geojsonlayer);
    mapLayer.add(geojsonlayer2);
  };
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
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // color += "c9";
    return color;
  }
  let content = null;
  let hamza = 3;
  useEffect(() => {
    axios.get(url).then((res) => {
      res.data.map(
        (a) =>
          createGraphic(a["situation"], getRandomColor()) ||
          console.log(getRandomColor())
      );
      //   console.log(res.data[0]["situation"]);
      //   createGraphic(res.data[0]["situation"]);
      //   console.log(res);
    });
    axios.get("http://127.0.0.1:8000/api/etudes").then((res) => {
      res.data.map(
        (a) =>
          console.log("etude 1 : " + etudes) ||
          setetudes(
            (last) => [...last, a.titre]
            // () => {
            //   console.log("etude 2 : ");
            // }
          )
      );
      //   console.log("test : " + tab);
      content = etudes
        ? etudes.map((etude) => <option value="1">etude</option>)
        : console.log("error in axios get etudes content");
      //   setetudes(res.data);
    });
    // etudes ? console.log("etude : " + etudes) : console.log("");
    hamza = 2;
    const view = new MapView({
      container: mapRef.current,
      map: mapLayer,
      center: [-7.614392, 33.582764],
      zoom: 11,
    });
  }, [url, hamza]);
  //   etudes ? console.log("etude : " + etudes) : console.log("");
  //   tab ? console.log("etude : " + tab) : console.log("");
  hamza = 1;
  return (
    <>
      <div className="divBox">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "25px",
          }}
        >
          <div style={{ width: "500px" }}>
            <select class="form-select" aria-label="Default select example">
              <option defaultValue>Etudes...</option>
              {etudes ? <option value="2">{etudes}</option> : console.log()}
            </select>
          </div>
        </div>
        <div>
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
      </div>
    </>
  );
}
