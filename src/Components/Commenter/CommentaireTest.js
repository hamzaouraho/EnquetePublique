import React, { useState } from "react";

import "./Commentaire.css";
import { BiZoomIn } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
export default function CommentaireTest(props, CommentActionn) {
  let data = props.data;
  const [CommentAction, setCommentAction] = useState({
    action: "",
    data: props.data,
  });
  // console.log("{props.image : " + props.data["image"]);
  props.CommentActionn(CommentAction);
  // console.log("salem : " + JSON.stringify(props.data));
  const zoomin = (e) => {
    e.preventDefault();
    props.zoomin({ action: "zoomin", data: props.data });
  };
  const deleteComment = (e) => {
    e.preventDefault();
    props.deleteComment({ action: "delete", data: props.data });
  };

  return (
    <div
      style={{
        margin: "15px 25px",
        backgroundColor: "#45617e30",
        padding: "13px",
        // display: "flex",
        // border: "1px solid #FFF",
        borderRadius: "6px",
        // backgroundColor:"#34346f",
        boxShadow:
          "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <form style={{ display: "flex" }}>
        {/* <button> */}

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
                paddingRight: "10px",
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
              style={{ height: "60px" }}
              value={props.data["comment"]}
            ></textarea>
            <img
              src={props.data["image"]}
              alt="Paris"
              style={{
                width: "60px",
                height: "60px",
                marginLeft: "10px",
                // marginRight: "10px",
              }}
            />
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "10px",
          }}
        >
          <BiZoomIn
            style={{ margin: "2px", cursor: "pointer" }}
            color="black"
            size="1.2rem"
            onClick={zoomin}
          />
          <MdDelete
            style={{ margin: "2px", cursor: "pointer" }}
            size="1.2rem"
            color="#bf1e1c"
            onClick={deleteComment}
          />
        </div>
      </form>
    </div>
  );
}
