import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import Navbar from "./components/layouts/Navbar";
import Home from "./components/pages/Home";
import Sessions from "./components/pages/Sessions";
import Teachers from "./components/pages/Teachers";
import Students from "./components/pages/Students";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";

import { Provider } from "react-redux";
import { store, rrfProps } from "./store";
import SignUpStudent from "./components/auth/SignUpStudent";
import SignUpTeacher from "./components/auth/SignUpTeacher";

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <div className="App">
          <Navbar />
          <main style={{}}>
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/sessions" component={Sessions} />
                <Route exact path="/teachers" component={Teachers} />
                <Route exact path="/students" component={Students} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/signup/student" component={SignUpStudent} />
                <Route exact path="/signup/teacher" component={SignUpTeacher} />
              </Switch>
            </Router>
          </main>
        </div>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
