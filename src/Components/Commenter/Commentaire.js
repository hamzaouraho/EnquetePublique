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
    titre: "",
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
      titre: FormData.titre,
      data: props.data,
    });
  };

  const handleTitre = (e) => {
    setFormData({
      // coordonnee: FormData.coordonnee,
      comment: FormData.comment,
      titre: e.target.value,
      data: props.data,
    });
  };
  const hadelSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(FormData);
  };

  ///////////////
  return (
    <div
      style={{
        margin: "0px 20px ",
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
          {/* <li> */}
          {/* {data.map((test) => test["lat"] + ", " + test["long"])} */}
          {/* <label>
              Coordonnée <span class="required">*</span>
            </label> */}
          {/* <textarea
              rows="4"
              cols="50"
              readOnly
              name="field5"
              id="field5"
              class="field-long field-textarea"
              value={data.map(
                (test) =>
                  "X : " +
                  test["lat"].toFixed(2) +
                  ", Y : " +
                  test["long"].toFixed(2) +
                  "\n"
              )}
            ></textarea> */}
          {/* </li> */}
          {/* <h4 style={{ color: "white" }}>Entity : {data[0]["entity"]}</h4> */}
          <li>
            <label style={{ color: "white" }}>
              Type <span class="required">*</span>
            </label>
            <input
              type="text"
              name="field1"
              class="field-long"
              placeholder="Titre"
              onChange={handleTitre}
            />
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
          {/* <li>
            <label>
              Full Name <span class="required">*</span>
            </label>
            <input
              type="text"
              name="field1"
              class="field-divided"
              placeholder="First"
            />{" "}
            <input
              type="text"
              name="field2"
              class="field-divided"
              placeholder="Last"
            />
          </li> */}
          {/* <li>
            <label>
              Email <span class="required">*</span>
            </label>
            <input
              type="email"
              name="field3"
              class="field-long"
              onChange={handleEmail}
            />
          </li> */}
          {/* <li>
            <label>Subject</label>
            <select name="field4" class="field-select">
              <option value="Advertise">Advertise</option>
              <option value="Partnership">Partnership</option>
              <option value="General Question">General</option>
            </select>
          </li> */}
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
          {/* <button
            style={{
              margin: "17px",
              width: "110px",
              fontSize: "16px",
              backgroundImage:
                "radial-gradient(100% 100% at 100% 0,#406882 0,#406882 100%)",
            }}
            class="button-29"
            href="#"
            onClick={() =>
              setFormData({
                // coordonnee: FormData.coordonnee,
                comment: FormData.comment,
                titre: FormData.titre,
                data: props.data,
                button: "delete",
              })
            }
            type="submit"
          >
            Supprimer
          </button> */}
        </div>
      </form>
    </div>
  );
}
