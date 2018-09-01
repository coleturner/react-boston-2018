import React from "react";
import styled from "react-emotion";

const Image = styled("img")`
  border-radius: 10em;
  width: 9em;
  height: 9em;
`;

export default function Portrait(props) {
  return <Image {...props} />;
}
