import React, { Component } from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { LinearProgress } from "@material-ui/core";
class Students extends Component {
  state = {
    loading: true,
    columns: [
      { title: "Name", field: "name" },
      { title: "Email", field: "email", editable: "never" },
      {
        title: "Department",
        field: "department",
        lookup: {
          CSE: "Computer Science and Engineering",
          MECH: "Mechanical",
          ECE: "Electronics",
        },
      },
      {
        title: "Roll Number",
        field: "roll",
      },
      {
        title: "status",
        field: "status",
        lookup: {
          V: "Verified",
          NV: "Not-Verified",
        },
      },
    ],
    data: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { students } = props;
    if (students) {
      // console.log(students);
      let data = [];
      students.forEach((student) => {
        data.push({
          id: student.id,
          name: student.name,
          email: student.email,
          department: student.department,
          status: student.status,
          roll: student.roll,
        });
      });
      return { data: data, loading: false };
    } else {
      return null;
    }
  }

  render() {
    const { columns, data, loading } = this.state;
    return loading ? (
      <LinearProgress color="secondary" />
    ) : (
      <MaterialTable
        style={{ zIndex: 0 }}
        title="Students"
        columns={columns}
        data={data}
        minRows={10}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
          toolbar: true,
          paging: true,
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    const index = data.indexOf(oldData);

                    this.props.firestore
                      .update(
                        {
                          collection: "students",
                          doc: data[index].id,
                        },
                        newData
                      )
                      .then(() => {
                        data[index] = newData;
                        return { ...prevState, data };
                      });
                  });
                }
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                this.setState((prevState) => {
                  const data = [...prevState.data];
                  const index = data.indexOf(oldData);
                  this.props.firestore
                    .delete({ collection: "students", doc: data[index].id })
                    .then(() => {
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });
                });
              }, 600);
            }),
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    students: state.firestore.ordered.students,
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
  firestoreConnect([{ collection: "students" }])
)(Students);
