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

import styled, { injectGlobal } from "react-emotion";

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

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
        Introduce yourself.<br />
        <hr />
        Why are you talking today?<br />
        <hr />
        Why should anyone listen?

        `}
        >
          <About />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
          What is the problem?
          <hr />
          Why does it matter?
        `}
        >
          <Exposition withDefinition />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
          What's most important is getting the user to a state where the page is usable.
          `}
        >
          <Exposition />
        </Slide>

        {/* Demonstrating design bloat */}
        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <MasonryExample
            columns={8}
            nextSlide={7}
            initialItemCount={500}
            threshold={100000000}
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
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center"
            }}
          />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
        >
          <div>
            <img
              src={require("../assets/renderingTab.png")}
              alt="Chrome Rendering Tab"
              style={{
                maxWidth: "900px"
              }}
            />
          </div>
          <div>
            <img
              src={require("../assets/layersTab.png")}
              alt="Chrome Layer Tab"
              style={{
                maxWidth: "900px"
              }}
            />
          </div>
          <div>
            <img
              src={require("../assets/recalcStyle.png")}
              alt="Recalculate Style Warning"
            />
          </div>
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
              <a target="_blank" href="https://csstriggers.com/">
                CSS Triggers
              </a>
            </ListItem>
            <ListItem>
              <a
                target="_blank"
                href="https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid-forced-synchronous-layouts"
              >
                Avoid Large Complex Layouts & Layout Thrashing...
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
          <Heading caps size={1} fit textColor="primary">
            The End
          </Heading>
          <hr />
          <Text margin="10px 0 0" textColor="subtitle" textSize="0.85em" bold>
            <Heading caps textColor="subtitle" lineHeight={1.2} fit>
              For more pictures of dogs
            </Heading>
            <Heading caps textColor="subtitle" lineHeight={1.2} fit>
              And ocassional tweets about JavaScript
            </Heading>
            <Heading
              caps
              fontFamily={"secondary"}
              textColor="twitter"
              lineHeight={1}
              type="bold"
              fit
            >
              Follow @coleturner
            </Heading>
          </Text>
        </Slide>
      </Deck>
    );
  }
}
