import React from "react";
import { StringHelper } from "helpers";

const Iframe = (props) => {
  let id = "iframe_id_" + StringHelper.randomKey();
  let nameClass = props.nameClass || "";
  return (
    <div
      className={"iframe-container-page " + nameClass}
      id={id}
      dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
    />
  );
};

export default Iframe;
