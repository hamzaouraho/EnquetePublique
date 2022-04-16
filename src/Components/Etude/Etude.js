import React from "react";
import "./Etude.css";
import { MdHomeWork } from "react-icons/md";
import { FaGavel, FaCalendarAlt } from "react-icons/fa";
import { BsCalendar3WeekFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Etude(props) {
  const [style, setStyle] = React.useState({});
  const done = props.etude.duree;
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
        <img src={props.etude.url} />
      </div>
      <div className="etudeBody">
        <p className="titreHeader">{props.etude.titre} </p>
        <br />
        <p className="titreBody">
          <MdHomeWork
            className="iconsEtude"
            color="black"
            size="1.2rem"
            opacity={0.7}
          />
          <span>{props.etude.agence}</span>
          <br />
          <FaGavel
            className="iconsEtude"
            color="black"
            size="1.2rem"
            opacity={0.7}
          />
          {props.etude.decret}
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
              <span>{props.etude.dateFin}</span>
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
        <Link style={styleBotton} to="/visualiser">
          <button className="button-29">Visualiser</button>
        </Link>
        <Link style={styleBotton} to="/commenter">
          <button className="button-29">Commenter</button>
        </Link>
      </div>
    </div>
  );
}
