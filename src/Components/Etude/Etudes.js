import React from "react";
import Etude from "./Etude";
import "./Etudes.css";

export default function Etudes() {
  const etudes = [
    {
      id: 1,
      url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/fL0Lb9p4NnP1PK0sgZ0opve9Rnnm1o3qkw9BczHs",
      titre:
        "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
      agence: "Agence Urbaine de Nador-Driouch-Guercif",
      decret:
        "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
      dateDebut: "02/03/2022",
      dateFin: "01/04/2022",
      duree: 10,
    },
    {
      id: 2,
      url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/dJibbjLVJ2a2QjtnffKlJxGZvAQ18BZqS03PQWzm",
      titre:
        "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
      agence: "Agence Urbaine de Nador-Driouch-Guercif",
      decret:
        "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
      dateDebut: "02/03/2022",
      dateFin: "01/04/2022",
      duree: 20,
    },
    {
      id: 3,
      url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/gZ0oczHsO9hEPK0sb9p4AErjmcRcuF5odJapMVlD",
      titre:
        "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
      agence: "Agence Urbaine de Nador-Driouch-Guercif",
      decret:
        "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
      dateDebut: "02/03/2022",
      dateFin: "01/04/2022",
      duree: 5,
    },
    {
      id: 4,
      url: "https://taamir.gov.ma/karazal/DownloadFile?gedId=79288173-5a32-4b7d-beaf-2db913fda7e6/ffKlZVAyLOpbPK0sczHsUFUPfRX84MCwdDYWb9p4",
      titre:
        "DU-PLAN D’AMÉNAGEMENT FARKHANA-ABDOUNA TARIFA-BNI ANSAR/BNI CHIKER",
      agence: "Agence Urbaine de Nador-Driouch-Guercif",
      decret:
        "Décret n°2.13.275 du 22/04/2013, B.O n°6146 du 25/04/2013 ( 2013-04-04 )",
      dateDebut: "02/03/2022",
      dateFin: "01/04/2022",
      duree: 10,
    },
  ];

  return etudes.map((etude) => (
    <div className="etudeBoxAPP" key={etude.id}>
      <Etude etude={etude} />
    </div>
  ));
}
