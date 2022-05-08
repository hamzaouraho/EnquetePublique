import React, { useEffect, useRef, useState } from "react";
import "./CarteConsolidee.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import axios from "axios";

export default function CarteConsolidee() {
  const [etudes, setetudes] = useState();
  const [selectedLayer, setselectedLayer] = useState("");
  const mapRef = useRef(null);
  const [url, seturl] = useState("http://127.0.0.1:8000/api/situations");
  const graphicsLayer = new GraphicsLayer();
  const [MapLayers, setMapLayers] = useState(
    new Map({
      basemap: "satellite",
      layers: [graphicsLayer],
    })
  );
  const [viewGlob, setviewGlob] = useState(new MapView());

  //   const mapLayer = new Map({
  //     basemap: "satellite",
  //     layers: [graphicsLayer],
  //   });

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
    MapLayers.add(geojsonlayer2);
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
  const showLayerById = (id) => {
    // etudes
    //   ? etudes
    //       .filter((a) => {
    //         if (a.id == selectedLayer) {
    //           return a;
    //         }
    //       })
    //       .map((a) => {
    //         console.log("yoyo : " + JSON.stringify(a.perimetre));
    //       })
    //   : console.log();
    let urldata = "http://127.0.0.1:8000/api/situations/" + id;
    MapLayers.removeAll();
    // mapLayer.removeAll();
    console.log("url : " + urldata);
    const tab = [];
    axios.get(urldata).then((res) => {
      res.data.map(
        (a) =>
          createGraphic(a["situation"], getRandomColor()) ||
          JSON.parse(a["situation"]).features.map((graphic) => {
            graphic.geometry.coordinates[0].map((coordonne) =>
              tab.push(coordonne)
            );
          })
      );
      console.log("tab : " + tab);
      viewGlob.goTo({
        center: [tab],
        // zoom: 13,
      });
      //   console.log(res.data[0]["situation"]);
      //   createGraphic(res.data[0]["situation"]);
      //   console.log(res);
    });
    // console.log("url : " + url);
  };

  useEffect(() => {
    setMapLayers(MapLayers);
    showLayerById("");

    // MapLayers.removeAll();
    axios.get("http://127.0.0.1:8000/api/etudes").then((res) => {
      res.data.map((a) => console.log("etude 1 : " + JSON.stringify(a.titre)));
      //   console.log("res.data : " + JSON.stringify(res.data));
      setetudes(res.data);
    });
    // etudes ? console.log("etude : " + etudes) : console.log("");

    const view = new MapView({
      container: mapRef.current,
      map: MapLayers,
      center: [-7.614392, 33.582764],
      zoom: 11,
    });
    setviewGlob(view);
  }, [url]);
  //   etudes ? console.log("etude : " + etudes) : console.log("");
  //   tab ? console.log("etude : " + tab) : console.log("");

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
            {console.log("selectedTitle : " + selectedLayer)}
            <select
              value={selectedLayer}
              onChange={(e) =>
                showLayerById(e.target.value) ||
                setselectedLayer(e.target.value)
              }
              class="form-select"
            >
              <option key="" value="">
                Toutes les Etudes
              </option>
              {etudes
                ? etudes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.titre}
                    </option>
                  ))
                : console.log("walo")}
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
