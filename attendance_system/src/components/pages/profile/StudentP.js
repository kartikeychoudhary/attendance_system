import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import imageCompression from "browser-image-compression";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { LinearProgress } from "@material-ui/core";

import axios, { post } from "axios";

import firebase from "../../../firebase/firebase";

import VideoRecorder from "../../layouts/VideoRecorder";

class StudentP extends Component {
  state = {
    photoURL: "",
    type: null,
    displayName: "",
    email: "",
    roll: "",
    status: "",
    department: "",
  };

  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    const { user } = props;
    const { student } = props;
    if (user) {
      if (user.length > 0) {
        const type = user[0].type;
        let email = "";
        let roll = "";
        let status = "";
        let displayName = "";
        let photoURL = null;
        let department = "";
        if (user[0].photoURL) {
          //console.log(photoURL);
          photoURL = user[0].photoURL;
        }
        if (student) {
          //console.log("student", student);
          if (student.length > 0) {
            email = student[0].email;
            displayName = student[0].name;
            roll = student[0].roll;
            status = student[0].status;
            department = student[0].department;
          }
        }

        return { photoURL, type, displayName, roll, status, department, email };
      }
    }
    return state;
  }

  handleProfilePhotoChange = async (e) => {
    console.log("photo upload");

    const imageFile = e.target.files[0];
    const uid = localStorage.getItem("uid");

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageFile, options);
    await firebase
      .storage()
      .ref(`users/${uid}/${imageFile.name}`)
      .put(compressedFile)
      .then((res) => {
        firebase
          .storage()
          .ref(`users/${uid}/${imageFile.name}`)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            console.log(fireBaseUrl);
            this.props.firestore.update(
              { collection: "users", doc: localStorage.getItem("uid") },
              { photoURL: fireBaseUrl }
            );
          });
      });
  };

  handleVideoFileUpload = async (e) => {
    e.preventDefault();
    console.log("video upload");
    const file = e.target.files[0];
    var blob = file.slice(0, file.size, file.type);
    var t = file.name.split(".").pop();
    const newFile = new File([blob], localStorage.getItem("uid") + "." + t, {
      type: "image/png",
    });
    const formData = new FormData();
    console.log(newFile);
    formData.append("file", newFile);

    axios
      .post("http://127.0.0.1:5000/video/upload", formData)
      .then((res) => console.log(res))
      .catch((err) => console.warn(err));
  };

  handleInputChange = (e) => {
    e.preventDefault();

    if (e.target.name === "photoUpload") {
      this.handleVideoFileUpload(e);
    } else {
      this.handleVideoFileUpload(e);
    }
  };

  render() {
    // photoURL ? photoURL : (photoURL = "/static/images/avatar/1.jpg");
    const {
      photoURL,
      roll,
      department,
      status,
      displayName,
      email,
    } = this.state;
    return (
      <div>
        <AppBar
          position="static"
          style={{ backgroundColor: "primary" }}
          elevation={0}
        >
          <Toolbar>
            <Grid
              justify="space-between" // Add it here :)
              container
            >
              <Grid item>
                <Typography type="title" color="inherit">
                  Student
                </Typography>
              </Grid>

              <Grid item>
                <div></div>
              </Grid>
            </Grid>
            <Typography>{email} </Typography>
            <Avatar
              style={{ align: "right", marginLeft: "1rem" }}
              alt="Remy Sharp"
              src={photoURL}
            />
          </Toolbar>
        </AppBar>
        <hr style={{ padding: "0", margin: "0" }} />
        <Container style={{ backgroundColor: "#F3F5F9", minHeight: "100vh" }}>
          <Grid container>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="h3"
                gutterBottom
                color="textPrimary"
                style={{ paddingTop: "1rem" }}
              >
                User Profile
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <div
                style={{
                  marginTop: "3rem",
                  verticalAlign: "middle",
                }}
              >
                <hr style={{ verticalAlign: "middle" }} />
              </div>
            </Grid>
          </Grid>

          <Paper style={{ marginTop: "1rem", padding: "1rem" }} elevation={3}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} style={{ padding: "1rem" }}>
                <form>
                  <Typography>
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      name="photoUpload"
                      style={{ display: "none" }}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        variant="outlined"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Typography>
                </form>

                <Avatar
                  alt="Remy Sharp"
                  src={photoURL}
                  style={{
                    width: "10rem",
                    height: "10rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                />
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  {displayName}
                </Typography>
                <hr />
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    {status === "V" ? (
                      <span style={{ color: "green" }}>Verified</span>
                    ) : (
                      <span style={{ color: "red" }}>Not-Verified</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {
                      <span style={{ float: "right", color: "green" }}>
                        {department}
                      </span>
                    }
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: "1rem" }}>
                    Roll Number {<span style={{ float: "right" }}>{roll}</span>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} sm={6} md={3} style={{ padding: "1rem" }}>
                <div>
                  <form>
                    <Typography variant="h6"> Update Face Data </Typography>
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      name="videoUpload"
                      style={{ display: "none" }}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        variant="outlined"
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>

                    {false ? (
                      <Button variant="outlined" color="primary">
                        Start Upload //{" "}
                      </Button>
                    ) : (
                      // <Button variant="outlined" color="primary">
                      //   Start Upload
                      // </Button>
                      // <Button variant="outlined" color="primary">
                      //   Start Upload
                      // </Button>
                      "Select File"
                    )}
                  </form>
                </div>
              </Grid>

              <Grid item xs={6} sm={6} md={3} style={{ padding: "1rem" }}>
                <div>
                  <Typography variant="h6"> Check Detection </Typography>
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={() => {
                      console.log("test");
                    }}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      variant="outlined"
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>

                  {false ? (
                    <Button variant="outlined" color="primary">
                      Start Upload
                    </Button>
                  ) : (
                    "Select File"
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3} style={{ padding: "1rem" }}>
                <div>
                  <Typography variant="h6"> View Attendance </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.firestore.ordered.users,
    student: state.firestore.ordered.students,
    uid: state.firebase.auth.uid,
  };
};

const mapDispatchToProps = (dispatch) => ({
  // signout: () => dispatch(signOut()),
  // dispatchLoginRequest: ({ email, password }) => {
  //   dispatch({
  //     type: LOGIN_USER_REQUEST,
  //     payload: { email, password },
  //   });
  // },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "users", doc: localStorage.getItem("uid") },
    { collection: "students", doc: localStorage.getItem("uid") },
  ])
)(StudentP);
