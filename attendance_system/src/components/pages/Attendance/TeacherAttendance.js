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
  Table,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class TeacherAttendance extends Component {
  state = {
    sessions: [],
    attendance: [],
    loadedSessions: [],
    loadedStudents: [],
    loadedAttendance: {},
    students: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { uid, sessions, students, attendance } = props;

    if (sessions && uid && attendance && students) {
      let sess = [];
      let at = {};
      sessions.forEach((session) => {
        if (session.teacher === uid) {
          sess.push({
            id: session.id,
            name: session.name,
            semester: session.semester,
            teacher: session.teacher,
          });

          attendance.forEach((s) => {
            if (session.id === s.id) {
              at[session.id] = s;
            }
          });
        }
      });

      let stud = {};
      students.forEach((student) => {
        let id = student.id;
        stud[id] = {
          name: student.name,
          roll: student.roll,
          department: student.department,
          email: student.email,
        };
      });

      console.log(sess, at, stud);

      return { sessions: sess, students: stud, attendance: at };
    }

    return state;
  }

  handleSession = (e) => {
    let ls = {};
    try {
      ls = this.state.attendance[e.target.value];
    } finally {
    }
    if (ls) {
      let keys = Object.keys(ls);

      let loadedStudents = [];
      for (let i = 1; i < keys.length; i++) {
        loadedStudents.push({
          id: keys[i],
          name: this.state.students[keys[i]].name,
          roll: this.state.students[keys[i]].roll,
          department: this.state.students[keys[i]].department,
        });
      }
      console.log(ls, e.target.value, keys, loadedStudents);

      this.setState({ loadedStudents: loadedStudents, loadedAttendance: ls });
    } else {
      this.setState({ loadedStudents: [], loadedAttendance: ls });
    }
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
              <Grid item xs={10} sm={10} md={10}>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: "90%", marginTop: "1rem" }}
                >
                  <InputLabel id="session">Sessions</InputLabel>
                  <Select
                    labelId="session"
                    id="session"
                    // onChange={this.handleSession}
                    name="session"
                    label="Session"
                    //value={this.state.department}
                    onChange={this.handleSession}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {this.state.sessions.length > 0
                      ? this.state.sessions.map((session) => {
                          return (
                            <MenuItem value={session.id}>
                              {session.name}
                            </MenuItem>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Paper style={{ marginTop: "1rem" }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Roll</TableCell>
                    <TableCell align="right">Dates Present</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.loadedStudents.length > 0
                    ? this.state.loadedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell component="th" scope="row">
                            {student.name}
                          </TableCell>
                          <TableCell align="right">{student.roll}</TableCell>
                          <TableCell align="right">
                            {this.state.loadedAttendance[student.id].length > 0
                              ? this.state.loadedAttendance[student.id].map(
                                  (value) =>
                                    `${new Date(parseInt(value)).getDate()}-${
                                      new Date(parseInt(value)).getMonth() + 1
                                    },`
                                )
                              : "no attendance"}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sessions: state.firestore.ordered.sessions,
    // teachers: state.firestore.ordered.teachers,
    attendance: state.firestore.ordered.attendance,
    students: state.firestore.ordered.students,
    uid: state.firebase.auth.uid,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "sessions" },
    // { collection: "teachers" },
    { collection: "attendance" },
    { collection: "students" },
  ])
)(TeacherAttendance);
