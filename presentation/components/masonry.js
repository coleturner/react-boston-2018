/* eslint-disable */
import styled from "react-emotion";

/**
 * Masonry Component for React
 * @author Cole Turner <turner.cole@gmail.com | www.cole.codes>
 * 
 * If you use this, please retain the author name.
 * Please PR any new features you add so that others can enjoy
 * the blood sweat and tears of open source.
 * 
 * Features:
 *  - Masonry Layout
 *    A) Items must have fixed column width
 *    B) Items can span multiple columns
 *    C) Layout will be precalculated but only if the number of items has changed
 *        - This engine was designed for a static order placement
 *          and was not designed for reordering
 *    D) New items will layout if the previous layout parameters still apply
 *    E) Function `getState` returns either Redux or local component state
 *  - Infinite Scroll
 * 
 * 
 * How to use:
    const myArrayOfItems = [{ name: 'Hello' }, { name: 'World' }]
    <Masonry
      items={myArrayOfItems}
      itemComponent={MyMasonryItem}
      alignCenter={true}
      containerClassName="masonry"
      layoutClassName="masonry-view"
      pageClassName="masonry-page"
      loadingElement={<span>Loading...</span>}
      columnWidth={columnWidth}
      columnGutter={columnGutter}
      hasMore={this.props.hasMore}
      isLoading={this.props.isFetching}
      onInfiniteLoad={this.onFetch}
      getState={this.props.getState}
    />
*  How to layout your item:
    class MyMasonryItem extends React.Component {
      static getColumnSpanFromProps = ({ isFeatured }, getState) => {
        if (isFeatured) {
          return 2;
        }
        return 1;
      }
      static getHeightFromProps = (getState, props, columnSpan, columnGutter) => {
        return IMAGE_HEIGHT + TITLE_HEIGHT + FOOTER_HEIGHT;
      }
      
      render() {
        ...
      }
    }
 */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import throttle from "lodash.throttle";
import FPS from "./fps";

const noPage = { stop: 0 };
const defaultColumnSpanSelector = () => 1;
const sortAscending = (a, b) => a - b;
const sortTopByAscending = (a, b) => a.top - b.top;
const classNamePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.array
]).isRequired;

const Metric = styled("div")`
  text-transform: uppsercase;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-content: center;
  pointer-events: none;
  color: ${({ color }) => color || "#ffed58"};

  > * {
    flex: 0 1 50%;
    text-align: center;
  }

  em {
    display: block;
    color: #fff;
    line-height: 1;
    font-style: normal;
    min-width: 3em;
  }
`;

const Metrics = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  padding: 0.5em;
  font-size: 3vw;
  font-size: 3vmax;
