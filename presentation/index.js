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
          The word observed is important.
          <br/>
          Developers have powerful machines. We see the web as we designed it.
        `}
        >
          <Exposition withDefinition />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
          How quickly can we surface what's available?
          How quickly can the user interact?
          <br />
          A website that takes longer than 4 seconds to render is like a screen door on a submarine.
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
          className="full-width-slide"
          notes={`
          Lucky at the time Chrome had plenty of tools to debug performance.
          `}
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
