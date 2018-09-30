// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
  Deck,
  Heading,
  Slide as SpectacleSlide,
  Text,
  List,
  ListItem
} from "spectacle";

import Jeopardy from "./components/jeopardy";

// Import theme
import createTheme from "spectacle/lib/themes/default";

import About from "./about";
import MasonryExample from "./masonry-example";

import CRASH_URL from "../assets/crash.png";

import { injectGlobal } from "react-emotion";

export const SlideContext = React.createContext();
const Slide = function ({ children, ...props }) {
  return (
    <SpectacleSlide {...props}>
      <SlideContext.Provider value={props}>{children}</SlideContext.Provider>
    </SpectacleSlide>
  );
};

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

        <Slide
          transition={["fade"]}
          bgColor="stage"
          notes={`
        Talk about how performance is important to the needs for Streaming and Finance.

        `}
        >
          <About />
        </Slide>

        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
          I love dogs.
          <hr />
          Describe the layout.
          <hr />
          Describe infinite scroll.
          <hr />
          It was beautiful and worked fast.
          `}
        >
          <MasonryExample
            autoscroll
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
            It crashed for the users after three pages.
            <hr />
            Describe low end devices.
            <hr />
            Describe why crashes are bad.
            <hr />
            <em>Transition: That's why I'm here today...</em>

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
          Developers worry too much about:<br />
          Re-renders<br />
          State changes<br />
          shouldComponentUpdate
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
          But not enough about:<br />
          How much are we rendering?<br />
          What can the user see?<br />
          What is accessible?
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
            Introduce the game.
            <hr />
            <em>Next reveal: DOM MUTATIONS</em>
          `}
        >
          <Jeopardy index={0} />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
            DOM Mutations are expensive because:<br />
            React has to diff the virtual DOM<br />
            Synchronise the new DOM Tree<br />
            Inject and remove DOM nodes<br />
            <hr />
            <em>Next reveal: Style Calculations</em>
          `}
        >
          <Jeopardy index={1} />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
            Style calculations are expensive because:<br />
            Browser has to calculate the box model<br />
            Paint the element<br />
            Position it<br />
            <hr />
            Most of layout lag is observed here.
            <hr />
            <em>Next reveal: Layout Thrashing</em>
          `}
        >
          <Jeopardy index={2} />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
            Describe layout thrashing...
            <hr />
            A tornado of DOM mutations and style calculations. Causes many reflow and layout.
            <hr />
            Can crash the browser.

            <hr />
            <em>Next reveal: Render all the things</em>
          `}
        >
          <Jeopardy index={3} />
        </Slide>

        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
            Describe compound effect of thrashing everything.
            <hr/>
            Make Jeopardy Joke
            <hr />
            <em>Next reveal: back to the dog app</em>
          `}
        >
          <Jeopardy index={4} />
        </Slide>

        <Slide
          maxHeight={1400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
            Describe nodes/visible/nodes
          `}
        >
          <MasonryExample
            showMetrics
            autoscroll
            maxColumns={8}
            columns={8}
            initialItemCount={500}
            threshold={100000000}
          />
        </Slide>

        <Slide transition={["fade"]} bgColor="primary" textColor="secondary">
          <Heading size={1} textColor="focus" caps>
            Render Less!
          </Heading>
          <br />
          <Appear>
            <img
              src={require("../assets/he-said-it.png")}
              alt="Peter from Family Guy pointing to a movie screen, saying 'He said it!'"
            />
          </Appear>
        </Slide>
        <Slide
          transition={["fade"]}
          bgColor="primary"
          textColor="body"
          notes={`
          State the obvious: create less elements<hr />
          Describe why the viewport area matters<hr />
          Minimize style calculations:<br />
          optimizing animations, transitions
          <hr />
          Avoid layout trashing: repaints, flow, throttle DOM Mutations
        `}
        >
          <Heading size={1} textColor="focus" caps fit>
            How to: Render Less
          </Heading>
          <List>
            <Appear>
              <ListItem>Rendering the viewport area only</ListItem>
            </Appear>
            <Appear>
              <ListItem>Minimize style calculations</ListItem>
            </Appear>
            <Appear>
              <ListItem>Avoiding layout thrashing</ListItem>
            </Appear>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Heading size={1} textColor="secondary" caps fit>
            Virtualized Rendering
          </Heading>
          <Appear>
            <Heading size={6} fit textColor="body">
              react-window / react-virtualized
            </Heading>
          </Appear>
        </Slide>

        {/* Demonstrating best design */}
        <Slide
          maxHeight={12400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
            Here is our viewport<br />
            As elements approach it, they are rendered<br />
            <hr />
            Minimize amount of elements to calculate and paint.<br />
            <hr />
            Margin for scrolling, enough time for the browser to paint<br />
        `}
        >
          <MasonryExample
            fakeViewport={300}
            autoscroll
            columns={12}
            maxImages={5000}
            throttle={150}
            threshold={100}
            initialItemCount={2000}
            shouldSpanColumns={false}
          />
        </Slide>
        <Slide
          maxHeight={12400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
            The user sees it as we designed it.
            <hr />
            Fast and beautiful
            <hr />
            <em>Transition: Now I know what you're thinking. We can fit twice as many dogs.</em>
        `}
        >
          <MasonryExample
            showMetrics
            autoscroll
            maxColumns={8}
            columns={15}
            maxImages={5000}
            throttle={150}
            threshold={100}
            initialItemCount={2000}
            columnGutter={2}
            shouldSpanColumns={false}
          />
        </Slide>
        <Slide
          maxHeight={12400}
          transition={["fade"]}
          bgColor="stage"
          className="full-width-slide"
          notes={`
            The users are happy. The dogs are happy. That makes me happy.
          `}
        >
          <MasonryExample
            showMetrics
            maxColumns={8}
            columns={30}
            maxImages={5000}
            maxItemsPerPage={10}
            throttle={150}
            threshold={100}
            initialItemCount={2000}
            columnGutter={1}
            shouldSpanColumns={false}
          />
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="body">
          <Heading>☝️</Heading>
          <center>
            <List
              style={{
                display: "inline-block",
                listStyleType: "none",
                padding: 0,
                textAlign: "center"
              }}
            >
              <Appear>
                <ListItem>Render less things, fewer times</ListItem>
              </Appear>
              <Appear>
                <ListItem>Avoid layout thrashing</ListItem>
              </Appear>
              <Appear>
                <ListItem>Test low-end devices</ListItem>
              </Appear>
            </List>
          </center>
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
          <hr style={{ margin: "3em auto" }} />
          <Heading size={6} caps textColor="subtitle">
            For more pictures of dogs follow
          </Heading>

          <Heading size={6} caps textColor="twitter">
            <a
              style={{ textDecoration: "none" }}
              href="https://twitter.com/coleturner"
            >
              @coleturner
            </a>{" "}
            on Twitter
          </Heading>
        </Slide>
      </Deck>
    );
  }
}
