import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Symptoms from "./pages/Symptoms";
import Results from "./pages/Results";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/symptoms" element={<Symptoms />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/results" element={<Results />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;