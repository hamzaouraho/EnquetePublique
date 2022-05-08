import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Commentaire.css";
export default function SaveCommentaire(props, saveButtonV) {
  let commentaire = "";

  const [NomCytoyen, setNom] = useState("");
  const [Page, setPage] = useState("");
  const [TF, setTF] = useState("");
  const [Commentaire, setCommentaire] = useState("-");
  const [saveButtonValue, setsaveButtonValue] = useState(true);
  const url = "http://127.0.0.1:8000/api/etudes";
  const stock = "aa";
  props.data
    ? console.log("yzyz " + JSON.stringify(props.data))
    : console.log("");
  console.log("commentaire avant : " + commentaire);
  props.data
    ? JSON.parse(props.data).features.map((a, i) => {
        console.log(i);
        if (i == 0) {
          commentaire = "-" + a.properties.commentaire;
        } else {
          commentaire = commentaire + ", -" + a.properties.commentaire;
        }

        // console.log("a : " + JSON.stringify(a.properties.commentaire));
        // setCommentaire([...Commentaire, "/n *", a.properties.commentaire]);
        // console.log("ssalam");
      })
    : console.log("");
  console.log("commentaire : " + commentaire);

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
  const saveButton = () => {
    console.log(
      "chabab cv : " +
        NomCytoyen +
        ", " +
        Page +
        ", " +
        TF +
        ", " +
        commentaire +
        ", " +
        props.data
    );
    axios
      .post("http://127.0.0.1:8000/api/createRequete", {
        nom: NomCytoyen,
        tf: TF,
        page: Page,
        commentaire: commentaire,
        situation: props.data,
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
            onClick={saveButton}
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
