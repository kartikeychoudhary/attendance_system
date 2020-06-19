import React, { Component } from "react";
import { Button, Grid } from "@material-ui/core";

export class CameraFeed extends Component {
  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  processDevices(devices) {
    devices.forEach((device) => {
      console.log(device.label);
      this.setDevice(device);
    });
  }

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  async setDevice(device) {
    const { deviceId } = device;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId },
    });
    this.videoPlayer.srcObject = stream;
    this.videoPlayer.play();
  }

  /**
   * On mount, grab the users connected devices and process them
   * @memberof CameraFeed
   * @instance
   * @override
   */
  async componentDidMount() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    this.processDevices(cameras);
  }

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  takePhoto = () => {
    const { sendFile } = this.props;
    const context = this.canvas.getContext("2d");
    context.drawImage(this.videoPlayer, 0, 0, 480, 360);
    this.canvas.toBlob(sendFile);
  };

  render() {
    return (
      <Grid container className="c-camera-feed" style={{ padding: "1rem" }}>
        <Grid item xs={12} lg={5}>
          {" "}
          <video
            ref={(ref) => (this.videoPlayer = ref)}
            width="480"
            heigh="360"
          />
        </Grid>
        <Grid item xs={12} lg={2}>
          {" "}
          <Button
            onClick={this.takePhoto}
            variant="outlined"
            color="primary"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            Mark Attendance
          </Button>
        </Grid>

        <Grid item xs={12} lg={5}>
          <canvas width="480" height="360" ref={(ref) => (this.canvas = ref)} />
        </Grid>
      </Grid>
    );
  }
}
