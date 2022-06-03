import { red } from "@mui/material/colors";
import React, { useState } from "react";
import "./Commentaire.css";
export default function Commentaire(props) {
  const data = props.data;
  // console.log("data : " + data);
  ///////////////
  const [FormData, setFormData] = useState({
    // coordonnee: "",
    comment: "",
    // titre: "",
    data: props.data,
  });
  // setFormData({
  //   coordonnee: "JSON.stringify(data)",
  //   comment: FormData.comment,
  //   email: FormData.email,
  // });
  const tab = [];
  const handleName = (e) => {
    setFormData({
      // coordonnee: FormData.coordonnee,
      comment: e.target.value,
      // titre: FormData.titre,
      data: props.data,
    });
  };

  // const handleTitre = (e) => {
  //   setFormData({
  //     // coordonnee: FormData.coordonnee,
  //     comment: FormData.comment,
  //     titre: e.target.value,
  //     data: props.data,
  //   });
  // };
  const hadelSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(FormData);
  };

  ///////////////
  return (
    <div
      style={{
        margin: "0px 20px 20px 20px",
        // backgroundColor: "#17a2b887",
        backgroundColor: "#a3cad2",
        padding: "5px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <form
        onSubmit={hadelSubmit}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0px",
          padding: "0px",
        }}
      >
        <ul
          class="form-style-1"
          style={{
            margin: "5px",
            padding: "2px",
            width: "350px",
          }}
        >
          <li>
            <label style={{ color: "white" }}>
              Your Message <span class="required">*</span>
            </label>
            <textarea
              style={{ backgroundColor: "#f7f7f7", height: "50px" }}
              name="field5"
              id="field5"
              class="field-long field-textarea"
              placeholder="Ecrire votre commentaire"
              onChange={handleName}
            ></textarea>
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              margin: "17px",
              width: "110px",
              fontSize: "16px",
              backgroundImage:
                "radial-gradient(100% 100% at 100% 0,#224c7b 0,#224c7b 100%)",
            }}
            class="button-29"
            href="#"
            onClick={() =>
              setFormData({
                // coordonnee: FormData.coordonnee,
                comment: FormData.comment,
                titre: FormData.titre,
                data: props.data,
                button: "add",
              })
            }
            type="submit"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}
