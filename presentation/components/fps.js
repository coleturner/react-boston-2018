import React from "react";

import { Heading, Layout, Fill, ListItem, List, S } from "spectacle";
import throttle from "lodash.throttle";
import styled from "react-emotion";

const Counter = styled("div")`
  background: rgba(0, 0, 0, 0.85);
  border-radius: 10em;
  padding: 0.5em;
  position: absolute;
  right: 1em;
  top: 1em;
  width: 4em;
  height: 4em;
  text-align: center;
  z-index: 5;

  em {
    display: block;
    font-style: normal;
    color: #fff;
  }
`;

export default class FPS extends React.Component {
  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    this.tick = () => {};
  }

  times = [];
  fps = "";

  tick() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (this.times.length > 0 && this.times[0] <= now - 1000) {
        this.times.shift();
      }

      this.times.push(now);

      this.setFPS(this.times.length);

      this.tick();
    });
  }

  setFPS = throttle(function(fps) {
    if (this.fps !== fps) {
      this.fps = fps;
      this.forceUpdate();
    }
  }, 200).bind(this);

  render() {
    if (!this.fps) {
      return null;
    }

    return (
      <Counter>
        <em>{this.fps}</em> FPS
      </Counter>
    );
  }
}
