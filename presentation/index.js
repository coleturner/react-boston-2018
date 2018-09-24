// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
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
          <Text
            margin="10px 0 30px"
            textColor="secondary"
            size={1}
            caps
            fit
            bold
          >
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

        {/* Demonstrating design bloat */}
        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
          Needed to render many items with different sizes. Use infinite scroll to keep the user hooked.
          Our observations in development were smooth.
          `}
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
          notes={`
            In production our users observed their browsers crashing after a couple pages. If your website crashes, that's game over.
          `}
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
          The word observed is important.
          <br/>
          Developers have powerful machines. We see the web as we designed it.
        `}
        >
          <Heading size={1} caps textColor="accent" fit>
            React developers worry too much about
          </Heading>
          <Heading size={1} caps textColor="secondary" fit>
            Avoiding Re-Renders
          </Heading>
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
          The word observed is important.
          <br/>
          Developers have powerful machines. We see the web as we designed it.
        `}
        >
          <Heading size={1} caps textColor="accent" fit>
            But not enough about
          </Heading>
          <Heading size={1} caps textColor="focus" fit>
            How much we render
          </Heading>
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          The library we were using had a cascading bottlenecks.
          Excessive DOM mutations because dynamic positioning.
          Dynamic positioning because variable element sizes.
          But we also abused it by rendering everything.
        `}
        >
          <Bottlenecks index={0} />
        </Slide>
        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          To fix the layout thrashing I needed to reduce the number of DOM mutations
          `}
        >
          <Bottlenecks index={1} />
        </Slide>
        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          But to do that, the elements have to be positioned absolutely and calculated before they render.
          `}
        >
          <Bottlenecks index={2} />
        </Slide>
        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          Which meant I needed to know the width and height beforehand. So we set static column widths and calculated the height from the image's aspect ratio.
          But that was only enough to delay the crashing. After so many thousand DOM nodes the browser will lock up and the page will still crash.
          `}
        >
          <Bottlenecks index={3} />
        </Slide>
        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          
            The answer was virtual rendering. Instead of rendering all the items on the page, we would render only what's visible in the viewport to drastically cut down the number of DOM nodes.

          `}
        >
          <Bottlenecks index={4} />
        </Slide>

        {/* Demonstrating best design */}
        <Slide
          maxHeight={12400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
          
          This way our users could observe the same beautiful experience as we designed it, whether they had a desktop, tablet or mobile device.

        `}
        >
          <MasonryExample
            maxColumns={8}
            columns={8}
            maxImages={5000}
            throttle={150}
            initialItemCount={2000}
          />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="secondary">
          <Layout>
            <Fill>
              <Heading size={1} textColor="secondary" fit caps>
                Render Less:
              </Heading>

              <List textColor="body">
                <ListItem>Minimize layout thrashing</ListItem>
                <ListItem>Use progressive enhancement, skeleton UI</ListItem>
                <ListItem>
                  Virtual rendering: react-window / react-virtualized
                </ListItem>
              </List>
            </Fill>
          </Layout>
        </Slide>
        <Slide transition={["fade"]} bgColor="focus" textColor="primary">
          <Heading size={1} caps textColor="primary" fit>
            Thanks for Listening!
          </Heading>
          <Heading size={1} caps textColor="subtitle" fit>
            You might also be interested in:
          </Heading>
          <List>
            <ListItem>
              <a target="_blank" href="https://reactjs.org/docs/perf.html">
                React Performance Tools
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
          </List>
          <hr />
          <a href="https://goo.gl/ogCwKA">https://goo.gl/ogCwKA</a>
        </Slide>
      </Deck>
    );
  }
}
