// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  Layout,
  Fill,
  ListItem,
  List,
  Slide,
  S,
  Text
} from "spectacle";

import CodeSlide from "spectacle-code-slide";
import Bottlenecks from "./components/bottlenecks";

// Import theme
import createTheme from "spectacle/lib/themes/default";

import About from "./about";
import Exposition from "./exposition";
import MasonryExample from "./masonry-example";

import CRASH_URL from "../assets/crash.png";

import { injectGlobal } from "react-emotion";

// Require CSS
require("normalize.css");

injectGlobal(`
  body {
    line-height: 1.5;
    color: #fff;
  }

  .full-width-slide.spectacle-content { 
    max-width: 100%;
    width: 100%;
    transform: none;
    padding: 0;
    align-self: flex-start;
    overflow: auto;
    height: 100%;
    max-height: 100%;
  }

  .code-slide h1 {
    color: #dc3000 !important;
    border-color: #dc3000 !important;
  }
  
  .code-slide > div {
    color: #ffed58 !important;
  }

  a{
    color: inherit;
  }

`);

const theme = createTheme(
  {
    stage: "#111",
    primary: "#111",
    focus: "#ffed58",
    secondary: "#03fcf4",
    accent: "#CECECE",
    subtitle: "#444",
    body: "#fff",
    twitter: "#15acd2"
  },
  {
    primary: "Oswald",
    secondary: "Helvetica"
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={["zoom", "slide"]}
        transitionDuration={500}
        theme={theme}
        textColor="body"
      >
        <Slide transition={["zoom"]} bgColor="stage">
          <Heading size={1} fit caps lineHeight={1} textColor="focus">
            Render Less
          </Heading>
          <Text margin="10px 0 30px" textColor="secondary" size={1} fit bold>
            Creating Performant Layouts
          </Text>
          <hr />
          <Text
            margin="10px 0 0"
            textColor="accent"
            textSize="0.85em"
            bold
            caps
          >
            React Boston 2018 - Cole Turner
          </Text>
        </Slide>

        <Slide transition={["fade"]} bgColor="stage">
          <About />
        </Slide>

        <Slide transition={["fade"]} bgColor="stage">
          <Exposition withDefinition />
        </Slide>

        <Slide transition={["fade"]} bgColor="stage">
          <Exposition />
        </Slide>
        {/* Demonstrating initial design */}

        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <MasonryExample isFit />
        </Slide>

        {/* Demonstrating design bloat */}
        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <MasonryExample
            columns={6}
            canCrash
            nextSlide={7}
            overlayText="Requirements always change..."
          />
        </Slide>

        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <img
            src={CRASH_URL}
            alt="Your browser dun crashed"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Slide>

        <CodeSlide
          className="code-slide"
          color="accent"
          transition={[]}
          lang="jsx"
          code={require("raw-loader!../assets/before.example")}
          ranges={[
            { loc: [1, 3], title: "Brute Force with Isotope" },
            { loc: [4, 6], note: "Re-arrange the layout when an image loads." },
            { loc: [16, 17] },
            { loc: [17, 20], title: "O(n)" },
            { loc: [21, 22], title: "O(n)" },
            { loc: [22, 23], title: "O(n)" },
            {
              loc: [18, 23]
            },
            {
              loc: [18, 23],
              title: "Recreates layout for every item",
              image: "https://media0.giphy.com/media/T7nRl5WHw7Yru/200.webp"
            },
            {
              loc: [28, 29],
              title: "Causes browser layout/reflow",
              note: "also known as layout thrashing"
            },
            {
              loc: [0, 1],
              note: "More thrashing than a Tornado at a Metallica concert."
            }
            // ...
          ]}
        />

        {/* Talk about how to identify bottlenecks */}
        {/* Identify value, goal, and desired outcome */}

        <Slide transition={["fade"]} bgColor="primary">
          <Heading>Why?</Heading>
        </Slide>

        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Bottlenecks index={0} />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Bottlenecks index={1} />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Bottlenecks index={2} />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Bottlenecks index={3} />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Bottlenecks index={4} />
        </Slide>

        {/* Demonstrating best design */}
        <Slide
          maxHeight={12400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <MasonryExample
            maxColumns={8}
            columns={8}
            maxImages={5000}
            throttle={150}
            initialItemCount={2000}
          />
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
          <Heading size={1} caps textColor="primary">
            Resources
          </Heading>
          <List>
            <ListItem>
              <a target="_blank" href="https://reactjs.org/docs/perf.html">
                React Performance Tools
              </a>
            </ListItem>
            <ListItem>
              <a
                target="_blank"
                href="https://calibreapp.com/blog/2017-11-28-debugging-react/"
              >
                Debugging React Performance with React 16...
              </a>
            </ListItem>
            <ListItem>
              <a
                target="_blank"
                href="https://github.com/maicki/why-did-you-update"
              >
                Why Did You Update?
              </a>
            </ListItem>
            <ListItem>
              <a
                target="_blank"
                href="https://hackernoon.com/masonry-in-react-a-performance-hell-fb779f5fcebd"
              >
                Masonry in React: A Performance Hell
              </a>
            </ListItem>
          </List>
        </Slide>

        <Slide transition={["fade"]} bgColor="focus">
          <Heading size={1} fit caps textColor="primary">
            The End
          </Heading>
          <hr />
          <Text
            margin="10px 0 0"
            textColor="subtitle"
            textSize="0.85em"
            bold
            caps
          >
            <Heading textColor="subtitle" lineHeight={1.2} fit>
              For more pictures of dogs
            </Heading>
            <Heading textColor="subtitle" lineHeight={1.2} fit>
              And ocassionally a tweet about JavaScript
            </Heading>
            <Heading textColor="twitter" lineHeight={1} type="bold" fit>
              Follow @coleturner
            </Heading>
          </Text>
        </Slide>
      </Deck>
    );
  }
}
