import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
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
    setviewGlob(view);
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
      console.log("haniya");
      deleteEntity();
      setShowAddComment(false);
      deleteAllGraphics();
      viewGlob.graphics.removeAll();
      // console.log("FinalEntities before add : " + JSON.parse(FinalEntities));
      setFinalEntities((oldArray) => [...oldArray, data]);

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
    ).then(() => setDataGeojson(geojsonFile));
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
  const showCommentInMaps = () => {
    console.log("FinalEntities : " + JSON.stringify(FinalEntities));
    FinalEntities?.map((entities) => {
      const hamza = new Graphic({
        geometry: {
          type: "polygon", // autocasts as new Polygon()
          rings: [
            entities["data"].map((entity) => {
              return [
                webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[0],
                webMercatorUtils.xyToLngLat(entity["lat"], entity["long"])[1],
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
          color: [227, 139, 79, 0.8],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1,
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
      console.log("rayaaah" + JSON.stringify(hamza));

      viewGlob.graphics.add(hamza);
    });

    // viewGlob.graphics.add(polygonGraphic);
  };
  const reset = () => {
    setFinalEntities([]);
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
              {FinalEntities
                ? // console.log("baba 2 : " + JSON.stringify(FinalEntities)) |
                  FinalEntities.map((data) => <CommentaireTest data={data} />)
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
                onClick={showCommentInMaps}
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
                onClick={() => (
                  getGeojson(), setsaveRequeteButton(!saveRequeteButton)
                )}
              >
                Save
              </button>
            </div>
            <div>
              {saveRequeteButton ? (
                <SaveCommentaire
                  saveButtonV={(value) => setsaveRequeteButton(value)}
                  data={DataGeojson}
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
