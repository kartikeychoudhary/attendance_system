import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";

import {
  LinearProgress,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";

class Session extends Component {
  state = {
    sessions: [],
    teachers: [],
  };

  render() {
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
        <Container
          style={{ backgroundColor: "#F3F5F9", minHeight: "100vh" }}

          
        ></Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sessions: state.firestore.ordered.sessions,
    teachers: state.firestore.ordered.teachers,
    // uid: state.firebase.auth.uid,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "sessions" }, { collection: "teachers" }])
)(Session);
