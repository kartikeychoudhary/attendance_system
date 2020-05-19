import React, { useState } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";

import { useFirebase } from "react-redux-firebase";
import { useFirestore } from "redux-firestore";
import { useHistory } from "react-router-dom";
import { useFirestoreConnect } from 'react-redux-firebase'

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch } from "react-redux";
import { saveUserProfile } from "../../store/actions/authActions";
import { saveUserStateToLocalStorage } from "../../store/actions/storeActions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90vh",
    width: "90%",
    marginTop: "1rem",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  if (localStorage.getItem("uid") !== "Logout") {
    props.history.push("/");
  }

  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const firebase = useFirebase();
  const firestore = firebase.firestore();
  const history = useHistory();

  const signInWithGoogle = () => {
    firebase
      .login({
        provider: "google",
        type: "popup",
      })
      .then((res) => {
        localStorage.setItem("uid", res.user.uid);
        props.history.push("/");
        window.location.reload();
      });
  };

  const signInWithUsernamePassword = (e) => {
    e.preventDefault();

    props.history.push("/");
    firebase.login({ email: email, password: password }).then((res) => {
      //console.log(firestore);

      dispatch(
        saveUserProfile(
          res.user.user.uid,
          res.user.user.displayName,
          email,
          res.user.user.photoURL
        )
      );

      dispatch(saveUserStateToLocalStorage());
      localStorage.setItem("uid", res.user.user.uid);
      props.history.push("/");
    });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={signInWithUsernamePassword}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>

            {/* <Button
              type="button"
              variant="contained"
              color="secondary"
              size="medium"
              className={classes.submit}
              fullWidth
              style={{ height: "30px" }}
              onClick={signInWithGoogle}
            >
              <i className="fab fa-google fa-lg"></i>
            </Button> */}

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
