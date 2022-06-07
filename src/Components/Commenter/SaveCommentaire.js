import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Commentaire.css";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
export default function SaveCommentaire(props, saveButtonV) {
  let commentaire = "";

  const [NomCytoyen, setNom] = useState("");
  const [Page, setPage] = useState("");
  const [TF, setTF] = useState("");
  const [Commentaire, setCommentaire] = useState("-");
  const [saveButtonValue, setsaveButtonValue] = useState(true);
  const url = "http://127.0.0.1:8090/etudes";
  const stock = "aa";

  // props.data
  //   ? console.log("yzyz " + JSON.stringify(props.data))
  //   : console.log("");
  // console.log("commentaire avant : " + commentaire);
  const max = (data) => {
    let max = data[0];
    data.map((a) => {
      if (max < a) {
        max = a;
      }
    });
    return max;
  };
  const min = (data) => {
    let min = data[0];
    data.map((a) => {
      if (min > a) {
        min = a;
      }
    });
    return min;
  };
  let tableauLat = [];
  let tableauLong = [];
  let distanceLat = 0;
  let distanceLong = 0;
  props.data
    ? props.data.map((a, i) => {
        let Lowlat = props.data[i]["data"][0]["lat"];
        // console.log("base : " + props.data[i]["data"][0]["lat"]);
        a["data"].map((b) => {
          // console.log(b["lat"]);
          if (b["lat"] < Lowlat) {
            Lowlat = b["lat"];
            tableauLat[i] = Lowlat;
          }
        });
      })
    : console.log("");
  props.data
    ? props.data.map((a, i) => {
        let Lowlat = props.data[i]["data"][0]["long"];
        // console.log("base : " + props.data[i]["data"][0]["long"]);
        a["data"].map((b) => {
          // console.log(b["long"]);
          if (b["long"] < Lowlat) {
            Lowlat = b["long"];
            tableauLong[i] = Lowlat;
          }
        });
      })
    : console.log("");
  // console.log("tableauLat" + tableauLat);

  // console.log("max : " + max(tableauLat) + ", min : " + min(tableauLat));
  // console.log(
  //   "distance : " + (max(tableauLat) - min(tableauLat)) < 0
  //     ? -(max(tableauLat) - min(tableauLat))
  //     : max(tableauLat) - min(tableauLat)
  // );
  // console.log("tableauLong" + tableauLong);

  // console.log("max : " + max(tableauLong) + ", min : " + min(tableauLong));
  // console.log(
  //   "distance : " + (max(tableauLong) - min(tableauLong)) < 0
  //     ? -(max(tableauLong) - min(tableauLong))
  //     : max(tableauLong) - min(tableauLong)
  // );
  if (max(tableauLong) - min(tableauLong) < 0) {
    distanceLong = -(max(tableauLong) - min(tableauLong));
  } else {
    distanceLong = max(tableauLong) - min(tableauLong);
  }
  if (max(tableauLat) - min(tableauLat) < 0) {
    distanceLat = -(max(tableauLat) - min(tableauLat));
  } else {
    distanceLat = max(tableauLat) - min(tableauLat);
  }
  console.log("distanceLong : " + distanceLong + " : distanceLong ");
  console.log("distanceLat : " + distanceLat + " : distanceLat ");
  // console.log(distanceLong, distanceLat);
  const getGeojsonMultiple = (e) => {
    const element = document.createElement("a");
    // console.log("e : " + e);
    // console.log("comment : " + e["comment"]);
    let geojsonFile =
      '{"type": "FeatureCollection","name": "' + NomCytoyen + '","features": [';

    geojsonFile =
      geojsonFile +
      '{"type": "Feature","properties": {"commentaire": "' +
      e["comment"] +
      '"},"geometry": {"type": "Polygon","coordinates": [[';

    e["data"].map(
      (aa) =>
        (geojsonFile =
          geojsonFile +
          "[" +
          webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[0] +
          ", " +
          webMercatorUtils.xyToLngLat(aa["lat"], aa["long"])[1] +
          "],")
    );

    geojsonFile = geojsonFile.slice(0, -1) + "]]}},";
    geojsonFile = geojsonFile.slice(0, -1) + "]}";

    return geojsonFile;
  };
  const getGeojsonOne = (FinalEntities) => {
    const element = document.createElement("a");

    let geojsonFile =
      '{"type": "FeatureCollection","name": "' + NomCytoyen + '","features": [';
    Promise.all(
      FinalEntities.map(
        (a) =>
          (geojsonFile =
            geojsonFile +
            '{"type": "Feature","properties": {"name": "' +
            NomCytoyen +
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
    ).then(() => console.log("getGeojsonOne : " + geojsonFile));
    return geojsonFile;
  };
  props.data
    ? props.data.map((a, i) => {
        // console.log(i);
        if (i == 0) {
          commentaire = "-" + a.comment;
        } else {
          commentaire = commentaire + ", -" + a.comment;
        }

        // console.log("a : " + JSON.stringify(a.properties.commentaire));
        // setCommentaire([...Commentaire, "/n *", a.properties.commentaire]);
        // console.log("ssalam");
      })
    : console.log("");
  // console.log("commentaire : " + commentaire);

  useEffect(() => {
    axios.get(url).then((res) => {
      // res.data.map((a) => console.log(a));
    });
  }, []);
  const sendthru = () => {
    document.getElementById("inputName").value = "";
    document.getElementById("inputPage").value = "";
    document.getElementById("inputTF").value = "";
    setTF("");
    setPage("");
    setNom("");
    document.getElementById("buttonSave").innerHTML = "Save";
    props.saveButtonV(false);
  };
  const saveMultiple = () => {
    props.data.map((a) => {
      // console.log(
      //   "chabab cv : " +
      //     NomCytoyen +
      //     ", \n" +
      //     Page +
      //     ", \n" +
      //     TF +
      //     ", \n" +
      //     a.comment +
      //     ", \n" +
      //     getGeojsonMultiple(a) +
      //     ", \n id : " +
      //     props.id +
      //     ", \n" +
      //     a.image
      // );
    });

    if (distanceLong > 500 || distanceLat > 500) {
      props.data.map((a) => {
        axios
          .post("http://127.0.0.1:8090/createRequete", {
            nom: NomCytoyen,
            tf: TF,
            page: Page,
            commentaire: a.comment,
            situation: getGeojsonMultiple(a),
            image: a.image,
            etudeId: props.id,
          })
          .then((res) =>
            console.log("reponce : " + res) || res ? sendthru() : null
          )
          .catch(
            (err) =>
              console.log("error : " + err) ||
              (document.getElementById("buttonSave").innerHTML = "Try again")
          );
      });
    } else {
      axios
        .post("http://127.0.0.1:8090/createRequete", {
          nom: NomCytoyen,
          tf: TF,
          page: Page,
          commentaire: commentaire,
          situation: getGeojsonOne(props.data),
          image: props.dataImage,
          etudeId: props.id,
        })
        .then((res) =>
          console.log("reponce : " + res) || res ? sendthru() : null
        )
        .catch(
          (err) =>
            console.log("error : " + err) ||
            (document.getElementById("buttonSave").innerHTML = "Try again")
        );
    }
  };
  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log("hna ba3da");
  //     props.onSubmit(saveButtonValue);
  //   };
  return (
    <div style={{ margin: "10px" }}>
      <form>
        {/* onSubmit={handleSubmit}> */}
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputEmail4">
              Nom <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              id="inputName"
              placeholder="Exemple : Mr. Prenom. Nom"
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div class="form-group col-md-6">
            <label for="inputEmail4">
              Page <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              id="inputPage"
              placeholder="Exemple : Page 1"
              onChange={(e) => setPage(e.target.value)}
              required
            />
          </div>
          <div class="form-group col-md-6">
            <label for="inputEmail4">
              Titre Foncier <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              id="inputTF"
              placeholder="Exemple : T.F. 209410/12"
              onChange={(e) => setTF(e.target.value)}
            />
          </div>
        </div>
        <div class="text-center">
          <button
            class="btn-success btn pull-center"
            onClick={saveMultiple}
            type="button"
            id="buttonSave"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
