import React from "react";

export default function TestLoadfile() {
  const showFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    console.log("reader : " + JSON.stringify(reader));
    reader.onload = (e) => {
      console.log("e : " + JSON.stringify(e));
      const text = e.target.result;
      console.log(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={showFile} />
    </div>
  );
}

// import React, { Component } from "react";

// class TestLoadfile extends Component {
//   constructor(props) {
//     super(props);
//   }

//   showFile = async (e) => {
//     e.preventDefault();
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const text = e.target.result;
//       console.log(text);
//     };
//     reader.readAsText(e.target.files[0]);
//   };

//   render = () => {
//     return (
//       <div>
//         <input type="file" onChange={(e) => this.showFile(e)} />
//       </div>
//     );
//   };
// }

// export default TestLoadfile;
