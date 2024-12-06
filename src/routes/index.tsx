import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Settings from "./Settings";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
