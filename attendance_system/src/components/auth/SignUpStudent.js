import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { LinearProgress } from "@material-ui/core";
import firebase from "../../firebase/firebase";

class SignUpStudent extends Component {
  state = {
    loading: false,
    fname: "",
    lname: "",
    department: "",
    roll: "",
    email: "",
    password: "",
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  validate = () => {
    let flag = true;
    console.log(this.state);
    if (this.state.fname === "") {
      alert("Please fill Firstname");
      return false;
    }
    if (this.state.lname === "") {
      alert("Please fill Lastname");
      return false;
    }
    if (this.state.roll === "") {
      alert("Please fill RollNumber");
      return false;
    }
    if (this.state.department === "") {
      alert("Please select a department");
      return false;
    }
    if (this.state.email === "") {
      alert("Please fill valid email");
      return false;
    }
    if (this.state.password === "") {
      alert("Please fill the password");
      return false;
    }

    return flag;
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const { email, password, department, roll, fname, lname } = this.state;
      this.setState({
        loading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const uid = res.user.uid;
          const name = fname + " " + lname;
          this.props.firestore
            .set(
              { collection: "students", doc: uid },
              { email, status: "NV", department, roll, name: name }
            )
            .then(() => {
              //console.log("test");

              this.props.firestore
                .set({ collection: "users", doc: uid }, { type: "student" })
                .then(() => {
                  this.setState({ loading: false });
                  localStorage.setItem("uid", uid);
                  this.props.history("/");
                });
            });
        });
    }
  };

  render() {
    return (
      <>
        {this.state.loading ? <LinearProgress color="secondary" /> : null}
        <Container
          component="main"
          maxWidth="xs"
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CssBaseline />
          <div>
            <Avatar
              style={{
                backgroundColor: "#FF7B7B",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ padding: "1rem" }}>
              Sign up Student
            </Typography>
            <form noValidate onSubmit={this.onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="fname"
                    variant="outlined"
                    name="fname"
                    value={this.state.fname}
                    onChange={this.onChange}
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lname"
                    value={this.state.lname}
                    onChange={this.onChange}
                    autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="roll"
                    label="Roll Number"
                    name="roll"
                    value={this.state.roll}
                    onChange={this.onChange}
                    autoComplete="roll"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" style={{ minWidth: "100%" }}>
                    <InputLabel id="department">Department</InputLabel>
                    <Select
                      labelId="department"
                      id="department"
                      // value={department}
                      // onChange={handleChange}
                      name="department"
                      label="Department"
                      value={this.state.department}
                      onChange={this.onChange}
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
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    label="Password"
                    type="password"
                    id="password"
                    minLength={8}
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
              >
                Sign Up
              </Button>
              {this.state.loading ? <LinearProgress color="secondary" /> : null}

              <Grid container justify="flex-end">
                <Grid item style={{ padding: "1rem" }}>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    firebase: state.firebase,
    firestore: state.firestore,
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
  firestoreConnect([{ collection: "students" }, { collection: "users" }])
)(SignUpStudent);
