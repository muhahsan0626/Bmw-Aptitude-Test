import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Hero from "./Hero";

import CarDetails from "./CarDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/car/:id" element={<CarDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
