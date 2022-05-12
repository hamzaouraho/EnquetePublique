import React, { useEffect, useRef, useState } from "react";
import "./CarteConsolidee.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { AiFillFilter } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import axios from "axios";
import { exportPDF } from "@progress/kendo-drawing";
import ihamzaCV from "./cvPhoto.png";
import logo from "./logo.png";

export default function CarteConsolidee() {
  const [etudes, setetudes] = useState();
  const [selectedLayer, setselectedLayer] = useState("");
  const [showFilter, setshowFilter] = useState(false);
  const [NomCitoyen, setNomCitoyen] = useState("");
  const [TFCitoyen, setTFCitoyen] = useState("");
  const [CommentaireCitoyen, setCommentaireCitoyen] = useState("");
  const [exportData, setexportData] = useState("");
  const mapRef = useRef(null);
  const [url, seturl] = useState("http://127.0.0.1:8000/api/situations");
  const graphicsLayer = new GraphicsLayer();
  const pdfExportComponent = React.useRef(null);
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
    let urldata = "";
    urldata = "http://127.0.0.1:8000/api/situations/" + id;
    MapLayers.removeAll();
    // mapLayer.removeAll();
    // console.log("url : " + urldata);
    const tab = [];
    console.log("salam : " + id);
    setexportData("");
    axios.get(urldata).then((res) => {
      res.data
        .filter((a) => {
          console.log("a.nom.toLowerCase() : " + a.nom.toLowerCase() + ", ");
          if (TFCitoyen == "" && CommentaireCitoyen == "" && NomCitoyen == "") {
            return a;
          } else if (
            a.nom.toLowerCase().includes(NomCitoyen.toLowerCase()) &&
            a.tf.toLowerCase().includes(TFCitoyen.toLowerCase()) &&
            a.commentaire
              .toLowerCase()
              .includes(CommentaireCitoyen.toLowerCase())
          ) {
            // console.log("etude.commune : " + etude.commune);
            return a;
          }
        })
        .map((a) =>
          createGraphic(a["situation"], getRandomColor()) ||
          JSON.parse(a["situation"]).features.map((graphic) => {
            graphic.geometry.coordinates[0].map(
              (coordonne) =>
                console.log("coordonnee : " + coordonne) || tab.push(coordonne)
            );
          }) ||
          a
            ? JSON.stringify(
                JSON.parse(a.situation).features.map((a) =>
                  setexportData((oldArray) =>
                    oldArray != ""
                      ? oldArray + "," + JSON.stringify(a)
                      : '{"type": "FeatureCollection","features": [' +
                        JSON.stringify(a)
                  )
                )
              )
            : null
        );
      setexportData((oldArray) => oldArray + "]}");
      //   console.log("res.data : " + JSON.stringify(res.data));
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
  console.log("salam bro cv : " + exportData);
  //   etudes ? console.log("etude : " + etudes) : console.log("");
  //   tab ? console.log("etude : " + tab) : console.log("");
  const exportFile = () => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(
      new Blob([JSON.parse(JSON.stringify(exportData))], {
        type: "text/plain",
      })
    );
    element.download = "File.geojson";
    document.body.appendChild(element);
    element.click();
  };
  const exportPDFWithMethod = () => {
    let element = document.querySelector(".k-grid") || document.body;
    savePDF(element, {
      paperSize: "A4",
    });
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <>
      <div className="divBox">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            margin: "25px 25px 5px 25px",
          }}
        >
          <div style={{ width: "500px", display: "flex" }}>
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
                : null}
            </select>
            <button
              className="iconButton"
              onClick={() => setshowFilter(!showFilter)}
            >
              <AiFillFilter color="dark" size="1rem" />
            </button>
            <button className="iconButton" onClick={exportFile}>
              <FaFileExport color="dark" size="1.2rem" />
            </button>
            {/* <AiFillFilter></AiFillFilter> */}
          </div>
          {showFilter ? (
            <div style={{ marginTop: "18px" }}>
              <div class="form-row ">
                <div class="form-group col-md-4 col-sm-6">
                  <label for="input4">Nom</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nom"
                    onChange={(e) =>
                      setNomCitoyen(e.target.value) ||
                      showLayerById(selectedLayer)
                    }
                  />
                </div>
                <div class="form-group col-md-4 col-sm-6">
                  <label for="input4">Titre Foncier</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="TF"
                    onChange={(e) =>
                      setTFCitoyen(e.target.value) ||
                      showLayerById(selectedLayer)
                    }
                  />
                </div>
                <div class="form-group col-md-4 col-sm-6">
                  <label for="input4">Commentaire</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Commentaire"
                    onChange={(e) =>
                      setCommentaireCitoyen(e.target.value) ||
                      showLayerById(selectedLayer)
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
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

      <PDFExport ref={pdfExportComponent} paperSize="A4">
        <div
          style={{
            margin: "5px 100px",
          }}
        >
          <img src={logo} />
        </div>
        <div
          style={{
            margin: "5px 100px",
            fontSize: "8px",
          }}
        >
          <div>
            <div>
              <table
                style={{
                  tableLayout: "fixed",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <tr style={{ backgroundColor: "#d9d9d9", color: "white" }}>
                  <th colspan="4">Requete N°</th>

                  <th colspan="8">Situation</th>
                </tr>
                <tr>
                  <td colspan="2">Page 3 & 3</td>
                  <td colspan="2">MR. A. BOUCHOUIREB</td>
                  <td rowspan="7">
                    P A - E DI TI O N E N Q U E T E P U B LI Q U E-
                  </td>
                  <td rowspan="7" colspan="7">
                    <img src={ihamzaCV} />
                  </td>
                </tr>
                <tr>
                  <td colspan="4">T.F. 187100/12</td>
                </tr>
                <tr>
                  <td colspan="4">
                    •S’oppose à la voie d’aménagement «LA09». •S’oppose au tracé
                    du TGV.
                  </td>
                </tr>
                <tr>
                  <td colspan="4" rowspan="4"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </PDFExport>
      <button onClick={exportPDFWithComponent}>Export pdf </button>
    </>
  );
}
