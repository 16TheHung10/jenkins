import React from "react";

const Loading = ({ isLoading, error, children }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return children;
};

export default Loading;
