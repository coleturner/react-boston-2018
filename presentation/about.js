import React from "react";

import { Fit, Fill, Layout, Heading, ListItem, List } from "spectacle";

import Portrait from "./components/portrait";
import PORTRAIT_PHOTO from "../assets/cole.jpg";

export default function About() {
  return (
    <Layout>
      <Fit>
        <Portrait src={PORTRAIT_PHOTO} style={{ marginRight: "3em" }} />
      </Fit>
      <Fill>
        <Heading size={1} textColor="secondary" fit textFont="secondary">
          <span style={{ position: "relative", top: "1px" }}>@</span>
          coleturner
        </Heading>
        <List size={1} textColor="body">
          <ListItem textColor="#dc3000">Acquisition UI @ Netflix</ListItem>
          <ListItem>Previously PayPal</ListItem>
          <ListItem>Copy pasting since 2004</ListItem>
        </List>
      </Fill>
    </Layout>
  );
}
