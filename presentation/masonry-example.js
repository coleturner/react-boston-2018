import React from "react";
import styled from "react-emotion";
import { GoToAction } from "spectacle";

import Masonry from "./components/masonry";
import MasonryItem from "./components/masonry-item";
import { SlideContext } from "./index";

const shuffle = input => {
  let ctr = input.length;
  let temp;
  let index;
  const arra1 = [...input];

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
};

const Container = styled("div")`
  ${({ fakeViewport }) => `padding: 0 ${fakeViewport}px;`};
`;

const FakeViewport = styled("div")`
  border: ${({ size }) => size}px solid rgba(0, 0, 0, 0.65);
  box-shadow: inset 0 0 0 3px #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const preloadedImages = {};

export class MasonryExample extends React.Component {
  static defaultProps = {
    columns: 3,
    maxImages: 500,
    initialItemCount: 100,
    shouldSpanColumns: true,
    columnGutter: 10
  };

  constructor(props) {
    super(props);
    const images = shuffle(this.getImages());

    images.forEach(({ thumbUrl }) => {
      if (!(thumbUrl in preloadedImages)) {
        preloadedImages[thumbUrl] = true;
        const img = new Image();
        img.src = thumbUrl;
      }
    });

    while (images.length < this.props.initialItemCount) {
      images.push(
        ...images.slice(0, this.props.initialItemCount - images.length)
      );
    }

    this.state = { images };
  }

  componentDidMount() {
    if (this.props.appearOff) {
      return;
    }

    if (this.props.autoscroll) {
      requestAnimationFrame(this.tick);
    }

    document.addEventListener("scroll", this.onDocumentScroll);
  }

  lastScroll = null;
  onDocumentScroll = () => {
    this.lastScroll = new Date();
  };

  componentWillUnmount() {
    this.node = null;
    this.tick = () => {};
  }

  getImages() {
    return Array.from(require("../assets/images.json")).map(
      ({ imageUrl, thumbUrl, ...imageProps }) => {
        return {
          ...imageProps,
          imageUrl: require(`../assets/${imageUrl}`),
          thumbUrl: require(`../assets/${thumbUrl}`)
        };
      }
    );
  }

  node = null;
  slideContent = null;

  tick = () => {
    if (!this.node) {
      return;
    }

    if (!this.slideContent) {
      return;
    }

    if (this.slideContent.scrollTop > this.slideContent.scrollHeight) {
      return;
    }

    if (new Date() - this.lastScroll < 500) {
      requestAnimationFrame(this.tick);
      return;
    }

    //this.slideContent.scrollTop = this.slideContent.scrollTop + 1;
    this.slideContent.scrollTo(0, this.slideContent.scrollTop + 1);
    if (this.onScroll) {
      this.onScroll();
    }

    requestAnimationFrame(this.tick);
  };

  onReference = node => {
    this.node = node;

    if (node) {
      this.slideContent = node.closest(".spectacle-content");
    }
  };

  isInfiniteLoading = false;
  handleInfiniteLoad = () => {
    if (
      this.isInfiniteLoading ||
      this.state.images.length > this.props.maxImages
    ) {
      return;
    }

    this.isInfiniteLoading = true;

    this.setState(
      {
        images: this.state.images.concat(
          shuffle(this.state.images.slice(0, 100))
        )
      },
      () => {
        this.isInfiniteLoading = false;
      }
    );
  };

  render() {
    const {
      overlayText,
      columns,
      canCrash,
      nextSlide,
      shouldSpanColumns,
      fakeViewport,
      columnGutter,
      ...otherProps
    } = this.props;
    const { images } = this.state;
    const items = images.map((n, i) => ({
      shouldSpanColumns: this.props.shouldSpanColumns,
      itemId: i,
      ...n
    }));

    const columnWidth = Math.floor(
      parseInt(window.innerWidth, 10) / columns - columnGutter
    );

    const isCrashed = canCrash && images.length > this.props.maxImages;

    return (
      <Container fakeViewport={fakeViewport} innerRef={this.onReference}>
        {isCrashed && (
          <GoToAction
            render={goToSlide => {
              goToSlide(nextSlide);
              return null;
            }}
          />
        )}
        {!isCrashed &&
          this.node && (
            <Masonry
              setOnScroll={onScroll => (this.onScroll = onScroll)}
              scrollAnchor={this.node.parentNode}
              items={items}
              itemComponent={MasonryItem}
              doneElement={<div>Woof!</div>}
              containerClassName="masonry"
              layoutClassName="masonry-view"
              pageClassName="masonry-page"
              loadingElement={<span>Loading...</span>}
              columnWidth={columnWidth}
              columnGutter={columnGutter}
              onInfiniteLoad={this.handleInfiniteLoad}
              getState={() => ({})}
              alignCenter
              hasMore
              showMetrics={this.props.showMetrics}
              fakeViewport={fakeViewport}
              {...otherProps}
            />
          )}

        {fakeViewport && (
          <FakeViewport size={fakeViewport}>&nbsp;</FakeViewport>
        )}
      </Container>
    );
  }
}

export default function MasonryExampleHoC(props) {
  return (
    <SlideContext.Consumer>
      {({ appearOff, presenter }) =>
        appearOff ? (
          <div style={{ background: "#fff", color: "red" }}>
            Masonry will render next slide
          </div>
        ) : (
          <MasonryExample
            {...props}
            autoscroll={presenter ? false : props.autoscroll}
          />
        )
      }
    </SlideContext.Consumer>
  );
}
