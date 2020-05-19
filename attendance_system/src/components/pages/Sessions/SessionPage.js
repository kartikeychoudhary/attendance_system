import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import {
  LinearProgress,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
} from "@material-ui/core";
import Session from "./Session";
import { connect } from "react-redux";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class SessionPage extends Component {
  state = {
    sessions: [],
    teachers: [],
    department: [],
    loadedTeacher: [],
    loadedSessions: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { teachers, sessions } = props;

    if (teachers && sessions) {
      let department = [];
      let teach = [];
      let sess = [];

      teachers.forEach((teacher) => {
        if (!department.includes(teacher.department)) {
          department.push(teacher.department);
        }
        teach.push({
          email: teacher.email,
          name: teacher.name,
          department: teacher.department,
          id: teacher.id,
        });
      });

      sessions.forEach((session) => {
        sess.push({
          id: session.id,
          name: session.name,
          semester: session.semester,
          teacher: session.teacher,
        });
      });
      console.log(teachers, sessions, department);

      return { sessions: sess, teachers: teach, department: department };
    }

    return state;
  }

  handleDepartments = (e) => {
    // e.preventDefaults();
    let teachers = [];
    this.state.teachers.forEach((teacher) => {
      if (teacher.department === e.target.value) {
        teachers.push(teacher);
      }
    });
    console.log(teachers);
    this.setState({ loadedTeacher: teachers });
  };

  handleTeachers = (e) => {
    let sessions = [];
    this.state.sessions.forEach((session) => {
      if (session.teacher === e.target.value) {
        sessions.push(session);
      }
    });
    console.log(sessions, e.target.value);

    this.setState({ loadedSessions: sessions });
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
        <Container style={{ backgroundColor: "#F3F5F9", minHeight: "100vh" }}>
          <Paper style={{ marginTop: "1rem", padding: "1rem" }} elevation={3}>
            <Grid container>
              <Grid item xs={10} sm={8} md={6}>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: "90%", marginTop: "1rem" }}
                >
                  <InputLabel id="department">Department</InputLabel>
                  <Select
                    labelId="department"
                    id="department"
                    // value={department}
                    // onChange={handleChange}
                    name="department"
                    label="Department"
                    //value={this.state.department}
                    onChange={this.handleDepartments}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"CSE"}>
                      Computer Science and Engineering
                    </MenuItem>
                    <MenuItem value={"MECH"}>Mechanical</MenuItem>
                    <MenuItem value={"Electronics"}>Electronics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10} sm={4} md={4}>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: "90%", marginTop: "1rem" }}
                >
                  <InputLabel id="department">Teachers</InputLabel>
                  <Select
                    labelId="department"
                    id="department"
                    // onChange={handleChange}
                    name="department"
                    label="Department"
                    //value={this.state.department}
                    onChange={this.handleTeachers}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {this.state.loadedTeacher.length > 0
                      ? this.state.loadedTeacher.map((teacher) => {
                          return (
                            <MenuItem value={teacher.id}>
                              {teacher.name}
                            </MenuItem>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
              </Grid>

              {this.state.loadedSessions.length > 0 ? (
                <Grid item xs={12}>
                  <ul>
                    {this.state.loadedSessions.map((session) => {
                      return (
                        <li>
                          {session.name} : {session.semester} : {session.id} :
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: "1rem" }}
                          >
                            Submit Attendance
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </Grid>
              ) : null}
            </Grid>
          </Paper>
        </Container>
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
)(SessionPage);
