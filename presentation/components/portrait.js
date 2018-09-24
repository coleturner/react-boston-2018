import React from "react";
import styled from "react-emotion";

const Image = styled("img")`
  border-radius: 10em;
  width: 10em;
  height: 10em;
  overflow: hidden;
  border: 6px solid #fff;
`;

export default function Portrait(props) {
  return <Image {...props} />;
}
