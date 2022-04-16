import React from "react";
import "./Header.css";
export default function Header() {
  return (
    <div className="HeaderBox">
      <div className="HeaderBoxMin">
        <img
          className="fit-picture"
          src="https://taamir.gov.ma/karazal/extensions/assets/img/logo/maroc.png"
          alt="maroc"
        ></img>
        <div className="pBox">
          <p className="pMinistere">
            <span
              style={{
                fontSize: "15px",
                textTransform: "uppercase",
                marginBottom: "2px",
                lineHeight: "10px",
                fontWeight: "900",
                fontFamily: "Roboto",
                color: "#506172",
              }}
            >
              ROYAUME DU MAROC
            </span>
            <br />{" "}
            <span
              style={{
                fontSize: "13px",
                lineHeight: "16px",
                marginBottom: "2px",
                fontWeight: 500,
                color: "#444",
              }}
            >
              Ministère de l’Aménagement du Territoire National, de l’Urbanisme,
              de l’Habitat et de la Politique de la Ville
            </span>
            <br />
            Département de l’Aménagement du Territoire et de l’Urbanisme
          </p>
        </div>
      </div>
      <div className="HeaderBoxLoc">
        <img
          className="AUIMG"
          src="https://taamir.gov.ma/karazal/img/AUIMG.PNG"
          alt="AUIMG"
        ></img>
      </div>
    </div>
  );
}
