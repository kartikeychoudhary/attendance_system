import React, { Component } from "react";
// import PropTypes from "prop-types";

import MaterialTable from "material-table";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { LinearProgress } from "@material-ui/core";

class Sessions extends Component {
  state = {
    loading: true,
    columns: [
      { title: "Name", field: "name" },
      {
        title: "Semester",
        field: "semester",
        lookup: {
          1: "1st Semester",
          2: "2nd Semester",
          3: "3rd Semester",
          4: "4th Semester",
          5: "5th Semester",
          6: "6th Semester",
          7: "7th Semester",
          8: "8th Semester",
        },
      },
    ],
    data: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { sessions } = props;
    if (sessions) {
      // console.log(sessions);
      let data = [];
      sessions.forEach((session) => {
        data.push({
          id: session.id,
          name: session.name,
          semester: session.semester,
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
        title="Sessions"
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
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                newData["teacher"] = this.props.uid;
                this.props.firestore
                  .add({ collection: "sessions" }, newData)
                  .then(() => {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data.push(newData);
                      return { ...prevState, data };
                    });
                  });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  const data = [...this.state.data];
                  const index = data.indexOf(oldData);

                  this.props.firestore
                    .update(
                      {
                        collection: "sessions",
                        doc: data[index].id,
                      },
                      newData
                    )
                    .then(() => {
                      this.setState((prevState) => {
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
                const data = [...this.state.data];
                const index = data.indexOf(oldData);
                this.props.firestore
                  .delete({ collection: "sessions", doc: data[index].id })
                  .then(() => {
                    this.setState((prevState) => {
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
    sessions: state.firestore.ordered.sessions,
    uid: state.firebase.auth.uid,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "sessions" }])
)(Sessions);
