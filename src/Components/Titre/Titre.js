import { React, useState } from "react";
import "./Titre.css";
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

export default function Titre() {
  const [Titre, setTitre] = useState("");
  return (
    <div className="titreBox">
      <p className="titre">Enquete Publique</p>
      <div className="titreBoxSearchBox">
        <input
          type="text"
          placeholder=" Mots clés : Nom, Description, Organisme, ..."
          name="search"
          onChange={(event) => {
            setTitre(event.target.value);
          }}
        />
        <button>
          <FaFilter color="white" size="1rem" />
        </button>
        <button>
          <FaSearch color="white" size="1rem" />
        </button>

        <button>
          <HiRefresh color="white" size="1.3rem" />
        </button>
      </div>
    </div>
  );
}
