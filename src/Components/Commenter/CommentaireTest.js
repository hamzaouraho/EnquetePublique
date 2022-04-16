import React, { useState } from "react";
import "./Commentaire.css";

export default function CommentaireTest(props) {
  const data = props.data;
  console.log("salem : " + JSON.stringify(props.data));
  return (
    <div
      style={{
        margin: "15px 25px",
        backgroundColor: "#45617e30",
        // display: "flex",
        // border: "1px solid #FFF",
        borderRadius: "6px",
        // backgroundColor:"#34346f",
        padding: "5px",
        boxShadow:
          "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <form style={{ display: "flex" }}>
        <ul
          class="form-style-1"
          style={{
            flex: 1,
            margin: "0px",
            padding: "0px",
            width: "350px",
          }}
        >
          <li style={{ display: "flex" }}>
            <label
              style={{
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Type
            </label>
            <input
              type="text"
              name="field1"
              class="field-long"
              readOnly
              value={props.data["titre"]}
            ></input>
          </li>
          <li style={{ display: "flex" }}>
            <label
              style={{
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Commentaire
            </label>
            <textarea
              name="field5"
              id="field5"
              readOnly
              class="field-long field-textarea"
              style={{ height: "40px" }}
              value={props.data["comment"]}
            ></textarea>
          </li>
        </ul>
      </form>
    </div>
  );
}
