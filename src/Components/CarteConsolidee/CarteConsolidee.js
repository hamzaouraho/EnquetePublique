import React, { useEffect, useRef, useState } from "react";
import "./CarteConsolidee.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { AiFillFilter } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import axios from "axios";
import ihamzaCV from "./cvPhoto.png";
import * as htmlToImage from "html-to-image";
import PDFComponent from "../pdf/PDFComponent";
// import testExportpdf from "../pdf/Testtest";
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
  const [exportpdfData, setexportpdfData] = useState([]);
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
  const createGraphicForPA = (graphic, color) => {
    // console.log("graphic : " + graphic);
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
            width: 0.5,
            color: "black",
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
      // popupTemplate: {
      //   title: "Commentaire Citoyen",
      //   content:
      //     "<h4> Nom : $feature.name </h4>\n<h4> Commentaire : {commentaire} </h4>  ",
      // },
    });
    // mapLayer.add(geojsonlayer);
    MapLayers.add(geojsonlayer2);
  };

  const createGraphic = (graphic, color) => {
    // console.log("graphic : " + graphic);
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
            width: 2.5,
            color: "red",
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
      popupTemplate: {
        title: "Commentaire Citoyen",
        content:
          "<h4> Nom : {name} </h4>\n<h4> Commentaire : {commentaire} </h4>  ",
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
  let colorhex = "";
  let colors = [
    "rgba(30, 122, 46, 0.41)",
    "rgba(15 ,136 ,251, 0.41)",
    "rgba(241, 253, 13, 0.41)",
  ];
  const getColor = (i) => {
    if (i > 2) {
      // console.log("random color");
      colorhex = hexToRgba(getRandomColor());
    } else {
      colorhex = colors[i];
    }
    return colorhex;
  };
  const showLayerById = (id) => {
    ////////////// call PA Layers
    let statesLabelClass = new LabelClass();
    let Layers = [];
    const tabl = [];
    axios.get("http://127.0.0.1:8000/api/etudes/" + id).then((res) => {
      // console.log("res.data : " + JSON.stringify(res.data[0].perimetre));
      if (res.data[0].perimetre.includes("%pablo144%")) {
        Layers = res.data[0].perimetre.split("%pablo144%");
      } else {
        Layers = res.data[0].perimetre;
      }
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
            // popupTemplate: {
            //   title: "Commentaire",
            //   content: "Magnitude {fill},,$feature.fill  hit {nom} ",
            // },
          });

          geojsonlayer2.labelingInfo = [statesLabelClass];
          MapLayers.add(geojsonlayer2);
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
          graphic.geometry.coordinates[0].map((coordonne) =>
            tab.push(coordonne)
          );
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
              color: hexToRgb(getRandomColor()),
              outline: {
                width: 1.5,
                color: "black",
              },
              style: "solid",
              // opacity: 0.33,
            },
          },
          // popupTemplate: {
          //   title: "Commentaire",
          //   content: "Magnitude {fill},,$feature.fill  hit {nom} ",
          // },
        });

        geojsonlayer2.labelingInfo = [statesLabelClass];
        MapLayers.add(geojsonlayer2);
      }
      Promise.all(tabl).then(() => {
        viewGlob.goTo({
          center: [tabl],
        });
      });
    });
    ////////////////////
    let urldata = "";
    urldata = "http://127.0.0.1:8000/api/situations/" + id;
    MapLayers.removeAll();
    // mapLayer.removeAll();
    // console.log("url : " + urldata);
    const tab = [];
    // console.log("salamo3alikom : " + id);
    setexportData("");
    // axios.get("http://127.0.0.1:8000/api/etudes/" + id).then((res) => {
    //   createGraphic(res.data[0].perimetre, getRandomColor());
    //   // console.log("toto : " + res.data[0].perimetre);
    // });
    axios.get(urldata).then((res) => {
      res.data
        .filter((a) => {
          // console.log("a.nom.toLowerCase() : " + JSON.stringify(a) + ", ");
          setexportpdfData([]);
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
          // console.log("aaaaa : " + JSON.stringify(a)) ||
          setexportpdfData((last) => [
            ...last,
            {
              nom: a.nom,
              tf: a.tf,
              page: a.page,
              commentaire: a.commentaire,
              image: a.image,
            },
          ]) ||
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
                      : '{"type": "FeatureCollection","name": "' +
                        a.nom +
                        '","features": [' +
                        JSON.stringify(a)
                  )
                )
              )
            : null
        );
      setexportData((oldArray) => oldArray + "]}");
      //   console.log("res.data : " + JSON.stringify(res.data));
      //   console.log("tab : " + tab);
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
      // res.data.map((a) => console.log("etude 1 : " + JSON.stringify(a.titre)));
      //   console.log("res.data : " + JSON.stringify(res.data));
      setetudes(res.data);
    });
    // etudes ? console.log("etude : " + etudes) : console.log("");
    // 20.866019, -17.02941;
    // 32.522435, -1.028146;
    // 35.916308, -5.485227;
    const view = new MapView({
      container: mapRef.current,
      map: MapLayers,
      center: [-8.247694, 29.446916],
      zoom: 5.4,
    });
    const tableau = [];
    tableau.push(20.866019);
    tableau.push(-17.02941);
    tableau.push(32.522435);
    tableau.push(-1.028146);
    tableau.push(35.916308);
    tableau.push(-5.485227);
    view.goTo({
      center: [tableau],
    });
    setviewGlob(view);
  }, [url]);
  // console.log("salam bro cv : " + JSON.stringify(exportpdfData[0]));
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
      forcePageBreak: ".page-break",
    });
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };
  const domEl = useRef(null);

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domEl.current);

    // download image
    const link = document.createElement("a");
    link.download = "html-to-img.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      <div>
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
            <div style={{ width: "800px", display: "flex" }}>
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
              {/* <div class="text-center" style={{ margin: "20px" }}> */}
              {/* <button
              type="button"
              style={{ margin: "0px 20px" }}
              class="btn btn-primary"
              onClick={downloadImage}
            >
              Download Image
            </button> */}
              <button
                type="button"
                class="btn btn-primary"
                onClick={exportPDFWithComponent}
                style={{
                  margin: "0px 20px",
                  color: "#fff",
                  backgroundColor: "#97afd2",
                  borderColor: "#97afd2",
                }}
              >
                Export pdf
              </button>
              {/* </div> */}
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
        <div
          style={{
            position: "absolute",
            left: "-10000px",
            top: 0,
          }}
        >
          <div
            className="divBox"
            style={{ marginTop: "100px", width: "1638px" }}
          >
            <PDFExport
              ref={pdfExportComponent}
              forcePageBreak=".page-break"
              paperSize="A4"
            >
              {/* <div
            style={{
              margin: "5px 50px",
              display: "none",
            }}
          >
            <img className="imglogo" src={logo} />
          </div> */}
              <div
                style={{
                  margin: "5px 50px",
                  fontSize: "8px",
                }}
              >
                <div>
                  <div>
                    {exportpdfData
                      ? exportpdfData.map((a, index) => (
                          <PDFComponent
                            data={a}
                            nbrpage={exportpdfData.length}
                            indexNbr={{ index }}
                          />
                        ))
                      : console.log("error :" + exportpdfData)}
                    {/* {exportpdfData ? <pdf /> : null} */}
                    {/* {exportpdfData.map((a) => {
                <pdf />;
                
              })} */}
                  </div>
                </div>
              </div>
            </PDFExport>
          </div>
        </div>
      </div>

      {/* <testExportpdf /> */}
    </>
  );
}
