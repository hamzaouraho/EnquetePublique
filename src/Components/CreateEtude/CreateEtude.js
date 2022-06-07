import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import axios from "axios";
import proj4 from "proj4";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useNavigate } from "react-router-dom";
import { React, useEffect, useState, useRef } from "react";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import { BiZoomIn } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
export default function CreateEtude() {
  const mapRef = useRef(null);
  const [MapLayers, setMapLayers] = useState(new Map());
  const [viewGlob, setviewGlob] = useState(new MapView());
  const [divLayerSHowed, setdivLayerSHowed] = useState([]);
  const [TD, setTD] = useState("");
  const [Titre, setTitre] = useState("");
  const [Intitule, setIntitule] = useState("");
  const [Commune, setCommune] = useState("");
  const [Agence, setAgence] = useState("");
  const [DateDebut, setDateDebut] = useState("");
  const [ImageURL, setImageURL] = useState("");
  const [Perimetre, setPerimetre] = useState("");
  const [colorOfLayerUploaded, setcolorOfLayerUploaded] = useState("");
  const [toshowThatDeletedLayer, settoshowThatDeletedLayer] = useState("");
  let navigate = useNavigate();
  let renderer = {};

  function hexToRgb(hex) {
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

  const tab = [];
  const convertToGeographicCoordinates = (coo) => {
    // console.log(coo);
    const lambert41 =
      "+proj=lcc +lat_1=31.73 +lat_2=34.87 +lat_0=33.3 +lon_0=-5.4 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356514.999904194 +units=m +no_defs";
    try {
      const coord = proj4(
        "+proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees",
        lambert41
      ).inverse([parseFloat(coo[0]), parseFloat(coo[1])]);
      // console.log(coord);

      return coord;
    } catch (error) {
      console.log(error);
    }
  };
  const convertLambToGeo = (geojson) => {
    // console.log("geojson : " + geojson);
    let geojsonData = JSON.parse(geojson);
    if (
      JSON.parse(geojson).features[0].geometry.coordinates[0][0][0][0] > 5000 ||
      JSON.parse(geojson).features[0].geometry.coordinates[0][0][0][0] <
        -5000 ||
      JSON.parse(geojson).features[0].geometry.coordinates[0][0][0] > 5000 ||
      JSON.parse(geojson).features[0].geometry.coordinates[0][0][0] < -5000
    ) {
      console.log("convertion is Activeted");
      JSON.parse(geojson).features.map((a, i) => {
        // console.log(a.geometry.type);
        if (a.geometry.type == "MultiPolygon") {
          a.geometry.coordinates.map((b, j) =>
            b.map((c, k) =>
              c.map(
                (d, l) => (
                  (geojsonData.features[i].geometry.coordinates[j][k][l] =
                    convertToGeographicCoordinates([d[0], d[1]])),
                  tab.push(
                    geojsonData.features[i].geometry.coordinates[j][k][l]
                  )
                )
              )
            )
          );
        } else {
          a.geometry.coordinates.map((b, j) =>
            b.map(
              (c, k) => (
                (geojsonData.features[i].geometry.coordinates[j][k] =
                  convertToGeographicCoordinates([c[0], c[1]])),
                tab.push(geojsonData.features[i].geometry.coordinates[j][k])
              )
            )
          );
        }
      });
    } else {
      JSON.parse(geojson).features.map((a, i) => {
        // console.log(a.geometry.type);
        if (a.geometry.type == "MultiPolygon") {
          a.geometry.coordinates.map((b, j) =>
            b.map((c, k) =>
              c.map((d, l) =>
                tab.push(geojsonData.features[i].geometry.coordinates[j][k][l])
              )
            )
          );
        } else {
          a.geometry.coordinates.map((b, j) =>
            b.map((c, k) =>
              tab.push(geojsonData.features[i].geometry.coordinates[j][k])
            )
          );
        }
      });
    }
    return geojsonData;
  };
  useEffect(() => {
    let unmounted = false;
    const graphicsLayer = new GraphicsLayer();
    const mapLayer = new Map({
      basemap: "satellite",
      layers: [graphicsLayer],
    });
    setMapLayers(mapLayer);
    const view = new MapView({
      container: mapRef.current,
      map: mapLayer,
      center: [-7.614392, 33.582764],
      zoom: 11,
    });
    setviewGlob(view);
    view.ui.add(document.getElementById("actions"), "top-right");
    if (!unmounted) {
    }

    return () => {
      unmounted = true;
    };
  }, []);
  const [ImportbuttonHide, setImportbuttonHide] = useState(false);
  const addActiveClass = () => {
    setImportbuttonHide(!ImportbuttonHide);
  };
  const [FileUploaded, setFileUploaded] = useState("");
  const showFileData = (e) => {
    setFileUploaded("");
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = (e) => {
      // console.log("text 2");
      const text = e.target.result;
      // console.log(text);
      setFileUploaded(text);
    };
    // console.log("FileUploaded 1 :" + FileUploaded);
    reader.readAsText(e.target.files[0]);
  };
  let statesLabelClass = new LabelClass();

  const addGeojsonFileInLayer = () => {
    // MapLayers.removeAll();

    // JSON.parse(FileUploaded).features.map((graphic) => {
    //   graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
    // });
    // console.log("JSON.parse(FileUploaded).type : " + FileUploaded);
    try {
      if (JSON.parse(FileUploaded).name == "ZONAGE") {
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
      } else if (JSON.parse(FileUploaded).name == "EQUIPEMENTS") {
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
      }
    } catch {
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
    let colors = [
      "rgba(30, 122, 46, 0.41)",
      "rgba(15 ,136 ,251, 0.41)",
      "rgba(241, 253, 13, 0.41)",
    ];
    // var numberiteration = 0;
    console.log("divLayerSHowed.length : " + divLayerSHowed.length);
    let colorhex = "";
    const getColor = (tab, i) => {
      let numberiteration = divLayerSHowed.length;
      if (divLayerSHowed.length > 2) {
        console.log("random color");
        colorhex = hexToRgb(getRandomColor());
      } else {
        colorhex = colors[numberiteration];
      }

      setcolorOfLayerUploaded(colorhex);
      setdivLayerSHowed((prev) => [
        ...prev,
        { name: hamza, color: colorhex, tab: tab },
      ]);
      return colorhex;
    };
    let hamza = JSON.stringify(convertLambToGeo(FileUploaded));

    // console.log(JSON.parse(FileUploaded).name);
    // console.log("FileUploaded : " + FileUploaded);
    const hamzaa = new GeoJSONLayer({
      url: URL.createObjectURL(new Blob([hamza], { type: "application/json" })),
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          // color: `${generateColors()}`,
          color: getColor(tab),
          outline: {
            width: 1.5,
            color: "black",
          },
          style: "solid",
          // opacity: 0.33,
        },
      },
    });
    hamzaa.labelingInfo = [statesLabelClass];
    setPerimetre(FileUploaded);
    // console.log("hamzaa : " + JSON.stringify(hamzaa));

    const addBtn = document.getElementById("add");
    Promise.all(tab).then(() => {
      MapLayers.add(hamzaa);
      viewGlob.goTo({
        center: [tab],
      });
    });
  };
  const saveButton = () => {
    // let Allpermeteres = "{";
    let Allpermeteres = "";
    divLayerSHowed.map((a, i) => {
      console.log("aaz : " + JSON.stringify(a.name));
      if (i == 0) {
        Allpermeteres = Allpermeteres + a.name;
      } else {
        Allpermeteres = Allpermeteres + "%pablo144%" + a.name;
      }
    });
    // Allpermeteres = Allpermeteres + "}";
    console.log(Titre, Intitule);
    axios
      .post("http://127.0.0.1:8090/createEtude", {
        titre: Titre,
        typeDoc: TD,
        intitule: Intitule,
        dateDebut: DateDebut,
        commune: Commune,
        agenceUrba: Agence,
        pictureUrl: "https://taamir.gov.ma/karazal/extensions/img/maroc.png",
        perimetre: Allpermeteres,
      })
      .then(
        (res) =>
          (window.location.href =
            "/enquete-pub" || console.log("reponce : " + JSON.parse(res)))
      )
      .catch(
        (err) =>
          console.log("error : " + err) ||
          (document.getElementById("buttonSave").innerHTML = "Try again")
      );
    navigate("/enquete-pub");
  };
  const hamza = () => {
    let options = {
      width: 200,
      height: 200,
    };

    viewGlob.takeScreenshot(options).then(function (screenshot) {
      let imageElement = document.getElementById("screenshotImage");
      imageElement.src = screenshot.dataUrl;
    });
  };

  const takeScreenShot = () => {
    viewGlob
      .takeScreenshot({
        area: {
          x: 0,
          y: 0,
          width: 836 - 0,
          height: 427 - 0,
        },
      })
      .then(function (screenshot) {
        // console.log("screenshot : " + JSON.stringify(screenshot.data));
        createImage(screenshot);
      });
  };
  const createImage = (screenshot) => {
    const imageData = screenshot.data;

    // create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = imageData.height;
    canvas.width = imageData.width;

    // add the image to the canvas
    context.putImageData(imageData, 0, 0);

    // add the text from the titleInput element
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText("", 20, 50);
    // console.log(canvas.toDataURL());
  };

  const deleteComment = (i) => {
    // console.log("9abla : " + JSON.stringify(divLayerSHowed));
    let newdevLayer = divLayerSHowed;
    // newdevLayer.splice(i, 1);
    // let hamza = newdevLayer;
    // console.log("sama : " + i + " " + newdevLayer);

    let newDiv = divLayerSHowed.splice(i, 1);

    // console.log("Ba3da : " + JSON.stringify(newdevLayer));
    // console.log("Ba3da : " + JSON.stringify(newdevLayer[0]));
    setdivLayerSHowed(newdevLayer);

    showLayers(newdevLayer);
    settoshowThatDeletedLayer("hamza" + Math.random() * 2.5);
    // console.log(JSON.stringify(newDiv));
  };

  const showLayers = (layers) => {
    let tableau = [];
    let statesLabel = new LabelClass();
    // console.log("yyy : " + JSON.parse(layers[0].name).features);
    MapLayers.removeAll();
    if (Array.isArray(layers)) {
      layers.map((layer) => {
        // console.log("yyy : " + JSON.parse(layer));
        if (layer.name == "ZONAGE") {
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
        } else if (layer.name == "EQUIPEMENTS") {
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
        JSON.parse(layer.name).features.map((graphic) => {
          graphic.geometry.coordinates[0].map((coordonne) =>
            tableau.push(coordonne)
          );
        });
        console.log(tableau);
        const blob2 = new Blob([layer.name], {
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
              color: layer.color,
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
        MapLayers.add(geojsonlayer2);
      });
    } else {
      if (JSON.parse(layers).name == "ZONAGE") {
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
      } else if (JSON.parse(layers).name == "EQUIPEMENTS") {
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
      JSON.parse(layers.name).features.map((graphic) => {
        graphic.geometry.coordinates[0].map((coordonne) =>
          tableau.push(coordonne)
        );
      });
      console.log(tab);
      const blob2 = new Blob([layers], {
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
            color: layers.color,
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
      MapLayers.add(geojsonlayer2);
    }
    viewGlob.goTo({
      center: [tableau],
    });
  };
  const zoomin = (i) => {
    viewGlob.goTo({
      center: [divLayerSHowed[i].tab],
    });
  };
  // console.log(divLayerSHowed);
  return (
    <>
      <div
        style={{
          margin: "20px 100px ",
          // backgroundColor: "#17a2b887",
          backgroundColor: "#f1f1f1",
          padding: "25px",
          display: "flex",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <div style={{ flex: 1, margin: "20px" }}>
          <form>
            <div class="form-group">
              <label for="inputAddress">Titre</label>
              <input
                type="text"
                class="form-control"
                id="inputAddress"
                placeholder="Titre"
                onChange={(e) => setTitre(e.target.value)}
              />
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="inputEmail4">Typde Document</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Ex: PA"
                  onChange={(e) => setTD(e.target.value)}
                />
              </div>
              <div class="form-group col-md-6">
                <label for="inputEmail4">Intitule</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Intitule"
                  onChange={(e) => setIntitule(e.target.value)}
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="inputEmail4">Commune</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Commune"
                  onChange={(e) => setCommune(e.target.value)}
                />
              </div>
              <div class="form-group col-md-6">
                <label for="inputEmail4">Agence Urbaine</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Agence"
                  onChange={(e) => setAgence(e.target.value)}
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="inputEmail4">dateDebut</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="dateDebut"
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>
            </div>
            <div class="text-center">
              <button
                class="btn-success btn pull-center"
                onClick={saveButton}
                // onClick={hamza}
                // onClick={takeScreenShot}
                type="button"
                id="buttonSave"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <div
          style={{ flex: 1, margin: "20px", height: "500px" }}
          class="map-container"
        >
          <div class="map-frame">
            <div ref={mapRef} id="map"></div>
          </div>
        </div>
      </div>
      <div
        id="actions"
        style={{ boxShadow: "0 1px 2px rgb(0 0 0 / 0%)" }}
        className={"ImportBox"}
      >
        <label
          style={{
            width: "60px",
            height: "40px",
            backgroundColor: "white",
            color: "#000000b3",
            padding: "10px",
            margin: "0px",
          }}
          onClick={() => addActiveClass()}
        >
          import
        </label>

        <div
          // className="HideImportButton"
          className={ImportbuttonHide ? "ShowImportButton" : "HideImportButton"}
        >
          <input
            type="file"
            onChange={showFileData}
            accept=".geojson"
            style={{
              margin: "10px",
            }}
          />

          <div>
            <button
              className="button-16"
              // onClick={() => showFileData()}
              onClick={() => addGeojsonFileInLayer()}
            >
              Charger
            </button>
            <button
              className="button-16"
              // onClick={() => setImportbuttonHide(!ImportbuttonHide)}
              // onClick={() => addFeatures()}
              id="add"
            >
              Abondonner
            </button>
          </div>

          <hr style={{ marginBottom: "0px", paddingBottom: "0px" }} />
          <div
            style={{ display: "flex", flexDirection: "column", margin: "10px" }}
          >
            {divLayerSHowed != toshowThatDeletedLayer
              ? divLayerSHowed.map((a, i) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            backgroundColor: a.color,
                            height: "25px",
                            width: "25px",
                            borderRadius: "50px",
                          }}
                        ></div>
                      </div>
                      <div>
                        <h6 style={{ paddingTop: "4px", paddingLeft: "5px" }}>
                          {JSON.parse(a.name).name
                            ? JSON.parse(a.name).name
                            : "Layer"}
                        </h6>
                      </div>
                      <div>
                        <BiZoomIn
                          style={{ margin: "2px", cursor: "pointer" }}
                          color="black"
                          size="1.1rem"
                          onClick={() => zoomin(i)}
                        />
                        <MdDelete
                          style={{ margin: "2px", cursor: "pointer" }}
                          size="1.1rem"
                          color="#bf1e1c"
                          onClick={() => deleteComment(i)}
                        />
                      </div>
                    </div>
                  </>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
