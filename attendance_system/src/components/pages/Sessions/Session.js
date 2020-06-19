import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";

import axios from "axios";

import {
  LinearProgress,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Paper,
} from "@material-ui/core";

import { CameraFeed } from "../../layouts/CameraFeed";

class Session extends Component {
  state = {
    id: "",
    name: "",
    teacher: {},
    semester: "",
    attendance: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { session, teachers, attendance } = props;

    if (session && teachers && attendance) {
      // console.log(session);
      const { id, name, semester, teacher } = session;
      let t = {};
      console.log(teachers);
      if (teachers) {
        teachers.forEach((tt) => {
          if (tt.id === teacher) {
            const { id, name, department, email } = tt;

            t = { id, name, department, email };
          }
        });
      }
      console.log(attendance);
      return { id, name, semester, teacher: t, attendance };
    }

    return state;
  }

  attendSession(uid) {
    // ! axios
    let prev = [];
    console.log(this.state.attendance[uid]);
    if (this.state.attendance[uid]) {
      prev = this.state.attendance[uid];
    }
    let obj = {};
    let temp = [];
    prev.forEach((item) => {
      temp.push(item);
    });
    temp.push(Date.now().toString());

    console.log(temp, obj);
    obj[uid.toString()] = temp;
    console.log(obj);
    const { firestore } = this.props;
    firestore.update(
      { collection: "attendance", doc: this.props.match.params.id },
      obj
    );
  }

  uploadImage = async (file) => {
    const formData = new FormData();
    const newFile = new File([file], "test.jpg", {
      type: "image/png",
    });
    formData.append("file", newFile);
    formData.append("session", this.state.id);

    axios
      .post("http://127.0.0.1:5000/predict", formData)
      .then((res) => {
        res.data.result.forEach((id) => {
          if (id !== "Unknown") {
            this.attendSession(id);
          }
        });
      })
      .catch((err) => console.warn(err));
  };

  render() {
    const { name, semester, teacher } = this.state;

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
                  Session
                </Typography>
              </Grid>

              <Grid item>
                <div></div>
              </Grid>
            </Grid>
            <Typography></Typography>
          </Toolbar>
        </AppBar>
        <hr style={{ padding: "0", margin: "0" }} />
        <Container style={{ backgroundColor: "#F3F5F9", minHeight: "100vh" }}>
          <Typography
            variant="h5"
            style={{
              padding: "1rem",
            }}
          >
            {name ? (
              <div>
                {name}. Semester : {semester} By. {teacher.name}
              </div>
            ) : null}
          </Typography>
          <hr></hr>
          <Paper
            style={{
              marginTop: "2rem",
            }}
          >
            <CameraFeed sendFile={this.uploadImage} />
          </Paper>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    session:
      state.firestore.ordered.session && state.firestore.ordered.session[0],
    teachers: state.firestore.ordered.teachers,
    attendance:
      state.firestore.ordered.attendance &&
      state.firestore.ordered.attendance[0],
    // uid: state.firebase.auth.uid,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => [
    { collection: "sessions", storeAs: "session", doc: props.match.params.id },
    { collection: "teachers" },
    { collection: "attendance", doc: props.match.params.id },
  ])
)(Session);
