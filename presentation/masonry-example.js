import React from "react";
import styled from "react-emotion";
import { GoToAction, S } from "spectacle";

import Masonry from "./components/masonry";
import MasonryItem from "./components/masonry-item";

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

const Container = styled("div")``;

const OverlayText = styled("div")`
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-transform: uppercase;
  text-shadow: 0 0 10em #000, 0 0 5em #000, 0 0 1em #000, 0 3px 0 #000,
    -1px 3px 0 #000, 1px 3px 0 #000;
  max-width: 600px;
  pointer-events: none;
  font-family: Oswald, Helvetica, sans-serif;
`;

const preloadedImages = {};

export default class MasonryExample extends React.Component {
  static defaultProps = {
    columns: 3,
    maxImages: 500,
    initialItemCount: 100
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
    if (this.props.autoscroll) {
      requestAnimationFrame(this.tick);
    }
  }

  componentWillUnmount() {
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

    //this.slideContent.scrollTop = this.slideContent.scrollTop + 1;
    this.slideContent.scrollTo(0, this.slideContent.scrollTop + 3);
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
      ...otherProps
    } = this.props;
    const { images } = this.state;
    const items = images.map(n => ({
      ...n
    }));

    const columnGutter = 10;
    const columnWidth = Math.floor(
      parseInt(window.innerWidth, 10) / columns - columnGutter
    );

    const isCrashed = canCrash && images.length > this.props.maxImages;

    return (
      <Container innerRef={this.onReference}>
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
              {...otherProps}
            />
          )}

        {overlayText && (
          <OverlayText>
            <S textSize={100} type="normal">
              {overlayText}
            </S>
          </OverlayText>
        )}
      </Container>
    );
  }
}
