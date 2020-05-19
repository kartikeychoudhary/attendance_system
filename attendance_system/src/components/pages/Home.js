import React, { Component } from "react";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import StudentP from "./profile/StudentP";
import TeacherP from "./profile/TeacherP";
import SessionPage from "./Sessions/SessionPage";

class Home extends Component {
  render() {
    const type = this.props.firebase.profile.type;

    return (
      <>
        {type ? (
          type === "student" ? (
            <StudentP />
          ) : type === "teacher" ? (
            <TeacherP />
          ) : type === "admin" ? (
            <TeacherP />
          ) : (
            <SessionPage />
          )
        ) : (
          <LinearProgress color="secondary" />
        )}
      </>
    );
  }
}
const mapStateToProps = ({ firebase, user }) => {
  return { firebase, user };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
