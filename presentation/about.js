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
        <Heading size={6} textColor="secondary" caps>
          New speaker, who dis?
        </Heading>
        <List size={1} textColor="body">
          <ListItem textColor="#e50914">Acquisition UI @ Netflix</ListItem>
          <ListItem>Previously PayPal</ListItem>
          <ListItem>Copy pasting since 2004</ListItem>
        </List>
      </Fill>
    </Layout>
  );
}
