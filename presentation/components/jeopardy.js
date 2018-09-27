import React from "react";
import styled, { css } from "react-emotion";

import { Heading, Appear, ListItem, List, S } from "spectacle";

const E = styled("span")`
  float: right;
`;

const Block = styled("div")`
  max-width: 600px;
  background-color: blue;
  padding: 0.5em;
  list-style-type: none;
  margin: 6px auto;
  text-align: left;
  color: ${({ visible }) => (visible ? "#fff" : "rgba(255,255,255,0)")};
  position: relative;

  &:nth-child(1)::after {
    content: "$50";
    color: #fff;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5em;
    z-index: 2;
    ${({ visible }) => visible && "display: none;"};
  }

  &:nth-child(2)::after {
    content: "$100";
    color: #fff;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5em;
    z-index: 2;
    ${({ visible }) => visible && "display: none;"};
  }

  &:nth-child(3)::after {
    content: "$500";
    color: #fff;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5em;
    z-index: 2;
    ${({ visible }) => visible && "display: none;"};
  }

  &:nth-child(4)::after {
    content: "Daily Double";
    color: #fff;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5em;
    z-index: 2;
    ${({ visible }) => visible && "display: none;"};
  }
`;

const Category = styled("h1")`
  max-width: 600px;
  margin: 0 auto;
  background: blue;
  color: yellow;
  text-align: center;
  font-size: 1em;
  padding: 0.5em;
`;

export default function Bottlenecks({ index = 0 }) {
  return (
    <div>
      <Category>Things that makes layout slow</Category>
      <div style={{ marginBottom: "2em" }}>
        <Block visible={index > 0}>
          DOM mutations <E>👎</E>
        </Block>
        <Block visible={index > 1}>
          Style Calculations <E>💅</E>
        </Block>
        <Block visible={index > 2}>
          Layout Thrashing <E>🤘</E>
        </Block>
        <Block visible={index > 3}>
          Rendering all the things <E>🤦‍♂</E>️
        </Block>
      </div>
      <Heading textColor="secondary" size={2} fit caps>
        Rendering Jeopardy
      </Heading>
    </div>
  );
}
