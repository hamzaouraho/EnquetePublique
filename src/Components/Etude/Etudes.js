import { React, useEffect, useState } from "react";
import Etude from "./Etude";
import axios from "axios";
import "./Etudes.css";
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

export default function Etudes() {
  // const etudess = [
  //   {
  //     id: 1,
  //     url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/fL0Lb9p4NnP1PK0sgZ0opve9Rnnm1o3qkw9BczHs",
  //     titre:
  //       "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
  //     agence: "Agence Urbaine de Nador-Driouch-Guercif",
  //     decret:
  //       "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
  //     dateDebut: "02/03/2022",
  //     dateFin: "01/04/2022",
  //     duree: 10,
  //   },
  //   {
  //     id: 2,
  //     url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/dJibbjLVJ2a2QjtnffKlJxGZvAQ18BZqS03PQWzm",
  //     titre:
  //       "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
  //     agence: "Agence Urbaine de Nador-Driouch-Guercif",
  //     decret:
  //       "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
  //     dateDebut: "02/03/2022",
  //     dateFin: "01/04/2022",
  //     duree: 20,
  //   },
  //   {
  //     id: 3,
  //     url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/gZ0oczHsO9hEPK0sb9p4AErjmcRcuF5odJapMVlD",
  //     titre:
  //       "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
  //     agence: "Agence Urbaine de Nador-Driouch-Guercif",
  //     decret:
  //       "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
  //     dateDebut: "02/03/2022",
  //     dateFin: "01/04/2022",
  //     duree: 5,
  //   },
  //   {
  //     id: 4,
  //     url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/ffKlZVAyLOpbPK0sczHsUFUPfRX84MCwdDYWb9p4",
  //     titre:
  //       "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
  //     agence: "Agence Urbaine de Nador-Driouch-Guercif",
  //     decret:
  //       "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
  //     dateDebut: "02/03/2022",
  //     dateFin: "01/04/2022",
  //     duree: 10,
  //   },
  // ];
  const [etudes, setetudes] = useState(null);
  const [Titre, setTitre] = useState("");
  const [Intitule, setIntitule] = useState("");
  const [Commune, setCommune] = useState("");
  const [TypeDoc, setTypeDoc] = useState("");
  const [Filter, setFilter] = useState(false);

  const url = "http://127.0.0.1:8090/etudes";

  useEffect(() => {
    axios.get(url).then((res) => {
      console.log("res : " + res);
      res.data.map((a) => console.log(a));
      setetudes(res.data);
      console.log(etudes);
    });
  }, [url]);

  let content = null;
  if (etudes) {
    // console.log("etude : " + etudes[0]);
    console.log("Titre : " + Titre);
    console.log("Commune : " + etudes[0].commune);
    console.log("Intitule : " + Intitule);
    content = etudes
      .filter((etude) => {
        if (Titre == "" && Commune == "" && Intitule == "" && TypeDoc == "") {
          return etude;
        } else if (
          etude.titre.toLowerCase().includes(Titre.toLowerCase()) &&
          etude.commune.toLowerCase().includes(Commune.toLowerCase()) &&
          etude.agenceUrba.toLowerCase().includes(Intitule.toLowerCase()) &&
          etude.typeDoc.toLowerCase().includes(TypeDoc.toLowerCase())
        ) {
          // console.log("etude.commune : " + etude.commune);
          return etude;
        }
        // else if (
        //   etude.titre.toLowerCase().includes(Titre.toLowerCase()) &&
        //   etude.commune.toLowerCase().includes(Commune.toLowerCase()) &&
        //   etude.intitule.toLowerCase().includes(Intitule.toLowerCase())
        // ) {
        //   // console.log("etude.commune : " + etude.commune);
        //   return etude;
        // }
        // if (etude.intitule.toLowerCase().includes(Intitule.toLowerCase())) {
        //   return etude;
        // }
        // if (etude.typeDoc.toLowerCase().includes(TypeDoc.toLowerCase())) {
        //   return etude;
        // }
      })
      .map((etude) => (
        // console.log("etude : ");
        <div className="etudeBoxAPP" key={etude.id}>
          <Etude etude={etude} />
        </div>
      ));
  }

  return (
    <div>
      <div>
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
            <button onClick={() => setFilter(!Filter)}>
              <FaFilter color="white" size="1rem" />
            </button>
            <button>
              <FaSearch color="white" size="1rem" />
            </button>

            <button>
              <HiRefresh color="white" size="1.3rem" />
            </button>
          </div>
          <div className={Filter ? "ShowImportButtonn" : "HideImportButtonn"}>
            <div className="Filterclass">
              <div className="filterClass">
                <label for="fname">Commune</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setCommune(event.target.value);
                  }}
                  placeholder="Commune.."
                />
              </div>
              <div className="filterClass">
                <label for="fname">Agence</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setIntitule(event.target.value);
                  }}
                  placeholder="Intitule.."
                />
              </div>
              <div className="filterClass">
                <label for="fname">type</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setTypeDoc(event.target.value);
                  }}
                  placeholder="type..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
}
