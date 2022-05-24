import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import axios from "axios";
// import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useNavigate } from "react-router-dom";
import { React, useEffect, useState, useRef } from "react";

export default function CreateEtude() {
  const mapRef = useRef(null);
  const [MapLayers, setMapLayers] = useState(new Map());
  const [viewGlob, setviewGlob] = useState(new MapView());

  const [TD, setTD] = useState("");
  const [Titre, setTitre] = useState("");
  const [Intitule, setIntitule] = useState("");
  const [Commune, setCommune] = useState("");
  const [Agence, setAgence] = useState("");
  const [DateDebut, setDateDebut] = useState("");
  const [ImageURL, setImageURL] = useState("");
  const [Perimetre, setPerimetre] = useState("");
  let navigate = useNavigate();

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
    console.log("FileUploaded 1 :" + FileUploaded);
    reader.readAsText(e.target.files[0]);
  };
  const addGeojsonFileInLayer = () => {
    MapLayers.removeAll();
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
        },
      },
      popupTemplate: {
        title: "Commentaire",
        content:
          "<h4> Type : {titre}</h4>  <h4> Commentaire : {commentaire} </h4>  ",
      },
    });
    setPerimetre(FileUploaded);
    console.log("hamzaa : " + JSON.stringify(hamzaa));

    const addBtn = document.getElementById("add");
    Promise.all(tab).then(() => {
      MapLayers.add(hamzaa);
      viewGlob.goTo({
        center: [tab],
      });
    });
  };
  const saveButton = () => {
    axios
      .post("http://127.0.0.1:8000/api/createEtude", {
        titre: Titre,
        typeDoc: TD,
        intitule: Intitule,
        dateDebut: DateDebut,
        commune: Commune,
        agenceUrba: Agence,
        pictureUrl: ImageURL,
        perimetre: Perimetre,
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
    // navigate("/enquete-pub");
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
        console.log("screenshot : " + JSON.stringify(screenshot.data));
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
    console.log(canvas.toDataURL());
  };

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
              <div class="form-group col-md-6">
                <label for="inputEmail4">Image</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Image"
                  onChange={(e) => setImageURL(e.target.value)}
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
        </div>
      </div>
    </>
  );
}
