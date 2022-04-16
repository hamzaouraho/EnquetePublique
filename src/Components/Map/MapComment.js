import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import "./Map.css";
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import said from "../Shapefiles/shapefile";
import { styled } from "@mui/material/styles";
import Commentaire from "../Commenter/Commentaire";
import NavbarMenu from "./../NavBarMenu/NavbarMenu";
import CommentaireTest from "./../Commenter/CommentaireTest";
import { usePreviousProps } from "@mui/utils";

const MyMap = () => {
  const mapRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const [ChotuseEffect, setChotuseEffect] = useState(true);
  const [graphicLayers, setgraphicLayers] = useState(new GraphicsLayer());
  const [MapLayers, setMapLayers] = useState(new Map());
  const [File, setFile] = useState("");
  console.log(showResults);
  useEffect(() => {
    console.log("inside");
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
    view.ui.add(document.getElementById("actions"), "top-right");
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

      view.ui.add(sketch, "top-right");
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

    console.log("******* : data : " + JSON.stringify(data));
    if (data.button === "add") {
      console.log("haniya");
      deleteEntity();
      // deleteAllGraphics();
      setFinalEntities((oldArray) => [...oldArray, data]);

      console.log("Entities after add : " + JSON.parse(FinalEntities));
    }

    const ondexx = Entities[0].indexOf(data.data);
    Entities[0].splice(ondexx, 1);
  };
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const frontBlob = new Blob(['{"type": "FeatureCollection","features": ['], {
      type: "text/plain",
    });
    let kolchi = '{"type": "FeatureCollection","features": [';
    // kolchi = kolchi + "tnaket";
    Promise.all(
      // console.log("FinalEntities : " + JSON.stringify(FinalEntities))

      FinalEntities.map(
        (a) =>
          (kolchi =
            kolchi +
            '{"type": "Feature","properties": {"titre": "' +
            a["titre"] +
            '", "commentaire" : "' +
            a["comment"] +
            '"},"geometry": {"type": "Polygon","coordinates": [[') |
          a["data"].map(
            (aa) =>
              (kolchi =
                kolchi +
                "[" +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
                ", " +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
                "],")
          ) |
          (kolchi = kolchi.slice(0, -1) + "]]}},")
      ),
      (kolchi = kolchi.slice(0, -1) + "]}")
    ).then(
      () => (element = document.createElement("a")),
      console.log(kolchi),
      (element.href = URL.createObjectURL(
        new Blob([JSON.parse(JSON.stringify(kolchi))], {
          type: "text/plain",
        })
      )),
      (element.download = "myFile.geojson"),
      document.body.appendChild(element),
      element.click()
    );

    const entityBlob = new Blob(
      [
        // FinalEntities
        //   ? FinalEntities.map(
        //       (a) => '{"type": "Feature","properties": {"commentaire": ',
        //       FinalEntities ? a["comment"] : null,
        //       " ",
        //       '},"geometry": {"type": "Polygon","coordinates": [[',
        //       a["data"].map((aa) => ("[", aa["lat"], "],[", aa["long"], "],")),
        //       "]]}}"
        //     )
        //   : null,
        "",
      ],
      { type: "text/plain" }
    );
    const endBlob = new Blob(["]}"], { type: "text/plain" });
  };

  const showCommentsInMap = () => {
    const element = document.createElement("a");
    const frontBlob = new Blob(['{"type": "FeatureCollection","features": ['], {
      type: "text/plain",
    });
    let kolchi = '{"type": "FeatureCollection","features": [';
    // kolchi = kolchi + "tnaket";
    Promise.all(
      // console.log("FinalEntities : " + JSON.stringify(FinalEntities))

      FinalEntities.map(
        (a) =>
          (kolchi =
            kolchi +
            '{"type": "Feature","properties": {"titre": "' +
            a["titre"] +
            '", "commentaire" : "' +
            a["comment"] +
            '"},"geometry": {"type": "Polygon","coordinates": [[') |
          a["data"].map(
            (aa) =>
              (kolchi =
                kolchi +
                "[" +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
                ", " +
                webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
                "],")
          ) |
          (kolchi = kolchi.slice(0, -1) + "]]}},")
      ),
      (kolchi = kolchi.slice(0, -1) + "]}")
    ).then(() =>
      MapLayers.add(
        new GeoJSONLayer({
          url: URL.createObjectURL(
            new Blob([kolchi], { type: "application/json" })
          ),
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color: "blue",
              outline: {
                width: 1.5,
                color: [255, 255, 255],
              },
              style: "solid",
              // opacity: 0.33,
            },
          },
          popupTemplate: {
            title: "Commentaire",
            content: "Type : {titre}, Commentaire : {commentaire}",
          },
        })
      )
    );

    // URL reference to the blob
  };
  const reset = () => {};

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
          {Entities
            ? Entities.map((ha, index, stadart) =>
                ha[0]
                  ? console.log("baba 3 : " + JSON.stringify(ha)) || (
                      <Commentaire data={ha} onSubmit={dataForm} />
                    )
                  : null
              )
            : null}

          <div class="div-commentaire">
            <h6>Commentaire</h6>
            <div style={{ overflow: "auto", height: "325px" }}>
              {FinalEntities
                ? // console.log("baba 2 : " + JSON.stringify(FinalEntities)) |
                  FinalEntities.map((data) => <CommentaireTest data={data} />)
                : null}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  margin: "10px",
                  width: "150px",
                  height: "50px",
                  fontSize: "16px",
                  backgroundImage:
                    "radial-gradient(100% 100% at 100% 0,#224c7b 0,#224c7b 100%)",
                }}
                class="button-28"
                href="#"
                type="submit"
                onClick={downloadTxtFile}
              >
                Export GeoJson
              </button>
              <button
                style={{
                  margin: "10px",
                  width: "150px",
                  height: "50px",
                  fontSize: "16px",
                  backgroundImage:
                    "radial-gradient(100% 100% at 100% 0,#224c7b 0,#224c7b 100%)",
                }}
                class="button-28"
                href="#"
                type="submit"
                onClick={showCommentsInMap}
              >
                Show In Map
              </button>
              <button
                style={{
                  margin: "10px",
                  width: "150px",
                  height: "50px",
                  fontSize: "16px",
                  backgroundImage:
                    "radial-gradient(100% 100% at 100% 0,#224c7b 0,#224c7b 100%)",
                }}
                class="button-28"
                href="#"
                type="submit"
                onClick={showCommentsInMap}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="actions" class="esri-widget">
        <button class="esri-button" style={{ margin: "20px" }} id="add">
          Add 7 Features
        </button>
        <button class="esri-button" id="remove">
          Remove 7 Features
        </button>
      </div>
    </>
  );
};
export default MyMap;