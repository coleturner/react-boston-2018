import React from "react";

import { Heading, Layout, Fill, ListItem, List, S } from "spectacle";
import throttle from "lodash.throttle";
import styled from "react-emotion";

const Counter = styled("div")`
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

    const { children } = this.props;

    if (children) {
      return children(this.fps);
    }

    return (
      <Counter>
        <em>{this.fps}</em> FPS
      </Counter>
    );
  }
}
