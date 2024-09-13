import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "./component/ui/button";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./component/Home";

function App() {
  return (
    <div>
      <Router>
        <div>
          <nav>
            <ul className="flex space-x-4 bg-gray-100 p-4">
              <li>
                <Link to="/" className="text-blue-500 hover:text-blue-700">
                  Home
                </Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
