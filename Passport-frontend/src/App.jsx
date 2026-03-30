import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import ApplyPassport from "./pages/ApplyPassport";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/apply" element={<ApplyPassport />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
