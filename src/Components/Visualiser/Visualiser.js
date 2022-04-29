import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MyMap from "./../Map/Map";
import "reactjs-popup/dist/index.css";

export default function Visualiser() {
  const { id } = useParams();
  const [perimetre, setperimetre] = useState(null);

  const url = "http://127.0.0.1:8000/api/visualiser/" + id;

  useEffect(() => {
    axios.get(url).then((res) => {
      setperimetre(res.data);
    });
  }, [url]);
  let content = null;
  if (perimetre) {
    // console.log("kiki1 " + perimetre);
    content = (
      <div key={perimetre.id}>
        <MyMap perimetre={perimetre} />
      </div>
    );
  }

  return <div>{content}</div>;
}
