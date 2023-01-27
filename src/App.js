import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";

function App() {
  console.log('3002번 포트에서 실행');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
