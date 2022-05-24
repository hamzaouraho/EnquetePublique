// import React from "react";
// import ReactDOM from "react-dom";
// import { PDFViewer } from "@react-pdf/renderer";

// const Testtest = () => (
//   <>
//     <h1>hamza</h1>
//     {/* <PDFViewer>
//       <MyDocument />
//     </PDFViewer> */}
//   </>
// );

// ReactDOM.render(<Testtest />, document.getElementById("root"));
// export default Testtest;

// import * as React from "react";

// import { useScreenshot } from "use-screenshot-hook"

// export default function testtest() {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const { image, takeScreenshot } = useScreenshot();
//   return (
//     <div>
//       <h1>Hello World!</h1>
//       <button onClick={() => takeScreenshot()}>screenshot</button>
//       {image && <img src={img} />}
//     </div>
//   );
// }

import React from "react";
import { render } from "react-dom";
import html2canvas from "html2canvas";

export default function testtest() {
  // const exportAsImage = async (el, imageFileName) => {
  //   const canvas = await html2canvas(element);
  //   const image = canvas.toDataURL("image/png", 1.0);
  //   // download the image
  //   };
  html2canvas("main-content").then(function (canvas) {
    document.body.appendChild(canvas);
  });

  return (
    <>
      <>
        <div id="main-content" class="main-content">
          <div id="primary" class="content-area">
            <div id="content-bautismo" class="site-content" role="main">
              <h1>Wesley Montoya</h1>
              <h1>Iglesia Luz de Vida Eterna</h1>
              <h1>Naples, Florida</h1>
              <h1>10</h1>
              <h1>Noviembre</h1>
              <h1>2019</h1>
            </div>
          </div>
        </div>
        <div id="app"></div>
      </>
    </>
  );
}
