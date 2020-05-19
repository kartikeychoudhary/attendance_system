import React, { Component } from "react";
// import PropTypes from "prop-types";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { LinearProgress } from "@material-ui/core";

class Teachers extends Component {
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
        title: "status",
        field: "status",
        lookup: {
          V: "Verified",
          NV: "not-verified",
        },
      },
    ],
    data: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { teachers } = props;
    if (teachers) {
      // console.log(teachers);
      let data = [];
      teachers.forEach((teacher) => {
        data.push({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          status: teacher.status,
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
        title="Teachers"
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
                          collection: "teachers",
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
                    .delete({ collection: "teachers", doc: data[index].id })
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
    teachers: state.firestore.ordered.teachers,
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
  firestoreConnect([{ collection: "teachers" }])
)(Teachers);
