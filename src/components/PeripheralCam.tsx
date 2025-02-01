import React from "react";
import Webcam from "react-webcam";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
}

const videoConstraints = {
  facingMode: "user",
};

const PeripheralCam: React.FC<Props> = ({ webcamRef }) => {
  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        overflowY: "hidden",
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        height="100%"
        width="100%"
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
    </div>
  );
};

export default PeripheralCam;