`;

export default class Masonry extends React.PureComponent {
  static propTypes = {
    alignCenter: PropTypes.bool.isRequired,
    columnGutter: PropTypes.number.isRequired,
    columnWidth: PropTypes.number.isRequired,
    containerClassName: classNamePropType,
    layoutClassName: classNamePropType,
    pageClassName: classNamePropType,
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    itemComponent: PropTypes.oneOfType([
      PropTypes.instanceOf(React.Component),
      PropTypes.func
    ]).isRequired,
    itemProps: PropTypes.object,
    loadingElement: PropTypes.node,
    onInfiniteLoad: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    scrollAnchor: PropTypes.object,
    scrollOffset: PropTypes.number
  };

  static defaultProps = {
    alignCenter: true,
    containerClassName: "masonry collection-group",
    layoutClassName: "masonry-view",
    pageClassName: "masonry-page",
    loadingElement: <div className="loading-cap">Loading...</div>,
    scrollAnchor: window,
    threshold: null,
    isLoading: false
  };

  state = { averageHeight: 300, pages: [], nodes: 0 };

  componentDidMount() {
    this.layout(this.props);
    this.onScroll();

    this.props.scrollAnchor.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.onResize);
    this.props.setOnScroll && this.props.setOnScroll(this.onScroll);
  }

  componentWillUnmount() {
    this.props.scrollAnchor.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    this.layout(nextProps);
  }

  componentDidUpdate(prevProps) {
    if (this.props.scrollAnchor !== prevProps.scrollAnchor) {
      prevProps.scrollAnchor.removeEventListener("scroll", this.onScroll);
      this.props.scrollAnchor.addEventListener("scroll", this.onScroll);
    }

    requestAnimationFrame(() => {
      const nodes = Array.from(this.node.querySelectorAll("*")).length;
      this.setNodeCount(nodes);
    });

    this.onScroll();
  }

  setNodeCount = throttle(nodes => {
    if (this.nodesRef) {
      this.nodesRef.innerText = nodes;
    }
  }, 150);

  onResize = throttle(() => {
    this.layout(this.props, true);
  }, 500);

  layout(props, rearrange = false) {
    if (!this.node) {
      return;
    }

    const { columnWidth, columnGutter, items, itemComponent, getState } = props;

    const componentName =
      itemComponent.constructor.displayName || itemComponent.constructor.name;

    if (!("getHeightFromProps" in itemComponent)) {
      throw new Error(
        `Component type ${componentName} does not respond to 'getHeightFromProps'`
      );
    }

    const heightSelector = itemComponent.getHeightFromProps;
    const columnSpanSelector =
      itemComponent.getColumnSpanFromProps || defaultColumnSpanSelector;

    // Decide a starter position for centering
    const viewableWidth = this.node.offsetWidth;
    const viewableHeight = this.getViewableHeight();
    const maxColumns = Math.floor(viewableWidth / (columnWidth + columnGutter));
    const spannableWidth =
      maxColumns * columnWidth + columnGutter * (maxColumns - 1);
    const viewableStart = this.props.alignCenter
      ? (viewableWidth - spannableWidth) / 2
      : 0;

    // Setup bounds and limiters for deciding how to stage items in a page
    const itemsPerPage = this.getItemsPerPage({ maxColumns, viewableHeight });
    const top = Math.max(0, this.getScrollTop() + this.getScrollOffset());

    // Here we decide if we layout the entire grid or just new items
    const shouldRearrange =
      rearrange ||
      !this.state.lastWorkingPage ||
      this.state.lastWorkingIndex === null ||
      maxColumns !== this.state.maxColumns;

    // Setup our boundaries for layout
    const columnHeights = shouldRearrange
      ? new Array(maxColumns).fill(0)
      : this.state.columnHeights;
    const columnGaps = shouldRearrange
      ? new Array(maxColumns).fill([])
      : this.state.columnGaps;

    const initialWorkingPages = shouldRearrange ? [] : this.state.pages;
    const itemsToLayout = shouldRearrange
      ? items
      : items.slice(this.state.lastWorkingIndex + 1);

    let column = 0;
    let lastWorkingIndex = null;

    const stagedItems = [];
    const pages = itemsToLayout
      .reduce((workingPages, itemProps, index) => {
        // Decide which page we are on
        let workingPage = null;

        if (workingPages.length) {
          workingPage = workingPages[workingPages.length - 1];
        }

        if (!workingPage || workingPage.items.length >= itemsPerPage) {
          workingPage = { index: workingPages.length, items: [] };
          workingPages.push(workingPage);
        }

        // Ok now we have an item, let's decide how many columns it spans
        const columnSpan = Math.min(
          maxColumns,
          columnSpanSelector({ getState, props: itemProps, maxColumns, index })
        );

        // Check if the column will exceed maxColumns
        if (column + columnSpan > maxColumns) {
          column = 0;
        }

        // Determine the height of this item to stage
        const height = Math.round(
          heightSelector({
            getState,
            props: itemProps,
            columnSpan,
            columnGutter,
            columnWidth
          })
        );

        if (isNaN(height)) {
          console.warn(
            `Skipping feed item ${componentName} with props ${JSON.stringify(
              itemProps
            )} because "${height}" is not a number.`
          );
          return workingPages;
        }

        const item = {
          props: itemProps,
          column,
          columnSpan,
          height,
          width: columnSpan * columnWidth + (columnSpan - 1) * columnGutter
        };

        // Here is where the magic happens
        // First we take a slice of the items above
        const previousSlicedItems = stagedItems.slice(-1 * (itemsPerPage * 2));

        const columnGapValues = Object.values(columnGaps);

        // Let's fill any gaps if possible.
        const positionWithinGap = this.findPositionInGaps(
          itemProps,
          columnHeights,
          columnGapValues,
          maxColumns,
          columnSpan,
          height,
          viewableStart
        );

        if (positionWithinGap) {
          Object.assign(item, positionWithinGap);
        } else {
          // And then for good measure, transverse up a little more to catch any items staged below
          stagedItems
            .slice(stagedItems.length - 1 - itemsPerPage, -1 * itemsPerPage)
            .forEach(previousItem => {
              if (
                previousSlicedItems.some(
                  previousSlicedItem =>
                    previousSlicedItem.top < previousItem.top
                )
              ) {
                previousSlicedItems.push(previousItem);
              }
            });

          previousSlicedItems.sort(sortTopByAscending);

          // Then find the smallest column
          const position = this.findPositionForItem(
            previousSlicedItems,
            columnSpan,
            maxColumns,
            columnHeights,
            height,
            viewableStart
          );

          Object.assign(item, position);
        }

        const minPreviousSlicedItemTop = Math.min(
          ...previousSlicedItems.map(i => i.top)
        );

        columnHeights
          .slice(item.column, item.column + columnSpan)
          .forEach((thisColumn, columnIndex) => {
            // Remove any gaps we're overlaying
            columnGaps[item.column + columnIndex] = columnGaps[
              item.column + columnIndex
            ].map(gap => {
              const [gapTop, gapHeight] = gap;
              if (
                // If we filled the gap
                (item.top <= gapTop && item.top + item.height >= gapTop) ||
                (item.top >= gapTop && item.top <= gapTop + gapHeight) ||
                // or if the gap is above our fill zone
                gapTop < minPreviousSlicedItemTop
              ) {
                const newGapTop =
                  item.top + item.height + this.props.columnGutter;

                const newGap = [newGapTop, gapHeight - (newGapTop - gapTop)];
                return newGap;
              }

              return gap;
            });

            // Add a gap if we've created one
            if (item.top > thisColumn) {
              columnGaps[item.column + columnIndex].push([
                thisColumn,
                item.top - thisColumn - this.props.columnGutter
              ]);
            }

            columnHeights[item.column + columnIndex] = Math.max(
              thisColumn,
              item.top + item.height + columnGutter
            );
          });

        column += columnSpan;

        workingPage.items.push(item);
        stagedItems.push(item);
        lastWorkingIndex = items.indexOf(itemProps); // not `item`!!

        return workingPages;
      }, initialWorkingPages)
      .map(page => {
        // Calculate when a page starts and stops
        // To determine which pages are visible
        const itemsTop = page.items.map(item => item.top);

        page.start = !itemsTop.length ? 0 : Math.min(...itemsTop);
        page.stop = Math.max(
          0,
          ...page.items.map(item => item.top + item.height)
        );

        page.visible = this.isPageVisible({ page, top, viewableHeight });

        return page;
      });

    // Facilitate the average height for next layout's itemsPerPage
    const averageHeight = Math.round(
      stagedItems
        .map(item => item.height)
        .reduce((prev, val) => prev + val, 0) / stagedItems.length
    );

    this.setState({
      pages,
      lastWorkingIndex,
      averageHeight,
      columnHeights,
      columnGaps,
      maxColumns
    });
  }

  getItemsPerPage = ({ maxColumns, viewableHeight }) => {
    if (this.props.maxItemsPerPage) {
      return this.props.maxItemsPerPage;
    }

    const $masonryItems = Array.from(
      document.querySelectorAll(".masonry-page div")
    );

    const $visibleMasonryItems = $masonryItems.filter(n => {
      const bounds = n.getBoundingClientRect();

      return bounds.top + bounds.height >= 1 && bounds.top < window.innerHeight;
    });

    return Math.max(maxColumns, $visibleMasonryItems.length);
  };

  findPositionForItem(
    previousItems,
    columnSpan,
    maxColumns,
    columnHeights,
    itemHeight,
    viewableStart
  ) {
    // If it spans one column, return the shortest column
    if (columnSpan === 1) {
      const smallestHeight = columnHeights.slice(0).sort(sortAscending)[0];
      const column = columnHeights.indexOf(smallestHeight);
      const left = Math.round(
        this.getLeftPositionForColumn(column, viewableStart)
      );
      const top = Math.round(columnHeights[column]);

      return {
        column,
        left,
        top,
        filledInShortestColumn: true,
        columnHeights
      };
    }

    // Find columns to span that will create the shortest gap
    const columnGaps = columnHeights
      .slice(0, maxColumns - columnSpan + 1) // only measure columns it can span
      .reduce((gapReduction, thisColumnHeight, column) => {
        if (thisColumnHeight < columnHeights[column + 1]) {
          // If this item clips the next column, overextend
          gapReduction[column] = columnHeights[column + 1];
        } else {
          // Determine how much of a gap will be created if we start in this column
          const columnsToMeasure = columnHeights.slice(
            column,
            column + columnSpan
          );

          gapReduction[column] =
            Math.max(...columnsToMeasure) - Math.min(...columnsToMeasure);
        }
        return gapReduction;
      }, []);

    let column = columnGaps.indexOf(columnGaps.slice(0).sort(sortAscending)[0]);

    if (
      previousItems[previousItems.length - 1] &&
      previousItems[previousItems.length - 2] &&
      column === previousItems[previousItems.length - 1].column &&
      column === previousItems[previousItems.length - 2].column
    ) {
      column++;
    }

    const maxSpannedHeight = Math.max(
      ...columnHeights.slice(column, column + columnSpan)
    );
    const top = Math.round(maxSpannedHeight);
    const left = Math.round(
      this.getLeftPositionForColumn(column, viewableStart)
    );

    return {
      column,
      left,
      top,
      filledToMinimizeGap: true
    };
  }

  findPositionInGaps = (
    itemProps,
    columnHeights,
    gapColumns,
    maxColumns,
    columnSpan,
    height,
    viewableStart
  ) => {
    if (columnSpan === 1) {
      // Easy, find the first gap

      const maxGapColumnCount = Math.max(...gapColumns.map(n => n.length));

      for (let i = 0; i < maxGapColumnCount; i++) {
        const column = gapColumns.findIndex(
          gaps => gaps[i] && gaps[i][1] >= height
        );

        const gap = ~column && gapColumns[column][i];

        if (gap) {
          const left = Math.round(
            this.getLeftPositionForColumn(column, viewableStart)
          );

          return {
            left,
            top: gap[0],
            column,
            filledByFirstGap: true
          };
        }
      }
    }

    if (columnSpan > 1 && gapColumns.every(column => column.length <= 0)) {
      // If there are no gaps, see if we can lay it out evenly
      const spannableColumnHeights = columnHeights.slice(
        0,
        maxColumns - columnSpan + 1
      );

      const columnSpanning = spannableColumnHeights.map(
        (height, columnIndex) => {
          const hasNextColumn = columnIndex + 1 > spannableColumnHeights.length;

          const canSpanNextColumn =
            hasNextColumn && spannableColumnHeights[columnIndex + 1] === height;

          if (canSpanNextColumn) {
            return true;
          }

          return false;
        }
      );

      // If we can span at all
      const spannableColumn = columnSpanning.indexOf(true);
      if (~spannableColumn) {
        const left = Math.round(
          this.getLeftPositionForColumn(spannableColumn, viewableStart)
        );

        return {
          left,
          top: gap[0],
          column,
          filledByEvenSpan: true
        };
      }
    }

    // Much more difficult
    // only measure columns it can span
    const fillableColumnGaps = gapColumns
      .slice(0, maxColumns - columnSpan + 1)
      .reduce((workingColumns, thisColumnGaps, columnIndex) => {
        workingColumns[columnIndex] = thisColumnGaps.filter(
          g => g[1] >= height
        );
        return workingColumns;
      }, new Array(gapColumns.length).fill([]));

    // Sorry this is going to get verbose
    const spannableColumnGaps = fillableColumnGaps.reduce(
      (acc, thisColumn, index) => {
        // Filter out columns
        acc[index] = thisColumn.filter(thisColumnGap => {
          const [thisColumnGapTop, thisColumnGapHeight] = thisColumnGap;

          // Where the item can't span next columns
          const nextColumns = fillableColumnGaps.slice(index + 1);
          return nextColumns.every(nextSpannableColumn => {
            // By looking for a gap it can fit into
            return nextSpannableColumn.find(nextSpannableColumnGap => {
              const [
                nextSpannableColumnGapTop,
                nextSpannableColumnGapHeight
              ] = nextSpannableColumnGap;

              return (
                nextSpannableColumnGapTop <= thisColumnGapTop &&
                nextSpannableColumnGapTop + nextSpannableColumnGapHeight >=
                  thisColumnGapTop + thisColumnGapHeight
              );
            });
          });
        });

        return acc;
      },
      new Array(fillableColumnGaps.length).fill([])
    );

    for (let column = 0; column < spannableColumnGaps.length; column++) {
      if (spannableColumnGaps[column].length) {
        const gap = spannableColumnGaps[column][0];
        const left = Math.round(
          this.getLeftPositionForColumn(column, viewableStart)
        );

        return {
          left,
          top: gap[0],
          column,
          filledSpanning: true
        };
      }
    }

    // I have failed you
    return null;
  };

  findItemsInSameColumn(itemList, item) {
    return itemList.filter(upperItem => {
      return (
        item.column === upperItem.column ||
        (item.column >= upperItem.column &&
          item.column + item.columnSpan <=
            upperItem.column + upperItem.columnSpan)
      );
    });
  }

  getLeftPositionForColumn(column, viewableStart) {
    return (
      viewableStart +
      column * (this.props.columnWidth + this.props.columnGutter)
    );
  }

  lastScrollDate = null;
  lastScrollOffset = null;
  scrollSpeed = 1;
  onScroll = e => {
    if (e) {
      this.scrollSpeed =
        (e.target.scrollTop - this.lastScrollOffset) /
        (e.timeStamp - this.lastScrollDate);

      this.lastScrollDate = e.timeStamp;
      this.lastScrollOffset = e.target.scrollTop;
    }

    if (!this.node) {
      return;
    }

    const bounds = this.node.getBoundingClientRect();
    this.checkScroll(bounds);
    this.checkInfiniteLoad(bounds);
  };

  checkScroll = throttle(bounds => {
    this.checkVisibility();
  }, 30);

  checkVisibility() {
    const viewableHeight = this.getViewableHeight();
    const top = Math.max(0, this.getScrollTop() - this.getScrollOffset());

    let isChanged = false;

    const pages = this.state.pages.map(page => {
      const visible = this.isPageVisible({ page, top, viewableHeight });

      isChanged = isChanged || page.visible !== visible;

      return {
        ...page,
        visible
      };
    });

    if (isChanged) {
      this.setState({ pages });
    }
  }

  getThreshold() {
    return this.props.threshold || window.innerHeight;
  }

  isPageVisible({ page, top, viewableHeight }) {
    const { start, stop } = page;
    const extraThreshold = this.getThreshold() * Math.abs(this.scrollSpeed);

    const startsBeforeViewableArea = start <= top + extraThreshold;
    const stopsAfterViewableArea = stop > top + viewableHeight + extraThreshold;

    const startsWithinViewableArea =
      start >= top - extraThreshold &&
      start < top + viewableHeight + extraThreshold;
    const stopsWithinViewableArea =
      startsBeforeViewableArea &&
      stop >= top - extraThreshold &&
      stop <= top + viewableHeight + extraThreshold;

    const rendersInViewableArea =
      (startsBeforeViewableArea && stopsAfterViewableArea) ||
      startsWithinViewableArea ||
      stopsWithinViewableArea;

    // trigger area = viewable area with buffer areas
    if (rendersInViewableArea) {
      return true;
    }

    return false;
  }

  checkInfiniteLoad(bounds) {
    const minimumColumnHeight = Math.min(...this.state.columnHeights);

    if (
      Math.abs(bounds.top) >
      minimumColumnHeight - window.innerHeight * (1 + this.scrollSpeed)
    ) {
      this.props.onInfiniteLoad();
      return;
    }
  }

  getScrollTop() {
    if (this.props.scrollAnchor === window) {
      return window.pageYOffset;
    }

    return this.props.scrollAnchor.scrollTop;
  }

  getScrollOffset() {
    if (this.props.scrollAnchor === window) {
      return 0;
    }

    return this.node.offsetTop;
  }

  getViewableHeight() {
    if (this.props.scrollAnchor === window) {
      return window.innerHeight;
    }

    return this.props.scrollAnchor.offsetHeight;
  }

  onReference = node => {
    this.node = node;

    if (this.props.innerRef) {
      this.props.innerRef(this.node);
    }
  };

  render() {
    const {
      containerClassName,
      layoutClassName,
      pageClassName,
      hasMore,
      loadingElement,
      isLoading,
      itemProps,
      itemComponent: Item
    } = this.props;

    const { pages } = this.state;

    const isDone = !hasMore && !isLoading;

    const layoutHeight = (pages[pages.length - 1] || noPage).stop;

    if (isDone) {
      layoutHeight + 50;
    }

    return (
      <div ref={this.onReference} className={classNames(containerClassName)}>
        <div
          className={classNames(layoutClassName)}
          style={{ height: `${layoutHeight}px`, position: "relative" }}
        >
          {pages.map((page, index) => {
            if (!page.visible) {
              return null;
            }
            return (
              <div
                className={classNames(pageClassName)}
                data-id={index}
                key={index}
              >
                {page.items.map(
                  (
                    {
                      props,
                      left,
                      top,
                      width,
                      height,
                      columnSpan,
                      ...otherProps
                    },
                    itemIndex
                  ) => {
                    return (
                      <Item
                        key={itemIndex}
                        columnSpan={columnSpan}
                        style={{
                          position: "absolute",
                          transform: `translate3d(${left}px, ${top}px, 0)`,
                          width: width + "px",
                          height: height + "px"
                        }}
                        {...props}
                        {...otherProps}
                      />
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
        <Metrics>
          <Metric>
            <em>{this.props.items.length}</em>
            <span>Items</span>
          </Metric>
          <Metric>
            <em ref={node => (this.nodesRef = node)}>{this.state.nodes}</em>
            <span>Nodes</span>
          </Metric>

          {/* <FPS>
            {fps => (
              <Metric>
                <em>{fps}</em>
                <span>FPS</span>
              </Metric>
            )}
          </FPS> */}
        </Metrics>
        {hasMore && isLoading && loadingElement}
        {isDone && (
          <footer
            style={{
              position: "absolute",
              top: `${layoutHeight - 40}px`,
              left: "50%",
              transform: "translateX(-50%);"
            }}
          >
            {doneElement}
          </footer>
        )}
      </div>
    );
  }
}
