import "./App.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarMenu from "./Components/NavBarMenu/NavbarMenu";
import Header from "./Components/Header/Header";
import Titre from "./Components/Titre/Titre";
import Etudes from "./Components/Etude/Etudes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Visualiser from "./Components/Visualiser/Visualiser";
import Commenter from "./Components/Commenter/Commenter";
import TestLoadfile from "./TestLoadfile";
import CarteConsolidee from "./Components/CarteConsolidee/CarteConsolidee";
import Testtest from "./Components/pdf/Testtest";
import CreateEtude from "./Components/CreateEtude/CreateEtude";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavbarMenu />
        <Header />

        <Routes>
          <Route path="/" element={<Titre />} />
          <Route path="enquete-pub" element={<Etudes />} />
          {/* <Route path="enquete-pubb" element={<Navigate to="/enquete-pub" />} /> */}
          <Route path="enquete-pub/visualiser/:id" element={<Visualiser />} />
          <Route path="enquete-pub/commenter/:id" element={<Commenter />} />
          <Route path="test" element={<TestLoadfile />} />
          <Route path="carte-consolidee" element={<CarteConsolidee />} />
          <Route path="textexportpdf" element={<Testtest />} />
          <Route path="create-etude" element={<CreateEtude />} />
        </Routes>
      </BrowserRouter>
      <div className="Footer"></div>
    </>
  );
}

export default App;
