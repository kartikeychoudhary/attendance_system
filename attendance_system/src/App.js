import React from "react";
import "./App.css";
import Navbar from "./components/layouts/Navbar";
import Home from "./components/pages/Home";
import Sessions from "./components/pages/Sessions";
import Teachers from "./components/pages/Teachers";
import Students from "./components/pages/Students";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/sessions" component={Sessions} />
            <Route exact path="/teachers" component={Teachers} />
            <Route exact path="/students" component={Students} />
          </Switch>
        </Router>
      </main>
    </div>
  );
}

export default App;
