import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import Graphic from "@arcgis/core/Graphic";
import "./Map.css";
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import said from "../Shapefiles/shapefile";
import { styled } from "@mui/material/styles";
import Commentaire from "../Commenter/Commentaire";
import NavbarMenu from "./../NavBarMenu/NavbarMenu";
import CommentaireTest from "./../Commenter/CommentaireTest";
import { usePreviousProps } from "@mui/utils";
import SaveCommentaire from "../Commenter/SaveCommentaire";
import axios from "axios";
const MyMap = (props) => {
  const mapRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const [ChotuseEffect, setChotuseEffect] = useState(true);
  const [graphicLayers, setgraphicLayers] = useState(new GraphicsLayer());
  const [MapLayers, setMapLayers] = useState(new Map());
  const [File, setFile] = useState("");
  const [ShowAddComment, setShowAddComment] = useState(true);
  const [geojsonGraphicLayer, setgeojsonGraphicLayer] = useState(
    new GeoJSONLayer()
  );
  const [viewGlob, setviewGlob] = useState(new MapView());
  const [saveRequeteButton, setsaveRequeteButton] = useState(false);
  const [DataGeojson, setDataGeojson] = useState("");
  const [toreloadJSX, settoreloadJSX] = useState("");
  const [probcreatGraphZoomIn, setprobcreatGraphZoomIn] = useState("");
  const [imageURLData, setImageURLData] = useState("");
  const [imageComment, setImageComment] = useState("");
  const [CmommentaireTestData, setCmommentaireTestData] = useState([]);
  // console.log("props : " + JSON.stringify(props));
  let renderer = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    field: "type",
    defaultSymbol: { type: "simple-fill" }, // autocasts as new SimpleFillSymbol()
    uniqueValueInfos: [
      {
        // All features with value of "North" will be blue
        value: "ZV",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [0, 0, 255, 0.5],
        },
      },
      {
        // All features with value of "East" will be green
        value: "EV",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [50, 205, 50, 0.5],
        },
      },
      {
        // All features with value of "South" will be red
        value: "AD",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 0, 0, 0.5],
        },
      },
      {
        // All features with value of "West" will be yellow
        value: "SK",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 255, 0, 0.5],
        },
      },
      {
        // All features with value of "West" will be yellow
        value: "HC",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [255, 165, 0, 0.5],
        },
      },
    ],
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
  useEffect(() => {
    const urlAPI = "http://127.0.0.1:8000/api/etudes/" + props.id;
    const graphicsLayer = new GraphicsLayer();
    const mapLayer = new Map({
      basemap: "satellite",
      layers: [graphicsLayer],
    });
    setgraphicLayers(graphicsLayer);
    setMapLayers(mapLayer);
    const view = new MapView({
      container: mapRef.current,
      map: mapLayer,
      center: [-7.614392, 33.582764],
      zoom: 11,
    });
    setviewGlob(view);
    // console.log(JSON.stringify(said, null, 4));
    let statesLabelClass = new LabelClass();
    let Layers = [];
    const tab = [];
    axios.get(urlAPI).then((res) => {
      console.log("res.data : " + JSON.stringify(res.data[0].perimetre));
      if (res.data[0].perimetre.includes("%pablo144%")) {
        Layers = res.data[0].perimetre.split("%pablo144%");
      } else {
        Layers = res.data[0].perimetre;
      }
      if (Array.isArray(Layers)) {
        Layers.map((layer) => {
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
                color: hexToRgb(getRandomColor()),
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

      // const tab = [];
      // JSON.parse(res.data[0].perimetre).features.map((graphic) => {
      //   graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
      // });
      // tab ? console.log("tab ::" + tab) : console.log();
      // Promise.all(tab).then(() => {
      //   view.goTo({
      //     center: [tab],
      //   });
      // });
      // console.log("said : " + said);
      // console.log("res.data[0].perimetre : " + res.data[0].perimetre);
      // const blob = new Blob([res.data[0].perimetre], {
      //   type: "application/json",
      // });
      // const url = URL.createObjectURL(blob);
      // const geojsonlayer = new GeoJSONLayer({
      //   url: url,
      //   renderer: renderer,
      // });
      // const statesLabelClass = new LabelClass({
      //   labelExpressionInfo: { expression: "$feature.nom" },
      //   symbol: {
      //     type: "text",
      //     color: [255, 255, 255, 255], // white
      //     font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
      //     haloColor: [0, 0, 0, 255], // black
      //     haloSize: 1,
      //   },
      // });
      // geojsonlayer.labelingInfo = [statesLabelClass];
      // mapLayer.add(geojsonlayer);
    });

    // URL reference to the blob

    view.when(() => {
      const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        visibleElements: {
          createTools: {
            point: false,
            circle: false,
            square: false,
            rectangle: false,
            line: false,
          },
          selectionTools: {
            "lasso-selection": false,
          },
          settingsMenu: false,
        },
        // graphic will be selected as soon as it is created
        creationMode: "update",
      });
      let AarrayOfEntitys = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      let i = 0;
      sketch.on("create", function (event) {
        // respond to create event while the cursor is being moved on the view.
        const eventInfo = event.toolEventInfo;
        setShowAddComment(true);

        if (event.toolEventInfo && event.toolEventInfo.type === "vertex-add") {
          const addedPoint = event.toolEventInfo.added[0].geometry;

          if (event.toolEventInfo.vertices[0].vertexIndex == 0) {
            i++;
            graphicsLayer.removeAll();
          }
          AarrayOfEntitys[i].push({
            entity: i,
            lat: event.toolEventInfo.added[0][0],
            long: event.toolEventInfo.added[0][1],
          });
          ShowEntitys(AarrayOfEntitys[i]);
          // ShowEntitys(AarrayOfEntitys);

          // console.log("array : " + JSON.stringify(AarrayOfEntitys));
          // setEntities(...[AarrayOfEntitys]);

          // console.log(
          //   event.toolEventInfo.added[0][0],
          //   event.toolEventInfo.added[0][1]
          // );
        }
      });
      // sketch.on("delete", function (event) {
      //   event.graphics.forEach(function (graphic) {
      //     console.log("deleted : ", graphic);
      //   });
      // });
      sketch.on("update", function (event) {
        // console.log(
        //   "update : " + JSON.stringify(event.graphics[0].geometry.rings[0])
        // );

        const tabUpdate = [];
        event.graphics[0].geometry.rings[0].map((tab) =>
          tabUpdate.push({
            entity: i,
            lat: tab[0],
            long: tab[1],
          })
        );
        ShowEntitys(tabUpdate);
        // if (event.state === "active") {
        //   console.log("update inside");
        //   sketch.delete();
        // }
      });
      sketch.on("delete", function (event) {
        setFinalEntities((oldArray) => [...oldArray]);
        console.log("tessst");
        setEntities([]);
        event.graphics.forEach(function (graphic) {
          console.log("deleted", graphic);
        });
      });

      view.ui.add([sketch, document.getElementById("actions")], "top-right");
      // viewGlob.ui.add(document.getElementById("actions"), "top-right");
    });
  }, []);
  console.log("outside 2");

  let [Entities, setEntities] = useState();
  let [FinalEntities, setFinalEntities] = useState([]);

  let nbrEntities, a;
  const ShowEntitys = (param1) => {
    // console.log("param1 : " + param1);
    // console.log("ShowEntitys : " + JSON.stringify(param1, null, 4));
    // console.log(JSON.stringify(param1[0].entity, null, 4));
    console.log("said lkayd : " + JSON.stringify(param1));
    setEntities([param1]);
    // console.log("set here!! : " + JSON.stringify(param1));
    // console.log("Entities Stringify : " + JSON.stringify(Entities));
    // console.log("INside function Entities : " + Entities ? Entities : 0);
    // console.log(typeof JSON.parse(JSON.stringify(param1)));
  };
  var deleteAllGraphics = () => {
    graphicLayers.removeAll();
  };
  var deleteEntity = () => {
    setEntities([]);
  };
  const dataForm = (data) => {
    // console.log("******* : data : " + JSON.stringify(Entities[0]));

    // console.log("******* : data : " + JSON.stringify(data));
    if (data.button === "add") {
      reset2();
      console.log("haniya");
      deleteEntity();
      setShowAddComment(false);
      deleteAllGraphics();
      viewGlob.graphics.removeAll();
      // console.log(
      //   "[...FinalEntities, data] : " + JSON.stringify([...FinalEntities, data])
      // );
      // [...FinalEntities, data].map((a) => {
      //   // console.log("Inside FinalEntities  : " + JSON.stringify(a));
      // });
      zoomToPolygons(data);
      console.log(
        "data : " +
          JSON.stringify(data) +
          ", FinalEntities : " +
          JSON.stringify(FinalEntities)
      );
      showCommentInMaps([...FinalEntities, data]);
      setFinalEntities((oldArray) => [...oldArray]);
      // data.image = imageComment;
      // imageComment != ""
      //   ? console.log("imageComment : " + imageComment)
      //   : console.log();
      // console.log("FinalEntities before add : " + JSON.parse(FinalEntities));
      // setFinalEntities((oldArray) => [...oldArray, data]);
      // [...FinalEntities, data].map(
      //   (a, i) => (
      //     FinalEntities[i + 1]
      //       ? (a.image = FinalEntities[i + 1].image)
      //       : console.log(),
      //     setCmommentaireTestData((oldArray) => [...oldArray, a])
      //   )
      // );

      // console.log("FinalEntities after add : " + JSON.parse(FinalEntities));
    }

    const ondexx = Entities[0].indexOf(data.data);
    Entities[0].splice(ondexx, 1);
  };
  const downloadTxtFile = () => {
    const element = document.createElement("a");

    let geojsonFile = '{"type": "FeatureCollection","features": [';
    Promise.all(
      FinalEntities.map(
        (a) =>
          (geojsonFile =
            geojsonFile +
            '{"type": "Feature","properties": {"commentaire": "' +
            // a["titre"] +
            // '", "commentaire" : "' +
            a["comment"] +
            '"},"geometry": {"type": "Polygon","coordinates": [[') |
          a["data"].map(
            (aa) =>
              (geojsonFile =
                geojsonFile +
                "[" +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
                ", " +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
                "],")
          ) |
          (geojsonFile = geojsonFile.slice(0, -1) + "]]}},")
      ),
      (geojsonFile = geojsonFile.slice(0, -1) + "]}")
    ).then(
      () => (element = document.createElement("a")),
      console.log(geojsonFile),
      (element.href = URL.createObjectURL(
        new Blob([JSON.parse(JSON.stringify(geojsonFile))], {
          type: "text/plain",
        })
      )),
      (element.download = "Commentaires.geojson"),
      document.body.appendChild(element),
      element.click()
    );

    // const entityBlob = new Blob(
    //   [
    //     // FinalEntities
    //     //   ? FinalEntities.map(
    //     //       (a) => '{"type": "Feature","properties": {"commentaire": ',
    //     //       FinalEntities ? a["comment"] : null,
    //     //       " ",
    //     //       '},"geometry": {"type": "Polygon","coordinates": [[',
    //     //       a["data"].map((aa) => ("[", aa["lat"], "],[", aa["long"], "],")),
    //     //       "]]}}"
    //     //     )
    //     //   : null,
    //     "",
    //   ],
    //   { type: "text/plain" }
    // );
    // const endBlob = new Blob(["]}"], { type: "text/plain" });
  };

  const getGeojson = () => {
    const element = document.createElement("a");

    let geojsonFile = '{"type": "FeatureCollection","features": [';
    Promise.all(
      FinalEntities.map(
        (a) =>
          (geojsonFile =
            geojsonFile +
            '{"type": "Feature","properties": {"commentaire": "' +
            // a["titre"] +
            // '", "commentaire" : "' +
            a["comment"] +
            '"},"geometry": {"type": "Polygon","coordinates": [[') |
          a["data"].map(
            (aa) =>
              (geojsonFile =
                geojsonFile +
                "[" +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
                ", " +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
                "],")
          ) |
          (geojsonFile = geojsonFile.slice(0, -1) + "]]}},")
      ),
      (geojsonFile = geojsonFile.slice(0, -1) + "]}")
    ).then(() => setDataGeojson(geojsonFile) || zoomToLayer(geojsonFile));
  };
  const takeScreenShot = (imagedata) => {
    viewGlob
      .takeScreenshot({
        area: {
          x: 0,
          y: 0,
          width: 900,
          height: 700,
        },
      })
      .then(function (screenshot) {
        // console.log("screenshot : " + JSON.stringify(screenshot.data));
        createImage(screenshot, imagedata);
      });
  };
  const takeScreenShotForFinale = () => {
    viewGlob
      .takeScreenshot({
        area: {
          x: 0,
          y: 0,
          width: 900,
          height: 700,
        },
      })
      .then(function (screenshot) {
        // console.log("screenshot : " + JSON.stringify(screenshot.data));
        createImageForFinal(screenshot);
      });
  };
  const createImageForFinal = (screenshot) => {
    const imageData = screenshot.data;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = imageData.height;
    canvas.width = imageData.width;
    context.putImageData(imageData, 0, 0);
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText("", 20, 50);
    setImageURLData(canvas.toDataURL());
    setsaveRequeteButton(!saveRequeteButton);
  };
  const zoomToLayer = (perimetre) => {
    const tab = [];
    JSON.parse(perimetre).features.map((graphic) => {
      graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
    });
    // tab ? console.log("tab ::" + tab) : console.log();
    Promise.all(tab).then(() => {
      viewGlob.goTo({
        center: [tab],
      });
    });
  };
  const createImage = (screenshot, imagedata) => {
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
    // setImageURLData(canvas.toDataURL());
    setImageURLData(canvas.toDataURL());
    setImageComment(canvas.toDataURL());
    imagedata.image = canvas.toDataURL();
    setFinalEntities((oldArray) => [...oldArray, imagedata]);
    // console.log(canvas.toDataURL());
    // console.log("ImageURLData : :  : : : :" + imageURLData);
  };

  const showCommentsInMap = () => {
    const element = document.createElement("a");
    const frontBlob = new Blob(['{"type": "FeatureCollection","features": ['], {
      type: "text/plain",
    });
    let geojsonFile = '{"type": "FeatureCollection","features": [';
    Promise.all(
      FinalEntities.map(
        (a) =>
          (geojsonFile =
            geojsonFile +
            '{"type": "Feature","properties": {"titre": "' +
            a["titre"] +
            '", "commentaire" : "' +
            a["comment"] +
            '"},"geometry": {"type": "Polygon","coordinates": [[') |
          a["data"].map(
            (aa) =>
              (geojsonFile =
                geojsonFile +
                "[" +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
                ", " +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
                "],")
          ) |
          (geojsonFile = geojsonFile.slice(0, -1) + "]]}},")
      ),
      (geojsonFile = geojsonFile.slice(0, -1) + "]}")
    ).then(() =>
      // deleteLayer() || //||layer.visible = false;
      MapLayers.add(
        new GeoJSONLayer({
          url: URL.createObjectURL(
            new Blob([geojsonFile], { type: "application/json" })
          ),
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color: "#224c7b",
              // style: "solid",
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: "white",
                width: 1,
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
        })
      )
    );

    // URL reference to the blob
  };
  function getArea(polygon) {
    const geodesicArea = geometryEngine.geodesicArea(polygon, "square-meters");
    return geodesicArea;
  }
  const zoomToPolygons = (dataaa) => {
    let area = 0;

    let polygon = {
      type: "polygon",
      spatialReference: {
        wkid: 4326,
      },
      rings: [
        dataaa["data"].map((entity) => {
          return [
            webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[0],
            webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[1],
          ];
        }),
      ],
    };
    area = area + getArea(polygon);

    console.log("area : " + area);
    console.log(
      "data : " +
        JSON.stringify(dataaa) +
        ", FinalEntities : " +
        JSON.stringify(FinalEntities)
    );
    const tab = [];
    dataaa
      ? // dataaa.map((a) => {
        dataaa.data.map((e) => {
          // console.log("Show in map dataa: " + JSON.stringify(e.lat));
          tab.push(webMercatorUtils.xyToLngLat(e.lat, e.long));

          // tab.push();
        })
      : // })
        console.log();
    tab ? console.log("tab ::" + tab) : console.log();

    if (area > 3700) {
      Promise.all(tab).then(() => {
        viewGlob.goTo({
          center: [tab],
        });
        // setTimeout(takeScreenShot(dataaa), 12000);
        setTimeout(() => {
          takeScreenShot(dataaa);
        }, 800);
      });
    } else {
      Promise.all(tab).then(() => {
        viewGlob.goTo({
          center: [tab],
          zoom: 18,
        });
        // setTimeout(takeScreenShot(dataaa), 12000);
        setTimeout(() => {
          takeScreenShot(dataaa);
        }, 800);
      });
    }
  };
  const zoomToPolygonsForFinale = (dataaa) => {
    let area = 0;
    dataaa
      ? dataaa.map((entities) => {
          let polygon = {
            type: "polygon",
            spatialReference: {
              wkid: 4326,
            },
            rings: [
              entities["data"].map((entity) => {
                return [
                  webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[0],
                  webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[1],
                ];
              }),
            ],
          };
          area = area + getArea(polygon);
        })
      : console.log();
    console.log("area : " + area);
    const tab = [];
    dataaa
      ? dataaa.map((a) => {
          a.data.map((e) => {
            // console.log("Show in map dataa: " + JSON.stringify(e.lat));
            tab.push(webMercatorUtils.xyToLngLat(e.lat, e.long));

            // tab.push();
          });
        })
      : // })
        console.log();
    tab ? console.log("tab ::" + tab) : console.log();
    if (area > 1700) {
      Promise.all(tab).then(() => {
        viewGlob.goTo({
          center: [tab],
        });
        // setTimeout(takeScreenShot(dataaa), 12000);
        setTimeout(() => {
          takeScreenShotForFinale();
        }, 800);
      });
    } else {
      Promise.all(tab).then(() => {
        viewGlob.goTo({
          center: [tab],
          zoom: 18,
        });
        // setTimeout(takeScreenShot(dataaa), 12000);
        setTimeout(() => {
          takeScreenShotForFinale();
        }, 800);
      });
    }
  };

  const showCommentInMaps = (dataaa) => {
    // console.log("dataaa : " + JSON.stringify(dataaa));
    dataaa
      ? dataaa.map((entities) => {
          const hamza = new Graphic({
            geometry: {
              type: "polygon", // autocasts as new Polygon()
              rings: [
                entities["data"].map((entity) => {
                  return [
                    webMercatorUtils.xyToLngLat(
                      entity["lat"],
                      entity["long"]
                    )[0],
                    webMercatorUtils.xyToLngLat(
                      entity["lat"],
                      entity["long"]
                    )[1],
                  ];
                }),

                // [
                //   entities["data"].map((entity) => [
                //     webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[1] ||
                //       webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[0],
                //     // JSON.stringify(
                //     //   "[" +
                //     //     webMercatorUtils.xyToLngLat(
                //     //       entity["lat"],
                //     //       entity["long"]
                //     //     )[1] +
                //     //     "," +
                //     //     webMercatorUtils.xyToLngLat(
                //     //       entity["lat"],
                //     //       entity["long"]
                //     //     )[1] +
                //     //     "]"
                //     // ),
                //   ]),
                // ],
              ],
            },
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color: [255, 255, 255, 0],
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: "#eb0000",
                width: 3,
              },
            },
            popupTemplate: {
              title: "Commentaire",
              content:
                "<h4> Type : " +
                entities["titre"] +
                "</h4>  <h4> Commentaire : " +
                entities["comment"] +
                "</h4>  ",
            },
          });
          // console.log("rayaaah" + JSON.stringify(hamza));

          viewGlob.graphics.add(hamza);
        })
      : console.log();

    // viewGlob.graphics.add(polygonGraphic);
  };
  const reset = () => {
    setFinalEntities([]);
    viewGlob.graphics.removeAll();
    setImageURLData([]);
    // console.log("finalentities : " + JSON.stringify(FinalEntities));
    // console.log("setChotuseEffect : " + JSON.stringify(setChotuseEffect));
    deleteLayer();
    setChotuseEffect([]);
  };
  let reset2 = () => {
    // setFinalEntities([]);
    viewGlob.graphics.removeAll();

    // console.log("finalentities : " + JSON.stringify(FinalEntities));
    // console.log("setChotuseEffect : " + JSON.stringify(setChotuseEffect));
    deleteLayer();
    setChotuseEffect([]);
  };
  const saveButton = () => {};
  const deleteLayer = () => {
    // MapLayers.removeAll();
    // MapLayers.visible = false;
    // graphicLayers.removeAll();
    // console.log("deleteLayer :" + MapLayers.getLayers());
    // viewGlob.graphics.removeAll();
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
    console.log("FileUploaded 1 :" + FileUploaded);
    reader.readAsText(e.target.files[0]);
  };

  const [LayerImportLocal, setLayerImportLocal] = useState(new GeoJSONLayer());
  // const [GrandLat, setGrandLat] = useState(-12);
  // const [PetitLat, setPetitLat] = useState(0);
  // const [GrandLong, setGrandLong] = useState(0);
  // const [PetitLong, setPetitLong] = useState(50);
  const addGeojsonFileInLayer = () => {
    const tab = [];
    JSON.parse(FileUploaded).features.map((graphic) => {
      graphic.geometry.coordinates[0].map((coordonne) => tab.push(coordonne));
    });

    console.log("FileUploaded : " + FileUploaded);
    const hamzaa = new GeoJSONLayer({
      url: URL.createObjectURL(
        new Blob([FileUploaded], { type: "application/json" })
      ),
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [107, 249, 253, 0.3],
          outline: {
            width: 2,
            color: [107, 249, 253],
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
    setLayerImportLocal(hamzaa);
    console.log("hamzaa : " + JSON.stringify(hamzaa));
    console.log("LayerImportLocal : " + JSON.stringify(LayerImportLocal));
    // MapLayers.add(LayerImportLocal);
    // LayerImportLocal.visibility = false;
    // console.log("setLayerImportLocal : " + JSON.stringify(LayerImportLocal));
    // console.log("setLayerImportLocal : " + JSON.stringify(LayerImportLocal));

    viewGlob.ui.add(document.getElementById("actions"), "top-right");

    const addBtn = document.getElementById("add");
    Promise.all(tab).then(() => {
      // !!LayerImportLocal ? MapLayers.add(LayerImportLocal) : console.log();
      MapLayers.add(LayerImportLocal);
      setlayer();
      viewGlob.goTo({
        center: [tab],
        // zoom: 13,
      });
    });

    addBtn.addEventListener("click", addFeatures);

    // MapLayers.remove(LayerImportLocal);

    // MapLayers.remove(LayerImportLocal);
    // graphicLayers.clearLayers();
    // MapLayers.visible = false;
    // MapLayers.removeAll();
    // MapLayers.visible = false;
    // graphicLayers.removeAll();
    //MapLayers.remove(hamzaa);
    // MapLayers.removeLayer(hamzaa);
    // console.log("deleteLayer :" + MapLayers.getLayers());
    // viewGlob.graphics.removeAll();
  };
  function setlayer() {
    console.log("yayayay : " + JSON.stringify(LayerImportLocal));
    MapLayers.add(LayerImportLocal);
  }
  function addFeatures() {
    console.log("babab");
    // setLayerImportLocal(new GeoJSONLayer());

    MapLayers.remove(LayerImportLocal);
    setFileUploaded("");
  }
  // const addFeatures = (hamzaa) => {
  //   console.log("salam : " + JSON.stringify(LayerImportLocal));

  // };
  const [ImportbuttonHide, setImportbuttonHide] = useState(false);
  const addActiveClass = () => {
    setImportbuttonHide(!ImportbuttonHide);
  };
  const getSaveButtonValue = (value) => {
    console.log("ana jay mn SaveComponent : " + value);
    setsaveRequeteButton(value);
  };
  const deleteComment = (index, type) => {
    // deleteAllGraphics();

    viewGlob.graphics.removeAll();

    if (type == "zoomin") {
      // let vzar = FinalEntities;
      let tab = [];

      tab
        ? FinalEntities[index].data.map((a) => {
            tab.push(webMercatorUtils.xyToLngLat(a.lat, a.long));

            console.log(webMercatorUtils.xyToLngLat(a.lat, a.long));
          })
        : console.log();

      tab
        ? console.log("tab : " + tab) ||
          viewGlob.goTo({
            center: [tab],
            // zoom: 13,
          })
        : console.log();
      // showCommentInMaps(FinalEntities);

      // settoreloadJSX("" + Math.random());
      console.log("zoomin button");
    } else if (type == "delete") {
      let vzar = FinalEntities.splice(index, 1);
      settoreloadJSX("" + Math.random());
      console.log("delete button");
    }
    // console.log("test FinalEntities : " + FinalEntities);
    showCommentInMaps(FinalEntities);

    // settoreloadJSX("" + Math.random());
    // FinalEntities
    //   ? console.log("apres : FinalEntities :" + JSON.stringify(FinalEntities))
    //   : console.log();
  };

  console.log("toreloadJSX : " + toreloadJSX);
  const datazoomin = (v) => {
    console.log(v.data);
    FinalEntities.filter((a, i) => {
      if (a.data == v.data.data) {
        console.log("wakha 3la mok : " + i + ", action : " + v.action);
        // setprobcreatGraphZoomIn(v.data.data);
        deleteComment(i, v.action);
      }
    });
  };
  const datadeleteComment = (v) => {
    console.log(v.data);
    FinalEntities.filter((a, i) => {
      if (a.data == v.data.data) {
        console.log("wakha 3la mok : " + i + ", action : " + v.action);
        // setprobcreatGraphZoomIn(v.data.data);
        deleteComment(i, v.action);
      }
    });
  };

  return (
    <>
      <div class="div-ombre">
        {/* <h3>Ajouter Commentaire</h3> */}
        <div class="map-container">
          <div class="map-frame">
            <div ref={mapRef} id="map"></div>
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
            className={
              ImportbuttonHide ? "ShowImportButton" : "HideImportButton"
            }
            // onClick={() => addActiveClass()}
          >
            <input
              type="file"
              onChange={showFileData}
              accept=".geojson"
              style={{
                // padding: "10px",/
                margin: "10px",
              }}
              // style={{ display: "none" }}
            />
            {/* <button class="esri-button" id="add">
              Add 7 Features
            </button> */}
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
          </div>
        </div>
        {/* <select id="actions">
          <option value="0">Select car:</option>
          <option value="1">Audi</option>
        </select> */}
        <div
          style={{
            display: "flex",
            flex: 3,
            flexDirection: "column",
            flexWrap: "wrap",
            // justifyContent: "space-evenly",
          }}
        >
          {/* {Entities
            ? Entities.map((haha) =>
                // console.log("baba 1 : " + JSON.stringify(haha)) |
                haha.map((ha, index, stadart) =>
                  ha[0] ? (
                    //  console.log("baba 2 : " + JSON.stringify(ha)) |
                    <Commentaire data={ha} onSubmit={dataForm} />
                  ) : null
                )
              )
            : null} */}
          {ShowAddComment
            ? Entities
              ? Entities.map((ha, index, stadart) =>
                  ha[0]
                    ? console.log("baba 3 : " + JSON.stringify(ha)) || (
                        <Commentaire data={ha} onSubmit={dataForm} />
                      )
                    : null
                )
              : null
            : null}

          <div class="div-commentaire">
            <h6>Commentaire</h6>
            <div style={{ overflow: "auto", height: "325px" }}>
              {JSON.stringify(FinalEntities) != "[]"
                ? FinalEntities.map((data) => (
                    <CommentaireTest
                      data={data}
                      zoomin={datazoomin}
                      deleteComment={datadeleteComment}
                      imageComment={imageComment}
                      CommentActionn={(v) => {
                        // if (probcreatGraphZoomIn != v.data.data) {
                        //   console.log(
                        //     "probcreatGraphZoomIn : " + probcreatGraphZoomIn
                        //   );
                        //   console.log("v.data.data : " + v.data.data);
                        //   FinalEntities.filter((a, i) => {
                        //     if (a.data == v.data.data && v.action) {
                        //       console.log(
                        //         "wakha 3la mok : " +
                        //           i +
                        //           ", action : " +
                        //           v.action
                        //       );
                        //       setprobcreatGraphZoomIn(v.data.data);
                        //       deleteComment(i, v.action);
                        //     }
                        //   }) ||
                        //     console.log("jatt dataa : " + JSON.stringify(v));
                        // }
                      }}
                    />
                  ))
                : null}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                class="button-28 buttonStyle"
                type="submit"
                onClick={downloadTxtFile}
              >
                Export GeoJson
              </button>
              <button
                class="button-28 buttonStyle"
                type="submit"
                onClick={showCommentInMaps(FinalEntities)}
              >
                Show In Map
              </button>
              <button
                class="button-28 buttonStyle"
                type="submit"
                onClick={reset}
              >
                Delete All
              </button>
              <button
                class="button-28 buttonStyle"
                href="#"
                type="submit"
                onClick={() => zoomToPolygonsForFinale(FinalEntities)}
              >
                Save
              </button>
            </div>
            <div>
              {saveRequeteButton ? (
                <SaveCommentaire
                  saveButtonV={(value) => setsaveRequeteButton(value)}
                  // data={DataGeojson}
                  data={FinalEntities}
                  dataImage={imageURLData}
                  id={props.id}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyMap;
