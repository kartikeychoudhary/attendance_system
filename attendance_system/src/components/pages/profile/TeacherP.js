import React, { Component } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

class TeacherP extends Component {
  render() {
    const email = this.props.firebase.profile.email;
    const type = this.props.firebase.profile.type;
    const bull = (
      <span
        style={{
          display: "inline-block",
          margin: "0 2px",
          transform: "scale(0.8)",
        }}
      >
        •
      </span>
    );
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
                  {type}
                </Typography>
              </Grid>

              <Grid item>
                <div></div>
              </Grid>
            </Grid>
            <Typography>{email}</Typography>
          </Toolbar>
        </AppBar>

        <Grid
          container
          style={{
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Grid item xs={10} sm={8} md={6} style={{ marginTop: "5rem" }}>
            <Card style={{ minWidth: 275 }} elevation={3}>
              <CardContent>
                <Typography
                  style={{ fontSize: 14 }}
                  color="textSecondary"
                  gutterBottom
                >
                  Welcome
                </Typography>
                <Typography variant="h5" component="h2">
                  {bull} View sidebar to Navigate
                </Typography>
                <Typography style={{ marginBottom: 12 }} color="textSecondary">
                  For support mail to 31shavy@gmail.com
                </Typography>
                <Typography variant="body2" component="p">
                 Happy Managing
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ firebase, user }) => {
  return { firebase, user };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherP);
