import React from "react";
import Map from "../Map/MapComment";
import { useParams } from "react-router-dom";
export default function Commenter() {
  const { id } = useParams();
  return (
    <>
      <Map id={id} />
    </>
  );
}
