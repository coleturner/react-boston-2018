import React from "react";
import styled, { keyframes } from "react-emotion";

const Container = styled("div")`
  transition: all 150ms ease-in-out;
  transition-property: width, height, transform;
  overflow: hidden;

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

  &:hover {
    overflow: visible;
    will-change: width, height, transform;
    z-index: 2;
    transform: ${({ style: { transform } }) =>
      `${transform} scale3d(1.05, 1.05, 1.05)`} !important;
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
  opacity: 0.85;
  transition: opacity 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${({ src }) => `
  background-image: url(${src})
  `};

  div:hover > & {
    opacity: 1;
  }
`;

export default class MasonryItem extends React.Component {
  static getColumnSpanFromProps = ({ index, maxColumns }) => {
    if (maxColumns > 3 && index > 0 && index % 24 === 0) {
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

      isFit,
      ...otherProps
    } = this.props;

    return (
      <Container
        preloadImageSrc={thumbUrl}
        imageColor={imageColor}
        {...otherProps}
      >
        <Image src={imageUrl} />
      </Container>
    );
  }
}
