import React from "react";

const LoadingSpinner = () => (
  <div style={styles.container}>
    <div style={styles.spinner}></div>
    <p>Loading...</p>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default LoadingSpinner;
