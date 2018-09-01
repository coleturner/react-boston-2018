import React from "react";

import {
  Anim,
  Appear,
  Fit,
  Fill,
  Layout,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text
} from "spectacle";

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
          <Appear>
            <ListItem textColor="#e50914">Acquisition UI @ Netflix</ListItem>
          </Appear>
          <Appear>
            <ListItem>Previously PayPal</ListItem>
          </Appear>
          <Appear>
            <ListItem>Closing Engineer since 2004</ListItem>
          </Appear>
        </List>
      </Fill>
    </Layout>
  );
}
