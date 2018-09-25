import React from "react";
import styled, { css, keyframes } from "react-emotion";

const Container = styled("div")`
  transition: all 150ms ease-in-out;
  transition-property: width, height, transform;
  overflow: hidden;
  backface-visibility: hidden;
  perspective: 1000;

  &::before {
    background-color: ${({ imageColor }) => imageColor};
    background-image: url(${({ preloadImageSrc }) => preloadImageSrc});
    background-size: cover;
    background-position: center center;
    content: " ";
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(20px);
    max-width: 100%;
    max-height: 100%;
  }

    ${({ isOutOfViewport }) =>
    isOutOfViewport &&
      css`
        opacity: 0.15 !important;
        div {
          filter: grayscale(100%);
          animation: none;
        }
      `};
  }
`;

const FADE_IN = keyframes`
from {
  opacity: 0;
}

to {
  opacity: 1;
}
`;

const Image = styled("div")`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  background-position: center center;
  background-size: cover;
  z-index: 2;
  opacity: 0;
  transition: opacity 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: ${FADE_IN} 150ms 1 ease-in;
  animation-fill-mode: forwards;

  ${({ src }) => `
  background-image: url(${src})
  `};
`;

export default class MasonryItem extends React.Component {
  static getColumnSpanFromProps = ({
    props: { featured, shouldSpanColumns },
    index,
    maxColumns
  }) => {
    if (!shouldSpanColumns) {
      return 1;
    }

    if (featured) {
      return 3;
    }

    if (maxColumns > 3 && index > 0 && index % 9 === 0) {
      return 3;
    }

    if (maxColumns > 3 && index > 0 && (index === 1 || index % 5 === 0)) {
      return 2;
    }

    return 1;
  };

  static getHeightFromProps = ({
    columnWidth,
    columnSpan,
    props: { imageHeight, imageWidth, isFit }
  }) => {
    if (isFit) {
      return columnWidth * columnSpan;
    }

    const height = ((columnWidth * columnSpan) / imageWidth) * imageHeight;

    return height;
  };

  render() {
    const {
      imageUrl,
      thumbUrl,
      imageWidth,
      imageHeight,
      imageColor,
      hasRenderedBefore,
      isFit,
      ...otherProps
    } = this.props;

    return (
      <Container
        preloadImageSrc={thumbUrl}
        imageColor={imageColor}
        isOutOfViewport
        {...otherProps}
      >
        <Image src={imageUrl} hasRenderedBefore={hasRenderedBefore} />
      </Container>
    );
  }
}
