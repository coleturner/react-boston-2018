import React from "react";

import { Appear, Fit, Fill, Layout, Heading, ListItem, List } from "spectacle";

import Portrait from "./components/portrait";
import PORTRAIT_PHOTO from "../assets/cole.jpg";

export default function About() {
  return (
    <div>
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
      {!window.location.href.includes("export") && (
        <Appear>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200vw",
              whiteSpace: "nowrap"
            }}
          >
            <img
              src={require("../assets/dogatwork2.jpg")}
              style={{ height: "100vh" }}
            />
            <video muted style={{ height: "100vh" }} loop autoPlay>
              <source
                type="video/mp4"
                src={require("../assets/dogatwork4.mp4")}
              />
              Your browser does not support HTML5 video.
            </video>
            <img
              src={require("../assets/dogatwork1.jpg")}
              style={{ height: "100vh" }}
            />
            <img
              src={require("../assets/dogatwork3.jpg")}
              style={{ height: "100vh" }}
            />
          </div>
        </Appear>
      )}
    </div>
  );
}
