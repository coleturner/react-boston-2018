import React from "react";
import styled, { css } from "react-emotion";

import { Heading, Appear, ListItem, List, S } from "spectacle";

const E = styled("span")`
  float: right;
`;

const jeopardyStyle = css`
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 2em;
  li {
    background-color: blue;
    padding: 0.5em;
    list-style-type: none;
    margin: 6px 3px;
  }
`;

export default function Bottlenecks({ index = 0 }) {
  return (
    <div>
      <List className={jeopardyStyle}>
        <Appear order={1}>
          <ListItem>
            DOM mutations <E>👎</E>
          </ListItem>
        </Appear>
        <Appear order={2}>
          <ListItem>
            Style Calculations <E>💅</E>
          </ListItem>
        </Appear>
        <Appear order={3}>
          <ListItem>
            Layout Thrashing <E>🤘</E>
          </ListItem>
        </Appear>
        <Appear order={4}>
          <ListItem>
            Rendering all the things <E>🤦‍♂</E>️
          </ListItem>
        </Appear>
      </List>
      <Appear order={0}>
        <Heading textColor="body" size={6} fit>
          Things that makes layout slow
        </Heading>
      </Appear>
      <Heading textColor="secondary" size={2} fit caps>
        Rendering Jeopardy
      </Heading>
    </div>
  );
}
