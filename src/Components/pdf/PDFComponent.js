import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";
import ihamzaCV from "../CarteConsolidee/cvPhoto.png";
import logo from "../CarteConsolidee/logo.png";
export default function PDFComponent(props) {
  const domEl = useRef(null);
  console.log("nbrpage " + JSON.stringify(props.nbrpage));
  console.log(
    "indexNbr : " + (parseInt(JSON.stringify(props.indexNbr.index)) + 1)
  );
  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domEl.current);

    // download image
    const link = document.createElement("a");
    link.download = "html-to-img.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      <div>
        <div id="domEl" ref={domEl}>
          <div
            style={{
              margin: "5px 0px",
            }}
          >
            <img alt="" className="imglogoo" src={logo} />
          </div>
          <table
            style={{
              tableLayout: "fixed",
              width: "100%",
              textAlign: "center",
            }}
          >
            <tr style={{ backgroundColor: "#d9d9d9", color: "white" }}>
              <th colspan="6" style={{ color: "#eeeeee" }}>
                Requete N°
              </th>

              <th colspan="15" style={{ color: "#eeeeee" }}>
                Situation
              </th>
            </tr>
            <tr>
              <td colspan="2" style={{ fontSize: "6px" }}>
                {props.data.page}
              </td>
              <td colspan="4" style={{ fontSize: "6px" }}>
                {props.data.nom}
              </td>
              <td
                rowspan="15"
                style={{ backgroundColor: "#b4c7e7", color: "white" }}
              >
                P A - E D I T I O N E N Q U E T E P U B L I Q U E-
              </td>
              <td rowspan="15" colspan="14">
                <img
                  alt=""
                  style={{ width: "300px", height: "233px" }}
                  className="imglogo2"
                  src={props.data.image}
                />
              </td>
            </tr>
            <tr>
              <td colspan="6" style={{ fontSize: "6px" }}>
                {props.data.tf}
              </td>
            </tr>
            <tr>
              <td colspan="6" style={{ fontSize: "6px" }}>
                {props.data.commentaire}
              </td>
            </tr>
            <tr>
              <td colspan="6" rowspan="6"></td>
            </tr>
          </table>
          {parseInt(JSON.stringify(props.indexNbr.index)) + 1 !==
          parseInt(JSON.stringify(props.nbrpage)) ? (
            <p className="page-break" />
          ) : null}
          {/* if({props.indexNbr}!={props.nbrpage}){<p className="page-break" />} */}
          {/* <h3>Convert HTML element or document into Image in React</h3> */}
        </div>
      </div>
      {/* <div className="Appa">
        <button onClick={downloadImage}>Download Image</button>
      </div> */}
    </>
  );
}
