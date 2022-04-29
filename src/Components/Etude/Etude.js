import React from "react";
import "./Etude.css";
import { MdHomeWork } from "react-icons/md";
import { FaGavel, FaCalendarAlt } from "react-icons/fa";
import { BsCalendar3WeekFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Etude(props) {
  const [style, setStyle] = React.useState({});
  const dd = props.etude.dateDebut;
  const day = parseInt(dd[0] + dd[1]);
  const month = parseInt(dd[3] + dd[4]);
  const year = parseInt(dd[6] + dd[7] + dd[8] + dd[9]);

  let df =
    "0" + day.toString() + "/" + (month + 1).toString() + "/" + year.toString();

  if (day < 10) {
    df =
      "0" +
      day.toString() +
      "/" +
      (month + 1).toString() +
      "/" +
      year.toString();
    if (month + 1 < 10) {
      df =
        "0" +
        day.toString() +
        "/" +
        "0" +
        (month + 1).toString() +
        "/" +
        year.toString();
    }
    if (month == 12) {
      df = "0" + day.toString() + "/" + "01" + "/" + (year + 1).toString();
    }
  }
  if (month + 1 < 10) {
    df =
      day.toString() +
      "/" +
      "0" +
      (month + 1).toString() +
      "/" +
      year.toString();
  }

  let today = new Date();

  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let done = 0;
  if (today.getMonth() + 1 > day) {
    done = today.getMonth() + 1 - day;
  } else {
    done = today.getMonth() + 1 + 30 - day;
  }

  const Jrest = 30 - done;
  const donee = (done * 100) / 30;
  const styleBotton = {
    textDecoration: "none",
  };
  // const { url, titre } = props.etude[0];
  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${donee}%`,
    };

    setStyle(newStyle);
  }, 200);

  return (
    <div className="etudeBox">
      <div className="etudeHeader">
        <img src={props.etude.pictureUrl} />
      </div>
      <div className="etudeBody">
        <p className="titreHeader">{props.etude.titre} </p>
        <br />
        <p className="titreBody">
          <FaGavel
            className="iconsEtude"
            color="black"
            size="1.2rem"
            opacity={0.7}
          />
          {props.etude.intitule} | {props.etude.commune}
          <br />
          <MdHomeWork
            className="iconsEtude"
            color="black"
            size="1.2rem"
            opacity={0.7}
          />
          <span>
            {props.etude.agenceUrba} | {props.etude.typeDoc}
          </span>
        </p>
        <div className="titreFooter">
          <div className="dateDebut">
            <div>
              <FaCalendarAlt
                className="iconsEtude"
                color="black"
                size="1rem"
                opacity={0.7}
              />
              Date Début&nbsp;&nbsp;
              <span>{props.etude.dateDebut}</span>
            </div>
            <div>
              <FaCalendarAlt
                className="iconsEtude"
                color="black"
                size="1rem"
                opacity={0.7}
              />
              Date Fin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{df}</span>
            </div>
          </div>
          <div className="progresBar">
            <div className="progress">
              <div className="progress-done" style={style}>
                {done}J / 30
              </div>
            </div>

            <p>{Jrest} jours restants</p>
          </div>
        </div>
      </div>
      <div className="etudeFooter">
        <Link style={styleBotton} to={`visualiser/${props.etude.id}`}>
          <button className="button-29">Visualiser</button>
        </Link>
        <Link style={styleBotton} to="commenter">
          <button className="button-29">Commenter</button>
        </Link>
      </div>
    </div>
  );
}
