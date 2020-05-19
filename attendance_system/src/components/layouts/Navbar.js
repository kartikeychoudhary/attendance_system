import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

class Navbar extends Component {
  signOut = () => {
    localStorage.setItem("uid", "Logout");
    localStorage.setItem("UserState", "Logout");
    // this.props.history.push("/login");
    this.props.signout();
    // window.location.reload();
  };

  render() {
    const path = window.location.pathname;
    const type = this.props.firebase.profile.type;

    return (
      <nav className="navbar" style={{ zIndex: 1 }}>
        <ul className="navbar-nav">
          <li className="logo">
            <a href="#!" className="nav-link">
              <span className="link-text logo-text">Welcome</span>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fad"
                data-icon="angle-double-right"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg-inline--fa fa-angle-double-right fa-w-14 fa-5x"
              >
                <g className="fa-group">
                  <path
                    fill="currentColor"
                    d="M224 273L88.37 409a23.78 23.78 0 0 1-33.8 0L32 386.36a23.94 23.94 0 0 1 0-33.89l96.13-96.37L32 159.73a23.94 23.94 0 0 1 0-33.89l22.44-22.79a23.78 23.78 0 0 1 33.8 0L223.88 239a23.94 23.94 0 0 1 .1 34z"
                    className="fa-secondary"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M415.89 273L280.34 409a23.77 23.77 0 0 1-33.79 0L224 386.26a23.94 23.94 0 0 1 0-33.89L320.11 256l-96-96.47a23.94 23.94 0 0 1 0-33.89l22.52-22.59a23.77 23.77 0 0 1 33.79 0L416 239a24 24 0 0 1-.11 34z"
                    className="fa-primary"
                  ></path>
                </g>
              </svg>
            </a>
          </li>
          {path === "/login" ? (
            <>
              <li className="nav-item">
                <a href="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt fa-lg"></i>
                  <span className="link-text">Login</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/signup/student" className="nav-link">
                  <i className="fas fa-user-plus fa-lg"></i>
                  <span className="link-text">Sign-Up Student</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/signup/teacher" className="nav-link">
                  <i className="fas fa-user-plus fa-lg"></i>
                  <span className="link-text">Sign-Up Teacher</span>
                </a>
              </li>
            </>
          ) : null}

          {path === "/signup/student" || path === "/signup/teacher" ? (
            <li className="nav-item">
              <a href="/login" className="nav-link">
                <i className="fas fa-sign-in-alt fa-lg"></i>
                <span className="link-text">Go back to login</span>
              </a>
            </li>
          ) : null}

          {type === "student" ? (
            <>
              <li className="nav-item">
                <a href="/" className="nav-link">
                  <i className="fas fa-user-alt fa-lg"></i>
                  <span className="link-text">Profile</span>
                </a>
              </li>
            </>
          ) : null}

          {type === "teacher" ? (
            <>
              <li className="nav-item">
                <a href="/" className="nav-link">
                  <i className="fas fa-user-alt fa-lg"></i>
                  <span className="link-text">Profile</span>
                </a>
              </li>

              <li className="nav-item">
                <a href="/sessions" className="nav-link">
                  <i className="fas fa-book fa-lg"></i>
                  <span className="link-text">Sessions</span>
                </a>
              </li>
            </>
          ) : null}

          {type === "admin" ? (
            <>
              <li className="nav-item">
                <a href="/teachers" className="nav-link">
                  <i className="fas fa-chalkboard-teacher fa-lg"></i>
                  <span className="link-text">Teachers</span>
                </a>
              </li>

              <li className="nav-item">
                <a href="/students" className="nav-link">
                  <i className="fas fa-user-graduate fa-lg"></i>
                  <span className="link-text">Students</span>
                </a>
              </li>
            </>
          ) : null}

          {type ? (
            <>
              <li className="nav-item" id="themeButton">
                <a href="/login" className="nav-link" onClick={this.signOut}>
                  <i className="fas fa-sign-out-alt fa-lg"></i>
                  <span className="link-text">SignOut</span>
                </a>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = ({ firebase, user }) => {
  return { firebase, user };
};

const mapDispatchToProps = (dispatch) => ({
  signout: () => dispatch(signOut()),
  // dispatchLoginRequest: ({ email, password }) => {
  //   dispatch({
  //     type: LOGIN_USER_REQUEST,
  //     payload: { email, password },
  //   });
  // },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
