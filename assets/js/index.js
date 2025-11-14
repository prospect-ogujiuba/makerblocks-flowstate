/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => d.overflows[0] > 0 && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ }),

/***/ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
  // RTL <body> scrollbar.
  getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, accRect.top);
    accRect.right = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(referenceEl) : []), ...(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ "./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate),
/* harmony export */   computePosition: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size),
/* harmony export */   useFloating: () => (/* binding */ useFloating)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "react-dom");






var isClient = typeof document !== 'undefined';

var noop = function noop() {};
var index = isClient ? react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect : noop;

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}

function getDPR(element) {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

function useLatestRef(value) {
  const ref = react__WEBPACK_IMPORTED_MODULE_2__.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = react__WEBPACK_IMPORTED_MODULE_2__.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = react__WEBPACK_IMPORTED_MODULE_2__.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = react__WEBPACK_IMPORTED_MODULE_2__.useState(null);
  const [_floating, _setFloating] = react__WEBPACK_IMPORTED_MODULE_2__.useState(null);
  const setReference = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(node => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(node => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
  const floatingRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
  const dataRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);
  const openRef = useLatestRef(open);
  const update = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(referenceRef.current, floatingRef.current, config).then(data => {
      const fullData = {
        ...data,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        react_dom__WEBPACK_IMPORTED_MODULE_3__.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData(data => ({
        ...data,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...(getDPR(elements.floating) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, 'current');
  }
  return {
    name: 'arrow',
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === 'function' ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.arrow)({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.arrow)({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)(options),
  options: [options, deps]
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.limitShift)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)(options),
  options: [options, deps]
});

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoPlacement)(options),
  options: [options, deps]
});

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.hide)(options),
  options: [options, deps]
});

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.inline)(options),
  options: [options, deps]
});

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
});




/***/ }),

/***/ "./node_modules/@floating-ui/react/dist/floating-ui.react.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/react/dist/floating-ui.react.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Composite: () => (/* binding */ Composite),
/* harmony export */   CompositeItem: () => (/* binding */ CompositeItem),
/* harmony export */   FloatingArrow: () => (/* binding */ FloatingArrow),
/* harmony export */   FloatingDelayGroup: () => (/* binding */ FloatingDelayGroup),
/* harmony export */   FloatingFocusManager: () => (/* binding */ FloatingFocusManager),
/* harmony export */   FloatingList: () => (/* binding */ FloatingList),
/* harmony export */   FloatingNode: () => (/* binding */ FloatingNode),
/* harmony export */   FloatingOverlay: () => (/* binding */ FloatingOverlay),
/* harmony export */   FloatingPortal: () => (/* binding */ FloatingPortal),
/* harmony export */   FloatingTree: () => (/* binding */ FloatingTree),
/* harmony export */   arrow: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.arrow),
/* harmony export */   autoPlacement: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.autoPlacement),
/* harmony export */   autoUpdate: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.autoUpdate),
/* harmony export */   computePosition: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.computePosition),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.detectOverflow),
/* harmony export */   flip: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getOverflowAncestors),
/* harmony export */   hide: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.hide),
/* harmony export */   inline: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.inline),
/* harmony export */   inner: () => (/* binding */ inner),
/* harmony export */   limitShift: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.limitShift),
/* harmony export */   offset: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.offset),
/* harmony export */   platform: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.platform),
/* harmony export */   safePolygon: () => (/* binding */ safePolygon),
/* harmony export */   shift: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.shift),
/* harmony export */   size: () => (/* reexport safe */ _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.size),
/* harmony export */   useClick: () => (/* binding */ useClick),
/* harmony export */   useClientPoint: () => (/* binding */ useClientPoint),
/* harmony export */   useDelayGroup: () => (/* binding */ useDelayGroup),
/* harmony export */   useDelayGroupContext: () => (/* binding */ useDelayGroupContext),
/* harmony export */   useDismiss: () => (/* binding */ useDismiss),
/* harmony export */   useFloating: () => (/* binding */ useFloating),
/* harmony export */   useFloatingNodeId: () => (/* binding */ useFloatingNodeId),
/* harmony export */   useFloatingParentNodeId: () => (/* binding */ useFloatingParentNodeId),
/* harmony export */   useFloatingPortalNode: () => (/* binding */ useFloatingPortalNode),
/* harmony export */   useFloatingRootContext: () => (/* binding */ useFloatingRootContext),
/* harmony export */   useFloatingTree: () => (/* binding */ useFloatingTree),
/* harmony export */   useFocus: () => (/* binding */ useFocus),
/* harmony export */   useHover: () => (/* binding */ useHover),
/* harmony export */   useId: () => (/* binding */ useId),
/* harmony export */   useInnerOffset: () => (/* binding */ useInnerOffset),
/* harmony export */   useInteractions: () => (/* binding */ useInteractions),
/* harmony export */   useListItem: () => (/* binding */ useListItem),
/* harmony export */   useListNavigation: () => (/* binding */ useListNavigation),
/* harmony export */   useMergeRefs: () => (/* binding */ useMergeRefs),
/* harmony export */   useRole: () => (/* binding */ useRole),
/* harmony export */   useTransitionStatus: () => (/* binding */ useTransitionStatus),
/* harmony export */   useTransitionStyles: () => (/* binding */ useTransitionStyles),
/* harmony export */   useTypeahead: () => (/* binding */ useTypeahead)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @floating-ui/react/utils */ "./node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs");
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @floating-ui/react-dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");
/* harmony import */ var tabbable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tabbable */ "./node_modules/tabbable/dist/index.esm.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/react-dom */ "./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs");
/* harmony import */ var _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @floating-ui/react-dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");










/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 * @see https://floating-ui.com/docs/react-utils#usemergerefs
 */
function useMergeRefs(refs) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    if (refs.every(ref => ref == null)) {
      return null;
    }
    return value => {
      refs.forEach(ref => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

// https://github.com/mui/material-ui/issues/41190#issuecomment-2040873379
const SafeReact = {
  .../*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))
};

const useInsertionEffect = SafeReact.useInsertionEffect;
const useSafeInsertionEffect = useInsertionEffect || (fn => fn());
function useEffectEvent(callback) {
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {
    if (true) {
      throw new Error('Cannot call an event handler while rendering.');
    }
  });
  useSafeInsertionEffect(() => {
    ref.current = callback;
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current == null ? void 0 : ref.current(...args);
  }, []);
}

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
function isDifferentRow(index, cols, prevRow) {
  return Math.floor(index / cols) !== prevRow;
}
function isIndexOutOfBounds(listRef, index) {
  return index < 0 || index >= listRef.current.length;
}
function getMinIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    disabledIndices
  });
}
function getMaxIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices
  });
}
function findNonDisabledIndex(listRef, _temp) {
  let {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1
  } = _temp === void 0 ? {} : _temp;
  const list = listRef.current;
  let index = startingIndex;
  do {
    index += decrement ? -amount : amount;
  } while (index >= 0 && index <= list.length - 1 && isDisabled(list, index, disabledIndices));
  return index;
}
function getGridNavigatedIndex(elementsRef, _ref) {
  let {
    event,
    orientation,
    loop,
    rtl,
    cols,
    disabledIndices,
    minIndex,
    maxIndex,
    prevIndex,
    stopEvent: stop = false
  } = _ref;
  let nextIndex = prevIndex;
  if (event.key === ARROW_UP) {
    stop && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
    if (prevIndex === -1) {
      nextIndex = maxIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: nextIndex,
        amount: cols,
        decrement: true,
        disabledIndices
      });
      if (loop && (prevIndex - cols < minIndex || nextIndex < 0)) {
        const col = prevIndex % cols;
        const maxCol = maxIndex % cols;
        const offset = maxIndex - (maxCol - col);
        if (maxCol === col) {
          nextIndex = maxIndex;
        } else {
          nextIndex = maxCol > col ? offset : offset - cols;
        }
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }
  if (event.key === ARROW_DOWN) {
    stop && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
    if (prevIndex === -1) {
      nextIndex = minIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: prevIndex,
        amount: cols,
        disabledIndices
      });
      if (loop && prevIndex + cols > maxIndex) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex % cols - cols,
          amount: cols,
          disabledIndices
        });
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }

  // Remains on the same row/column.
  if (orientation === 'both') {
    const prevRow = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.floor)(prevIndex / cols);
    if (event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT)) {
      stop && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex - prevIndex % cols - 1,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    if (event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT)) {
      stop && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          decrement: true,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex + (cols - prevIndex % cols),
            decrement: true,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex + (cols - prevIndex % cols),
          decrement: true,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    const lastRow = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.floor)(maxIndex / cols) === prevRow;
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      if (loop && lastRow) {
        nextIndex = event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT) ? maxIndex : findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      } else {
        nextIndex = prevIndex;
      }
    }
  }
  return nextIndex;
}

/** For each cell index, gets the item index that occupies that cell */
function buildCellMap(sizes, cols, dense) {
  const cellMap = [];
  let startIndex = 0;
  sizes.forEach((_ref2, index) => {
    let {
      width,
      height
    } = _ref2;
    if (width > cols) {
      if (true) {
        throw new Error("[Floating UI]: Invalid grid - item width at index " + index + " is greater than grid columns");
      }
    }
    let itemPlaced = false;
    if (dense) {
      startIndex = 0;
    }
    while (!itemPlaced) {
      const targetCells = [];
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          targetCells.push(startIndex + i + j * cols);
        }
      }
      if (startIndex % cols + width <= cols && targetCells.every(cell => cellMap[cell] == null)) {
        targetCells.forEach(cell => {
          cellMap[cell] = index;
        });
        itemPlaced = true;
      } else {
        startIndex++;
      }
    }
  });

  // convert into a non-sparse array
  return [...cellMap];
}

/** Gets cell index of an item's corner or -1 when index is -1. */
function getCellIndexOfCorner(index, sizes, cellMap, cols, corner) {
  if (index === -1) return -1;
  const firstCellIndex = cellMap.indexOf(index);
  const sizeItem = sizes[index];
  switch (corner) {
    case 'tl':
      return firstCellIndex;
    case 'tr':
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + sizeItem.width - 1;
    case 'bl':
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + (sizeItem.height - 1) * cols;
    case 'br':
      return cellMap.lastIndexOf(index);
  }
}

/** Gets all cell indices that correspond to the specified indices */
function getCellIndices(indices, cellMap) {
  return cellMap.flatMap((index, cellIndex) => indices.includes(index) ? [cellIndex] : []);
}
function isDisabled(list, index, disabledIndices) {
  if (disabledIndices) {
    return disabledIndices.includes(index);
  }
  const element = list[index];
  return element == null || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}

var index = typeof document !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

function sortByDocumentPosition(a, b) {
  const position = a.compareDocumentPosition(b);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
}
function areMapsEqual(map1, map2) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value] of map1.entries()) {
    if (value !== map2.get(key)) {
      return false;
    }
  }
  return true;
}
const FloatingListContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  register: () => {},
  unregister: () => {},
  map: /*#__PURE__*/new Map(),
  elementsRef: {
    current: []
  }
});
/**
 * Provides context for a list of items within the floating element.
 * @see https://floating-ui.com/docs/FloatingList
 */
function FloatingList(props) {
  const {
    children,
    elementsRef,
    labelsRef
  } = props;
  const [map, setMap] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new Map());
  const register = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    setMap(prevMap => new Map(prevMap).set(node, null));
  }, []);
  const unregister = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    setMap(prevMap => {
      const map = new Map(prevMap);
      map.delete(node);
      return map;
    });
  }, []);
  index(() => {
    const newMap = new Map(map);
    const nodes = Array.from(newMap.keys()).sort(sortByDocumentPosition);
    nodes.forEach((node, index) => {
      newMap.set(node, index);
    });
    if (!areMapsEqual(map, newMap)) {
      setMap(newMap);
    }
  }, [map]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FloatingListContext.Provider, {
    value: react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
      register,
      unregister,
      map,
      elementsRef,
      labelsRef
    }), [register, unregister, map, elementsRef, labelsRef])
  }, children);
}
/**
 * Used to register a list item and its index (DOM position) in the
 * `FloatingList`.
 * @see https://floating-ui.com/docs/FloatingList#uselistitem
 */
function useListItem(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    label
  } = props;
  const {
    register,
    unregister,
    map,
    elementsRef,
    labelsRef
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FloatingListContext);
  const [index$1, setIndex] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const componentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    componentRef.current = node;
    if (index$1 !== null) {
      elementsRef.current[index$1] = node;
      if (labelsRef) {
        var _node$textContent;
        const isLabelDefined = label !== undefined;
        labelsRef.current[index$1] = isLabelDefined ? label : (_node$textContent = node == null ? void 0 : node.textContent) != null ? _node$textContent : null;
      }
    }
  }, [index$1, elementsRef, labelsRef, label]);
  index(() => {
    const node = componentRef.current;
    if (node) {
      register(node);
      return () => {
        unregister(node);
      };
    }
  }, [register, unregister]);
  index(() => {
    const index = componentRef.current ? map.get(componentRef.current) : null;
    if (index != null) {
      setIndex(index);
    }
  }, [map]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    ref,
    index: index$1 == null ? -1 : index$1
  }), [index$1, ref]);
}

function renderJsx(render, computedProps) {
  if (typeof render === 'function') {
    return render(computedProps);
  }
  if (render) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(render, computedProps);
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", computedProps);
}
const CompositeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  activeIndex: 0,
  onNavigate: () => {}
});
const horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
const verticalKeys = [ARROW_UP, ARROW_DOWN];
const allKeys = [...horizontalKeys, ...verticalKeys];

/**
 * Creates a single tab stop whose items are navigated by arrow keys, which
 * provides list navigation outside of floating element contexts.
 *
 * This is useful to enable navigation of a list of items that aren’t part of a
 * floating element. A menubar is an example of a composite, with each reference
 * element being an item.
 * @see https://floating-ui.com/docs/Composite
 */
const Composite = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function Composite(props, forwardedRef) {
  const {
    render,
    orientation = 'both',
    loop = true,
    rtl = false,
    cols = 1,
    disabledIndices,
    activeIndex: externalActiveIndex,
    onNavigate: externalSetActiveIndex,
    itemSizes,
    dense = false,
    ...domProps
  } = props;
  const [internalActiveIndex, internalSetActiveIndex] = react__WEBPACK_IMPORTED_MODULE_0__.useState(0);
  const activeIndex = externalActiveIndex != null ? externalActiveIndex : internalActiveIndex;
  const onNavigate = useEffectEvent(externalSetActiveIndex != null ? externalSetActiveIndex : internalSetActiveIndex);
  const elementsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef([]);
  const renderElementProps = render && typeof render !== 'function' ? render.props : {};
  const contextValue = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    activeIndex,
    onNavigate
  }), [activeIndex, onNavigate]);
  const isGrid = cols > 1;
  function handleKeyDown(event) {
    if (!allKeys.includes(event.key)) return;
    let nextIndex = activeIndex;
    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);
    const horizontalEndKey = rtl ? ARROW_LEFT : ARROW_RIGHT;
    const horizontalStartKey = rtl ? ARROW_RIGHT : ARROW_LEFT;
    if (isGrid) {
      const sizes = itemSizes || Array.from({
        length: elementsRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(index => index != null && !isDisabled(elementsRef.current, index, disabledIndices));
      // last enabled index
      const maxGridIndex = cellMap.reduce((foundIndex, index, cellIndex) => index != null && !isDisabled(elementsRef.current, index, disabledIndices) ? cellIndex : foundIndex, -1);
      const maybeNextIndex = cellMap[getGridNavigatedIndex({
        current: cellMap.map(itemIndex => itemIndex ? elementsRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loop,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getCellIndices([...(disabledIndices || elementsRef.current.map((_, index) => isDisabled(elementsRef.current, index) ? index : undefined)), undefined], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getCellIndexOfCorner(activeIndex > maxIndex ? minIndex : activeIndex, sizes, cellMap, cols,
        // use a corner matching the edge closest to the direction we're
        // moving in so we don't end up in the same item. Prefer
        // top/left over bottom/right.
        event.key === ARROW_DOWN ? 'bl' : event.key === horizontalEndKey ? 'tr' : 'tl')
      })];
      if (maybeNextIndex != null) {
        nextIndex = maybeNextIndex;
      }
    }
    const toEndKeys = {
      horizontal: [horizontalEndKey],
      vertical: [ARROW_DOWN],
      both: [horizontalEndKey, ARROW_DOWN]
    }[orientation];
    const toStartKeys = {
      horizontal: [horizontalStartKey],
      vertical: [ARROW_UP],
      both: [horizontalStartKey, ARROW_UP]
    }[orientation];
    const preventedKeys = isGrid ? allKeys : {
      horizontal: horizontalKeys,
      vertical: verticalKeys,
      both: allKeys
    }[orientation];
    if (nextIndex === activeIndex && [...toEndKeys, ...toStartKeys].includes(event.key)) {
      if (loop && nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (loop && nextIndex === minIndex && toStartKeys.includes(event.key)) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: nextIndex,
          decrement: toStartKeys.includes(event.key),
          disabledIndices
        });
      }
    }
    if (nextIndex !== activeIndex && !isIndexOutOfBounds(elementsRef, nextIndex)) {
      var _elementsRef$current$;
      event.stopPropagation();
      if (preventedKeys.includes(event.key)) {
        event.preventDefault();
      }
      onNavigate(nextIndex);
      (_elementsRef$current$ = elementsRef.current[nextIndex]) == null || _elementsRef$current$.focus();
    }
  }
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: forwardedRef,
    'aria-orientation': orientation === 'both' ? undefined : orientation,
    onKeyDown(e) {
      domProps.onKeyDown == null || domProps.onKeyDown(e);
      renderElementProps.onKeyDown == null || renderElementProps.onKeyDown(e);
      handleKeyDown(e);
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(CompositeContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FloatingList, {
    elementsRef: elementsRef
  }, renderJsx(render, computedProps)));
});
/**
 * @see https://floating-ui.com/docs/Composite
 */
const CompositeItem = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function CompositeItem(props, forwardedRef) {
  const {
    render,
    ...domProps
  } = props;
  const renderElementProps = render && typeof render !== 'function' ? render.props : {};
  const {
    activeIndex,
    onNavigate
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(CompositeContext);
  const {
    ref,
    index
  } = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);
  const isActive = activeIndex === index;
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: isActive ? 0 : -1,
    'data-active': isActive ? '' : undefined,
    onFocus(e) {
      domProps.onFocus == null || domProps.onFocus(e);
      renderElementProps.onFocus == null || renderElementProps.onFocus(e);
      onNavigate(index);
    }
  };
  return renderJsx(render, computedProps);
});

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

let serverHandoffComplete = false;
let count = 0;
const genId = () => // Ensure the id is unique with multiple independent versions of Floating UI
// on <React 18
"floating-ui-" + Math.random().toString(36).slice(2, 6) + count++;
function useFloatingId() {
  const [id, setId] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => serverHandoffComplete ? genId() : undefined);
  index(() => {
    if (id == null) {
      setId(genId());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    serverHandoffComplete = true;
  }, []);
  return id;
}
const useReactId = SafeReact.useId;

/**
 * Uses React 18's built-in `useId()` when available, or falls back to a
 * slightly less performant (requiring a double render) implementation for
 * earlier React versions.
 * @see https://floating-ui.com/docs/react-utils#useid
 */
const useId = useReactId || useFloatingId;

let devMessageSet;
if (true) {
  devMessageSet = /*#__PURE__*/new Set();
}
function warn() {
  var _devMessageSet;
  for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
    messages[_key] = arguments[_key];
  }
  const message = "Floating UI: " + messages.join(' ');
  if (!((_devMessageSet = devMessageSet) != null && _devMessageSet.has(message))) {
    var _devMessageSet2;
    (_devMessageSet2 = devMessageSet) == null || _devMessageSet2.add(message);
    console.warn(message);
  }
}
function error() {
  var _devMessageSet3;
  for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    messages[_key2] = arguments[_key2];
  }
  const message = "Floating UI: " + messages.join(' ');
  if (!((_devMessageSet3 = devMessageSet) != null && _devMessageSet3.has(message))) {
    var _devMessageSet4;
    (_devMessageSet4 = devMessageSet) == null || _devMessageSet4.add(message);
    console.error(message);
  }
}

/**
 * Renders a pointing arrow triangle.
 * @see https://floating-ui.com/docs/FloatingArrow
 */
const FloatingArrow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function FloatingArrow(props, ref) {
  const {
    context: {
      placement,
      elements: {
        floating
      },
      middlewareData: {
        arrow,
        shift
      }
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d,
    style: {
      transform,
      ...restStyle
    } = {},
    ...rest
  } = props;
  if (true) {
    if (!ref) {
      warn('The `ref` prop is required for `FloatingArrow`.');
    }
  }
  const clipPathId = useId();
  const [isRTL, setIsRTL] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);

  // https://github.com/floating-ui/floating-ui/issues/2932
  index(() => {
    if (!floating) return;
    const isRTL = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getComputedStyle)(floating).direction === 'rtl';
    if (isRTL) {
      setIsRTL(true);
    }
  }, [floating]);
  if (!floating) {
    return null;
  }
  const [side, alignment] = placement.split('-');
  const isVerticalSide = side === 'top' || side === 'bottom';
  let computedStaticOffset = staticOffset;
  if (isVerticalSide && shift != null && shift.x || !isVerticalSide && shift != null && shift.y) {
    computedStaticOffset = null;
  }

  // Strokes must be double the border width, this ensures the stroke's width
  // works as you'd expect.
  const computedStrokeWidth = strokeWidth * 2;
  const halfStrokeWidth = computedStrokeWidth / 2;
  const svgX = width / 2 * (tipRadius / -8 + 1);
  const svgY = height / 2 * tipRadius / 4;
  const isCustomShape = !!d;
  const yOffsetProp = computedStaticOffset && alignment === 'end' ? 'bottom' : 'top';
  let xOffsetProp = computedStaticOffset && alignment === 'end' ? 'right' : 'left';
  if (computedStaticOffset && isRTL) {
    xOffsetProp = alignment === 'end' ? 'left' : 'right';
  }
  const arrowX = (arrow == null ? void 0 : arrow.x) != null ? computedStaticOffset || arrow.x : '';
  const arrowY = (arrow == null ? void 0 : arrow.y) != null ? computedStaticOffset || arrow.y : '';
  const dValue = d || 'M0,0' + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + ' Z';
  const rotation = {
    top: isCustomShape ? 'rotate(180deg)' : '',
    left: isCustomShape ? 'rotate(90deg)' : 'rotate(-90deg)',
    bottom: isCustomShape ? '' : 'rotate(180deg)',
    right: isCustomShape ? 'rotate(-90deg)' : 'rotate(90deg)'
  }[side];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({}, rest, {
    "aria-hidden": true,
    ref: ref,
    width: isCustomShape ? width : width + computedStrokeWidth,
    height: width,
    viewBox: "0 0 " + width + " " + (height > width ? height : width),
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      [xOffsetProp]: arrowX,
      [yOffsetProp]: arrowY,
      [side]: isVerticalSide || isCustomShape ? '100%' : "calc(100% - " + computedStrokeWidth / 2 + "px)",
      transform: [rotation, transform].filter(t => !!t).join(' '),
      ...restStyle
    }
  }), computedStrokeWidth > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    clipPath: "url(#" + clipPathId + ")",
    fill: "none",
    stroke: stroke
    // Account for the stroke on the fill path rendered below.
    ,
    strokeWidth: computedStrokeWidth + (d ? 0 : 1),
    d: dValue
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    stroke: computedStrokeWidth && !d ? rest.fill : 'none',
    d: dValue
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("clipPath", {
    id: clipPathId
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", {
    x: -halfStrokeWidth,
    y: halfStrokeWidth * (isCustomShape ? -1 : 1),
    width: width + computedStrokeWidth,
    height: width
  })));
});

function createPubSub() {
  const map = new Map();
  return {
    emit(event, data) {
      var _map$get;
      (_map$get = map.get(event)) == null || _map$get.forEach(handler => handler(data));
    },
    on(event, listener) {
      map.set(event, [...(map.get(event) || []), listener]);
    },
    off(event, listener) {
      var _map$get2;
      map.set(event, ((_map$get2 = map.get(event)) == null ? void 0 : _map$get2.filter(l => l !== listener)) || []);
    }
  };
}

const FloatingNodeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
const FloatingTreeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);

/**
 * Returns the parent node id for nested floating elements, if available.
 * Returns `null` for top-level floating elements.
 */
const useFloatingParentNodeId = () => {
  var _React$useContext;
  return ((_React$useContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
};

/**
 * Returns the nearest floating tree context, if available.
 */
const useFloatingTree = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(FloatingTreeContext);

/**
 * Registers a node into the `FloatingTree`, returning its id.
 * @see https://floating-ui.com/docs/FloatingTree
 */
function useFloatingNodeId(customParentId) {
  const id = useId();
  const tree = useFloatingTree();
  const reactParentId = useFloatingParentNodeId();
  const parentId = customParentId || reactParentId;
  index(() => {
    const node = {
      id,
      parentId
    };
    tree == null || tree.addNode(node);
    return () => {
      tree == null || tree.removeNode(node);
    };
  }, [tree, id, parentId]);
  return id;
}
/**
 * Provides parent node context for nested floating elements.
 * @see https://floating-ui.com/docs/FloatingTree
 */
function FloatingNode(props) {
  const {
    children,
    id
  } = props;
  const parentId = useFloatingParentNodeId();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FloatingNodeContext.Provider, {
    value: react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
      id,
      parentId
    }), [id, parentId])
  }, children);
}
/**
 * Provides context for nested floating elements when they are not children of
 * each other on the DOM.
 * This is not necessary in all cases, except when there must be explicit communication between parent and child floating elements. It is necessary for:
 * - The `bubbles` option in the `useDismiss()` Hook
 * - Nested virtual list navigation
 * - Nested floating elements that each open on hover
 * - Custom communication between parent and child floating elements
 * @see https://floating-ui.com/docs/FloatingTree
 */
function FloatingTree(props) {
  const {
    children
  } = props;
  const nodesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef([]);
  const addNode = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    nodesRef.current = [...nodesRef.current, node];
  }, []);
  const removeNode = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    nodesRef.current = nodesRef.current.filter(n => n !== node);
  }, []);
  const events = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => createPubSub())[0];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FloatingTreeContext.Provider, {
    value: react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
      nodesRef,
      addNode,
      removeNode,
      events
    }), [addNode, removeNode, events])
  }, children);
}

function createAttribute(name) {
  return "data-floating-ui-" + name;
}

function useLatestRef(value) {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

const safePolygonIdentifier = /*#__PURE__*/createAttribute('safe-polygon');
function getDelay(value, prop, pointerType) {
  if (pointerType && !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerType)) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return value == null ? void 0 : value[prop];
}
/**
 * Opens the floating element while hovering over the reference element, like
 * CSS `:hover`.
 * @see https://floating-ui.com/docs/useHover
 */
function useHover(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements
  } = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true
  } = props;
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const openRef = useLatestRef(open);
  const pointerTypeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const timeoutRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(-1);
  const handlerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const restTimeoutRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(-1);
  const blockMouseMoveRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  const performedPointerEventsMutationRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const unbindMouseMoveRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {});
  const restTimeoutPendingRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const isHoverOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    var _dataRef$current$open;
    const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
    return (type == null ? void 0 : type.includes('mouse')) && type !== 'mousedown';
  }, [dataRef]);

  // When closing before opening, clear the delay timeouts to cancel it
  // from showing.
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    function onOpenChange(_ref) {
      let {
        open
      } = _ref;
      if (!open) {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }
    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [enabled, events]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    if (!handleCloseRef.current) return;
    if (!open) return;
    function onLeave(event) {
      if (isHoverOpen()) {
        onOpenChange(false, event, 'hover');
      }
    }
    const html = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [elements.floating, open, onOpenChange, enabled, handleCloseRef, isHoverOpen]);
  const closeWithDelay = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (event, runElseBranch, reason) {
    if (runElseBranch === void 0) {
      runElseBranch = true;
    }
    if (reason === void 0) {
      reason = 'hover';
    }
    const closeDelay = getDelay(delayRef.current, 'close', pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => onOpenChange(false, event, reason), closeDelay);
    } else if (runElseBranch) {
      clearTimeout(timeoutRef.current);
      onOpenChange(false, event, reason);
    }
  }, [delayRef, onOpenChange]);
  const cleanupMouseMoveHandler = useEffectEvent(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = undefined;
  });
  const clearPointerEvents = useEffectEvent(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating).body;
      body.style.pointerEvents = '';
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });
  const isClickLikeOpenEvent = useEffectEvent(() => {
    return dataRef.current.openEvent ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type) : false;
  });

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    function onMouseEnter(event) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;
      if (mouseOnly && !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerTypeRef.current) || restMs > 0 && !getDelay(delayRef.current, 'open')) {
        return;
      }
      const openDelay = getDelay(delayRef.current, 'open', pointerTypeRef.current);
      if (openDelay) {
        timeoutRef.current = window.setTimeout(() => {
          if (!openRef.current) {
            onOpenChange(true, event, 'hover');
          }
        }, openDelay);
      } else if (!open) {
        onOpenChange(true, event, 'hover');
      }
    }
    function onMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      unbindMouseMoveRef.current();
      const doc = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating);
      clearTimeout(restTimeoutRef.current);
      restTimeoutPendingRef.current = false;
      if (handleCloseRef.current && dataRef.current.floatingContext) {
        // Prevent clearing `onScrollMouseLeave` timeout.
        if (!open) {
          clearTimeout(timeoutRef.current);
        }
        handlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event, true, 'safe-polygon');
            }
          }
        });
        const handler = handlerRef.current;
        doc.addEventListener('mousemove', handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler);
        };
        return;
      }

      // Allow interactivity without `safePolygon` on touch devices. With a
      // pointer, a short close delay is an alternative, so it should work
      // consistently.
      const shouldClose = pointerTypeRef.current === 'touch' ? !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(elements.floating, event.relatedTarget) : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }

    // Ensure the floating element closes after scrolling even if the pointer
    // did not move.
    // https://github.com/floating-ui/floating-ui/discussions/1692
    function onScrollMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      if (!dataRef.current.floatingContext) return;
      handleCloseRef.current == null || handleCloseRef.current({
        ...dataRef.current.floatingContext,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          if (!isClickLikeOpenEvent()) {
            closeWithDelay(event);
          }
        }
      })(event);
    }
    if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(elements.domReference)) {
      var _elements$floating;
      const ref = elements.domReference;
      open && ref.addEventListener('mouseleave', onScrollMouseLeave);
      (_elements$floating = elements.floating) == null || _elements$floating.addEventListener('mouseleave', onScrollMouseLeave);
      move && ref.addEventListener('mousemove', onMouseEnter, {
        once: true
      });
      ref.addEventListener('mouseenter', onMouseEnter);
      ref.addEventListener('mouseleave', onMouseLeave);
      return () => {
        var _elements$floating2;
        open && ref.removeEventListener('mouseleave', onScrollMouseLeave);
        (_elements$floating2 = elements.floating) == null || _elements$floating2.removeEventListener('mouseleave', onScrollMouseLeave);
        move && ref.removeEventListener('mousemove', onMouseEnter);
        ref.removeEventListener('mouseenter', onMouseEnter);
        ref.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [elements, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, openRef, tree, delayRef, handleCloseRef, dataRef, isClickLikeOpenEvent]);

  // Block pointer-events of every element other than the reference and floating
  // while the floating element is open and has a `handleClose` handler. Also
  // handles nested floating elements.
  // https://github.com/floating-ui/floating-ui/issues/1722
  index(() => {
    var _handleCloseRef$curre;
    if (!enabled) return;
    if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
      performedPointerEventsMutationRef.current = true;
      const floatingEl = elements.floating;
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(elements.domReference) && floatingEl) {
        var _tree$nodesRef$curren;
        const body = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating).body;
        body.setAttribute(safePolygonIdentifier, '');
        const ref = elements.domReference;
        const parentFloating = tree == null || (_tree$nodesRef$curren = tree.nodesRef.current.find(node => node.id === parentId)) == null || (_tree$nodesRef$curren = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren.elements.floating;
        if (parentFloating) {
          parentFloating.style.pointerEvents = '';
        }
        body.style.pointerEvents = 'none';
        ref.style.pointerEvents = 'auto';
        floatingEl.style.pointerEvents = 'auto';
        return () => {
          body.style.pointerEvents = '';
          ref.style.pointerEvents = '';
          floatingEl.style.pointerEvents = '';
        };
      }
    }
  }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);
  index(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      restTimeoutPendingRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [enabled, elements.domReference, cleanupMouseMoveHandler, clearPointerEvents]);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }
    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const {
          nativeEvent
        } = event;
        function handleMouseMove() {
          if (!blockMouseMoveRef.current && !openRef.current) {
            onOpenChange(true, nativeEvent, 'hover');
          }
        }
        if (mouseOnly && !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerTypeRef.current)) {
          return;
        }
        if (open || restMs === 0) {
          return;
        }

        // Ignore insignificant movements to account for tremors.
        if (restTimeoutPendingRef.current && event.movementX ** 2 + event.movementY ** 2 < 2) {
          return;
        }
        clearTimeout(restTimeoutRef.current);
        if (pointerTypeRef.current === 'touch') {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeoutRef.current = window.setTimeout(handleMouseMove, restMs);
        }
      }
    };
  }, [mouseOnly, onOpenChange, open, openRef, restMs]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onMouseEnter() {
      clearTimeout(timeoutRef.current);
    },
    onMouseLeave(event) {
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event.nativeEvent, false);
      }
    }
  }), [closeWithDelay, isClickLikeOpenEvent]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

const NOOP = () => {};
const FloatingDelayGroupContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  delay: 0,
  initialDelay: 0,
  timeoutMs: 0,
  currentId: null,
  setCurrentId: NOOP,
  setState: NOOP,
  isInstantPhase: false
});

/**
 * @deprecated
 * Use the return value of `useDelayGroup()` instead.
 */
const useDelayGroupContext = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(FloatingDelayGroupContext);
/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
function FloatingDelayGroup(props) {
  const {
    children,
    delay,
    timeoutMs = 0
  } = props;
  const [state, setState] = react__WEBPACK_IMPORTED_MODULE_0__.useReducer((prev, next) => ({
    ...prev,
    ...next
  }), {
    delay,
    timeoutMs,
    initialDelay: delay,
    currentId: null,
    isInstantPhase: false
  });
  const initialCurrentIdRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const setCurrentId = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(currentId => {
    setState({
      currentId
    });
  }, []);
  index(() => {
    if (state.currentId) {
      if (initialCurrentIdRef.current === null) {
        initialCurrentIdRef.current = state.currentId;
      } else if (!state.isInstantPhase) {
        setState({
          isInstantPhase: true
        });
      }
    } else {
      if (state.isInstantPhase) {
        setState({
          isInstantPhase: false
        });
      }
      initialCurrentIdRef.current = null;
    }
  }, [state.currentId, state.isInstantPhase]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FloatingDelayGroupContext.Provider, {
    value: react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
      ...state,
      setState,
      setCurrentId
    }), [state, setCurrentId])
  }, children);
}
/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
function useDelayGroup(context, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    open,
    onOpenChange,
    floatingId
  } = context;
  const {
    id: optionId,
    enabled = true
  } = options;
  const id = optionId != null ? optionId : floatingId;
  const groupContext = useDelayGroupContext();
  const {
    currentId,
    setCurrentId,
    initialDelay,
    setState,
    timeoutMs
  } = groupContext;
  index(() => {
    if (!enabled) return;
    if (!currentId) return;
    setState({
      delay: {
        open: 1,
        close: getDelay(initialDelay, 'close')
      }
    });
    if (currentId !== id) {
      onOpenChange(false);
    }
  }, [enabled, id, onOpenChange, setState, currentId, initialDelay]);
  index(() => {
    function unset() {
      onOpenChange(false);
      setState({
        delay: initialDelay,
        currentId: null
      });
    }
    if (!enabled) return;
    if (!currentId) return;
    if (!open && currentId === id) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeout);
        };
      }
      unset();
    }
  }, [enabled, open, setState, currentId, id, onOpenChange, initialDelay, timeoutMs]);
  index(() => {
    if (!enabled) return;
    if (setCurrentId === NOOP || !open) return;
    setCurrentId(id);
  }, [enabled, open, setCurrentId, id]);
  return groupContext;
}

let rafId = 0;
function enqueueFocus(el, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    preventScroll = false,
    cancelPrevious = true,
    sync = false
  } = options;
  cancelPrevious && cancelAnimationFrame(rafId);
  const exec = () => el == null ? void 0 : el.focus({
    preventScroll
  });
  if (sync) {
    exec();
  } else {
    rafId = requestAnimationFrame(exec);
  }
}

function getAncestors(nodes, id) {
  var _nodes$find;
  let allAncestors = [];
  let currentParentId = (_nodes$find = nodes.find(node => node.id === id)) == null ? void 0 : _nodes$find.parentId;
  while (currentParentId) {
    const currentNode = nodes.find(node => node.id === currentParentId);
    currentParentId = currentNode == null ? void 0 : currentNode.parentId;
    if (currentNode) {
      allAncestors = allAncestors.concat(currentNode);
    }
  }
  return allAncestors;
}

function getChildren(nodes, id) {
  let allChildren = nodes.filter(node => {
    var _node$context;
    return node.parentId === id && ((_node$context = node.context) == null ? void 0 : _node$context.open);
  });
  let currentChildren = allChildren;
  while (currentChildren.length) {
    currentChildren = nodes.filter(node => {
      var _currentChildren;
      return (_currentChildren = currentChildren) == null ? void 0 : _currentChildren.some(n => {
        var _node$context2;
        return node.parentId === n.id && ((_node$context2 = node.context) == null ? void 0 : _node$context2.open);
      });
    });
    allChildren = allChildren.concat(currentChildren);
  }
  return allChildren;
}
function getDeepestNode(nodes, id) {
  let deepestNodeId;
  let maxDepth = -1;
  function findDeepest(nodeId, depth) {
    if (depth > maxDepth) {
      deepestNodeId = nodeId;
      maxDepth = depth;
    }
    const children = getChildren(nodes, nodeId);
    children.forEach(child => {
      findDeepest(child.id, depth + 1);
    });
  }
  findDeepest(id, 0);
  return nodes.find(node => node.id === deepestNodeId);
}

// Modified to add conditional `aria-hidden` support:
// https://github.com/theKashey/aria-hidden/blob/9220c8f4a4fd35f63bee5510a9f41a37264382d4/src/index.ts
let counterMap = /*#__PURE__*/new WeakMap();
let uncontrolledElementsSet = /*#__PURE__*/new WeakSet();
let markerMap = {};
let lockCount$1 = 0;
const supportsInert = () => typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;
const unwrapHost = node => node && (node.host || unwrapHost(node.parentNode));
const correctElements = (parent, targets) => targets.map(target => {
  if (parent.contains(target)) {
    return target;
  }
  const correctedTarget = unwrapHost(target);
  if (parent.contains(correctedTarget)) {
    return correctedTarget;
  }
  return null;
}).filter(x => x != null);
function applyAttributeToOthers(uncorrectedAvoidElements, body, ariaHidden, inert) {
  const markerName = 'data-floating-ui-inert';
  const controlAttribute = inert ? 'inert' : ariaHidden ? 'aria-hidden' : null;
  const avoidElements = correctElements(body, uncorrectedAvoidElements);
  const elementsToKeep = new Set();
  const elementsToStop = new Set(avoidElements);
  const hiddenElements = [];
  if (!markerMap[markerName]) {
    markerMap[markerName] = new WeakMap();
  }
  const markerCounter = markerMap[markerName];
  avoidElements.forEach(keep);
  deep(body);
  elementsToKeep.clear();
  function keep(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    el.parentNode && keep(el.parentNode);
  }
  function deep(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    [].forEach.call(parent.children, node => {
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getNodeName)(node) === 'script') return;
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        const attr = controlAttribute ? node.getAttribute(controlAttribute) : null;
        const alreadyHidden = attr !== null && attr !== 'false';
        const counterValue = (counterMap.get(node) || 0) + 1;
        const markerValue = (markerCounter.get(node) || 0) + 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        hiddenElements.push(node);
        if (counterValue === 1 && alreadyHidden) {
          uncontrolledElementsSet.add(node);
        }
        if (markerValue === 1) {
          node.setAttribute(markerName, '');
        }
        if (!alreadyHidden && controlAttribute) {
          node.setAttribute(controlAttribute, 'true');
        }
      }
    });
  }
  lockCount$1++;
  return () => {
    hiddenElements.forEach(element => {
      const counterValue = (counterMap.get(element) || 0) - 1;
      const markerValue = (markerCounter.get(element) || 0) - 1;
      counterMap.set(element, counterValue);
      markerCounter.set(element, markerValue);
      if (!counterValue) {
        if (!uncontrolledElementsSet.has(element) && controlAttribute) {
          element.removeAttribute(controlAttribute);
        }
        uncontrolledElementsSet.delete(element);
      }
      if (!markerValue) {
        element.removeAttribute(markerName);
      }
    });
    lockCount$1--;
    if (!lockCount$1) {
      counterMap = new WeakMap();
      counterMap = new WeakMap();
      uncontrolledElementsSet = new WeakSet();
      markerMap = {};
    }
  };
}
function markOthers(avoidElements, ariaHidden, inert) {
  if (ariaHidden === void 0) {
    ariaHidden = false;
  }
  if (inert === void 0) {
    inert = false;
  }
  const body = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(avoidElements[0]).body;
  return applyAttributeToOthers(avoidElements.concat(Array.from(body.querySelectorAll('[aria-live]'))), body, ariaHidden, inert);
}

const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck:
  // JSDOM does not support the `tabbable` library. To solve this we can
  // check if `ResizeObserver` is a real function (not polyfilled), which
  // determines if the current environment is JSDOM-like.
  typeof ResizeObserver === 'function' && ResizeObserver.toString().includes('[native code]') ? 'full' : 'none'
});
function getTabbableIn(container, direction) {
  const allTabbable = (0,tabbable__WEBPACK_IMPORTED_MODULE_7__.tabbable)(container, getTabbableOptions());
  if (direction === 'prev') {
    allTabbable.reverse();
  }
  const activeIndex = allTabbable.indexOf((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(container)));
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getNextTabbable() {
  return getTabbableIn(document.body, 'next');
}
function getPreviousTabbable() {
  return getTabbableIn(document.body, 'prev');
}
function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = (0,tabbable__WEBPACK_IMPORTED_MODULE_7__.tabbable)(container, getTabbableOptions());
  tabbableElements.forEach(element => {
    element.dataset.tabindex = element.getAttribute('tabindex') || '';
    element.setAttribute('tabindex', '-1');
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll('[data-tabindex]');
  elements.forEach(element => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute('tabindex', tabindex);
    } else {
      element.removeAttribute('tabindex');
    }
  });
}

// See Diego Haz's Sandbox for making this logic work well on Safari/iOS:
// https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/FocusTrap.tsx

const HIDDEN_STYLES = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  whiteSpace: 'nowrap',
  width: '1px',
  top: 0,
  left: 0
};
let timeoutId;
function setActiveElementOnTab(event) {
  if (event.key === 'Tab') {
    event.target;
    clearTimeout(timeoutId);
  }
}
const FocusGuard = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function FocusGuard(props, ref) {
  const [role, setRole] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  index(() => {
    if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isSafari)()) {
      // Unlike other screen readers such as NVDA and JAWS, the virtual cursor
      // on VoiceOver does trigger the onFocus event, so we can use the focus
      // trap element. On Safari, only buttons trigger the onFocus event.
      // NB: "group" role in the Sandbox no longer appears to work, must be a
      // button role.
      setRole('button');
    }
    document.addEventListener('keydown', setActiveElementOnTab);
    return () => {
      document.removeEventListener('keydown', setActiveElementOnTab);
    };
  }, []);
  const restProps = {
    ref,
    tabIndex: 0,
    // Role is only for VoiceOver
    role,
    'aria-hidden': role ? undefined : true,
    [createAttribute('focus-guard')]: '',
    style: HIDDEN_STYLES
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", _extends({}, props, restProps));
});

const PortalContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
const attr = /*#__PURE__*/createAttribute('portal');
/**
 * @see https://floating-ui.com/docs/FloatingPortal#usefloatingportalnode
 */
function useFloatingPortalNode(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    id,
    root
  } = props;
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const [portalNode, setPortalNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const portalNodeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  index(() => {
    return () => {
      portalNode == null || portalNode.remove();
      // Allow the subsequent layout effects to create a new node on updates.
      // The portal node will still be cleaned up on unmount.
      // https://github.com/floating-ui/floating-ui/issues/2454
      queueMicrotask(() => {
        portalNodeRef.current = null;
      });
    };
  }, [portalNode]);
  index(() => {
    // Wait for the uniqueId to be generated before creating the portal node in
    // React <18 (using `useFloatingId` instead of the native `useId`).
    // https://github.com/floating-ui/floating-ui/issues/2778
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    const existingIdRoot = id ? document.getElementById(id) : null;
    if (!existingIdRoot) return;
    const subRoot = document.createElement('div');
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');
    existingIdRoot.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, uniqueId]);
  index(() => {
    // Wait for the root to exist before creating the portal node. The root must
    // be stored in state, not a ref, for this to work reactively.
    if (root === null) return;
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    let container = root || (portalContext == null ? void 0 : portalContext.portalNode);
    if (container && !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(container)) container = container.current;
    container = container || document.body;
    let idWrapper = null;
    if (id) {
      idWrapper = document.createElement('div');
      idWrapper.id = id;
      container.appendChild(idWrapper);
    }
    const subRoot = document.createElement('div');
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');
    container = idWrapper || container;
    container.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, root, uniqueId, portalContext]);
  return portalNode;
}
/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * This is necessary to ensure the floating element can appear outside any
 * potential parent containers that cause clipping (such as `overflow: hidden`),
 * while retaining its location in the React tree.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
function FloatingPortal(props) {
  const {
    children,
    id,
    root,
    preserveTabOrder = true
  } = props;
  const portalNode = useFloatingPortalNode({
    id,
    root
  });
  const [focusManagerState, setFocusManagerState] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const beforeOutsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const afterOutsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const beforeInsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const afterInsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const modal = focusManagerState == null ? void 0 : focusManagerState.modal;
  const open = focusManagerState == null ? void 0 : focusManagerState.open;
  const shouldRenderGuards =
  // The FocusManager and therefore floating element are currently open/
  // rendered.
  !!focusManagerState &&
  // Guards are only for non-modal focus management.
  !focusManagerState.modal &&
  // Don't render if unmount is transitioning.
  focusManagerState.open && preserveTabOrder && !!(root || portalNode);

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!portalNode || !preserveTabOrder || modal) {
      return;
    }

    // Make sure elements inside the portal element are tabbable only when the
    // portal has already been focused, either by tabbing into a focus trap
    // element outside or using the mouse.
    function onFocus(event) {
      if (portalNode && isOutsideEvent(event)) {
        const focusing = event.type === 'focusin';
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    // Listen to the event on the capture phase so they run before the focus
    // trap elements onFocus prop is called.
    portalNode.addEventListener('focusin', onFocus, true);
    portalNode.addEventListener('focusout', onFocus, true);
    return () => {
      portalNode.removeEventListener('focusin', onFocus, true);
      portalNode.removeEventListener('focusout', onFocus, true);
    };
  }, [portalNode, preserveTabOrder, modal]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!portalNode) return;
    if (open) return;
    enableFocusInside(portalNode);
  }, [open, portalNode]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(PortalContext.Provider, {
    value: react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
      preserveTabOrder,
      beforeOutsideRef,
      afterOutsideRef,
      beforeInsideRef,
      afterInsideRef,
      portalNode,
      setFocusManagerState
    }), [preserveTabOrder, portalNode])
  }, shouldRenderGuards && portalNode && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FocusGuard, {
    "data-type": "outside",
    ref: beforeOutsideRef,
    onFocus: event => {
      if (isOutsideEvent(event, portalNode)) {
        var _beforeInsideRef$curr;
        (_beforeInsideRef$curr = beforeInsideRef.current) == null || _beforeInsideRef$curr.focus();
      } else {
        const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        prevTabbable == null || prevTabbable.focus();
      }
    }
  }), shouldRenderGuards && portalNode && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    "aria-owns": portalNode.id,
    style: HIDDEN_STYLES
  }), portalNode && /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal(children, portalNode), shouldRenderGuards && portalNode && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FocusGuard, {
    "data-type": "outside",
    ref: afterOutsideRef,
    onFocus: event => {
      if (isOutsideEvent(event, portalNode)) {
        var _afterInsideRef$curre;
        (_afterInsideRef$curre = afterInsideRef.current) == null || _afterInsideRef$curre.focus();
      } else {
        const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        nextTabbable == null || nextTabbable.focus();
        (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false, event.nativeEvent, 'focus-out'));
      }
    }
  }));
}
const usePortalContext = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(PortalContext);

const FOCUSABLE_ATTRIBUTE = 'data-floating-ui-focusable';
function getFloatingFocusElement(floatingElement) {
  if (!floatingElement) {
    return null;
  }
  // Try to find the element that has `{...getFloatingProps()}` spread on it.
  // This indicates the floating element is acting as a positioning wrapper, and
  // so focus should be managed on the child element with the event handlers and
  // aria props.
  return floatingElement.hasAttribute(FOCUSABLE_ATTRIBUTE) ? floatingElement : floatingElement.querySelector("[" + FOCUSABLE_ATTRIBUTE + "]") || floatingElement;
}

const LIST_LIMIT = 20;
let previouslyFocusedElements = [];
function addPreviouslyFocusedElement(element) {
  previouslyFocusedElements = previouslyFocusedElements.filter(el => el.isConnected);
  let tabbableEl = element;
  if (!tabbableEl || (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getNodeName)(tabbableEl) === 'body') return;
  if (!(0,tabbable__WEBPACK_IMPORTED_MODULE_7__.isTabbable)(tabbableEl, getTabbableOptions())) {
    const tabbableChild = (0,tabbable__WEBPACK_IMPORTED_MODULE_7__.tabbable)(tabbableEl, getTabbableOptions())[0];
    if (tabbableChild) {
      tabbableEl = tabbableChild;
    }
  }
  previouslyFocusedElements.push(tabbableEl);
  if (previouslyFocusedElements.length > LIST_LIMIT) {
    previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT);
  }
}
function getPreviouslyFocusedElement() {
  return previouslyFocusedElements.slice().reverse().find(el => el.isConnected);
}
const VisuallyHiddenDismiss = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function VisuallyHiddenDismiss(props, ref) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", _extends({}, props, {
    type: "button",
    ref: ref,
    tabIndex: -1,
    style: HIDDEN_STYLES
  }));
});
/**
 * Provides focus management for the floating element.
 * @see https://floating-ui.com/docs/FloatingFocusManager
 */
function FloatingFocusManager(props) {
  const {
    context,
    children,
    disabled = false,
    order = ['content'],
    guards: _guards = true,
    initialFocus = 0,
    returnFocus = true,
    restoreFocus = false,
    modal = true,
    visuallyHiddenDismiss = false,
    closeOnFocusOut = true
  } = props;
  const {
    open,
    refs,
    nodeId,
    onOpenChange,
    events,
    dataRef,
    floatingId,
    elements: {
      domReference,
      floating
    }
  } = context;
  const ignoreInitialFocus = typeof initialFocus === 'number' && initialFocus < 0;
  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const isUntrappedTypeableCombobox = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isTypeableCombobox)(domReference) && ignoreInitialFocus;

  // Force the guards to be rendered if the `inert` attribute is not supported.
  const guards = supportsInert() ? _guards : true;
  const orderRef = useLatestRef(order);
  const initialFocusRef = useLatestRef(initialFocus);
  const returnFocusRef = useLatestRef(returnFocus);
  const tree = useFloatingTree();
  const portalContext = usePortalContext();
  const startDismissButtonRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const endDismissButtonRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const preventReturnFocusRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const isPointerDownRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const tabbableIndexRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(-1);
  const isInsidePortal = portalContext != null;
  const floatingFocusElement = getFloatingFocusElement(floating);
  const getTabbableContent = useEffectEvent(function (container) {
    if (container === void 0) {
      container = floatingFocusElement;
    }
    return container ? (0,tabbable__WEBPACK_IMPORTED_MODULE_7__.tabbable)(container, getTabbableOptions()) : [];
  });
  const getTabbableElements = useEffectEvent(container => {
    const content = getTabbableContent(container);
    return orderRef.current.map(type => {
      if (domReference && type === 'reference') {
        return domReference;
      }
      if (floatingFocusElement && type === 'floating') {
        return floatingFocusElement;
      }
      return content;
    }).filter(Boolean).flat();
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (disabled) return;
    if (!modal) return;
    function onKeyDown(event) {
      if (event.key === 'Tab') {
        // The focus guards have nothing to focus, so we need to stop the event.
        if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(floatingFocusElement, (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement))) && getTabbableContent().length === 0 && !isUntrappedTypeableCombobox) {
          (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
        }
        const els = getTabbableElements();
        const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event);
        if (orderRef.current[0] === 'reference' && target === domReference) {
          (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
          if (event.shiftKey) {
            enqueueFocus(els[els.length - 1]);
          } else {
            enqueueFocus(els[1]);
          }
        }
        if (orderRef.current[1] === 'floating' && target === floatingFocusElement && event.shiftKey) {
          (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
          enqueueFocus(els[0]);
        }
      }
    }
    const doc = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [disabled, domReference, floatingFocusElement, modal, orderRef, isUntrappedTypeableCombobox, getTabbableContent, getTabbableElements]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (disabled) return;
    if (!floating) return;
    function handleFocusIn(event) {
      const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event);
      const tabbableContent = getTabbableContent();
      const tabbableIndex = tabbableContent.indexOf(target);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
    }
    floating.addEventListener('focusin', handleFocusIn);
    return () => {
      floating.removeEventListener('focusin', handleFocusIn);
    };
  }, [disabled, floating, getTabbableContent]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (disabled) return;
    if (!closeOnFocusOut) return;

    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDownRef.current = true;
      setTimeout(() => {
        isPointerDownRef.current = false;
      });
    }
    function handleFocusOutside(event) {
      const relatedTarget = event.relatedTarget;
      queueMicrotask(() => {
        const movedToUnrelatedNode = !((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(domReference, relatedTarget) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(floating, relatedTarget) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(relatedTarget, floating) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(portalContext == null ? void 0 : portalContext.portalNode, relatedTarget) || relatedTarget != null && relatedTarget.hasAttribute(createAttribute('focus-guard')) || tree && (getChildren(tree.nodesRef.current, nodeId).find(node => {
          var _node$context, _node$context2;
          return (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)((_node$context = node.context) == null ? void 0 : _node$context.elements.floating, relatedTarget) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)((_node$context2 = node.context) == null ? void 0 : _node$context2.elements.domReference, relatedTarget);
        }) || getAncestors(tree.nodesRef.current, nodeId).find(node => {
          var _node$context3, _node$context4;
          return ((_node$context3 = node.context) == null ? void 0 : _node$context3.elements.floating) === relatedTarget || ((_node$context4 = node.context) == null ? void 0 : _node$context4.elements.domReference) === relatedTarget;
        })));

        // Restore focus to the previous tabbable element index to prevent
        // focus from being lost outside the floating tree.
        if (restoreFocus && movedToUnrelatedNode && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement)) === (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement).body) {
          // Let `FloatingPortal` effect knows that focus is still inside the
          // floating tree.
          if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(floatingFocusElement)) {
            floatingFocusElement.focus();
          }
          const prevTabbableIndex = tabbableIndexRef.current;
          const tabbableContent = getTabbableContent();
          const nodeToFocus = tabbableContent[prevTabbableIndex] || tabbableContent[tabbableContent.length - 1] || floatingFocusElement;
          if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(nodeToFocus)) {
            nodeToFocus.focus();
          }
        }

        // Focus did not move inside the floating tree, and there are no tabbable
        // portal guards to handle closing.
        if ((isUntrappedTypeableCombobox ? true : !modal) && relatedTarget && movedToUnrelatedNode && !isPointerDownRef.current &&
        // Fix React 18 Strict Mode returnFocus due to double rendering.
        relatedTarget !== getPreviouslyFocusedElement()) {
          preventReturnFocusRef.current = true;
          onOpenChange(false, event, 'focus-out');
        }
      });
    }
    if (floating && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(domReference)) {
      domReference.addEventListener('focusout', handleFocusOutside);
      domReference.addEventListener('pointerdown', handlePointerDown);
      floating.addEventListener('focusout', handleFocusOutside);
      return () => {
        domReference.removeEventListener('focusout', handleFocusOutside);
        domReference.removeEventListener('pointerdown', handlePointerDown);
        floating.removeEventListener('focusout', handleFocusOutside);
      };
    }
  }, [disabled, domReference, floating, floatingFocusElement, modal, nodeId, tree, portalContext, onOpenChange, closeOnFocusOut, restoreFocus, getTabbableContent, isUntrappedTypeableCombobox]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    var _portalContext$portal;
    if (disabled) return;

    // Don't hide portals nested within the parent portal.
    const portalNodes = Array.from((portalContext == null || (_portalContext$portal = portalContext.portalNode) == null ? void 0 : _portalContext$portal.querySelectorAll("[" + createAttribute('portal') + "]")) || []);
    if (floating) {
      const insideElements = [floating, ...portalNodes, startDismissButtonRef.current, endDismissButtonRef.current, orderRef.current.includes('reference') || isUntrappedTypeableCombobox ? domReference : null].filter(x => x != null);
      const cleanup = modal || isUntrappedTypeableCombobox ? markOthers(insideElements, guards, !guards) : markOthers(insideElements);
      return () => {
        cleanup();
      };
    }
  }, [disabled, domReference, floating, modal, orderRef, portalContext, isUntrappedTypeableCombobox, guards]);
  index(() => {
    if (disabled || !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(floatingFocusElement)) return;
    const doc = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement);
    const previouslyFocusedElement = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)(doc);

    // Wait for any layout effect state setters to execute to set `tabIndex`.
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floatingFocusElement);
      const initialFocusValue = initialFocusRef.current;
      const elToFocus = (typeof initialFocusValue === 'number' ? focusableElements[initialFocusValue] : initialFocusValue.current) || floatingFocusElement;
      const focusAlreadyInsideFloatingEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(floatingFocusElement, previouslyFocusedElement);
      if (!ignoreInitialFocus && !focusAlreadyInsideFloatingEl && open) {
        enqueueFocus(elToFocus, {
          preventScroll: elToFocus === floatingFocusElement
        });
      }
    });
  }, [disabled, open, floatingFocusElement, ignoreInitialFocus, getTabbableElements, initialFocusRef]);
  index(() => {
    if (disabled || !floatingFocusElement) return;
    let preventReturnFocusScroll = false;
    const doc = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floatingFocusElement);
    const previouslyFocusedElement = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)(doc);
    const contextData = dataRef.current;
    let openEvent = contextData.openEvent;
    addPreviouslyFocusedElement(previouslyFocusedElement);

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
    function onOpenChange(_ref) {
      let {
        open,
        reason,
        event,
        nested
      } = _ref;
      if (open) {
        openEvent = event;
      }
      if (reason === 'escape-key' && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }
      if (reason === 'hover' && event.type === 'mouseleave') {
        preventReturnFocusRef.current = true;
      }
      if (reason !== 'outside-press') return;
      if (nested) {
        preventReturnFocusRef.current = false;
        preventReturnFocusScroll = true;
      } else {
        preventReturnFocusRef.current = !((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isVirtualClick)(event) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isVirtualPointerEvent)(event));
      }
    }
    events.on('openchange', onOpenChange);
    const fallbackEl = doc.createElement('span');
    fallbackEl.setAttribute('tabindex', '-1');
    fallbackEl.setAttribute('aria-hidden', 'true');
    Object.assign(fallbackEl.style, HIDDEN_STYLES);
    if (isInsidePortal && domReference) {
      domReference.insertAdjacentElement('afterend', fallbackEl);
    }
    function getReturnElement() {
      if (typeof returnFocusRef.current === 'boolean') {
        return getPreviouslyFocusedElement() || fallbackEl;
      }
      return returnFocusRef.current.current || fallbackEl;
    }
    return () => {
      events.off('openchange', onOpenChange);
      const activeEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)(doc);
      const isFocusInsideFloatingTree = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(floating, activeEl) || tree && getChildren(tree.nodesRef.current, nodeId).some(node => {
        var _node$context5;
        return (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)((_node$context5 = node.context) == null ? void 0 : _node$context5.elements.floating, activeEl);
      });
      const shouldFocusReference = isFocusInsideFloatingTree || openEvent && ['click', 'mousedown'].includes(openEvent.type);
      if (shouldFocusReference && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }
      const returnElement = getReturnElement();
      queueMicrotask(() => {
        if (
        // eslint-disable-next-line react-hooks/exhaustive-deps
        returnFocusRef.current && !preventReturnFocusRef.current && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(returnElement) && (
        // If the focus moved somewhere else after mount, avoid returning focus
        // since it likely entered a different element which should be
        // respected: https://github.com/floating-ui/floating-ui/issues/2607
        returnElement !== activeEl && activeEl !== doc.body ? isFocusInsideFloatingTree : true)) {
          returnElement.focus({
            preventScroll: preventReturnFocusScroll
          });
        }
        fallbackEl.remove();
      });
    };
  }, [disabled, floating, floatingFocusElement, returnFocusRef, dataRef, refs, events, tree, nodeId, isInsidePortal, domReference]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    // The `returnFocus` cleanup behavior is inside a microtask; ensure we
    // wait for it to complete before resetting the flag.
    queueMicrotask(() => {
      preventReturnFocusRef.current = false;
    });
  }, [disabled]);

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  index(() => {
    if (disabled) return;
    if (!portalContext) return;
    portalContext.setFocusManagerState({
      modal,
      closeOnFocusOut,
      open,
      onOpenChange,
      refs
    });
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [disabled, portalContext, modal, open, onOpenChange, refs, closeOnFocusOut]);
  index(() => {
    if (disabled) return;
    if (!floatingFocusElement) return;
    if (typeof MutationObserver !== 'function') return;
    if (ignoreInitialFocus) return;
    const handleMutation = () => {
      const tabIndex = floatingFocusElement.getAttribute('tabindex');
      const tabbableContent = getTabbableContent();
      const activeEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(floating));
      const tabbableIndex = tabbableContent.indexOf(activeEl);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
      if (orderRef.current.includes('floating') || activeEl !== refs.domReference.current && tabbableContent.length === 0) {
        if (tabIndex !== '0') {
          floatingFocusElement.setAttribute('tabindex', '0');
        }
      } else if (tabIndex !== '-1') {
        floatingFocusElement.setAttribute('tabindex', '-1');
      }
    };
    handleMutation();
    const observer = new MutationObserver(handleMutation);
    observer.observe(floatingFocusElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
    return () => {
      observer.disconnect();
    };
  }, [disabled, floating, floatingFocusElement, refs, orderRef, getTabbableContent, ignoreInitialFocus]);
  function renderDismissButton(location) {
    if (disabled || !visuallyHiddenDismiss || !modal) {
      return null;
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(VisuallyHiddenDismiss, {
      ref: location === 'start' ? startDismissButtonRef : endDismissButtonRef,
      onClick: event => onOpenChange(false, event.nativeEvent)
    }, typeof visuallyHiddenDismiss === 'string' ? visuallyHiddenDismiss : 'Dismiss');
  }
  const shouldRenderGuards = !disabled && guards && (modal ? !isUntrappedTypeableCombobox : true) && (isInsidePortal || modal);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, shouldRenderGuards && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FocusGuard, {
    "data-type": "inside",
    ref: portalContext == null ? void 0 : portalContext.beforeInsideRef,
    onFocus: event => {
      if (modal) {
        const els = getTabbableElements();
        enqueueFocus(order[0] === 'reference' ? els[0] : els[els.length - 1]);
      } else if (portalContext != null && portalContext.preserveTabOrder && portalContext.portalNode) {
        preventReturnFocusRef.current = false;
        if (isOutsideEvent(event, portalContext.portalNode)) {
          const nextTabbable = getNextTabbable() || domReference;
          nextTabbable == null || nextTabbable.focus();
        } else {
          var _portalContext$before;
          (_portalContext$before = portalContext.beforeOutsideRef.current) == null || _portalContext$before.focus();
        }
      }
    }
  }), !isUntrappedTypeableCombobox && renderDismissButton('start'), children, renderDismissButton('end'), shouldRenderGuards && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FocusGuard, {
    "data-type": "inside",
    ref: portalContext == null ? void 0 : portalContext.afterInsideRef,
    onFocus: event => {
      if (modal) {
        enqueueFocus(getTabbableElements()[0]);
      } else if (portalContext != null && portalContext.preserveTabOrder && portalContext.portalNode) {
        if (closeOnFocusOut) {
          preventReturnFocusRef.current = true;
        }
        if (isOutsideEvent(event, portalContext.portalNode)) {
          const prevTabbable = getPreviousTabbable() || domReference;
          prevTabbable == null || prevTabbable.focus();
        } else {
          var _portalContext$afterO;
          (_portalContext$afterO = portalContext.afterOutsideRef.current) == null || _portalContext$afterO.focus();
        }
      }
    }
  }));
}

let lockCount = 0;
function enableScrollLock() {
  const isIOS = /iP(hone|ad|od)|iOS/.test((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getPlatform)());
  const bodyStyle = document.body.style;
  // RTL <body> scrollbar
  const scrollbarX = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft;
  const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollX = bodyStyle.left ? parseFloat(bodyStyle.left) : window.scrollX;
  const scrollY = bodyStyle.top ? parseFloat(bodyStyle.top) : window.scrollY;
  bodyStyle.overflow = 'hidden';
  if (scrollbarWidth) {
    bodyStyle[paddingProp] = scrollbarWidth + "px";
  }

  // Only iOS doesn't respect `overflow: hidden` on document.body, and this
  // technique has fewer side effects.
  if (isIOS) {
    var _window$visualViewpor, _window$visualViewpor2;
    // iOS 12 does not support `visualViewport`.
    const offsetLeft = ((_window$visualViewpor = window.visualViewport) == null ? void 0 : _window$visualViewpor.offsetLeft) || 0;
    const offsetTop = ((_window$visualViewpor2 = window.visualViewport) == null ? void 0 : _window$visualViewpor2.offsetTop) || 0;
    Object.assign(bodyStyle, {
      position: 'fixed',
      top: -(scrollY - Math.floor(offsetTop)) + "px",
      left: -(scrollX - Math.floor(offsetLeft)) + "px",
      right: '0'
    });
  }
  return () => {
    Object.assign(bodyStyle, {
      overflow: '',
      [paddingProp]: ''
    });
    if (isIOS) {
      Object.assign(bodyStyle, {
        position: '',
        top: '',
        left: '',
        right: ''
      });
      window.scrollTo(scrollX, scrollY);
    }
  };
}
let cleanup = () => {};

/**
 * Provides base styling for a fixed overlay element to dim content or block
 * pointer events behind a floating element.
 * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
 * @see https://floating-ui.com/docs/FloatingOverlay
 */
const FloatingOverlay = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function FloatingOverlay(props, ref) {
  const {
    lockScroll = false,
    ...rest
  } = props;
  index(() => {
    if (!lockScroll) return;
    lockCount++;
    if (lockCount === 1) {
      cleanup = enableScrollLock();
    }
    return () => {
      lockCount--;
      if (lockCount === 0) {
        cleanup();
      }
    };
  }, [lockScroll]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", _extends({
    ref: ref
  }, rest, {
    style: {
      position: 'fixed',
      overflow: 'auto',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...rest.style
    }
  }));
});

function isButtonTarget(event) {
  return (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(event.target) && event.target.tagName === 'BUTTON';
}
function isSpaceIgnored(element) {
  return (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isTypeableElement)(element);
}
/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
function useClick(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    elements: {
      domReference
    }
  } = context;
  const {
    enabled = true,
    event: eventOption = 'click',
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true,
    stickIfOpen = true
  } = props;
  const pointerTypeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const didKeyDownRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onPointerDown(event) {
      pointerTypeRef.current = event.pointerType;
    },
    onMouseDown(event) {
      const pointerType = pointerTypeRef.current;

      // Ignore all buttons except for the "main" button.
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      if (event.button !== 0) return;
      if (eventOption === 'click') return;
      if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerType, true) && ignoreMouse) return;
      if (open && toggle && (dataRef.current.openEvent && stickIfOpen ? dataRef.current.openEvent.type === 'mousedown' : true)) {
        onOpenChange(false, event.nativeEvent, 'click');
      } else {
        // Prevent stealing focus from the floating element
        event.preventDefault();
        onOpenChange(true, event.nativeEvent, 'click');
      }
    },
    onClick(event) {
      const pointerType = pointerTypeRef.current;
      if (eventOption === 'mousedown' && pointerTypeRef.current) {
        pointerTypeRef.current = undefined;
        return;
      }
      if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerType, true) && ignoreMouse) return;
      if (open && toggle && (dataRef.current.openEvent && stickIfOpen ? dataRef.current.openEvent.type === 'click' : true)) {
        onOpenChange(false, event.nativeEvent, 'click');
      } else {
        onOpenChange(true, event.nativeEvent, 'click');
      }
    },
    onKeyDown(event) {
      pointerTypeRef.current = undefined;
      if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event)) {
        return;
      }
      if (event.key === ' ' && !isSpaceIgnored(domReference)) {
        // Prevent scrolling
        event.preventDefault();
        didKeyDownRef.current = true;
      }
      if (event.key === 'Enter') {
        if (open && toggle) {
          onOpenChange(false, event.nativeEvent, 'click');
        } else {
          onOpenChange(true, event.nativeEvent, 'click');
        }
      }
    },
    onKeyUp(event) {
      if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event) || isSpaceIgnored(domReference)) {
        return;
      }
      if (event.key === ' ' && didKeyDownRef.current) {
        didKeyDownRef.current = false;
        if (open && toggle) {
          onOpenChange(false, event.nativeEvent, 'click');
        } else {
          onOpenChange(true, event.nativeEvent, 'click');
        }
      }
    }
  }), [dataRef, domReference, eventOption, ignoreMouse, keyboardHandlers, onOpenChange, open, stickIfOpen, toggle]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

function createVirtualElement(domElement, data) {
  let offsetX = null;
  let offsetY = null;
  let isAutoUpdateEvent = false;
  return {
    contextElement: domElement || undefined,
    getBoundingClientRect() {
      var _data$dataRef$current;
      const domRect = (domElement == null ? void 0 : domElement.getBoundingClientRect()) || {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
      const isXAxis = data.axis === 'x' || data.axis === 'both';
      const isYAxis = data.axis === 'y' || data.axis === 'both';
      const canTrackCursorOnAutoUpdate = ['mouseenter', 'mousemove'].includes(((_data$dataRef$current = data.dataRef.current.openEvent) == null ? void 0 : _data$dataRef$current.type) || '') && data.pointerType !== 'touch';
      let width = domRect.width;
      let height = domRect.height;
      let x = domRect.x;
      let y = domRect.y;
      if (offsetX == null && data.x && isXAxis) {
        offsetX = domRect.x - data.x;
      }
      if (offsetY == null && data.y && isYAxis) {
        offsetY = domRect.y - data.y;
      }
      x -= offsetX || 0;
      y -= offsetY || 0;
      width = 0;
      height = 0;
      if (!isAutoUpdateEvent || canTrackCursorOnAutoUpdate) {
        width = data.axis === 'y' ? domRect.width : 0;
        height = data.axis === 'x' ? domRect.height : 0;
        x = isXAxis && data.x != null ? data.x : x;
        y = isYAxis && data.y != null ? data.y : y;
      } else if (isAutoUpdateEvent && !canTrackCursorOnAutoUpdate) {
        height = data.axis === 'x' ? domRect.height : height;
        width = data.axis === 'y' ? domRect.width : width;
      }
      isAutoUpdateEvent = true;
      return {
        width,
        height,
        x,
        y,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x
      };
    }
  };
}
function isMouseBasedEvent(event) {
  return event != null && event.clientX != null;
}
/**
 * Positions the floating element relative to a client point (in the viewport),
 * such as the mouse position. By default, it follows the mouse cursor.
 * @see https://floating-ui.com/docs/useClientPoint
 */
function useClientPoint(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    dataRef,
    elements: {
      floating,
      domReference
    },
    refs
  } = context;
  const {
    enabled = true,
    axis = 'both',
    x = null,
    y = null
  } = props;
  const initialRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const cleanupListenerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const [pointerType, setPointerType] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  const [reactive, setReactive] = react__WEBPACK_IMPORTED_MODULE_0__.useState([]);
  const setReference = useEffectEvent((x, y) => {
    if (initialRef.current) return;

    // Prevent setting if the open event was not a mouse-like one
    // (e.g. focus to open, then hover over the reference element).
    // Only apply if the event exists.
    if (dataRef.current.openEvent && !isMouseBasedEvent(dataRef.current.openEvent)) {
      return;
    }
    refs.setPositionReference(createVirtualElement(domReference, {
      x,
      y,
      axis,
      dataRef,
      pointerType
    }));
  });
  const handleReferenceEnterOrMove = useEffectEvent(event => {
    if (x != null || y != null) return;
    if (!open) {
      setReference(event.clientX, event.clientY);
    } else if (!cleanupListenerRef.current) {
      // If there's no cleanup, there's no listener, but we want to ensure
      // we add the listener if the cursor landed on the floating element and
      // then back on the reference (i.e. it's interactive).
      setReactive([]);
    }
  });

  // If the pointer is a mouse-like pointer, we want to continue following the
  // mouse even if the floating element is transitioning out. On touch
  // devices, this is undesirable because the floating element will move to
  // the dismissal touch point.
  const openCheck = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMouseLikePointerType)(pointerType) ? floating : open;
  const addListener = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    // Explicitly specified `x`/`y` coordinates shouldn't add a listener.
    if (!openCheck || !enabled || x != null || y != null) return;
    const win = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getWindow)(floating);
    function handleMouseMove(event) {
      const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event);
      if (!(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(floating, target)) {
        setReference(event.clientX, event.clientY);
      } else {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      }
    }
    if (!dataRef.current.openEvent || isMouseBasedEvent(dataRef.current.openEvent)) {
      win.addEventListener('mousemove', handleMouseMove);
      const cleanup = () => {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      };
      cleanupListenerRef.current = cleanup;
      return cleanup;
    }
    refs.setPositionReference(domReference);
  }, [openCheck, enabled, x, y, floating, dataRef, refs, domReference, setReference]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return addListener();
  }, [addListener, reactive]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (enabled && !floating) {
      initialRef.current = false;
    }
  }, [enabled, floating]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled && open) {
      initialRef.current = true;
    }
  }, [enabled, open]);
  index(() => {
    if (enabled && (x != null || y != null)) {
      initialRef.current = false;
      setReference(x, y);
    }
  }, [enabled, x, y, setReference]);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    function setPointerTypeRef(_ref) {
      let {
        pointerType
      } = _ref;
      setPointerType(pointerType);
    }
    return {
      onPointerDown: setPointerTypeRef,
      onPointerEnter: setPointerTypeRef,
      onMouseMove: handleReferenceEnterOrMove,
      onMouseEnter: handleReferenceEnterOrMove
    };
  }, [handleReferenceEnterOrMove]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

const bubbleHandlerKeys = {
  pointerdown: 'onPointerDown',
  mousedown: 'onMouseDown',
  click: 'onClick'
};
const captureHandlerKeys = {
  pointerdown: 'onPointerDownCapture',
  mousedown: 'onMouseDownCapture',
  click: 'onClickCapture'
};
const normalizeProp = normalizable => {
  var _normalizable$escapeK, _normalizable$outside;
  return {
    escapeKey: typeof normalizable === 'boolean' ? normalizable : (_normalizable$escapeK = normalizable == null ? void 0 : normalizable.escapeKey) != null ? _normalizable$escapeK : false,
    outsidePress: typeof normalizable === 'boolean' ? normalizable : (_normalizable$outside = normalizable == null ? void 0 : normalizable.outsidePress) != null ? _normalizable$outside : true
  };
};
/**
 * Closes the floating element when a dismissal is requested — by default, when
 * the user presses the `escape` key or outside of the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
function useDismiss(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    elements,
    dataRef
  } = context;
  const {
    enabled = true,
    escapeKey = true,
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = 'pointerdown',
    referencePress = false,
    referencePressEvent = 'pointerdown',
    ancestorScroll = false,
    bubbles,
    capture
  } = props;
  const tree = useFloatingTree();
  const outsidePressFn = useEffectEvent(typeof unstable_outsidePress === 'function' ? unstable_outsidePress : () => false);
  const outsidePress = typeof unstable_outsidePress === 'function' ? outsidePressFn : unstable_outsidePress;
  const insideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const endedOrStartedInsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const {
    escapeKey: escapeKeyBubbles,
    outsidePress: outsidePressBubbles
  } = normalizeProp(bubbles);
  const {
    escapeKey: escapeKeyCapture,
    outsidePress: outsidePressCapture
  } = normalizeProp(capture);
  const isComposingRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const closeOnEscapeKeyDown = useEffectEvent(event => {
    var _dataRef$current$floa;
    if (!open || !enabled || !escapeKey || event.key !== 'Escape') {
      return;
    }

    // Wait until IME is settled. Pressing `Escape` while composing should
    // close the compose menu, but not the floating element.
    if (isComposingRef.current) {
      return;
    }
    const nodeId = (_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.nodeId;
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (!escapeKeyBubbles) {
      event.stopPropagation();
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach(child => {
          var _child$context;
          if ((_child$context = child.context) != null && _child$context.open && !child.context.dataRef.current.__escapeKeyBubbles) {
            shouldDismiss = false;
            return;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
    }
    onOpenChange(false, (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isReactEvent)(event) ? event.nativeEvent : event, 'escape-key');
  });
  const closeOnEscapeKeyDownCapture = useEffectEvent(event => {
    var _getTarget2;
    const callback = () => {
      var _getTarget;
      closeOnEscapeKeyDown(event);
      (_getTarget = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event)) == null || _getTarget.removeEventListener('keydown', callback);
    };
    (_getTarget2 = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event)) == null || _getTarget2.addEventListener('keydown', callback);
  });
  const closeOnPressOutside = useEffectEvent(event => {
    var _dataRef$current$floa2;
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = insideReactTreeRef.current;
    insideReactTreeRef.current = false;

    // When click outside is lazy (`click` event), handle dragging.
    // Don't close if:
    // - The click started inside the floating element.
    // - The click ended inside the floating element.
    const endedOrStartedInside = endedOrStartedInsideRef.current;
    endedOrStartedInsideRef.current = false;
    if (outsidePressEvent === 'click' && endedOrStartedInside) {
      return;
    }
    if (insideReactTree) {
      return;
    }
    if (typeof outsidePress === 'function' && !outsidePress(event)) {
      return;
    }
    const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event);
    const inertSelector = "[" + createAttribute('inert') + "]";
    const markers = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating).querySelectorAll(inertSelector);
    let targetRootAncestor = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(target) ? target : null;
    while (targetRootAncestor && !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isLastTraversableNode)(targetRootAncestor)) {
      const nextParent = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getParentNode)(targetRootAncestor);
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isLastTraversableNode)(nextParent) || !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(nextParent)) {
        break;
      }
      targetRootAncestor = nextParent;
    }

    // Check if the click occurred on a third-party element injected after the
    // floating element rendered.
    if (markers.length && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(target) && !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isRootElement)(target) &&
    // Clicked on a direct ancestor (e.g. FloatingOverlay).
    !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(target, elements.floating) &&
    // If the target root element contains none of the markers, then the
    // element was injected after the floating element rendered.
    Array.from(markers).every(marker => !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(targetRootAncestor, marker))) {
      return;
    }

    // Check if the click occurred on the scrollbar
    if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(target) && floating) {
      // In Firefox, `target.scrollWidth > target.clientWidth` for inline
      // elements.
      const canScrollX = target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
      const canScrollY = target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
      let xCond = canScrollY && event.offsetX > target.clientWidth;

      // In some browsers it is possible to change the <body> (or window)
      // scrollbar to the left side, but is very rare and is difficult to
      // check for. Plus, for modal dialogs with backdrops, it is more
      // important that the backdrop is checked but not so much the window.
      if (canScrollY) {
        const isRTL = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getComputedStyle)(target).direction === 'rtl';
        if (isRTL) {
          xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
        }
      }
      if (xCond || canScrollX && event.offsetY > target.clientHeight) {
        return;
      }
    }
    const nodeId = (_dataRef$current$floa2 = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa2.nodeId;
    const targetIsInsideChildren = tree && getChildren(tree.nodesRef.current, nodeId).some(node => {
      var _node$context;
      return (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isEventTargetWithin)(event, (_node$context = node.context) == null ? void 0 : _node$context.elements.floating);
    });
    if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isEventTargetWithin)(event, elements.floating) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isEventTargetWithin)(event, elements.domReference) || targetIsInsideChildren) {
      return;
    }
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (children.length > 0) {
      let shouldDismiss = true;
      children.forEach(child => {
        var _child$context2;
        if ((_child$context2 = child.context) != null && _child$context2.open && !child.context.dataRef.current.__outsidePressBubbles) {
          shouldDismiss = false;
          return;
        }
      });
      if (!shouldDismiss) {
        return;
      }
    }
    onOpenChange(false, event, 'outside-press');
  });
  const closeOnPressOutsideCapture = useEffectEvent(event => {
    var _getTarget4;
    const callback = () => {
      var _getTarget3;
      closeOnPressOutside(event);
      (_getTarget3 = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event)) == null || _getTarget3.removeEventListener(outsidePressEvent, callback);
    };
    (_getTarget4 = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event)) == null || _getTarget4.addEventListener(outsidePressEvent, callback);
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!open || !enabled) {
      return;
    }
    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;
    let compositionTimeout = -1;
    function onScroll(event) {
      onOpenChange(false, event, 'ancestor-scroll');
    }
    function handleCompositionStart() {
      window.clearTimeout(compositionTimeout);
      isComposingRef.current = true;
    }
    function handleCompositionEnd() {
      // Safari fires `compositionend` before `keydown`, so we need to wait
      // until the next tick to set `isComposing` to `false`.
      // https://bugs.webkit.org/show_bug.cgi?id=165004
      compositionTimeout = window.setTimeout(() => {
        isComposingRef.current = false;
      },
      // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
      // Only apply to WebKit for the test to remain 0ms.
      (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isWebKit)() ? 5 : 0);
    }
    const doc = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating);
    if (escapeKey) {
      doc.addEventListener('keydown', escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
      doc.addEventListener('compositionstart', handleCompositionStart);
      doc.addEventListener('compositionend', handleCompositionEnd);
    }
    outsidePress && doc.addEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
    let ancestors = [];
    if (ancestorScroll) {
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(elements.domReference)) {
        ancestors = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getOverflowAncestors)(elements.domReference);
      }
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(elements.floating)) {
        ancestors = ancestors.concat((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getOverflowAncestors)(elements.floating));
      }
      if (!(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(elements.reference) && elements.reference && elements.reference.contextElement) {
        ancestors = ancestors.concat((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getOverflowAncestors)(elements.reference.contextElement));
      }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(ancestor => {
      var _doc$defaultView;
      return ancestor !== ((_doc$defaultView = doc.defaultView) == null ? void 0 : _doc$defaultView.visualViewport);
    });
    ancestors.forEach(ancestor => {
      ancestor.addEventListener('scroll', onScroll, {
        passive: true
      });
    });
    return () => {
      if (escapeKey) {
        doc.removeEventListener('keydown', escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
        doc.removeEventListener('compositionstart', handleCompositionStart);
        doc.removeEventListener('compositionend', handleCompositionEnd);
      }
      outsidePress && doc.removeEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
      ancestors.forEach(ancestor => {
        ancestor.removeEventListener('scroll', onScroll);
      });
      window.clearTimeout(compositionTimeout);
    };
  }, [dataRef, elements, escapeKey, outsidePress, outsidePressEvent, open, onOpenChange, ancestorScroll, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, escapeKeyCapture, closeOnEscapeKeyDownCapture, closeOnPressOutside, outsidePressCapture, closeOnPressOutsideCapture]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    insideReactTreeRef.current = false;
  }, [outsidePress, outsidePressEvent]);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    [bubbleHandlerKeys[referencePressEvent]]: event => {
      if (referencePress) {
        onOpenChange(false, event.nativeEvent, 'reference-press');
      }
    }
  }), [closeOnEscapeKeyDown, onOpenChange, referencePress, referencePressEvent]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    onMouseDown() {
      endedOrStartedInsideRef.current = true;
    },
    onMouseUp() {
      endedOrStartedInsideRef.current = true;
    },
    [captureHandlerKeys[outsidePressEvent]]: () => {
      insideReactTreeRef.current = true;
    }
  }), [closeOnEscapeKeyDown, outsidePressEvent]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

function useFloatingRootContext(options) {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp
  } = options;
  const floatingId = useId();
  const dataRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef({});
  const [events] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;
  if (true) {
    const optionDomReference = elementsProp.reference;
    if (optionDomReference && !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(optionDomReference)) {
      error('Cannot pass a virtual element to the `elements.reference` option,', 'as it must be a real DOM element. Use `refs.setPositionReference()`', 'instead.');
    }
  }
  const [positionReference, setPositionReference] = react__WEBPACK_IMPORTED_MODULE_0__.useState(elementsProp.reference);
  const onOpenChange = useEffectEvent((open, event, reason) => {
    dataRef.current.openEvent = open ? event : undefined;
    events.emit('openchange', {
      open,
      event,
      reason,
      nested
    });
    onOpenChangeProp == null || onOpenChangeProp(open, event, reason);
  });
  const refs = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    setPositionReference
  }), []);
  const elements = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    reference: positionReference || elementsProp.reference || null,
    floating: elementsProp.floating || null,
    domReference: elementsProp.reference
  }), [positionReference, elementsProp.reference, elementsProp.floating]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    dataRef,
    open,
    onOpenChange,
    elements,
    events,
    floatingId,
    refs
  }), [open, onOpenChange, elements, events, floatingId, refs]);
}

/**
 * Provides data to position a floating element and context to add interactions.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    nodeId
  } = options;
  const internalRootContext = useFloatingRootContext({
    ...options,
    elements: {
      reference: null,
      floating: null,
      ...options.elements
    }
  });
  const rootContext = options.rootContext || internalRootContext;
  const computedElements = rootContext.elements;
  const [_domReference, setDomReference] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const [positionReference, _setPositionReference] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const optionDomReference = computedElements == null ? void 0 : computedElements.domReference;
  const domReference = optionDomReference || _domReference;
  const domReferenceRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const tree = useFloatingTree();
  index(() => {
    if (domReference) {
      domReferenceRef.current = domReference;
    }
  }, [domReference]);
  const position = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.useFloating)({
    ...options,
    elements: {
      ...computedElements,
      ...(positionReference && {
        reference: positionReference
      })
    }
  });
  const setPositionReference = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    const computedPositionReference = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      contextElement: node
    } : node;
    // Store the positionReference in state if the DOM reference is specified externally via the
    // `elements.reference` option. This ensures that it won't be overridden on future renders.
    _setPositionReference(computedPositionReference);
    position.refs.setReference(computedPositionReference);
  }, [position.refs]);
  const setReference = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(node => {
    if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(node) || node === null) {
      domReferenceRef.current = node;
      setDomReference(node);
    }

    // Backwards-compatibility for passing a virtual element to `reference`
    // after it has set the DOM reference.
    if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(position.refs.reference.current) || position.refs.reference.current === null ||
    // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !(0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs]);
  const refs = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    ...position.refs,
    setReference,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setPositionReference]);
  const elements = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    ...position.elements,
    domReference: domReference
  }), [position.elements, domReference]);
  const context = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    ...position,
    ...rootContext,
    refs,
    elements,
    nodeId
  }), [position, refs, elements, nodeId, rootContext]);
  index(() => {
    rootContext.dataRef.current.floatingContext = context;
    const node = tree == null ? void 0 : tree.nodesRef.current.find(node => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    ...position,
    context,
    refs,
    elements
  }), [position, refs, elements, context]);
}

/**
 * Opens the floating element while the reference element has focus, like CSS
 * `:focus`.
 * @see https://floating-ui.com/docs/useFocus
 */
function useFocus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    events,
    dataRef,
    elements
  } = context;
  const {
    enabled = true,
    visibleOnly = true
  } = props;
  const blockFocusRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const timeoutRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const keyboardModalityRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    const win = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.getWindow)(elements.domReference);

    // If the reference was focused and the user left the tab/window, and the
    // floating element was not open, the focus should be blocked when they
    // return to the tab/window.
    function onBlur() {
      if (!open && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(elements.domReference) && elements.domReference === (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.domReference))) {
        blockFocusRef.current = true;
      }
    }
    function onKeyDown() {
      keyboardModalityRef.current = true;
    }
    win.addEventListener('blur', onBlur);
    win.addEventListener('keydown', onKeyDown, true);
    return () => {
      win.removeEventListener('blur', onBlur);
      win.removeEventListener('keydown', onKeyDown, true);
    };
  }, [elements.domReference, open, enabled]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    function onOpenChange(_ref) {
      let {
        reason
      } = _ref;
      if (reason === 'reference-press' || reason === 'escape-key') {
        blockFocusRef.current = true;
      }
    }
    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [events, enabled]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onPointerDown(event) {
      if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isVirtualPointerEvent)(event.nativeEvent)) return;
      keyboardModalityRef.current = false;
    },
    onMouseLeave() {
      blockFocusRef.current = false;
    },
    onFocus(event) {
      if (blockFocusRef.current) return;
      const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event.nativeEvent);
      if (visibleOnly && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(target)) {
        try {
          // Mac Safari unreliably matches `:focus-visible` on the reference
          // if focus was outside the page initially - use the fallback
          // instead.
          if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isSafari)() && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMac)()) throw Error();
          if (!target.matches(':focus-visible')) return;
        } catch (e) {
          // Old browsers will throw an error when using `:focus-visible`.
          if (!keyboardModalityRef.current && !(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isTypeableElement)(target)) {
            return;
          }
        }
      }
      onOpenChange(true, event.nativeEvent, 'focus');
    },
    onBlur(event) {
      blockFocusRef.current = false;
      const relatedTarget = event.relatedTarget;
      const nativeEvent = event.nativeEvent;

      // Hit the non-modal focus management portal guard. Focus will be
      // moved into the floating element immediately after.
      const movedToFocusGuard = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(relatedTarget) && relatedTarget.hasAttribute(createAttribute('focus-guard')) && relatedTarget.getAttribute('data-type') === 'outside';

      // Wait for the window blur listener to fire.
      timeoutRef.current = window.setTimeout(() => {
        var _dataRef$current$floa;
        const activeEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)(elements.domReference ? elements.domReference.ownerDocument : document);

        // Focus left the page, keep it open.
        if (!relatedTarget && activeEl === elements.domReference) return;

        // When focusing the reference element (e.g. regular click), then
        // clicking into the floating element, prevent it from hiding.
        // Note: it must be focusable, e.g. `tabindex="-1"`.
        // We can not rely on relatedTarget to point to the correct element
        // as it will only point to the shadow host of the newly focused element
        // and not the element that actually has received focus if it is located
        // inside a shadow root.
        if ((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)((_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.refs.floating.current, activeEl) || (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(elements.domReference, activeEl) || movedToFocusGuard) {
          return;
        }
        onOpenChange(false, nativeEvent, 'focus');
      });
    }
  }), [dataRef, elements.domReference, onOpenChange, visibleOnly]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

const ACTIVE_KEY = 'active';
const SELECTED_KEY = 'selected';
function mergeProps(userProps, propsList, elementKey) {
  const map = new Map();
  const isItem = elementKey === 'item';
  let domUserProps = userProps;
  if (isItem && userProps) {
    const {
      [ACTIVE_KEY]: _,
      [SELECTED_KEY]: __,
      ...validProps
    } = userProps;
    domUserProps = validProps;
  }
  return {
    ...(elementKey === 'floating' && {
      tabIndex: -1,
      [FOCUSABLE_ATTRIBUTE]: ''
    }),
    ...domUserProps,
    ...propsList.map(value => {
      const propsOrGetProps = value ? value[elementKey] : null;
      if (typeof propsOrGetProps === 'function') {
        return userProps ? propsOrGetProps(userProps) : null;
      }
      return propsOrGetProps;
    }).concat(userProps).reduce((acc, props) => {
      if (!props) {
        return acc;
      }
      Object.entries(props).forEach(_ref => {
        let [key, value] = _ref;
        if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
          return;
        }
        if (key.indexOf('on') === 0) {
          if (!map.has(key)) {
            map.set(key, []);
          }
          if (typeof value === 'function') {
            var _map$get;
            (_map$get = map.get(key)) == null || _map$get.push(value);
            acc[key] = function () {
              var _map$get2;
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.map(fn => fn(...args)).find(val => val !== undefined);
            };
          }
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {})
  };
}
/**
 * Merges an array of interaction hooks' props into prop getters, allowing
 * event handler functions to be composed together without overwriting one
 * another.
 * @see https://floating-ui.com/docs/useInteractions
 */
function useInteractions(propsList) {
  if (propsList === void 0) {
    propsList = [];
  }
  const referenceDeps = propsList.map(key => key == null ? void 0 : key.reference);
  const floatingDeps = propsList.map(key => key == null ? void 0 : key.floating);
  const itemDeps = propsList.map(key => key == null ? void 0 : key.item);
  const getReferenceProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(userProps => mergeProps(userProps, propsList, 'reference'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  referenceDeps);
  const getFloatingProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(userProps => mergeProps(userProps, propsList, 'floating'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  floatingDeps);
  const getItemProps = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(userProps => mergeProps(userProps, propsList, 'item'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  itemDeps);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps
  }), [getReferenceProps, getFloatingProps, getItemProps]);
}

let isPreventScrollSupported = false;
function doSwitch(orientation, vertical, horizontal) {
  switch (orientation) {
    case 'vertical':
      return vertical;
    case 'horizontal':
      return horizontal;
    default:
      return vertical || horizontal;
  }
}
function isMainOrientationKey(key, orientation) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}
function isMainOrientationToEndKey(key, orientation, rtl) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal) || key === 'Enter' || key === ' ' || key === '';
}
function isCrossOrientationOpenKey(key, orientation, rtl) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}
function isCrossOrientationCloseKey(key, orientation, rtl) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  return doSwitch(orientation, vertical, horizontal);
}
/**
 * Adds arrow key-based navigation of a list of items, either using real DOM
 * focus or virtual focus.
 * @see https://floating-ui.com/docs/useListNavigation
 */
function useListNavigation(context, props) {
  const {
    open,
    onOpenChange,
    elements
  } = context;
  const {
    listRef,
    activeIndex,
    onNavigate: unstable_onNavigate = () => {},
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = undefined,
    orientation = 'vertical',
    cols = 1,
    scrollItemIntoView = true,
    virtualItemRef,
    itemSizes,
    dense = false
  } = props;
  if (true) {
    if (allowEscape) {
      if (!loop) {
        warn('`useListNavigation` looping must be enabled to allow escaping.');
      }
      if (!virtual) {
        warn('`useListNavigation` must be virtual to allow escaping.');
      }
    }
    if (orientation === 'vertical' && cols > 1) {
      warn('In grid list navigation mode (`cols` > 1), the `orientation` should', 'be either "horizontal" or "both".');
    }
  }
  const floatingFocusElement = getFloatingFocusElement(elements.floating);
  const floatingFocusElementRef = useLatestRef(floatingFocusElement);
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();
  const onNavigate = useEffectEvent(unstable_onNavigate);
  const typeableComboboxReference = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isTypeableCombobox)(elements.domReference);
  const focusItemOnOpenRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(focusItemOnOpen);
  const indexRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(selectedIndex != null ? selectedIndex : -1);
  const keyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const isPointerModalityRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(true);
  const previousOnNavigateRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(onNavigate);
  const previousMountedRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(!!elements.floating);
  const previousOpenRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(open);
  const forceSyncFocus = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const forceScrollIntoViewRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const disabledIndicesRef = useLatestRef(disabledIndices);
  const latestOpenRef = useLatestRef(open);
  const scrollItemIntoViewRef = useLatestRef(scrollItemIntoView);
  const selectedIndexRef = useLatestRef(selectedIndex);
  const [activeId, setActiveId] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  const [virtualId, setVirtualId] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  const focusItem = useEffectEvent(function (listRef, indexRef, forceScrollIntoView) {
    if (forceScrollIntoView === void 0) {
      forceScrollIntoView = false;
    }
    function runFocus(item) {
      if (virtual) {
        setActiveId(item.id);
        tree == null || tree.events.emit('virtualfocus', item);
        if (virtualItemRef) {
          virtualItemRef.current = item;
        }
      } else {
        enqueueFocus(item, {
          preventScroll: true,
          // Mac Safari does not move the virtual cursor unless the focus call
          // is sync. However, for the very first focus call, we need to wait
          // for the position to be ready in order to prevent unwanted
          // scrolling. This means the virtual cursor will not move to the first
          // item when first opening the floating element, but will on
          // subsequent calls. `preventScroll` is supported in modern Safari,
          // so we can use that instead.
          // iOS Safari must be async or the first item will not be focused.
          sync: (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isMac)() && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isSafari)() ? isPreventScrollSupported || forceSyncFocus.current : false
        });
      }
    }
    const initialItem = listRef.current[indexRef.current];
    if (initialItem) {
      runFocus(initialItem);
    }
    requestAnimationFrame(() => {
      const waitedItem = listRef.current[indexRef.current] || initialItem;
      if (!waitedItem) return;
      if (!initialItem) {
        runFocus(waitedItem);
      }
      const scrollIntoViewOptions = scrollItemIntoViewRef.current;
      const shouldScrollIntoView = scrollIntoViewOptions && item && (forceScrollIntoView || !isPointerModalityRef.current);
      if (shouldScrollIntoView) {
        // JSDOM doesn't support `.scrollIntoView()` but it's widely supported
        // by all browsers.
        waitedItem.scrollIntoView == null || waitedItem.scrollIntoView(typeof scrollIntoViewOptions === 'boolean' ? {
          block: 'nearest',
          inline: 'nearest'
        } : scrollIntoViewOptions);
      }
    });
  });
  index(() => {
    document.createElement('div').focus({
      get preventScroll() {
        isPreventScrollSupported = true;
        return false;
      }
    });
  }, []);

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  index(() => {
    if (!enabled) return;
    if (open && elements.floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef.current = true;
        indexRef.current = selectedIndex;
        onNavigate(selectedIndex);
      }
    } else if (previousMountedRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current(null);
    }
  }, [enabled, open, elements.floating, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  index(() => {
    if (!enabled) return;
    if (open && elements.floating) {
      if (activeIndex == null) {
        forceSyncFocus.current = false;
        if (selectedIndexRef.current != null) {
          return;
        }

        // Reset while the floating element was open (e.g. the list changed).
        if (previousMountedRef.current) {
          indexRef.current = -1;
          focusItem(listRef, indexRef);
        }

        // Initial sync.
        if ((!previousOpenRef.current || !previousMountedRef.current) && focusItemOnOpenRef.current && (keyRef.current != null || focusItemOnOpenRef.current === true && keyRef.current == null)) {
          let runs = 0;
          const waitForListPopulated = () => {
            if (listRef.current[0] == null) {
              // Avoid letting the browser paint if possible on the first try,
              // otherwise use rAF. Don't try more than twice, since something
              // is wrong otherwise.
              if (runs < 2) {
                const scheduler = runs ? requestAnimationFrame : queueMicrotask;
                scheduler(waitForListPopulated);
              }
              runs++;
            } else {
              indexRef.current = keyRef.current == null || isMainOrientationToEndKey(keyRef.current, orientation, rtl) || nested ? getMinIndex(listRef, disabledIndicesRef.current) : getMaxIndex(listRef, disabledIndicesRef.current);
              keyRef.current = null;
              onNavigate(indexRef.current);
            }
          };
          waitForListPopulated();
        }
      } else if (!isIndexOutOfBounds(listRef, activeIndex)) {
        indexRef.current = activeIndex;
        focusItem(listRef, indexRef, forceScrollIntoViewRef.current);
        forceScrollIntoViewRef.current = false;
      }
    }
  }, [enabled, open, elements.floating, activeIndex, selectedIndexRef, nested, listRef, orientation, rtl, onNavigate, focusItem, disabledIndicesRef]);

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  index(() => {
    var _nodes$find;
    if (!enabled || elements.floating || !tree || virtual || !previousMountedRef.current) {
      return;
    }
    const nodes = tree.nodesRef.current;
    const parent = (_nodes$find = nodes.find(node => node.id === parentId)) == null || (_nodes$find = _nodes$find.context) == null ? void 0 : _nodes$find.elements.floating;
    const activeEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getDocument)(elements.floating));
    const treeContainsActiveEl = nodes.some(node => node.context && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(node.context.elements.floating, activeEl));
    if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
      parent.focus({
        preventScroll: true
      });
    }
  }, [enabled, elements.floating, tree, parentId, virtual]);
  index(() => {
    if (!enabled) return;
    if (!tree) return;
    if (!virtual) return;
    if (parentId) return;
    function handleVirtualFocus(item) {
      setVirtualId(item.id);
      if (virtualItemRef) {
        virtualItemRef.current = item;
      }
    }
    tree.events.on('virtualfocus', handleVirtualFocus);
    return () => {
      tree.events.off('virtualfocus', handleVirtualFocus);
    };
  }, [enabled, tree, virtual, parentId, virtualItemRef]);
  index(() => {
    previousOnNavigateRef.current = onNavigate;
    previousMountedRef.current = !!elements.floating;
  });
  index(() => {
    if (!open) {
      keyRef.current = null;
    }
  }, [open]);
  index(() => {
    previousOpenRef.current = open;
  }, [open]);
  const hasActiveIndex = activeIndex != null;
  const item = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    function syncCurrentTarget(currentTarget) {
      if (!open) return;
      const index = listRef.current.indexOf(currentTarget);
      if (index !== -1) {
        onNavigate(index);
      }
    }
    const props = {
      onFocus(_ref) {
        let {
          currentTarget
        } = _ref;
        syncCurrentTarget(currentTarget);
      },
      onClick: _ref2 => {
        let {
          currentTarget
        } = _ref2;
        return currentTarget.focus({
          preventScroll: true
        });
      },
      // Safari
      ...(focusItemOnHover && {
        onMouseMove(_ref3) {
          let {
            currentTarget
          } = _ref3;
          syncCurrentTarget(currentTarget);
        },
        onPointerLeave(_ref4) {
          let {
            pointerType
          } = _ref4;
          if (!isPointerModalityRef.current || pointerType === 'touch') {
            return;
          }
          indexRef.current = -1;
          focusItem(listRef, indexRef);
          onNavigate(null);
          if (!virtual) {
            enqueueFocus(floatingFocusElementRef.current, {
              preventScroll: true
            });
          }
        }
      })
    };
    return props;
  }, [open, floatingFocusElementRef, focusItem, focusItemOnHover, listRef, onNavigate, virtual]);
  const commonOnKeyDown = useEffectEvent(event => {
    isPointerModalityRef.current = false;
    forceSyncFocus.current = true;

    // When composing a character, Chrome fires ArrowDown twice. Firefox/Safari
    // don't appear to suffer from this. `event.isComposing` is avoided due to
    // Safari not supporting it properly (although it's not needed in the first
    // place for Safari, just avoiding any possible issues).
    if (event.which === 229) {
      return;
    }

    // If the floating element is animating out, ignore navigation. Otherwise,
    // the `activeIndex` gets set to 0 despite not being open so the next time
    // the user ArrowDowns, the first item won't be focused.
    if (!latestOpenRef.current && event.currentTarget === floatingFocusElementRef.current) {
      return;
    }
    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
      (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
      onOpenChange(false, event.nativeEvent, 'list-navigation');
      if ((0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(elements.domReference)) {
        if (virtual) {
          tree == null || tree.events.emit('virtualfocus', elements.domReference);
        } else {
          elements.domReference.focus();
        }
      }
      return;
    }
    const currentIndex = indexRef.current;
    const minIndex = getMinIndex(listRef, disabledIndices);
    const maxIndex = getMaxIndex(listRef, disabledIndices);
    if (!typeableComboboxReference) {
      if (event.key === 'Home') {
        (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
        indexRef.current = minIndex;
        onNavigate(indexRef.current);
      }
      if (event.key === 'End') {
        (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
        indexRef.current = maxIndex;
        onNavigate(indexRef.current);
      }
    }

    // Grid navigation.
    if (cols > 1) {
      const sizes = itemSizes || Array.from({
        length: listRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(index => index != null && !isDisabled(listRef.current, index, disabledIndices));
      // last enabled index
      const maxGridIndex = cellMap.reduce((foundIndex, index, cellIndex) => index != null && !isDisabled(listRef.current, index, disabledIndices) ? cellIndex : foundIndex, -1);
      const index = cellMap[getGridNavigatedIndex({
        current: cellMap.map(itemIndex => itemIndex != null ? listRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loop,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getCellIndices([...(disabledIndices || listRef.current.map((_, index) => isDisabled(listRef.current, index) ? index : undefined)), undefined], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getCellIndexOfCorner(indexRef.current > maxIndex ? minIndex : indexRef.current, sizes, cellMap, cols,
        // use a corner matching the edge closest to the direction
        // we're moving in so we don't end up in the same item. Prefer
        // top/left over bottom/right.
        event.key === ARROW_DOWN ? 'bl' : event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT) ? 'tr' : 'tl'),
        stopEvent: true
      })];
      if (index != null) {
        indexRef.current = index;
        onNavigate(indexRef.current);
      }
      if (orientation === 'both') {
        return;
      }
    }
    if (isMainOrientationKey(event.key, orientation)) {
      (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);

      // Reset the index if no item is focused.
      if (open && !virtual && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.activeElement)(event.currentTarget.ownerDocument) === event.currentTarget) {
        indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl) ? minIndex : maxIndex;
        onNavigate(indexRef.current);
        return;
      }
      if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
        if (loop) {
          indexRef.current = currentIndex >= maxIndex ? allowEscape && currentIndex !== listRef.current.length ? -1 : minIndex : findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            disabledIndices
          });
        } else {
          indexRef.current = Math.min(maxIndex, findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            disabledIndices
          }));
        }
      } else {
        if (loop) {
          indexRef.current = currentIndex <= minIndex ? allowEscape && currentIndex !== -1 ? listRef.current.length : maxIndex : findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices
          });
        } else {
          indexRef.current = Math.max(minIndex, findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices
          }));
        }
      }
      if (isIndexOutOfBounds(listRef, indexRef.current)) {
        onNavigate(null);
      } else {
        onNavigate(indexRef.current);
      }
    }
  });
  const ariaActiveDescendantProp = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return virtual && open && hasActiveIndex && {
      'aria-activedescendant': virtualId || activeId
    };
  }, [virtual, open, hasActiveIndex, virtualId, activeId]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(!(0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isTypeableCombobox)(elements.domReference) && ariaActiveDescendantProp),
      onKeyDown: commonOnKeyDown,
      onPointerMove() {
        isPointerModalityRef.current = true;
      }
    };
  }, [ariaActiveDescendantProp, commonOnKeyDown, elements.domReference, orientation]);
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    function checkVirtualMouse(event) {
      if (focusItemOnOpen === 'auto' && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isVirtualClick)(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }
    function checkVirtualPointer(event) {
      // `pointerdown` fires first, reset the state then perform the checks.
      focusItemOnOpenRef.current = focusItemOnOpen;
      if (focusItemOnOpen === 'auto' && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.isVirtualPointerEvent)(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }
    return {
      ...ariaActiveDescendantProp,
      onKeyDown(event) {
        isPointerModalityRef.current = false;
        const isArrowKey = event.key.startsWith('Arrow');
        const isHomeOrEndKey = ['Home', 'End'].includes(event.key);
        const isMoveKey = isArrowKey || isHomeOrEndKey;
        const isCrossOpenKey = isCrossOrientationOpenKey(event.key, orientation, rtl);
        const isCrossCloseKey = isCrossOrientationCloseKey(event.key, orientation, rtl);
        const isMainKey = isMainOrientationKey(event.key, orientation);
        const isNavigationKey = (nested ? isCrossOpenKey : isMainKey) || event.key === 'Enter' || event.key.trim() === '';
        if (virtual && open) {
          const rootNode = tree == null ? void 0 : tree.nodesRef.current.find(node => node.parentId == null);
          const deepestNode = tree && rootNode ? getDeepestNode(tree.nodesRef.current, rootNode.id) : null;
          if (isMoveKey && deepestNode && virtualItemRef) {
            const eventObject = new KeyboardEvent('keydown', {
              key: event.key,
              bubbles: true
            });
            if (isCrossOpenKey || isCrossCloseKey) {
              var _deepestNode$context, _deepestNode$context2;
              const isCurrentTarget = ((_deepestNode$context = deepestNode.context) == null ? void 0 : _deepestNode$context.elements.domReference) === event.currentTarget;
              const dispatchItem = isCrossCloseKey && !isCurrentTarget ? (_deepestNode$context2 = deepestNode.context) == null ? void 0 : _deepestNode$context2.elements.domReference : isCrossOpenKey ? listRef.current.find(item => (item == null ? void 0 : item.id) === activeId) : null;
              if (dispatchItem) {
                (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
                dispatchItem.dispatchEvent(eventObject);
                setVirtualId(undefined);
              }
            }
            if ((isMainKey || isHomeOrEndKey) && deepestNode.context) {
              if (deepestNode.context.open && deepestNode.parentId && event.currentTarget !== deepestNode.context.elements.domReference) {
                var _deepestNode$context$;
                (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
                (_deepestNode$context$ = deepestNode.context.elements.domReference) == null || _deepestNode$context$.dispatchEvent(eventObject);
                return;
              }
            }
          }
          return commonOnKeyDown(event);
        }

        // If a floating element should not open on arrow key down, avoid
        // setting `activeIndex` while it's closed.
        if (!open && !openOnArrowKeyDown && isArrowKey) {
          return;
        }
        if (isNavigationKey) {
          keyRef.current = nested && isMainKey ? null : event.key;
        }
        if (nested) {
          if (isCrossOpenKey) {
            (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
            if (open) {
              indexRef.current = getMinIndex(listRef, disabledIndicesRef.current);
              onNavigate(indexRef.current);
            } else {
              onOpenChange(true, event.nativeEvent, 'list-navigation');
            }
          }
          return;
        }
        if (isMainKey) {
          if (selectedIndex != null) {
            indexRef.current = selectedIndex;
          }
          (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
          if (!open && openOnArrowKeyDown) {
            onOpenChange(true, event.nativeEvent, 'list-navigation');
          } else {
            commonOnKeyDown(event);
          }
          if (open) {
            onNavigate(indexRef.current);
          }
        }
      },
      onFocus() {
        if (open && !virtual) {
          onNavigate(null);
        }
      },
      onPointerDown: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse
    };
  }, [activeId, ariaActiveDescendantProp, commonOnKeyDown, disabledIndicesRef, focusItemOnOpen, listRef, nested, onNavigate, onOpenChange, open, openOnArrowKeyDown, orientation, rtl, selectedIndex, tree, virtual, virtualItemRef]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference,
    floating,
    item
  } : {}, [enabled, reference, floating, item]);
}

const componentRoleToAriaRoleMap = /*#__PURE__*/new Map([['select', 'listbox'], ['combobox', 'listbox'], ['label', false]]);

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
function useRole(context, props) {
  var _componentRoleToAriaR;
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    floatingId
  } = context;
  const {
    enabled = true,
    role = 'dialog'
  } = props;
  const ariaRole = (_componentRoleToAriaR = componentRoleToAriaRoleMap.get(role)) != null ? _componentRoleToAriaR : role;
  const referenceId = useId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    if (ariaRole === 'tooltip' || role === 'label') {
      return {
        ["aria-" + (role === 'label' ? 'labelledby' : 'describedby')]: open ? floatingId : undefined
      };
    }
    return {
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': ariaRole === 'alertdialog' ? 'dialog' : ariaRole,
      'aria-controls': open ? floatingId : undefined,
      ...(ariaRole === 'listbox' && {
        role: 'combobox'
      }),
      ...(ariaRole === 'menu' && {
        id: referenceId
      }),
      ...(ariaRole === 'menu' && isNested && {
        role: 'menuitem'
      }),
      ...(role === 'select' && {
        'aria-autocomplete': 'none'
      }),
      ...(role === 'combobox' && {
        'aria-autocomplete': 'list'
      })
    };
  }, [ariaRole, floatingId, isNested, open, referenceId, role]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...(ariaRole && {
        role: ariaRole
      })
    };
    if (ariaRole === 'tooltip' || role === 'label') {
      return floatingProps;
    }
    return {
      ...floatingProps,
      ...(ariaRole === 'menu' && {
        'aria-labelledby': referenceId
      })
    };
  }, [ariaRole, floatingId, referenceId, role]);
  const item = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(_ref => {
    let {
      active,
      selected
    } = _ref;
    const commonProps = {
      role: 'option',
      ...(active && {
        id: floatingId + "-option"
      })
    };

    // For `menu`, we are unable to tell if the item is a `menuitemradio`
    // or `menuitemcheckbox`. For backwards-compatibility reasons, also
    // avoid defaulting to `menuitem` as it may overwrite custom role props.
    switch (role) {
      case 'select':
        return {
          ...commonProps,
          'aria-selected': active && selected
        };
      case 'combobox':
        {
          return {
            ...commonProps,
            ...(active && {
              'aria-selected': true
            })
          };
        }
    }
    return {};
  }, [floatingId, role]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference,
    floating,
    item
  } : {}, [enabled, reference, floating, item]);
}

// Converts a JS style key like `backgroundColor` to a CSS transition-property
// like `background-color`.
const camelCaseToKebabCase = str => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
function execWithArgsOrReturn(valueOrFn, args) {
  return typeof valueOrFn === 'function' ? valueOrFn(args) : valueOrFn;
}
function useDelayUnmount(open, durationMs) {
  const [isMounted, setIsMounted] = react__WEBPACK_IMPORTED_MODULE_0__.useState(open);
  if (open && !isMounted) {
    setIsMounted(true);
  }
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!open && isMounted) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);
      return () => clearTimeout(timeout);
    }
  }, [open, isMounted, durationMs]);
  return isMounted;
}
/**
 * Provides a status string to apply CSS transitions to a floating element,
 * correctly handling placement-aware transitions.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 */
function useTransitionStatus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    elements: {
      floating
    }
  } = context;
  const {
    duration = 250
  } = props;
  const isNumberDuration = typeof duration === 'number';
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [status, setStatus] = react__WEBPACK_IMPORTED_MODULE_0__.useState('unmounted');
  const isMounted = useDelayUnmount(open, closeDuration);
  if (!isMounted && status === 'close') {
    setStatus('unmounted');
  }
  index(() => {
    if (!floating) return;
    if (open) {
      setStatus('initial');
      const frame = requestAnimationFrame(() => {
        setStatus('open');
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }
    setStatus('close');
  }, [open, floating]);
  return {
    isMounted,
    status
  };
}
/**
 * Provides styles to apply CSS transitions to a floating element, correctly
 * handling placement-aware transitions. Wrapper around `useTransitionStatus`.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstyles
 */
function useTransitionStyles(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    initial: unstable_initial = {
      opacity: 0
    },
    open: unstable_open,
    close: unstable_close,
    common: unstable_common,
    duration = 250
  } = props;
  const placement = context.placement;
  const side = placement.split('-')[0];
  const fnArgs = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    side,
    placement
  }), [side, placement]);
  const isNumberDuration = typeof duration === 'number';
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [styles, setStyles] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => ({
    ...execWithArgsOrReturn(unstable_common, fnArgs),
    ...execWithArgsOrReturn(unstable_initial, fnArgs)
  }));
  const {
    isMounted,
    status
  } = useTransitionStatus(context, {
    duration
  });
  const initialRef = useLatestRef(unstable_initial);
  const openRef = useLatestRef(unstable_open);
  const closeRef = useLatestRef(unstable_close);
  const commonRef = useLatestRef(unstable_common);
  index(() => {
    const initialStyles = execWithArgsOrReturn(initialRef.current, fnArgs);
    const closeStyles = execWithArgsOrReturn(closeRef.current, fnArgs);
    const commonStyles = execWithArgsOrReturn(commonRef.current, fnArgs);
    const openStyles = execWithArgsOrReturn(openRef.current, fnArgs) || Object.keys(initialStyles).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    if (status === 'initial') {
      setStyles(styles => ({
        transitionProperty: styles.transitionProperty,
        ...commonStyles,
        ...initialStyles
      }));
    }
    if (status === 'open') {
      setStyles({
        transitionProperty: Object.keys(openStyles).map(camelCaseToKebabCase).join(','),
        transitionDuration: openDuration + "ms",
        ...commonStyles,
        ...openStyles
      });
    }
    if (status === 'close') {
      const styles = closeStyles || initialStyles;
      setStyles({
        transitionProperty: Object.keys(styles).map(camelCaseToKebabCase).join(','),
        transitionDuration: closeDuration + "ms",
        ...commonStyles,
        ...styles
      });
    }
  }, [closeDuration, closeRef, initialRef, openRef, commonRef, openDuration, status, fnArgs]);
  return {
    isMounted,
    styles
  };
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
function useTypeahead(context, props) {
  var _ref;
  const {
    open,
    dataRef
  } = context;
  const {
    listRef,
    activeIndex,
    onMatch: unstable_onMatch,
    onTypingChange: unstable_onTypingChange,
    enabled = true,
    findMatch = null,
    resetMs = 750,
    ignoreKeys = [],
    selectedIndex = null
  } = props;
  const timeoutIdRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  const stringRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef('');
  const prevIndexRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef((_ref = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref : -1);
  const matchIndexRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const onMatch = useEffectEvent(unstable_onMatch);
  const onTypingChange = useEffectEvent(unstable_onTypingChange);
  const findMatchRef = useLatestRef(findMatch);
  const ignoreKeysRef = useLatestRef(ignoreKeys);
  index(() => {
    if (open) {
      clearTimeout(timeoutIdRef.current);
      matchIndexRef.current = null;
      stringRef.current = '';
    }
  }, [open]);
  index(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (open && stringRef.current === '') {
      var _ref2;
      prevIndexRef.current = (_ref2 = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref2 : -1;
    }
  }, [open, selectedIndex, activeIndex]);
  const setTypingChange = useEffectEvent(value => {
    if (value) {
      if (!dataRef.current.typing) {
        dataRef.current.typing = value;
        onTypingChange(value);
      }
    } else {
      if (dataRef.current.typing) {
        dataRef.current.typing = value;
        onTypingChange(value);
      }
    }
  });
  const onKeyDown = useEffectEvent(event => {
    function getMatchingIndex(list, orderedList, string) {
      const str = findMatchRef.current ? findMatchRef.current(orderedList, string) : orderedList.find(text => (text == null ? void 0 : text.toLocaleLowerCase().indexOf(string.toLocaleLowerCase())) === 0);
      return str ? list.indexOf(str) : -1;
    }
    const listContent = listRef.current;
    if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
      if (getMatchingIndex(listContent, listContent, stringRef.current) === -1) {
        setTypingChange(false);
      } else if (event.key === ' ') {
        (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
      }
    }
    if (listContent == null || ignoreKeysRef.current.includes(event.key) ||
    // Character key.
    event.key.length !== 1 ||
    // Modifier key.
    event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (open && event.key !== ' ') {
      (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.stopEvent)(event);
      setTypingChange(true);
    }

    // Bail out if the list contains a word like "llama" or "aaron". TODO:
    // allow it in this case, too.
    const allowRapidSuccessionOfFirstLetter = listContent.every(text => {
      var _text$, _text$2;
      return text ? ((_text$ = text[0]) == null ? void 0 : _text$.toLocaleLowerCase()) !== ((_text$2 = text[1]) == null ? void 0 : _text$2.toLocaleLowerCase()) : true;
    });

    // Allows the user to cycle through items that start with the same letter
    // in rapid succession.
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
    }
    stringRef.current += event.key;
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
      setTypingChange(false);
    }, resetMs);
    const prevIndex = prevIndexRef.current;
    const index = getMatchingIndex(listContent, [...listContent.slice((prevIndex || 0) + 1), ...listContent.slice(0, (prevIndex || 0) + 1)], stringRef.current);
    if (index !== -1) {
      onMatch(index);
      matchIndexRef.current = index;
    } else if (event.key !== ' ') {
      stringRef.current = '';
      setTypingChange(false);
    }
  });
  const reference = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onKeyDown
  }), [onKeyDown]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      onKeyDown,
      onKeyUp(event) {
        if (event.key === ' ') {
          setTypingChange(false);
        }
      }
    };
  }, [onKeyDown, setTypingChange]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

function getArgsWithCustomFloatingHeight(state, height) {
  return {
    ...state,
    rects: {
      ...state.rects,
      floating: {
        ...state.rects.floating,
        height
      }
    }
  };
}
/**
 * Positions the floating element such that an inner element inside of it is
 * anchored to the reference element.
 * @see https://floating-ui.com/docs/inner
 */
const inner = props => ({
  name: 'inner',
  options: props,
  async fn(state) {
    const {
      listRef,
      overflowRef,
      onFallbackChange,
      offset: innerOffset = 0,
      index = 0,
      minItemsVisible = 4,
      referenceOverflowThreshold = 0,
      scrollRef,
      ...detectOverflowOptions
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.evaluate)(props, state);
    const {
      rects,
      elements: {
        floating
      }
    } = state;
    const item = listRef.current[index];
    const scrollEl = (scrollRef == null ? void 0 : scrollRef.current) || floating;

    // Valid combinations:
    // 1. Floating element is the scrollRef and has a border (default)
    // 2. Floating element is not the scrollRef, floating element has a border
    // 3. Floating element is not the scrollRef, scrollRef has a border
    // Floating > {...getFloatingProps()} wrapper > scrollRef > items is not
    // allowed as VoiceOver doesn't work.
    const clientTop = floating.clientTop || scrollEl.clientTop;
    const floatingIsBordered = floating.clientTop !== 0;
    const scrollElIsBordered = scrollEl.clientTop !== 0;
    const floatingIsScrollEl = floating === scrollEl;
    if (true) {
      if (!state.placement.startsWith('bottom')) {
        warn('`placement` side must be "bottom" when using the `inner`', 'middleware.');
      }
    }
    if (!item) {
      return {};
    }
    const nextArgs = {
      ...state,
      ...(await (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_2__.offset)(-item.offsetTop - floating.clientTop - rects.reference.height / 2 - item.offsetHeight / 2 - innerOffset).fn(state))
    };
    const overflow = await (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.detectOverflow)(getArgsWithCustomFloatingHeight(nextArgs, scrollEl.scrollHeight + clientTop + floating.clientTop), detectOverflowOptions);
    const refOverflow = await (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.detectOverflow)(nextArgs, {
      ...detectOverflowOptions,
      elementContext: 'reference'
    });
    const diffY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.max)(0, overflow.top);
    const nextY = nextArgs.y + diffY;
    const isScrollable = scrollEl.scrollHeight > scrollEl.clientHeight;
    const rounder = isScrollable ? v => v : _floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.round;
    const maxHeight = rounder((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.max)(0, scrollEl.scrollHeight + (floatingIsBordered && floatingIsScrollEl || scrollElIsBordered ? clientTop * 2 : 0) - diffY - (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.max)(0, overflow.bottom)));
    scrollEl.style.maxHeight = maxHeight + "px";
    scrollEl.scrollTop = diffY;

    // There is not enough space, fallback to standard anchored positioning
    if (onFallbackChange) {
      const shouldFallback = scrollEl.offsetHeight < item.offsetHeight * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_6__.min)(minItemsVisible, listRef.current.length) - 1 || refOverflow.top >= -referenceOverflowThreshold || refOverflow.bottom >= -referenceOverflowThreshold;
      react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => onFallbackChange(shouldFallback));
    }
    if (overflowRef) {
      overflowRef.current = await (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_3__.detectOverflow)(getArgsWithCustomFloatingHeight({
        ...nextArgs,
        y: nextY
      }, scrollEl.offsetHeight + clientTop + floating.clientTop), detectOverflowOptions);
    }
    return {
      y: nextY
    };
  }
});
/**
 * Changes the `inner` middleware's `offset` upon a `wheel` event to
 * expand the floating element's height, revealing more list items.
 * @see https://floating-ui.com/docs/inner
 */
function useInnerOffset(context, props) {
  const {
    open,
    elements
  } = context;
  const {
    enabled = true,
    overflowRef,
    scrollRef,
    onChange: unstable_onChange
  } = props;
  const onChange = useEffectEvent(unstable_onChange);
  const controlledScrollingRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const prevScrollTopRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const initialOverflowRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!enabled) return;
    function onWheel(e) {
      if (e.ctrlKey || !el || overflowRef.current == null) {
        return;
      }
      const dY = e.deltaY;
      const isAtTop = overflowRef.current.top >= -0.5;
      const isAtBottom = overflowRef.current.bottom >= -0.5;
      const remainingScroll = el.scrollHeight - el.clientHeight;
      const sign = dY < 0 ? -1 : 1;
      const method = dY < 0 ? 'max' : 'min';
      if (el.scrollHeight <= el.clientHeight) {
        return;
      }
      if (!isAtTop && dY > 0 || !isAtBottom && dY < 0) {
        e.preventDefault();
        react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => {
          onChange(d => d + Math[method](dY, remainingScroll * sign));
        });
      } else if (/firefox/i.test((0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getUserAgent)())) {
        // Needed to propagate scrolling during momentum scrolling phase once
        // it gets limited by the boundary. UX improvement, not critical.
        el.scrollTop += dY;
      }
    }
    const el = (scrollRef == null ? void 0 : scrollRef.current) || elements.floating;
    if (open && el) {
      el.addEventListener('wheel', onWheel);

      // Wait for the position to be ready.
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop;
        if (overflowRef.current != null) {
          initialOverflowRef.current = {
            ...overflowRef.current
          };
        }
      });
      return () => {
        prevScrollTopRef.current = null;
        initialOverflowRef.current = null;
        el.removeEventListener('wheel', onWheel);
      };
    }
  }, [enabled, open, elements.floating, overflowRef, scrollRef, onChange]);
  const floating = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    onKeyDown() {
      controlledScrollingRef.current = true;
    },
    onWheel() {
      controlledScrollingRef.current = false;
    },
    onPointerMove() {
      controlledScrollingRef.current = false;
    },
    onScroll() {
      const el = (scrollRef == null ? void 0 : scrollRef.current) || elements.floating;
      if (!overflowRef.current || !el || !controlledScrollingRef.current) {
        return;
      }
      if (prevScrollTopRef.current !== null) {
        const scrollDiff = el.scrollTop - prevScrollTopRef.current;
        if (overflowRef.current.bottom < -0.5 && scrollDiff < -1 || overflowRef.current.top < -0.5 && scrollDiff > 1) {
          react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => onChange(d => d + scrollDiff));
        }
      }

      // [Firefox] Wait for the height change to have been applied.
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop;
      });
    }
  }), [elements.floating, onChange, overflowRef, scrollRef]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => enabled ? {
    floating
  } : {}, [enabled, floating]);
}

function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let isInside = false;
  const length = polygon.length;
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] || [0, 0];
    const [xj, yj] = polygon[j] || [0, 0];
    const intersect = yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}
function isInside(point, rect) {
  return point[0] >= rect.x && point[0] <= rect.x + rect.width && point[1] >= rect.y && point[1] <= rect.y + rect.height;
}
/**
 * Generates a safe polygon area that the user can traverse without closing the
 * floating element once leaving the reference element.
 * @see https://floating-ui.com/docs/useHover#safepolygon
 */
function safePolygon(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    buffer = 0.5,
    blockPointerEvents = false,
    requireIntent = true
  } = options;
  let timeoutId;
  let hasLanded = false;
  let lastX = null;
  let lastY = null;
  let lastCursorTime = performance.now();
  function getCursorSpeed(x, y) {
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastCursorTime;
    if (lastX === null || lastY === null || elapsedTime === 0) {
      lastX = x;
      lastY = y;
      lastCursorTime = currentTime;
      return null;
    }
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = distance / elapsedTime; // px / ms

    lastX = x;
    lastY = y;
    lastCursorTime = currentTime;
    return speed;
  }
  const fn = _ref => {
    let {
      x,
      y,
      placement,
      elements,
      onClose,
      nodeId,
      tree
    } = _ref;
    return function onMouseMove(event) {
      function close() {
        clearTimeout(timeoutId);
        onClose();
      }
      clearTimeout(timeoutId);
      if (!elements.domReference || !elements.floating || placement == null || x == null || y == null) {
        return;
      }
      const {
        clientX,
        clientY
      } = event;
      const clientPoint = [clientX, clientY];
      const target = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.getTarget)(event);
      const isLeave = event.type === 'mouseleave';
      const isOverFloatingEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(elements.floating, target);
      const isOverReferenceEl = (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(elements.domReference, target);
      const refRect = elements.domReference.getBoundingClientRect();
      const rect = elements.floating.getBoundingClientRect();
      const side = placement.split('-')[0];
      const cursorLeaveFromRight = x > rect.right - rect.width / 2;
      const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2;
      const isOverReferenceRect = isInside(clientPoint, refRect);
      const isFloatingWider = rect.width > refRect.width;
      const isFloatingTaller = rect.height > refRect.height;
      const left = (isFloatingWider ? refRect : rect).left;
      const right = (isFloatingWider ? refRect : rect).right;
      const top = (isFloatingTaller ? refRect : rect).top;
      const bottom = (isFloatingTaller ? refRect : rect).bottom;
      if (isOverFloatingEl) {
        hasLanded = true;
        if (!isLeave) {
          return;
        }
      }
      if (isOverReferenceEl) {
        hasLanded = false;
      }
      if (isOverReferenceEl && !isLeave) {
        hasLanded = true;
        return;
      }

      // Prevent overlapping floating element from being stuck in an open-close
      // loop: https://github.com/floating-ui/floating-ui/issues/1910
      if (isLeave && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_4__.isElement)(event.relatedTarget) && (0,_floating_ui_react_utils__WEBPACK_IMPORTED_MODULE_5__.contains)(elements.floating, event.relatedTarget)) {
        return;
      }

      // If any nested child is open, abort.
      if (tree && getChildren(tree.nodesRef.current, nodeId).some(_ref2 => {
        let {
          context
        } = _ref2;
        return context == null ? void 0 : context.open;
      })) {
        return;
      }

      // If the pointer is leaving from the opposite side, the "buffer" logic
      // creates a point where the floating element remains open, but should be
      // ignored.
      // A constant of 1 handles floating point rounding errors.
      if (side === 'top' && y >= refRect.bottom - 1 || side === 'bottom' && y <= refRect.top + 1 || side === 'left' && x >= refRect.right - 1 || side === 'right' && x <= refRect.left + 1) {
        return close();
      }

      // Ignore when the cursor is within the rectangular trough between the
      // two elements. Since the triangle is created from the cursor point,
      // which can start beyond the ref element's edge, traversing back and
      // forth from the ref to the floating element can cause it to close. This
      // ensures it always remains open in that case.
      let rectPoly = [];
      switch (side) {
        case 'top':
          rectPoly = [[left, refRect.top + 1], [left, rect.bottom - 1], [right, rect.bottom - 1], [right, refRect.top + 1]];
          break;
        case 'bottom':
          rectPoly = [[left, rect.top + 1], [left, refRect.bottom - 1], [right, refRect.bottom - 1], [right, rect.top + 1]];
          break;
        case 'left':
          rectPoly = [[rect.right - 1, bottom], [rect.right - 1, top], [refRect.left + 1, top], [refRect.left + 1, bottom]];
          break;
        case 'right':
          rectPoly = [[refRect.right - 1, bottom], [refRect.right - 1, top], [rect.left + 1, top], [rect.left + 1, bottom]];
          break;
      }
      function getPolygon(_ref3) {
        let [x, y] = _ref3;
        switch (side) {
          case 'top':
            {
              const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
              const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
              const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.bottom - buffer : isFloatingWider ? rect.bottom - buffer : rect.top], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.bottom - buffer : rect.top : rect.bottom - buffer]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
          case 'bottom':
            {
              const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
              const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
              const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.top + buffer : isFloatingWider ? rect.top + buffer : rect.bottom], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.top + buffer : rect.bottom : rect.top + buffer]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
          case 'left':
            {
              const cursorPointOne = [x + buffer + 1, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const cursorPointTwo = [x + buffer + 1, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const commonPoints = [[cursorLeaveFromBottom ? rect.right - buffer : isFloatingTaller ? rect.right - buffer : rect.left, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.right - buffer : rect.left : rect.right - buffer, rect.bottom]];
              return [...commonPoints, cursorPointOne, cursorPointTwo];
            }
          case 'right':
            {
              const cursorPointOne = [x - buffer, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const cursorPointTwo = [x - buffer, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const commonPoints = [[cursorLeaveFromBottom ? rect.left + buffer : isFloatingTaller ? rect.left + buffer : rect.right, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.left + buffer : rect.right : rect.left + buffer, rect.bottom]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
        }
      }
      if (isPointInPolygon([clientX, clientY], rectPoly)) {
        return;
      }
      if (hasLanded && !isOverReferenceRect) {
        return close();
      }
      if (!isLeave && requireIntent) {
        const cursorSpeed = getCursorSpeed(event.clientX, event.clientY);
        const cursorSpeedThreshold = 0.1;
        if (cursorSpeed !== null && cursorSpeed < cursorSpeedThreshold) {
          return close();
        }
      }
      if (!isPointInPolygon([clientX, clientY], getPolygon([x, y]))) {
        close();
      } else if (!hasLanded && requireIntent) {
        timeoutId = window.setTimeout(close, 40);
      }
    };
  };
  fn.__options = {
    blockPointerEvents
  };
  return fn;
}




/***/ }),

/***/ "./node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TYPEABLE_SELECTOR: () => (/* binding */ TYPEABLE_SELECTOR),
/* harmony export */   activeElement: () => (/* binding */ activeElement),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   getDocument: () => (/* binding */ getDocument),
/* harmony export */   getPlatform: () => (/* binding */ getPlatform),
/* harmony export */   getTarget: () => (/* binding */ getTarget),
/* harmony export */   getUserAgent: () => (/* binding */ getUserAgent),
/* harmony export */   isAndroid: () => (/* binding */ isAndroid),
/* harmony export */   isEventTargetWithin: () => (/* binding */ isEventTargetWithin),
/* harmony export */   isJSDOM: () => (/* binding */ isJSDOM),
/* harmony export */   isMac: () => (/* binding */ isMac),
/* harmony export */   isMouseLikePointerType: () => (/* binding */ isMouseLikePointerType),
/* harmony export */   isReactEvent: () => (/* binding */ isReactEvent),
/* harmony export */   isRootElement: () => (/* binding */ isRootElement),
/* harmony export */   isSafari: () => (/* binding */ isSafari),
/* harmony export */   isTypeableCombobox: () => (/* binding */ isTypeableCombobox),
/* harmony export */   isTypeableElement: () => (/* binding */ isTypeableElement),
/* harmony export */   isVirtualClick: () => (/* binding */ isVirtualClick),
/* harmony export */   isVirtualPointerEvent: () => (/* binding */ isVirtualPointerEvent),
/* harmony export */   stopEvent: () => (/* binding */ stopEvent)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");


function activeElement(doc) {
  let activeElement = doc.activeElement;
  while (((_activeElement = activeElement) == null || (_activeElement = _activeElement.shadowRoot) == null ? void 0 : _activeElement.activeElement) != null) {
    var _activeElement;
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}
function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }

  // then fallback to custom implementation with Shadow DOM support
  if (rootNode && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      // @ts-ignore
      next = next.parentNode || next.host;
    }
  }

  // Give up, the result is false
  return false;
}
// Avoid Chrome DevTools blue warning.
function getPlatform() {
  const uaData = navigator.userAgentData;
  if (uaData != null && uaData.platform) {
    return uaData.platform;
  }
  return navigator.platform;
}
function getUserAgent() {
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map(_ref => {
      let {
        brand,
        version
      } = _ref;
      return brand + "/" + version;
    }).join(' ');
  }
  return navigator.userAgent;
}

// License: https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/utils/src/isVirtualEvent.ts
function isVirtualClick(event) {
  // FIXME: Firefox is now emitting a deprecation warning for `mozInputSource`.
  // Try to find a workaround for this. `react-aria` source still has the check.
  if (event.mozInputSource === 0 && event.isTrusted) {
    return true;
  }
  if (isAndroid() && event.pointerType) {
    return event.type === 'click' && event.buttons === 1;
  }
  return event.detail === 0 && !event.pointerType;
}
function isVirtualPointerEvent(event) {
  if (isJSDOM()) return false;
  return !isAndroid() && event.width === 0 && event.height === 0 || isAndroid() && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse' ||
  // iOS VoiceOver returns 0.333• for width/height.
  event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'touch';
}
function isSafari() {
  // Chrome DevTools does not complain about navigator.vendor
  return /apple/i.test(navigator.vendor);
}
function isAndroid() {
  const re = /android/i;
  return re.test(getPlatform()) || re.test(getUserAgent());
}
function isMac() {
  return getPlatform().toLowerCase().startsWith('mac') && !navigator.maxTouchPoints;
}
function isJSDOM() {
  return getUserAgent().includes('jsdom/');
}
function isMouseLikePointerType(pointerType, strict) {
  // On some Linux machines with Chromium, mouse inputs return a `pointerType`
  // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
  const values = ['mouse', 'pen'];
  if (!strict) {
    values.push('', undefined);
  }
  return values.includes(pointerType);
}
function isReactEvent(event) {
  return 'nativeEvent' in event;
}
function isRootElement(element) {
  return element.matches('html,body');
}
function getDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}
function isEventTargetWithin(event, node) {
  if (node == null) {
    return false;
  }
  if ('composedPath' in event) {
    return event.composedPath().includes(node);
  }

  // TS thinks `event` is of type never as it assumes all browsers support composedPath, but browsers without shadow dom don't
  const e = event;
  return e.target != null && node.contains(e.target);
}
function getTarget(event) {
  if ('composedPath' in event) {
    return event.composedPath()[0];
  }

  // TS thinks `event` is of type never as it assumes all browsers support
  // `composedPath()`, but browsers without shadow DOM don't.
  return event.target;
}
const TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled])," + "[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
function isTypeableElement(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) && element.matches(TYPEABLE_SELECTOR);
}
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
function isTypeableCombobox(element) {
  if (!element) return false;
  return element.getAttribute('role') === 'combobox' && isTypeableElement(element);
}




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
const containValues = ['paint', 'layout', 'strict', 'content'];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/description/description.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/description/description.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Description: () => (/* binding */ H),
/* harmony export */   useDescribedBy: () => (/* binding */ U),
/* harmony export */   useDescriptions: () => (/* binding */ w)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/use-id.js */ "react");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _internal_disabled_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internal/disabled.js */ "./node_modules/@headlessui/react/dist/internal/disabled.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";let a=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);a.displayName="DescriptionContext";function f(){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(a);if(r===null){let e=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(e,f),e}return r}function U(){var r,e;return(e=(r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(a))==null?void 0:r.value)!=null?e:void 0}function w(){let[r,e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);return[r.length>0?r.join(" "):void 0,(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>function(t){let i=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(n=>(e(s=>[...s,n]),()=>e(s=>{let o=s.slice(),p=o.indexOf(n);return p!==-1&&o.splice(p,1),o}))),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({register:i,slot:t.slot,name:t.name,props:t.props,value:t.value}),[i,t.slot,t.name,t.props,t.value]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(a.Provider,{value:l},t.children)},[e])]}let S="p";function C(r,e){let d=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),t=(0,_internal_disabled_js__WEBPACK_IMPORTED_MODULE_2__.useDisabled)(),{id:i=`headlessui-description-${d}`,...l}=r,n=f(),s=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_3__.useSyncRefs)(e);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_4__.useIsoMorphicEffect)(()=>n.register(i),[i,n.register]);let o=t||!1,p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({...n.slot,disabled:o}),[n.slot,o]),D={ref:s,...n.props,id:i};return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.useRender)()({ourProps:D,theirProps:l,slot:p,defaultTag:S,name:n.name||"Description"})}let _=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(C),H=Object.assign(_,{});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/dialog/dialog.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/dialog/dialog.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dialog: () => (/* binding */ Lt),
/* harmony export */   DialogBackdrop: () => (/* binding */ bt),
/* harmony export */   DialogDescription: () => (/* binding */ vt),
/* harmony export */   DialogPanel: () => (/* binding */ qe),
/* harmony export */   DialogTitle: () => (/* binding */ ze)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/use-id.js */ "react");
/* harmony import */ var _hooks_use_escape_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../hooks/use-escape.js */ "./node_modules/@headlessui/react/dist/hooks/use-escape.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_inert_others_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/use-inert-others.js */ "./node_modules/@headlessui/react/dist/hooks/use-inert-others.js");
/* harmony import */ var _hooks_use_is_touch_device_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../hooks/use-is-touch-device.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-touch-device.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../hooks/use-on-disappear.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js");
/* harmony import */ var _hooks_use_outside_click_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../hooks/use-outside-click.js */ "./node_modules/@headlessui/react/dist/hooks/use-outside-click.js");
/* harmony import */ var _hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/use-owner.js */ "./node_modules/@headlessui/react/dist/hooks/use-owner.js");
/* harmony import */ var _hooks_use_root_containers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-root-containers.js */ "./node_modules/@headlessui/react/dist/hooks/use-root-containers.js");
/* harmony import */ var _hooks_use_scroll_lock_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../hooks/use-scroll-lock.js */ "./node_modules/@headlessui/react/dist/hooks/use-scroll-lock.js");
/* harmony import */ var _hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/use-server-handoff-complete.js */ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _internal_close_provider_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../internal/close-provider.js */ "./node_modules/@headlessui/react/dist/internal/close-provider.js");
/* harmony import */ var _internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../internal/open-closed.js */ "./node_modules/@headlessui/react/dist/internal/open-closed.js");
/* harmony import */ var _internal_portal_force_root_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../internal/portal-force-root.js */ "./node_modules/@headlessui/react/dist/internal/portal-force-root.js");
/* harmony import */ var _machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../machines/stack-machine.js */ "./node_modules/@headlessui/react/dist/machines/stack-machine.js");
/* harmony import */ var _react_glue_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../react-glue.js */ "./node_modules/@headlessui/react/dist/react-glue.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
/* harmony import */ var _description_description_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../description/description.js */ "./node_modules/@headlessui/react/dist/components/description/description.js");
/* harmony import */ var _focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../focus-trap/focus-trap.js */ "./node_modules/@headlessui/react/dist/components/focus-trap/focus-trap.js");
/* harmony import */ var _portal_portal_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../portal/portal.js */ "./node_modules/@headlessui/react/dist/components/portal/portal.js");
/* harmony import */ var _transition_transition_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../transition/transition.js */ "./node_modules/@headlessui/react/dist/components/transition/transition.js");
"use client";var Ge=(o=>(o[o.Open=0]="Open",o[o.Closed=1]="Closed",o))(Ge||{}),we=(t=>(t[t.SetTitleId=0]="SetTitleId",t))(we||{});let Be={[0](e,t){return e.titleId===t.id?e:{...e,titleId:t.id}}},w=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);w.displayName="DialogContext";function O(e){let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(w);if(t===null){let o=new Error(`<${e} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(o,O),o}return t}function Ue(e,t){return (0,_utils_match_js__WEBPACK_IMPORTED_MODULE_1__.match)(t.type,Be,e,t)}let z=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.forwardRefWithAs)(function(t,o){let a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:n=`headlessui-dialog-${a}`,open:i,onClose:s,initialFocus:d,role:p="dialog",autoFocus:T=!0,__demoMode:u=!1,unmount:y=!1,...S}=t,F=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);p=function(){return p==="dialog"||p==="alertdialog"?p:(F.current||(F.current=!0,console.warn(`Invalid role [${p}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)),"dialog")}();let c=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.useOpenClosed)();i===void 0&&c!==null&&(i=(c&_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.State.Open)===_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.State.Open);let f=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),I=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(f,o),b=(0,_hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_5__.useOwnerDocument)(f),g=i?0:1,[v,Q]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(Ue,{titleId:null,descriptionId:null,panelRef:(0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)()}),m=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(()=>s(!1)),B=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(r=>Q({type:0,id:r})),D=(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_7__.useServerHandoffComplete)()?g===0:!1,[Z,ee]=(0,_portal_portal_js__WEBPACK_IMPORTED_MODULE_8__.useNestedPortals)(),te={get current(){var r;return(r=v.panelRef.current)!=null?r:f.current}},L=(0,_hooks_use_root_containers_js__WEBPACK_IMPORTED_MODULE_9__.useMainTreeNode)(),{resolveContainers:M}=(0,_hooks_use_root_containers_js__WEBPACK_IMPORTED_MODULE_9__.useRootContainers)({mainTreeNode:L,portals:Z,defaultContainers:[te]}),U=c!==null?(c&_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.State.Closing)===_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.State.Closing:!1;(0,_hooks_use_inert_others_js__WEBPACK_IMPORTED_MODULE_10__.useInertOthers)(u||U?!1:D,{allowed:(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(()=>{var r,W;return[(W=(r=f.current)==null?void 0:r.closest("[data-headlessui-portal]"))!=null?W:null]}),disallowed:(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(()=>{var r;return[(r=L==null?void 0:L.closest("body > *:not(#headlessui-portal-root)"))!=null?r:null]})});let P=_machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_11__.stackMachines.get(null);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_12__.useIsoMorphicEffect)(()=>{if(D)return P.actions.push(n),()=>P.actions.pop(n)},[P,n,D]);let H=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_13__.useSlice)(P,(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(r=>P.selectors.isTop(r,n),[P,n]));(0,_hooks_use_outside_click_js__WEBPACK_IMPORTED_MODULE_14__.useOutsideClick)(H,M,r=>{r.preventDefault(),m()}),(0,_hooks_use_escape_js__WEBPACK_IMPORTED_MODULE_15__.useEscape)(H,b==null?void 0:b.defaultView,r=>{r.preventDefault(),r.stopPropagation(),document.activeElement&&"blur"in document.activeElement&&typeof document.activeElement.blur=="function"&&document.activeElement.blur(),m()}),(0,_hooks_use_scroll_lock_js__WEBPACK_IMPORTED_MODULE_16__.useScrollLock)(u||U?!1:D,b,M),(0,_hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_17__.useOnDisappear)(D,f,m);let[oe,ne]=(0,_description_description_js__WEBPACK_IMPORTED_MODULE_18__.useDescriptions)(),re=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>[{dialogState:g,close:m,setTitleId:B,unmount:y},v],[g,v,m,B,y]),N=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:g===0}),[g]),le={ref:I,id:n,role:p,tabIndex:-1,"aria-modal":u?void 0:g===0?!0:void 0,"aria-labelledby":v.titleId,"aria-describedby":oe,unmount:y},ae=!(0,_hooks_use_is_touch_device_js__WEBPACK_IMPORTED_MODULE_19__.useIsTouchDevice)(),E=_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrapFeatures.None;D&&!u&&(E|=_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrapFeatures.RestoreFocus,E|=_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrapFeatures.TabLock,T&&(E|=_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrapFeatures.AutoFocus),ae&&(E|=_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrapFeatures.InitialFocus));let ie=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.ResetOpenClosedProvider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_portal_force_root_js__WEBPACK_IMPORTED_MODULE_21__.ForcePortalRoot,{force:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_portal_portal_js__WEBPACK_IMPORTED_MODULE_8__.Portal,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(w.Provider,{value:re},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_portal_portal_js__WEBPACK_IMPORTED_MODULE_8__.PortalGroup,{target:f},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_portal_force_root_js__WEBPACK_IMPORTED_MODULE_21__.ForcePortalRoot,{force:!1},react__WEBPACK_IMPORTED_MODULE_0__.createElement(ne,{slot:N},react__WEBPACK_IMPORTED_MODULE_0__.createElement(ee,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_focus_trap_focus_trap_js__WEBPACK_IMPORTED_MODULE_20__.FocusTrap,{initialFocus:d,initialFocusFallback:f,containers:M,features:E},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_close_provider_js__WEBPACK_IMPORTED_MODULE_22__.CloseProvider,{value:m},ie({ourProps:le,theirProps:S,slot:N,defaultTag:He,features:Ne,visible:g===0,name:"Dialog"})))))))))))}),He="div",Ne=_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.RenderFeatures.RenderStrategy|_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.RenderFeatures.Static;function We(e,t){let{transition:o=!1,open:a,...n}=e,i=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_3__.useOpenClosed)(),s=e.hasOwnProperty("open")||i!==null,d=e.hasOwnProperty("onClose");if(!s&&!d)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!s)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!d)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if(!i&&typeof e.open!="boolean")throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e.open}`);if(typeof e.onClose!="function")throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e.onClose}`);return(a!==void 0||o)&&!n.static?react__WEBPACK_IMPORTED_MODULE_0__.createElement(_hooks_use_root_containers_js__WEBPACK_IMPORTED_MODULE_9__.MainTreeProvider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_transition_transition_js__WEBPACK_IMPORTED_MODULE_23__.Transition,{show:a,transition:o,unmount:n.unmount},react__WEBPACK_IMPORTED_MODULE_0__.createElement(z,{ref:t,...n}))):react__WEBPACK_IMPORTED_MODULE_0__.createElement(_hooks_use_root_containers_js__WEBPACK_IMPORTED_MODULE_9__.MainTreeProvider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(z,{ref:t,open:a,...n}))}let $e="div";function je(e,t){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:a=`headlessui-dialog-panel-${o}`,transition:n=!1,...i}=e,[{dialogState:s,unmount:d},p]=O("Dialog.Panel"),T=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(t,p.panelRef),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:s===0}),[s]),y=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(I=>{I.stopPropagation()}),S={ref:T,id:a,onClick:y},F=n?_transition_transition_js__WEBPACK_IMPORTED_MODULE_23__.TransitionChild:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,c=n?{unmount:d}:{},f=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(F,{...c},f({ourProps:S,theirProps:i,slot:u,defaultTag:$e,name:"Dialog.Panel"}))}let Ye="div";function Je(e,t){let{transition:o=!1,...a}=e,[{dialogState:n,unmount:i}]=O("Dialog.Backdrop"),s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:n===0}),[n]),d={ref:t,"aria-hidden":!0},p=o?_transition_transition_js__WEBPACK_IMPORTED_MODULE_23__.TransitionChild:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,T=o?{unmount:i}:{},u=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(p,{...T},u({ourProps:d,theirProps:a,slot:s,defaultTag:Ye,name:"Dialog.Backdrop"}))}let Ke="h2";function Xe(e,t){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:a=`headlessui-dialog-title-${o}`,...n}=e,[{dialogState:i,setTitleId:s}]=O("Dialog.Title"),d=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(t);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(s(a),()=>s(null)),[a,s]);let p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:i===0}),[i]),T={ref:d,id:a};return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.useRender)()({ourProps:T,theirProps:n,slot:p,defaultTag:Ke,name:"Dialog.Title"})}let Ve=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.forwardRefWithAs)(We),qe=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.forwardRefWithAs)(je),bt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.forwardRefWithAs)(Je),ze=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.forwardRefWithAs)(Xe),vt=_description_description_js__WEBPACK_IMPORTED_MODULE_18__.Description,Lt=Object.assign(Ve,{Panel:qe,Title:ze,Description:_description_description_js__WEBPACK_IMPORTED_MODULE_18__.Description});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/focus-trap/focus-trap.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/focus-trap/focus-trap.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FocusTrap: () => (/* binding */ Re),
/* harmony export */   FocusTrapFeatures: () => (/* binding */ G)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_event_listener_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../hooks/use-event-listener.js */ "./node_modules/@headlessui/react/dist/hooks/use-event-listener.js");
/* harmony import */ var _hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../hooks/use-is-mounted.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js");
/* harmony import */ var _hooks_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-is-top-layer.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js");
/* harmony import */ var _hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../hooks/use-on-unmount.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-unmount.js");
/* harmony import */ var _hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-owner.js */ "./node_modules/@headlessui/react/dist/hooks/use-owner.js");
/* harmony import */ var _hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/use-server-handoff-complete.js */ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/use-tab-direction.js */ "./node_modules/@headlessui/react/dist/hooks/use-tab-direction.js");
/* harmony import */ var _hooks_use_watch_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../hooks/use-watch.js */ "./node_modules/@headlessui/react/dist/hooks/use-watch.js");
/* harmony import */ var _internal_hidden_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../internal/hidden.js */ "./node_modules/@headlessui/react/dist/internal/hidden.js");
/* harmony import */ var _utils_active_element_history_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../utils/active-element-history.js */ "./node_modules/@headlessui/react/dist/utils/active-element-history.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/focus-management.js */ "./node_modules/@headlessui/react/dist/utils/focus-management.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _utils_micro_task_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../utils/micro-task.js */ "./node_modules/@headlessui/react/dist/utils/micro-task.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";function x(s){if(!s)return new Set;if(typeof s=="function")return new Set(s());let e=new Set;for(let t of s.current)_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isElement(t.current)&&e.add(t.current);return e}let $="div";var G=(n=>(n[n.None=0]="None",n[n.InitialFocus=1]="InitialFocus",n[n.TabLock=2]="TabLock",n[n.FocusLock=4]="FocusLock",n[n.RestoreFocus=8]="RestoreFocus",n[n.AutoFocus=16]="AutoFocus",n))(G||{});function D(s,e){let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),r=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_2__.useSyncRefs)(t,e),{initialFocus:o,initialFocusFallback:a,containers:n,features:u=15,...f}=s;(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_3__.useServerHandoffComplete)()||(u=0);let l=(0,_hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_4__.useOwnerDocument)(t);te(u,{ownerDocument:l});let m=re(u,{ownerDocument:l,container:t,initialFocus:o,initialFocusFallback:a});ne(u,{ownerDocument:l,container:t,containers:n,previousActiveElement:m});let g=(0,_hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__.useTabDirection)(),v=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(c=>{if(!_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement(t.current))return;let E=t.current;(V=>V())(()=>{(0,_utils_match_js__WEBPACK_IMPORTED_MODULE_7__.match)(g.current,{[_hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__.Direction.Forwards]:()=>{(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusIn)(E,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.First,{skipElements:[c.relatedTarget,a]})},[_hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__.Direction.Backwards]:()=>{(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusIn)(E,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.Last,{skipElements:[c.relatedTarget,a]})}})})}),A=(0,_hooks_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_9__.useIsTopLayer)(!!(u&2),"focus-trap#tab-lock"),N=(0,_hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_10__.useDisposables)(),b=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),k={ref:r,onKeyDown(c){c.key=="Tab"&&(b.current=!0,N.requestAnimationFrame(()=>{b.current=!1}))},onBlur(c){if(!(u&4))return;let E=x(n);_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement(t.current)&&E.add(t.current);let L=c.relatedTarget;_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLorSVGElement(L)&&L.dataset.headlessuiFocusGuard!=="true"&&(I(E,L)||(b.current?(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusIn)(t.current,(0,_utils_match_js__WEBPACK_IMPORTED_MODULE_7__.match)(g.current,{[_hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__.Direction.Forwards]:()=>_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.Next,[_hooks_use_tab_direction_js__WEBPACK_IMPORTED_MODULE_5__.Direction.Backwards]:()=>_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.Previous})|_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.WrapAround,{relativeTo:c.target}):_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLorSVGElement(c.target)&&(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(c.target)))}},B=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_11__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,A&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_hidden_js__WEBPACK_IMPORTED_MODULE_12__.Hidden,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:v,features:_internal_hidden_js__WEBPACK_IMPORTED_MODULE_12__.HiddenFeatures.Focusable}),B({ourProps:k,theirProps:f,defaultTag:$,name:"FocusTrap"}),A&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_hidden_js__WEBPACK_IMPORTED_MODULE_12__.Hidden,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:v,features:_internal_hidden_js__WEBPACK_IMPORTED_MODULE_12__.HiddenFeatures.Focusable}))}let w=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_11__.forwardRefWithAs)(D),Re=Object.assign(w,{features:G});function ee(s=!0){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(_utils_active_element_history_js__WEBPACK_IMPORTED_MODULE_13__.history.slice());return (0,_hooks_use_watch_js__WEBPACK_IMPORTED_MODULE_14__.useWatch)(([t],[r])=>{r===!0&&t===!1&&(0,_utils_micro_task_js__WEBPACK_IMPORTED_MODULE_15__.microTask)(()=>{e.current.splice(0)}),r===!1&&t===!0&&(e.current=_utils_active_element_history_js__WEBPACK_IMPORTED_MODULE_13__.history.slice())},[s,_utils_active_element_history_js__WEBPACK_IMPORTED_MODULE_13__.history,e]),(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(()=>{var t;return(t=e.current.find(r=>r!=null&&r.isConnected))!=null?t:null})}function te(s,{ownerDocument:e}){let t=!!(s&8),r=ee(t);(0,_hooks_use_watch_js__WEBPACK_IMPORTED_MODULE_14__.useWatch)(()=>{t||(e==null?void 0:e.activeElement)===(e==null?void 0:e.body)&&(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(r())},[t]),(0,_hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_16__.useOnUnmount)(()=>{t&&(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(r())})}function re(s,{ownerDocument:e,container:t,initialFocus:r,initialFocusFallback:o}){let a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),n=(0,_hooks_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_9__.useIsTopLayer)(!!(s&1),"focus-trap#initial-focus"),u=(0,_hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_17__.useIsMounted)();return (0,_hooks_use_watch_js__WEBPACK_IMPORTED_MODULE_14__.useWatch)(()=>{if(s===0)return;if(!n){o!=null&&o.current&&(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(o.current);return}let f=t.current;f&&(0,_utils_micro_task_js__WEBPACK_IMPORTED_MODULE_15__.microTask)(()=>{if(!u.current)return;let l=e==null?void 0:e.activeElement;if(r!=null&&r.current){if((r==null?void 0:r.current)===l){a.current=l;return}}else if(f.contains(l)){a.current=l;return}if(r!=null&&r.current)(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(r.current);else{if(s&16){if((0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusIn)(f,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.First|_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.AutoFocus)!==_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.FocusResult.Error)return}else if((0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusIn)(f,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.First)!==_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.FocusResult.Error)return;if(o!=null&&o.current&&((0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(o.current),(e==null?void 0:e.activeElement)===o.current))return;console.warn("There are no focusable elements inside the <FocusTrap />")}a.current=e==null?void 0:e.activeElement})},[o,n,s]),a}function ne(s,{ownerDocument:e,container:t,containers:r,previousActiveElement:o}){let a=(0,_hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_17__.useIsMounted)(),n=!!(s&4);(0,_hooks_use_event_listener_js__WEBPACK_IMPORTED_MODULE_18__.useEventListener)(e==null?void 0:e.defaultView,"focus",u=>{if(!n||!a.current)return;let f=x(r);_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement(t.current)&&f.add(t.current);let l=o.current;if(!l)return;let m=u.target;_utils_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement(m)?I(f,m)?(o.current=m,(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(m)):(u.preventDefault(),u.stopPropagation(),(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(l)):(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusElement)(o.current)},!0)}function I(s,e){for(let t of s)if(t.contains(e))return!0;return!1}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/keyboard.js":
/*!********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/keyboard.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Keys: () => (/* binding */ o)
/* harmony export */ });
var o=(r=>(r.Space=" ",r.Enter="Enter",r.Escape="Escape",r.Backspace="Backspace",r.Delete="Delete",r.ArrowLeft="ArrowLeft",r.ArrowUp="ArrowUp",r.ArrowRight="ArrowRight",r.ArrowDown="ArrowDown",r.Home="Home",r.End="End",r.PageUp="PageUp",r.PageDown="PageDown",r.Tab="Tab",r))(o||{});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/label/label.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/label/label.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Label: () => (/* binding */ V),
/* harmony export */   useLabelContext: () => (/* binding */ C),
/* harmony export */   useLabelledBy: () => (/* binding */ N),
/* harmony export */   useLabels: () => (/* binding */ Q)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/use-id.js */ "react");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _internal_disabled_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../internal/disabled.js */ "./node_modules/@headlessui/react/dist/internal/disabled.js");
/* harmony import */ var _internal_id_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internal/id.js */ "./node_modules/@headlessui/react/dist/internal/id.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";let L=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);L.displayName="LabelContext";function C(){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(L);if(n===null){let l=new Error("You used a <Label /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(l,C),l}return n}function N(n){var a,e,o;let l=(e=(a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(L))==null?void 0:a.value)!=null?e:void 0;return((o=n==null?void 0:n.length)!=null?o:0)>0?[l,...n].filter(Boolean).join(" "):l}function Q({inherit:n=!1}={}){let l=N(),[a,e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),o=n?[l,...a].filter(Boolean):a;return[o.length>0?o.join(" "):void 0,(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>function(t){let p=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(i=>(e(u=>[...u,i]),()=>e(u=>{let d=u.slice(),f=d.indexOf(i);return f!==-1&&d.splice(f,1),d}))),b=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({register:p,slot:t.slot,name:t.name,props:t.props,value:t.value}),[p,t.slot,t.name,t.props,t.value]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(L.Provider,{value:b},t.children)},[e])]}let G="label";function U(n,l){var E;let a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),e=C(),o=(0,_internal_id_js__WEBPACK_IMPORTED_MODULE_2__.useProvidedId)(),y=(0,_internal_disabled_js__WEBPACK_IMPORTED_MODULE_3__.useDisabled)(),{id:t=`headlessui-label-${a}`,htmlFor:p=o!=null?o:(E=e.props)==null?void 0:E.htmlFor,passive:b=!1,...i}=n,u=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(l);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_5__.useIsoMorphicEffect)(()=>e.register(t),[t,e.register]);let d=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(s=>{let g=s.currentTarget;if(!(s.target!==s.currentTarget&&_utils_dom_js__WEBPACK_IMPORTED_MODULE_6__.isInteractiveElement(s.target))&&(_utils_dom_js__WEBPACK_IMPORTED_MODULE_6__.isHTMLLabelElement(g)&&s.preventDefault(),e.props&&"onClick"in e.props&&typeof e.props.onClick=="function"&&e.props.onClick(s),_utils_dom_js__WEBPACK_IMPORTED_MODULE_6__.isHTMLLabelElement(g))){let r=document.getElementById(g.htmlFor);if(r){let x=r.getAttribute("disabled");if(x==="true"||x==="")return;let h=r.getAttribute("aria-disabled");if(h==="true"||h==="")return;(_utils_dom_js__WEBPACK_IMPORTED_MODULE_6__.isHTMLInputElement(r)&&(r.type==="file"||r.type==="radio"||r.type==="checkbox")||r.role==="radio"||r.role==="checkbox"||r.role==="switch")&&r.click(),r.focus({preventScroll:!0})}}}),f=y||!1,R=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({...e.slot,disabled:f}),[e.slot,f]),c={ref:u,...e.props,id:t,htmlFor:p,onClick:d};return b&&("onClick"in c&&(delete c.htmlFor,delete c.onClick),"onClick"in i&&delete i.onClick),(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_7__.useRender)()({ourProps:c,theirProps:i,slot:R,defaultTag:p?G:"div",name:e.name||"Label"})}let j=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_7__.forwardRefWithAs)(U),V=Object.assign(j,{});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/menu/menu-machine-glue.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/menu/menu-machine-glue.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MenuContext: () => (/* binding */ a),
/* harmony export */   useMenuMachine: () => (/* binding */ s),
/* harmony export */   useMenuMachineContext: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-on-unmount.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-unmount.js");
/* harmony import */ var _menu_machine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-machine.js */ "./node_modules/@headlessui/react/dist/components/menu/menu-machine.js");
const a=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);function p(t){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(a);if(n===null){let e=new Error(`<${t} /> is missing a parent <Menu /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(e,s),e}return n}function s({id:t,__demoMode:n=!1}){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>_menu_machine_js__WEBPACK_IMPORTED_MODULE_1__.MenuMachine.new({id:t,__demoMode:n}),[]);return (0,_hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_2__.useOnUnmount)(()=>e.dispose()),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/menu/menu-machine.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/menu/menu-machine.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* binding */ F),
/* harmony export */   ActivationTrigger: () => (/* binding */ O),
/* harmony export */   MenuMachine: () => (/* binding */ x),
/* harmony export */   MenuState: () => (/* binding */ E)
/* harmony export */ });
/* harmony import */ var _machine_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../machine.js */ "./node_modules/@headlessui/react/dist/machine.js");
/* harmony import */ var _machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../machines/stack-machine.js */ "./node_modules/@headlessui/react/dist/machines/stack-machine.js");
/* harmony import */ var _utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/calculate-active-index.js */ "./node_modules/@headlessui/react/dist/utils/calculate-active-index.js");
/* harmony import */ var _utils_focus_management_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/focus-management.js */ "./node_modules/@headlessui/react/dist/utils/focus-management.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
var h=Object.defineProperty;var y=(e,i,t)=>i in e?h(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var g=(e,i,t)=>(y(e,typeof i!="symbol"?i+"":i,t),t);var E=(t=>(t[t.Open=0]="Open",t[t.Closed=1]="Closed",t))(E||{}),O=(t=>(t[t.Pointer=0]="Pointer",t[t.Other=1]="Other",t))(O||{}),F=(r=>(r[r.OpenMenu=0]="OpenMenu",r[r.CloseMenu=1]="CloseMenu",r[r.GoToItem=2]="GoToItem",r[r.Search=3]="Search",r[r.ClearSearch=4]="ClearSearch",r[r.RegisterItems=5]="RegisterItems",r[r.UnregisterItems=6]="UnregisterItems",r[r.SetButtonElement=7]="SetButtonElement",r[r.SetItemsElement=8]="SetItemsElement",r[r.SortItems=9]="SortItems",r))(F||{});function S(e,i=t=>t){let t=e.activeItemIndex!==null?e.items[e.activeItemIndex]:null,n=(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_0__.sortByDomNode)(i(e.items.slice()),l=>l.dataRef.current.domRef.current),s=t?n.indexOf(t):null;return s===-1&&(s=null),{items:n,activeItemIndex:s}}let D={[1](e){return e.menuState===1?e:{...e,activeItemIndex:null,pendingFocus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Nothing},menuState:1}},[0](e,i){return e.menuState===0?e:{...e,__demoMode:!1,pendingFocus:i.focus,menuState:0}},[2]:(e,i)=>{var l,o,d,a,I;if(e.menuState===1)return e;let t={...e,searchQuery:"",activationTrigger:(l=i.trigger)!=null?l:1,__demoMode:!1};if(i.focus===_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Nothing)return{...t,activeItemIndex:null};if(i.focus===_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Specific)return{...t,activeItemIndex:e.items.findIndex(r=>r.id===i.id)};if(i.focus===_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Previous){let r=e.activeItemIndex;if(r!==null){let p=e.items[r].dataRef.current.domRef,m=(0,_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.calculateActiveIndex)(i,{resolveItems:()=>e.items,resolveActiveIndex:()=>e.activeItemIndex,resolveId:u=>u.id,resolveDisabled:u=>u.dataRef.current.disabled});if(m!==null){let u=e.items[m].dataRef.current.domRef;if(((o=p.current)==null?void 0:o.previousElementSibling)===u.current||((d=u.current)==null?void 0:d.previousElementSibling)===null)return{...t,activeItemIndex:m}}}}else if(i.focus===_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Next){let r=e.activeItemIndex;if(r!==null){let p=e.items[r].dataRef.current.domRef,m=(0,_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.calculateActiveIndex)(i,{resolveItems:()=>e.items,resolveActiveIndex:()=>e.activeItemIndex,resolveId:u=>u.id,resolveDisabled:u=>u.dataRef.current.disabled});if(m!==null){let u=e.items[m].dataRef.current.domRef;if(((a=p.current)==null?void 0:a.nextElementSibling)===u.current||((I=u.current)==null?void 0:I.nextElementSibling)===null)return{...t,activeItemIndex:m}}}}let n=S(e),s=(0,_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.calculateActiveIndex)(i,{resolveItems:()=>n.items,resolveActiveIndex:()=>n.activeItemIndex,resolveId:r=>r.id,resolveDisabled:r=>r.dataRef.current.disabled});return{...t,...n,activeItemIndex:s}},[3]:(e,i)=>{let n=e.searchQuery!==""?0:1,s=e.searchQuery+i.value.toLowerCase(),o=(e.activeItemIndex!==null?e.items.slice(e.activeItemIndex+n).concat(e.items.slice(0,e.activeItemIndex+n)):e.items).find(a=>{var I;return((I=a.dataRef.current.textValue)==null?void 0:I.startsWith(s))&&!a.dataRef.current.disabled}),d=o?e.items.indexOf(o):-1;return d===-1||d===e.activeItemIndex?{...e,searchQuery:s}:{...e,searchQuery:s,activeItemIndex:d,activationTrigger:1}},[4](e){return e.searchQuery===""?e:{...e,searchQuery:"",searchActiveItemIndex:null}},[5]:(e,i)=>{let t=e.items.concat(i.items.map(s=>s)),n=e.activeItemIndex;return e.pendingFocus.focus!==_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Nothing&&(n=(0,_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.calculateActiveIndex)(e.pendingFocus,{resolveItems:()=>t,resolveActiveIndex:()=>e.activeItemIndex,resolveId:s=>s.id,resolveDisabled:s=>s.dataRef.current.disabled})),{...e,items:t,activeItemIndex:n,pendingFocus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Nothing},pendingShouldSort:!0}},[6]:(e,i)=>{let t=e.items,n=[],s=new Set(i.items);for(let[l,o]of t.entries())if(s.has(o.id)&&(n.push(l),s.delete(o.id),s.size===0))break;if(n.length>0){t=t.slice();for(let l of n.reverse())t.splice(l,1)}return{...e,items:t,activationTrigger:1}},[7]:(e,i)=>e.buttonElement===i.element?e:{...e,buttonElement:i.element},[8]:(e,i)=>e.itemsElement===i.element?e:{...e,itemsElement:i.element},[9]:e=>e.pendingShouldSort?{...e,...S(e),pendingShouldSort:!1}:e};class x extends _machine_js__WEBPACK_IMPORTED_MODULE_2__.Machine{constructor(t){super(t);g(this,"actions",{registerItem:(0,_machine_js__WEBPACK_IMPORTED_MODULE_2__.batch)(()=>{let t=[],n=new Set;return[(s,l)=>{n.has(l)||(n.add(l),t.push({id:s,dataRef:l}))},()=>(n.clear(),this.send({type:5,items:t.splice(0)}))]}),unregisterItem:(0,_machine_js__WEBPACK_IMPORTED_MODULE_2__.batch)(()=>{let t=[];return[n=>t.push(n),()=>this.send({type:6,items:t.splice(0)})]})});g(this,"selectors",{activeDescendantId(t){var l;let n=t.activeItemIndex,s=t.items;return n===null||(l=s[n])==null?void 0:l.id},isActive(t,n){var o;let s=t.activeItemIndex,l=t.items;return s!==null?((o=l[s])==null?void 0:o.id)===n:!1},shouldScrollIntoView(t,n){return t.__demoMode||t.menuState!==0||t.activationTrigger===0?!1:this.isActive(t,n)}});this.on(5,()=>{this.disposables.requestAnimationFrame(()=>{this.send({type:9})})});{let n=this.state.id,s=_machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_3__.stackMachines.get(null);this.disposables.add(s.on(_machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Push,l=>{!s.selectors.isTop(l,n)&&this.state.menuState===0&&this.send({type:1})})),this.on(0,()=>s.actions.push(n)),this.on(1,()=>s.actions.pop(n))}}static new({id:t,__demoMode:n=!1}){return new x({id:t,__demoMode:n,menuState:n?0:1,buttonElement:null,itemsElement:null,items:[],searchQuery:"",activeItemIndex:null,activationTrigger:1,pendingShouldSort:!1,pendingFocus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_1__.Focus.Nothing}})}reduce(t,n){return (0,_utils_match_js__WEBPACK_IMPORTED_MODULE_4__.match)(n.type,D,t,n)}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/menu/menu.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/menu/menu.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Menu: () => (/* binding */ lo),
/* harmony export */   MenuButton: () => (/* binding */ yt),
/* harmony export */   MenuHeading: () => (/* binding */ Mt),
/* harmony export */   MenuItem: () => (/* binding */ Et),
/* harmony export */   MenuItems: () => (/* binding */ Pt),
/* harmony export */   MenuSection: () => (/* binding */ gt),
/* harmony export */   MenuSeparator: () => (/* binding */ bt)
/* harmony export */ });
/* harmony import */ var _react_aria_focus__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @react-aria/focus */ "./node_modules/@react-aria/focus/dist/useFocusRing.mjs");
/* harmony import */ var _react_aria_interactions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @react-aria/interactions */ "./node_modules/@react-aria/interactions/dist/useHover.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/use-id.js */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _hooks_use_active_press_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../hooks/use-active-press.js */ "./node_modules/@headlessui/react/dist/hooks/use-active-press.js");
/* harmony import */ var _hooks_use_did_element_move_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../hooks/use-did-element-move.js */ "./node_modules/@headlessui/react/dist/hooks/use-did-element-move.js");
/* harmony import */ var _hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../../hooks/use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _hooks_use_element_size_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../../hooks/use-element-size.js */ "./node_modules/@headlessui/react/dist/hooks/use-element-size.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_inert_others_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../hooks/use-inert-others.js */ "./node_modules/@headlessui/react/dist/hooks/use-inert-others.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../hooks/use-on-disappear.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js");
/* harmony import */ var _hooks_use_outside_click_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/use-outside-click.js */ "./node_modules/@headlessui/react/dist/hooks/use-outside-click.js");
/* harmony import */ var _hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../hooks/use-owner.js */ "./node_modules/@headlessui/react/dist/hooks/use-owner.js");
/* harmony import */ var _hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../hooks/use-quick-release.js */ "./node_modules/@headlessui/react/dist/hooks/use-quick-release.js");
/* harmony import */ var _hooks_use_resolve_button_type_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../hooks/use-resolve-button-type.js */ "./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js");
/* harmony import */ var _hooks_use_scroll_lock_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../hooks/use-scroll-lock.js */ "./node_modules/@headlessui/react/dist/hooks/use-scroll-lock.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _hooks_use_text_value_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../../hooks/use-text-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-text-value.js");
/* harmony import */ var _hooks_use_tracked_pointer_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../../hooks/use-tracked-pointer.js */ "./node_modules/@headlessui/react/dist/hooks/use-tracked-pointer.js");
/* harmony import */ var _hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../hooks/use-transition.js */ "./node_modules/@headlessui/react/dist/hooks/use-transition.js");
/* harmony import */ var _hooks_use_tree_walker_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../../hooks/use-tree-walker.js */ "./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js");
/* harmony import */ var _internal_floating_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../internal/floating.js */ "./node_modules/@headlessui/react/dist/internal/floating.js");
/* harmony import */ var _internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../internal/open-closed.js */ "./node_modules/@headlessui/react/dist/internal/open-closed.js");
/* harmony import */ var _machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../machines/stack-machine.js */ "./node_modules/@headlessui/react/dist/machines/stack-machine.js");
/* harmony import */ var _react_glue_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../react-glue.js */ "./node_modules/@headlessui/react/dist/react-glue.js");
/* harmony import */ var _utils_bugs_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../utils/bugs.js */ "./node_modules/@headlessui/react/dist/utils/bugs.js");
/* harmony import */ var _utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../utils/calculate-active-index.js */ "./node_modules/@headlessui/react/dist/utils/calculate-active-index.js");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/focus-management.js */ "./node_modules/@headlessui/react/dist/utils/focus-management.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
/* harmony import */ var _description_description_js__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../description/description.js */ "./node_modules/@headlessui/react/dist/components/description/description.js");
/* harmony import */ var _keyboard_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../keyboard.js */ "./node_modules/@headlessui/react/dist/components/keyboard.js");
/* harmony import */ var _label_label_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../label/label.js */ "./node_modules/@headlessui/react/dist/components/label/label.js");
/* harmony import */ var _portal_portal_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../portal/portal.js */ "./node_modules/@headlessui/react/dist/components/portal/portal.js");
/* harmony import */ var _menu_machine_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./menu-machine.js */ "./node_modules/@headlessui/react/dist/components/menu/menu-machine.js");
/* harmony import */ var _menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./menu-machine-glue.js */ "./node_modules/@headlessui/react/dist/components/menu/menu-machine-glue.js");
"use client";let et=react__WEBPACK_IMPORTED_MODULE_0__.Fragment;function tt(c,E){let p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{__demoMode:a=!1,...s}=c,l=(0,_menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__.useMenuMachine)({id:p,__demoMode:a}),[n,g,y]=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(l,T=>[T.menuState,T.itemsElement,T.buttonElement]),I=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(E),o=_machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_5__.stackMachines.get(null),h=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(o,(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(T=>o.selectors.isTop(T,p),[o,p]));(0,_hooks_use_outside_click_js__WEBPACK_IMPORTED_MODULE_6__.useOutsideClick)(h,[y,g],(T,u)=>{var f;l.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu}),(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.isFocusableElement)(u,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.FocusableMode.Loose)||(T.preventDefault(),(f=l.state.buttonElement)==null||f.focus())});let _=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(()=>{l.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})}),M=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:n===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,close:_}),[n,_]),i={ref:I},b=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.FloatingProvider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__.MenuContext.Provider,{value:l},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.OpenClosedProvider,{value:(0,_utils_match_js__WEBPACK_IMPORTED_MODULE_13__.match)(n,{[_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open]:_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open,[_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Closed]:_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Closed})},b({ourProps:i,theirProps:s,slot:M,defaultTag:et,name:"Menu"}))))}let ot="button";function nt(c,E){let p=(0,_menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__.useMenuMachineContext)("Menu.Button"),a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:s=`headlessui-menu-button-${a}`,disabled:l=!1,autoFocus:n=!1,...g}=c,y=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),I=(0,_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.useFloatingReferenceProps)(),o=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(E,y,(0,_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.useFloatingReference)(),(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.SetButtonElement,element:e}))),h=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{switch(e.key){case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Space:case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Enter:case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.ArrowDown:e.preventDefault(),e.stopPropagation(),p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.OpenMenu,focus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.First}});break;case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.ArrowUp:e.preventDefault(),e.stopPropagation(),p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.OpenMenu,focus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Last}});break}}),_=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{switch(e.key){case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Space:e.preventDefault();break}}),[M,i,b]=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(p,e=>[e.menuState,e.buttonElement,e.itemsElement]),T=M===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open;(0,_hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__.useQuickRelease)(T,{trigger:i,action:(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>{if(i!=null&&i.contains(e.target))return _hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__.Action.Ignore;let R=e.target.closest('[role="menuitem"]:not([data-disabled])');return _utils_dom_js__WEBPACK_IMPORTED_MODULE_17__.isHTMLElement(R)?_hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__.Action.Select(R):b!=null&&b.contains(e.target)?_hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__.Action.Ignore:_hooks_use_quick_release_js__WEBPACK_IMPORTED_MODULE_16__.Action.Close},[i,b]),close:(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu}),[]),select:(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>e.click(),[])});let u=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{var R;if(e.button===0){if((0,_utils_bugs_js__WEBPACK_IMPORTED_MODULE_18__.isDisabledReactIssue7711)(e.currentTarget))return e.preventDefault();l||(M===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open?((0,react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync)(()=>p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})),(R=y.current)==null||R.focus({preventScroll:!0})):(e.preventDefault(),p.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.OpenMenu,focus:{focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Nothing},trigger:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActivationTrigger.Pointer})))}}),{isFocusVisible:f,focusProps:v}=(0,_react_aria_focus__WEBPACK_IMPORTED_MODULE_19__.useFocusRing)({autoFocus:n}),{isHovered:S,hoverProps:O}=(0,_react_aria_interactions__WEBPACK_IMPORTED_MODULE_20__.useHover)({isDisabled:l}),{pressed:F,pressProps:U}=(0,_hooks_use_active_press_js__WEBPACK_IMPORTED_MODULE_21__.useActivePress)({disabled:l}),H=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:M===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,active:F||M===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,disabled:l,hover:S,focus:f,autofocus:n}),[M,S,f,F,l,n]),G=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.mergeProps)(I(),{ref:o,id:s,type:(0,_hooks_use_resolve_button_type_js__WEBPACK_IMPORTED_MODULE_22__.useResolveButtonType)(c,y.current),"aria-haspopup":"menu","aria-controls":b==null?void 0:b.id,"aria-expanded":M===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,disabled:l||void 0,autoFocus:n,onKeyDown:h,onKeyUp:_,onPointerDown:u},v,O,U);return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)()({ourProps:G,theirProps:g,slot:H,defaultTag:ot,name:"Menu.Button"})}let rt="div",at=_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.RenderFeatures.RenderStrategy|_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.RenderFeatures.Static;function st(c,E){let p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:a=`headlessui-menu-items-${p}`,anchor:s,portal:l=!1,modal:n=!0,transition:g=!1,...y}=c,I=(0,_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.useResolvedAnchor)(s),o=(0,_menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__.useMenuMachineContext)("Menu.Items"),[h,_]=(0,_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.useFloatingPanel)(I),M=(0,_internal_floating_js__WEBPACK_IMPORTED_MODULE_11__.useFloatingPanelProps)(),[i,b]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),T=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(E,I?h:null,(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(t=>o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.SetItemsElement,element:t})),b),[u,f]=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(o,t=>[t.menuState,t.buttonElement]),v=(0,_hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_23__.useOwnerDocument)(f),S=(0,_hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_23__.useOwnerDocument)(i);I&&(l=!0);let O=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.useOpenClosed)(),[F,U]=(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_24__.useTransition)(g,i,O!==null?(O&_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open)===_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open:u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open);(0,_hooks_use_on_disappear_js__WEBPACK_IMPORTED_MODULE_25__.useOnDisappear)(F,f,()=>{o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})});let H=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(o,t=>t.__demoMode),G=H?!1:n&&u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open;(0,_hooks_use_scroll_lock_js__WEBPACK_IMPORTED_MODULE_26__.useScrollLock)(G,S);let w=H?!1:n&&u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open;(0,_hooks_use_inert_others_js__WEBPACK_IMPORTED_MODULE_27__.useInertOthers)(w,{allowed:(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>[f,i],[f,i])});let e=u!==_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,le=(0,_hooks_use_did_element_move_js__WEBPACK_IMPORTED_MODULE_28__.useDidElementMove)(e,f)?!1:F;(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{let t=i;t&&u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open&&t!==(S==null?void 0:S.activeElement)&&t.focus({preventScroll:!0})},[u,i,S]),(0,_hooks_use_tree_walker_js__WEBPACK_IMPORTED_MODULE_29__.useTreeWalker)(u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open,{container:i,accept(t){return t.getAttribute("role")==="menuitem"?NodeFilter.FILTER_REJECT:t.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(t){t.setAttribute("role","none")}});let z=(0,_hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_30__.useDisposables)(),pe=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(t=>{var N,Y,Z;switch(z.dispose(),t.key){case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Space:if(o.state.searchQuery!=="")return t.preventDefault(),t.stopPropagation(),o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.Search,value:t.key});case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Enter:if(t.preventDefault(),t.stopPropagation(),o.state.activeItemIndex!==null){let{dataRef:ce}=o.state.items[o.state.activeItemIndex];(Y=(N=ce.current)==null?void 0:N.domRef.current)==null||Y.click()}o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu}),(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.restoreFocusIfNecessary)(o.state.buttonElement);break;case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.ArrowDown:return t.preventDefault(),t.stopPropagation(),o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Next});case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.ArrowUp:return t.preventDefault(),t.stopPropagation(),o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Previous});case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Home:case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.PageUp:return t.preventDefault(),t.stopPropagation(),o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.First});case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.End:case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.PageDown:return t.preventDefault(),t.stopPropagation(),o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Last});case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Escape:t.preventDefault(),t.stopPropagation(),(0,react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync)(()=>o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})),(Z=o.state.buttonElement)==null||Z.focus({preventScroll:!0});break;case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Tab:t.preventDefault(),t.stopPropagation(),(0,react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync)(()=>o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})),(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.focusFrom)(o.state.buttonElement,t.shiftKey?_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.Previous:_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.Focus.Next);break;default:t.key.length===1&&(o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.Search,value:t.key}),z.setTimeout(()=>o.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.ClearSearch}),350));break}}),ie=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(t=>{switch(t.key){case _keyboard_js__WEBPACK_IMPORTED_MODULE_14__.Keys.Space:t.preventDefault();break}}),ue=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({open:u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open}),[u]),de=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.mergeProps)(I?M():{},{"aria-activedescendant":(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(o,o.selectors.activeDescendantId),"aria-labelledby":(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(o,t=>{var N;return(N=t.buttonElement)==null?void 0:N.id}),id:a,onKeyDown:pe,onKeyUp:ie,role:"menu",tabIndex:u===_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.MenuState.Open?0:void 0,ref:T,style:{...y.style,..._,"--button-width":(0,_hooks_use_element_size_js__WEBPACK_IMPORTED_MODULE_31__.useElementSize)(f,!0).width},...(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_24__.transitionDataAttributes)(U)}),me=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_portal_portal_js__WEBPACK_IMPORTED_MODULE_32__.Portal,{enabled:l?c.static||F:!1,ownerDocument:v},me({ourProps:de,theirProps:y,slot:ue,defaultTag:rt,features:at,visible:le,name:"Menu.Items"}))}let lt=react__WEBPACK_IMPORTED_MODULE_0__.Fragment;function pt(c,E){let p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:a=`headlessui-menu-item-${p}`,disabled:s=!1,...l}=c,n=(0,_menu_machine_glue_js__WEBPACK_IMPORTED_MODULE_2__.useMenuMachineContext)("Menu.Item"),g=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(n,e=>n.selectors.isActive(e,a)),y=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),I=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.useSyncRefs)(E,y),o=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_3__.useSlice)(n,e=>n.selectors.shouldScrollIntoView(e,a));(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_33__.useIsoMorphicEffect)(()=>{if(o)return (0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_34__.disposables)().requestAnimationFrame(()=>{var e,R;(R=(e=y.current)==null?void 0:e.scrollIntoView)==null||R.call(e,{block:"nearest"})})},[o,y]);let h=(0,_hooks_use_text_value_js__WEBPACK_IMPORTED_MODULE_35__.useTextValue)(y),_=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({disabled:s,domRef:y,get textValue(){return h()}});(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_33__.useIsoMorphicEffect)(()=>{_.current.disabled=s},[_,s]),(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_33__.useIsoMorphicEffect)(()=>(n.actions.registerItem(a,_),()=>n.actions.unregisterItem(a)),[_,a]);let M=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(()=>{n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu})}),i=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{if(s)return e.preventDefault();n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.CloseMenu}),(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_8__.restoreFocusIfNecessary)(n.state.buttonElement)}),b=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(()=>{if(s)return n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Nothing});n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Specific,id:a})}),T=(0,_hooks_use_tracked_pointer_js__WEBPACK_IMPORTED_MODULE_36__.useTrackedPointer)(),u=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{T.update(e),!s&&(g||n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Specific,id:a,trigger:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActivationTrigger.Pointer}))}),f=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{T.wasMoved(e)&&(s||g||n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Specific,id:a,trigger:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActivationTrigger.Pointer}))}),v=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_9__.useEvent)(e=>{T.wasMoved(e)&&(s||g&&n.send({type:_menu_machine_js__WEBPACK_IMPORTED_MODULE_7__.ActionTypes.GoToItem,focus:_utils_calculate_active_index_js__WEBPACK_IMPORTED_MODULE_15__.Focus.Nothing}))}),[S,O]=(0,_label_label_js__WEBPACK_IMPORTED_MODULE_37__.useLabels)(),[F,U]=(0,_description_description_js__WEBPACK_IMPORTED_MODULE_38__.useDescriptions)(),H=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({active:g,focus:g,disabled:s,close:M}),[g,s,M]),G={id:a,ref:I,role:"menuitem",tabIndex:s===!0?void 0:-1,"aria-disabled":s===!0?!0:void 0,"aria-labelledby":S,"aria-describedby":F,disabled:void 0,onClick:i,onFocus:b,onPointerEnter:u,onMouseEnter:u,onPointerMove:f,onMouseMove:f,onPointerLeave:v,onMouseLeave:v},w=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(O,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(U,null,w({ourProps:G,theirProps:l,slot:H,defaultTag:lt,name:"Menu.Item"})))}let it="div";function ut(c,E){let[p,a]=(0,_label_label_js__WEBPACK_IMPORTED_MODULE_37__.useLabels)(),s=c,l={ref:E,"aria-labelledby":p,role:"group"},n=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(a,null,n({ourProps:l,theirProps:s,slot:{},defaultTag:it,name:"Menu.Section"}))}let dt="header";function mt(c,E){let p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),{id:a=`headlessui-menu-heading-${p}`,...s}=c,l=(0,_label_label_js__WEBPACK_IMPORTED_MODULE_37__.useLabelContext)();(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_33__.useIsoMorphicEffect)(()=>l.register(a),[a,l.register]);let n={id:a,ref:E,role:"presentation",...l.props};return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)()({ourProps:n,theirProps:s,slot:{},defaultTag:dt,name:"Menu.Heading"})}let ct="div";function Tt(c,E){let p=c,a={ref:E,role:"separator"};return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.useRender)()({ourProps:a,theirProps:p,slot:{},defaultTag:ct,name:"Menu.Separator"})}let ft=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(tt),yt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(nt),Pt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(st),Et=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(pt),gt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(ut),Mt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(mt),bt=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_10__.forwardRefWithAs)(Tt),lo=Object.assign(ft,{Button:yt,Items:Pt,Item:Et,Section:gt,Heading:Mt,Separator:bt});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/portal/portal.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/portal/portal.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Portal: () => (/* binding */ ne),
/* harmony export */   PortalGroup: () => (/* binding */ q),
/* harmony export */   useNestedPortals: () => (/* binding */ oe)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-on-unmount.js */ "./node_modules/@headlessui/react/dist/hooks/use-on-unmount.js");
/* harmony import */ var _hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/use-owner.js */ "./node_modules/@headlessui/react/dist/hooks/use-owner.js");
/* harmony import */ var _hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/use-server-handoff-complete.js */ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _internal_portal_force_root_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../internal/portal-force-root.js */ "./node_modules/@headlessui/react/dist/internal/portal-force-root.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";function I(e){let l=(0,_internal_portal_force_root_js__WEBPACK_IMPORTED_MODULE_2__.usePortalRoot)(),o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(H),[r,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(()=>{var i;if(!l&&o!==null)return(i=o.current)!=null?i:null;if(_utils_env_js__WEBPACK_IMPORTED_MODULE_3__.env.isServer)return null;let t=e==null?void 0:e.getElementById("headlessui-portal-root");if(t)return t;if(e===null)return null;let a=e.createElement("div");return a.setAttribute("id","headlessui-portal-root"),e.body.appendChild(a)});return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{r!==null&&(e!=null&&e.body.contains(r)||e==null||e.body.appendChild(r))},[r,e]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{l||o!==null&&u(o.current)},[o,u,l]),r}let M=react__WEBPACK_IMPORTED_MODULE_0__.Fragment,D=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.forwardRefWithAs)(function(l,o){let{ownerDocument:r=null,...u}=l,t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),a=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_5__.useSyncRefs)((0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_5__.optionalRef)(s=>{t.current=s}),o),i=(0,_hooks_use_owner_js__WEBPACK_IMPORTED_MODULE_6__.useOwnerDocument)(t),f=r!=null?r:i,p=I(f),[n]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(()=>{var s;return _utils_env_js__WEBPACK_IMPORTED_MODULE_3__.env.isServer?null:(s=f==null?void 0:f.createElement("div"))!=null?s:null}),P=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(g),O=(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_7__.useServerHandoffComplete)();(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{!p||!n||p.contains(n)||(n.setAttribute("data-headlessui-portal",""),p.appendChild(n))},[p,n]),(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{if(n&&P)return P.register(n)},[P,n]),(0,_hooks_use_on_unmount_js__WEBPACK_IMPORTED_MODULE_9__.useOnUnmount)(()=>{var s;!p||!n||(_utils_dom_js__WEBPACK_IMPORTED_MODULE_10__.isNode(n)&&p.contains(n)&&p.removeChild(n),p.childNodes.length<=0&&((s=p.parentElement)==null||s.removeChild(p)))});let b=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.useRender)();return O?!p||!n?null:(0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)(b({ourProps:{ref:a},theirProps:u,slot:{},defaultTag:M,name:"Portal"}),n):null});function J(e,l){let o=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_5__.useSyncRefs)(l),{enabled:r=!0,ownerDocument:u,...t}=e,a=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.useRender)();return r?react__WEBPACK_IMPORTED_MODULE_0__.createElement(D,{...t,ownerDocument:u,ref:o}):a({ourProps:{ref:o},theirProps:t,slot:{},defaultTag:M,name:"Portal"})}let X=react__WEBPACK_IMPORTED_MODULE_0__.Fragment,H=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);function k(e,l){let{target:o,...r}=e,t={ref:(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_5__.useSyncRefs)(l)},a=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(H.Provider,{value:o},a({ourProps:t,theirProps:r,defaultTag:X,name:"Popover.Group"}))}let g=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);function oe(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(g),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),o=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_11__.useEvent)(t=>(l.current.push(t),e&&e.register(t),()=>r(t))),r=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_11__.useEvent)(t=>{let a=l.current.indexOf(t);a!==-1&&l.current.splice(a,1),e&&e.unregister(t)}),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({register:o,unregister:r,portals:l}),[o,r,l]);return[l,(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>function({children:a}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(g.Provider,{value:u},a)},[u])]}let B=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.forwardRefWithAs)(J),q=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_4__.forwardRefWithAs)(k),ne=Object.assign(B,{Group:q});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/components/transition/transition.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/components/transition/transition.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transition: () => (/* binding */ ze),
/* harmony export */   TransitionChild: () => (/* binding */ Fe)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-is-mounted.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _hooks_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
/* harmony import */ var _hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/use-server-handoff-complete.js */ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");
/* harmony import */ var _hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/use-sync-refs.js */ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js");
/* harmony import */ var _hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/use-transition.js */ "./node_modules/@headlessui/react/dist/hooks/use-transition.js");
/* harmony import */ var _internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../internal/open-closed.js */ "./node_modules/@headlessui/react/dist/internal/open-closed.js");
/* harmony import */ var _utils_class_names_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/class-names.js */ "./node_modules/@headlessui/react/dist/utils/class-names.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
"use client";function ue(e){var t;return!!(e.enter||e.enterFrom||e.enterTo||e.leave||e.leaveFrom||e.leaveTo)||((t=e.as)!=null?t:de)!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment||react__WEBPACK_IMPORTED_MODULE_0__.Children.count(e.children)===1}let w=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);w.displayName="TransitionContext";var _e=(n=>(n.Visible="visible",n.Hidden="hidden",n))(_e||{});function De(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(w);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}function He(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(M);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}let M=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);M.displayName="NestingContext";function U(e){return"children"in e?U(e.children):e.current.filter(({el:t})=>t.current!==null).filter(({state:t})=>t==="visible").length>0}function Te(e,t){let n=(0,_hooks_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(e),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),S=(0,_hooks_use_is_mounted_js__WEBPACK_IMPORTED_MODULE_2__.useIsMounted)(),R=(0,_hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_3__.useDisposables)(),d=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((o,i=_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden)=>{let a=l.current.findIndex(({el:s})=>s===o);a!==-1&&((0,_utils_match_js__WEBPACK_IMPORTED_MODULE_6__.match)(i,{[_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount](){l.current.splice(a,1)},[_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden](){l.current[a].state="hidden"}}),R.microTask(()=>{var s;!U(l)&&S.current&&((s=n.current)==null||s.call(n))}))}),y=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(o=>{let i=l.current.find(({el:a})=>a===o);return i?i.state!=="visible"&&(i.state="visible"):l.current.push({el:o,state:"visible"}),()=>d(o,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount)}),C=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),p=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(Promise.resolve()),h=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({enter:[],leave:[]}),g=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((o,i,a)=>{C.current.splice(0),t&&(t.chains.current[i]=t.chains.current[i].filter(([s])=>s!==o)),t==null||t.chains.current[i].push([o,new Promise(s=>{C.current.push(s)})]),t==null||t.chains.current[i].push([o,new Promise(s=>{Promise.all(h.current[i].map(([r,f])=>f)).then(()=>s())})]),i==="enter"?p.current=p.current.then(()=>t==null?void 0:t.wait.current).then(()=>a(i)):a(i)}),v=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)((o,i,a)=>{Promise.all(h.current[i].splice(0).map(([s,r])=>r)).then(()=>{var s;(s=C.current.shift())==null||s()}).then(()=>a(i))});return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({children:l,register:y,unregister:d,onStart:g,onStop:v,wait:p,chains:h}),[y,d,l,g,v,h,p])}let de=react__WEBPACK_IMPORTED_MODULE_0__.Fragment,fe=_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderFeatures.RenderStrategy;function Ae(e,t){var ee,te;let{transition:n=!0,beforeEnter:l,afterEnter:S,beforeLeave:R,afterLeave:d,enter:y,enterFrom:C,enterTo:p,entered:h,leave:g,leaveFrom:v,leaveTo:o,...i}=e,[a,s]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),f=ue(e),j=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__.useSyncRefs)(...f?[r,t,s]:t===null?[]:[t]),H=(ee=i.unmount)==null||ee?_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Unmount:_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden,{show:u,appear:z,initial:K}=De(),[m,G]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(u?"visible":"hidden"),Q=He(),{register:A,unregister:I}=Q;(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>A(r),[A,r]),(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{if(H===_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.RenderStrategy.Hidden&&r.current){if(u&&m!=="visible"){G("visible");return}return (0,_utils_match_js__WEBPACK_IMPORTED_MODULE_6__.match)(m,{["hidden"]:()=>I(r),["visible"]:()=>A(r)})}},[m,r,A,I,u,H]);let B=(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__.useServerHandoffComplete)();(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{if(f&&B&&m==="visible"&&r.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[r,m,B,f]);let ce=K&&!z,Y=z&&u&&K,W=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),L=Te(()=>{W.current||(G("hidden"),I(r))},Q),Z=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(k=>{W.current=!0;let F=k?"enter":"leave";L.onStart(r,F,_=>{_==="enter"?l==null||l():_==="leave"&&(R==null||R())})}),$=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(k=>{let F=k?"enter":"leave";W.current=!1,L.onStop(r,F,_=>{_==="enter"?S==null||S():_==="leave"&&(d==null||d())}),F==="leave"&&!U(L)&&(G("hidden"),I(r))});(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{f&&n||(Z(u),$(u))},[u,f,n]);let pe=(()=>!(!n||!f||!B||ce))(),[,T]=(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__.useTransition)(pe,a,u,{start:Z,end:$}),Ce=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.compact)({ref:j,className:((te=(0,_utils_class_names_js__WEBPACK_IMPORTED_MODULE_11__.classNames)(i.className,Y&&y,Y&&C,T.enter&&y,T.enter&&T.closed&&C,T.enter&&!T.closed&&p,T.leave&&g,T.leave&&!T.closed&&v,T.leave&&T.closed&&o,!T.transition&&u&&h))==null?void 0:te.trim())||void 0,...(0,_hooks_use_transition_js__WEBPACK_IMPORTED_MODULE_10__.transitionDataAttributes)(T)}),N=0;m==="visible"&&(N|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open),m==="hidden"&&(N|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Closed),u&&m==="hidden"&&(N|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Opening),!u&&m==="visible"&&(N|=_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Closing);let he=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(M.Provider,{value:L},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.OpenClosedProvider,{value:N},he({ourProps:Ce,theirProps:i,defaultTag:de,features:fe,visible:m==="visible",name:"Transition.Child"})))}function Ie(e,t){let{show:n,appear:l=!1,unmount:S=!0,...R}=e,d=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),y=ue(e),C=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_7__.useSyncRefs)(...y?[d,t]:t===null?[]:[t]);(0,_hooks_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_9__.useServerHandoffComplete)();let p=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.useOpenClosed)();if(n===void 0&&p!==null&&(n=(p&_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open)===_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.State.Open),n===void 0)throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[h,g]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(n?"visible":"hidden"),v=Te(()=>{n||g("hidden")}),[o,i]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!0),a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([n]);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{o!==!1&&a.current[a.current.length-1]!==n&&(a.current.push(n),i(!1))},[a,n]);let s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({show:n,appear:l,initial:o}),[n,l,o]);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_8__.useIsoMorphicEffect)(()=>{n?g("visible"):!U(v)&&d.current!==null&&g("hidden")},[n,v]);let r={unmount:S},f=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(()=>{var u;o&&i(!1),(u=e.beforeEnter)==null||u.call(e)}),j=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_4__.useEvent)(()=>{var u;o&&i(!1),(u=e.beforeLeave)==null||u.call(e)}),H=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.useRender)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(M.Provider,{value:v},react__WEBPACK_IMPORTED_MODULE_0__.createElement(w.Provider,{value:s},H({ourProps:{...r,as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,children:react__WEBPACK_IMPORTED_MODULE_0__.createElement(me,{ref:C,...r,...R,beforeEnter:f,beforeLeave:j})},theirProps:{},defaultTag:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,features:fe,visible:h==="visible",name:"Transition"})))}function Le(e,t){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(w)!==null,l=(0,_internal_open_closed_js__WEBPACK_IMPORTED_MODULE_12__.useOpenClosed)()!==null;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,!n&&l?react__WEBPACK_IMPORTED_MODULE_0__.createElement(X,{ref:t,...e}):react__WEBPACK_IMPORTED_MODULE_0__.createElement(me,{ref:t,...e}))}let X=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(Ie),me=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(Ae),Fe=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_5__.forwardRefWithAs)(Le),ze=Object.assign(X,{Child:Fe,Root:X});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/document-overflow/adjust-scrollbar-padding.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/document-overflow/adjust-scrollbar-padding.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustScrollbarPadding: () => (/* binding */ d)
/* harmony export */ });
function d(){let r;return{before({doc:e}){var l;let o=e.documentElement,t=(l=e.defaultView)!=null?l:window;r=Math.max(0,t.innerWidth-o.clientWidth)},after({doc:e,d:o}){let t=e.documentElement,l=Math.max(0,t.clientWidth-t.offsetWidth),n=Math.max(0,r-l);o.style(t,"paddingRight",`${n}px`)}}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/document-overflow/handle-ios-locking.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/document-overflow/handle-ios-locking.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleIOSLocking: () => (/* binding */ w)
/* harmony export */ });
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/platform.js */ "./node_modules/@headlessui/react/dist/utils/platform.js");
function w(){return (0,_utils_platform_js__WEBPACK_IMPORTED_MODULE_0__.isIOS)()?{before({doc:n,d:l,meta:f}){function i(a){return f.containers.flatMap(r=>r()).some(r=>r.contains(a))}l.microTask(()=>{var c;if(window.getComputedStyle(n.documentElement).scrollBehavior!=="auto"){let t=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables)();t.style(n.documentElement,"scrollBehavior","auto"),l.add(()=>l.microTask(()=>t.dispose()))}let a=(c=window.scrollY)!=null?c:window.pageYOffset,r=null;l.addEventListener(n,"click",t=>{if(_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLorSVGElement(t.target))try{let e=t.target.closest("a");if(!e)return;let{hash:m}=new URL(e.href),s=n.querySelector(m);_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLorSVGElement(s)&&!i(s)&&(r=s)}catch{}},!0),l.addEventListener(n,"touchstart",t=>{if(_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLorSVGElement(t.target)&&_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.hasInlineStyle(t.target))if(i(t.target)){let e=t.target;for(;e.parentElement&&i(e.parentElement);)e=e.parentElement;l.style(e,"overscrollBehavior","contain")}else l.style(t.target,"touchAction","none")}),l.addEventListener(n,"touchmove",t=>{if(_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLorSVGElement(t.target)){if(_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLInputElement(t.target))return;if(i(t.target)){let e=t.target;for(;e.parentElement&&e.dataset.headlessuiPortal!==""&&!(e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth);)e=e.parentElement;e.dataset.headlessuiPortal===""&&t.preventDefault()}else t.preventDefault()}},{passive:!1}),l.add(()=>{var e;let t=(e=window.scrollY)!=null?e:window.pageYOffset;a!==t&&window.scrollTo(0,a),r&&r.isConnected&&(r.scrollIntoView({block:"nearest"}),r=null)})})}}:{}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/document-overflow/overflow-store.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/document-overflow/overflow-store.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   overflows: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/store.js */ "./node_modules/@headlessui/react/dist/utils/store.js");
/* harmony import */ var _adjust_scrollbar_padding_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adjust-scrollbar-padding.js */ "./node_modules/@headlessui/react/dist/hooks/document-overflow/adjust-scrollbar-padding.js");
/* harmony import */ var _handle_ios_locking_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./handle-ios-locking.js */ "./node_modules/@headlessui/react/dist/hooks/document-overflow/handle-ios-locking.js");
/* harmony import */ var _prevent_scroll_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prevent-scroll.js */ "./node_modules/@headlessui/react/dist/hooks/document-overflow/prevent-scroll.js");
function m(e){let n={};for(let t of e)Object.assign(n,t(n));return n}let a=(0,_utils_store_js__WEBPACK_IMPORTED_MODULE_0__.createStore)(()=>new Map,{PUSH(e,n){var o;let t=(o=this.get(e))!=null?o:{doc:e,count:0,d:(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables)(),meta:new Set};return t.count++,t.meta.add(n),this.set(e,t),this},POP(e,n){let t=this.get(e);return t&&(t.count--,t.meta.delete(n)),this},SCROLL_PREVENT({doc:e,d:n,meta:t}){let o={doc:e,d:n,meta:m(t)},c=[(0,_handle_ios_locking_js__WEBPACK_IMPORTED_MODULE_2__.handleIOSLocking)(),(0,_adjust_scrollbar_padding_js__WEBPACK_IMPORTED_MODULE_3__.adjustScrollbarPadding)(),(0,_prevent_scroll_js__WEBPACK_IMPORTED_MODULE_4__.preventScroll)()];c.forEach(({before:r})=>r==null?void 0:r(o)),c.forEach(({after:r})=>r==null?void 0:r(o))},SCROLL_ALLOW({d:e}){e.dispose()},TEARDOWN({doc:e}){this.delete(e)}});a.subscribe(()=>{let e=a.getSnapshot(),n=new Map;for(let[t]of e)n.set(t,t.documentElement.style.overflow);for(let t of e.values()){let o=n.get(t.doc)==="hidden",c=t.count!==0;(c&&!o||!c&&o)&&a.dispatch(t.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",t),t.count===0&&a.dispatch("TEARDOWN",t)}});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/document-overflow/prevent-scroll.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/document-overflow/prevent-scroll.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   preventScroll: () => (/* binding */ r)
/* harmony export */ });
function r(){return{before({doc:e,d:o}){o.style(e.documentElement,"overflow","hidden")}}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/document-overflow/use-document-overflow.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/document-overflow/use-document-overflow.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDocumentOverflowLockedEffect: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var _hooks_use_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/use-store.js */ "./node_modules/@headlessui/react/dist/hooks/use-store.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _overflow_store_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./overflow-store.js */ "./node_modules/@headlessui/react/dist/hooks/document-overflow/overflow-store.js");
function a(r,e,n=()=>({containers:[]})){let f=(0,_hooks_use_store_js__WEBPACK_IMPORTED_MODULE_0__.useStore)(_overflow_store_js__WEBPACK_IMPORTED_MODULE_1__.overflows),o=e?f.get(e):void 0,i=o?o.count>0:!1;return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_2__.useIsoMorphicEffect)(()=>{if(!(!e||!r))return _overflow_store_js__WEBPACK_IMPORTED_MODULE_1__.overflows.dispatch("PUSH",e,n),()=>_overflow_store_js__WEBPACK_IMPORTED_MODULE_1__.overflows.dispatch("POP",e,n)},[r,e]),i}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-active-press.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-active-press.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useActivePress: () => (/* binding */ w)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_owner_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
/* harmony import */ var _use_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
function E(e){let t=e.width/2,n=e.height/2;return{top:e.clientY-n,right:e.clientX+t,bottom:e.clientY+n,left:e.clientX-t}}function P(e,t){return!(!e||!t||e.right<t.left||e.left>t.right||e.bottom<t.top||e.top>t.bottom)}function w({disabled:e=!1}={}){let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),[n,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),r=(0,_use_disposables_js__WEBPACK_IMPORTED_MODULE_1__.useDisposables)(),o=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(()=>{t.current=null,l(!1),r.dispose()}),f=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(s=>{if(r.dispose(),t.current===null){t.current=s.currentTarget,l(!0);{let i=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_3__.getOwnerDocument)(s.currentTarget);r.addEventListener(i,"pointerup",o,!1),r.addEventListener(i,"pointermove",c=>{if(t.current){let p=E(c);l(P(p,t.current.getBoundingClientRect()))}},!1),r.addEventListener(i,"pointercancel",o,!1)}}});return{pressed:n,pressProps:e?{}:{onPointerDown:f,onPointerUp:o,onClick:o}}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-did-element-move.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-did-element-move.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDidElementMove: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function s(n,t){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({left:0,top:0});if((0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{if(!t)return;let r=t.getBoundingClientRect();r&&(e.current=r)},[n,t]),t==null||!n||t===document.activeElement)return!1;let o=t.getBoundingClientRect();return o.top!==e.current.top||o.left!==e.current.left}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-disposables.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDisposables: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
function p(){let[e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>()=>e.dispose(),[e]),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-document-event.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-document-event.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDocumentEvent: () => (/* binding */ i)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
function i(t,e,o,n){let u=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(o);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{if(!t)return;function r(m){u.current(m)}return document.addEventListener(e,r,n),()=>document.removeEventListener(e,r,n)},[t,e,n])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-element-size.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-element-size.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useElementSize: () => (/* binding */ d)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function f(e){if(e===null)return{width:0,height:0};let{width:t,height:r}=e.getBoundingClientRect();return{width:t,height:r}}function d(e,t=!1){let[r,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(()=>({}),{}),i=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>f(e),[e,r]);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{if(!e)return;let n=new ResizeObserver(u);return n.observe(e),()=>{n.disconnect()}},[e]),t?{width:`${i.width}px`,height:`${i.height}px`}:i}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-escape.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-escape.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEscape: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var _components_keyboard_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/keyboard.js */ "./node_modules/@headlessui/react/dist/components/keyboard.js");
/* harmony import */ var _use_event_listener_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event-listener.js */ "./node_modules/@headlessui/react/dist/hooks/use-event-listener.js");
/* harmony import */ var _use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-is-top-layer.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js");
function a(o,r=typeof document!="undefined"?document.defaultView:null,t){let n=(0,_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__.useIsTopLayer)(o,"escape");(0,_use_event_listener_js__WEBPACK_IMPORTED_MODULE_1__.useEventListener)(r,"keydown",e=>{n&&(e.defaultPrevented||e.key===_components_keyboard_js__WEBPACK_IMPORTED_MODULE_2__.Keys.Escape&&t(e))})}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-event-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-event-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEventListener: () => (/* binding */ E)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
function E(n,e,a,t){let i=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(a);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n=n!=null?n:window;function r(o){i.current(o)}return n.addEventListener(e,r,t),()=>n.removeEventListener(e,r,t)},[n,e,t])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-event.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-event.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEvent: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
let o=function(t){let e=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(t);return react__WEBPACK_IMPORTED_MODULE_0__.useCallback((...r)=>e.current(...r),[e])};


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-flags.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-flags.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFlags: () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
function c(u=0){let[t,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(u),g=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(e),[t]),s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a|e),[t]),m=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>(t&e)===e,[t]),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a&~e),[l]),F=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>l(a=>a^e),[l]);return{flags:t,setFlag:g,addFlag:s,hasFlag:m,removeFlag:n,toggleFlag:F}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-inert-others.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-inert-others.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInertOthers: () => (/* binding */ y)
/* harmony export */ });
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_owner_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
/* harmony import */ var _use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-is-top-layer.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
let f=new Map,u=new Map;function h(t){var e;let r=(e=u.get(t))!=null?e:0;return u.set(t,r+1),r!==0?()=>m(t):(f.set(t,{"aria-hidden":t.getAttribute("aria-hidden"),inert:t.inert}),t.setAttribute("aria-hidden","true"),t.inert=!0,()=>m(t))}function m(t){var i;let r=(i=u.get(t))!=null?i:1;if(r===1?u.delete(t):u.set(t,r-1),r!==1)return;let e=f.get(t);e&&(e["aria-hidden"]===null?t.removeAttribute("aria-hidden"):t.setAttribute("aria-hidden",e["aria-hidden"]),t.inert=e.inert,f.delete(t))}function y(t,{allowed:r,disallowed:e}={}){let i=(0,_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__.useIsTopLayer)(t,"inert-others");(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{var d,c;if(!i)return;let a=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_2__.disposables)();for(let n of(d=e==null?void 0:e())!=null?d:[])n&&a.add(h(n));let s=(c=r==null?void 0:r())!=null?c:[];for(let n of s){if(!n)continue;let l=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_3__.getOwnerDocument)(n);if(!l)continue;let o=n.parentElement;for(;o&&o!==l.body;){for(let p of o.children)s.some(E=>p.contains(E))||a.add(h(p));o=o.parentElement}}return a.dispose},[i,r,e])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsMounted: () => (/* binding */ f)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function f(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>(e.current=!0,()=>{e.current=!1}),[]),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsTopLayer: () => (/* binding */ I)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../machines/stack-machine.js */ "./node_modules/@headlessui/react/dist/machines/stack-machine.js");
/* harmony import */ var _react_glue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../react-glue.js */ "./node_modules/@headlessui/react/dist/react-glue.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function I(o,s){let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useId)(),r=_machines_stack_machine_js__WEBPACK_IMPORTED_MODULE_1__.stackMachines.get(s),[i,c]=(0,_react_glue_js__WEBPACK_IMPORTED_MODULE_2__.useSlice)(r,(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>[r.selectors.isTop(e,t),r.selectors.inStack(e,t)],[r,t]));return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__.useIsoMorphicEffect)(()=>{if(o)return r.actions.push(t),()=>r.actions.pop(t)},[r,o,t]),o?c?i:!0:!1}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-is-touch-device.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-is-touch-device.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsTouchDevice: () => (/* binding */ f)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function f(){var t;let[e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(()=>typeof window!="undefined"&&typeof window.matchMedia=="function"?window.matchMedia("(pointer: coarse)"):null),[o,c]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((t=e==null?void 0:e.matches)!=null?t:!1);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{if(!e)return;function n(r){c(r.matches)}return e.addEventListener("change",n),()=>e.removeEventListener("change",n)},[e]),o}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsoMorphicEffect: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
let n=(e,t)=>{_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isServer?(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(e,t):(0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(e,t)};


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-latest-value.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLatestValue: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function s(e){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(e);return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{r.current=e},[e]),r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-on-disappear.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnDisappear: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
function p(s,n,o){let i=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(t=>{let e=t.getBoundingClientRect();e.x===0&&e.y===0&&e.width===0&&e.height===0&&o()});(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{if(!s)return;let t=n===null?null:_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement(n)?n:n.current;if(!t)return;let e=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_3__.disposables)();if(typeof ResizeObserver!="undefined"){let r=new ResizeObserver(()=>i.current(t));r.observe(t),e.add(()=>r.disconnect())}if(typeof IntersectionObserver!="undefined"){let r=new IntersectionObserver(()=>i.current(t));r.observe(t),e.add(()=>r.disconnect())}return()=>e.dispose()},[n,i,s])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-on-unmount.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-on-unmount.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnUnmount: () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_micro_task_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/micro-task.js */ "./node_modules/@headlessui/react/dist/utils/micro-task.js");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
function c(t){let r=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(t),e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(e.current=!1,()=>{e.current=!0,(0,_utils_micro_task_js__WEBPACK_IMPORTED_MODULE_2__.microTask)(()=>{e.current&&r()})}),[r])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-outside-click.js":
/*!************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-outside-click.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOutsideClick: () => (/* binding */ k)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_focus_management_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/focus-management.js */ "./node_modules/@headlessui/react/dist/utils/focus-management.js");
/* harmony import */ var _utils_platform_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/platform.js */ "./node_modules/@headlessui/react/dist/utils/platform.js");
/* harmony import */ var _use_document_event_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-document-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-document-event.js");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
/* harmony import */ var _use_window_event_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./use-window-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-window-event.js");
const C=30;function k(o,f,h){let m=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(h),s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function(e,c){if(e.defaultPrevented)return;let r=c(e);if(r===null||!r.getRootNode().contains(r)||!r.isConnected)return;let M=function u(n){return typeof n=="function"?u(n()):Array.isArray(n)||n instanceof Set?n:[n]}(f);for(let u of M)if(u!==null&&(u.contains(r)||e.composed&&e.composedPath().includes(u)))return;return!(0,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_2__.isFocusableElement)(r,_utils_focus_management_js__WEBPACK_IMPORTED_MODULE_2__.FocusableMode.Loose)&&r.tabIndex!==-1&&e.preventDefault(),m.current(e,r)},[m,f]),i=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_3__.useDocumentEvent)(o,"pointerdown",t=>{var e,c;(0,_utils_platform_js__WEBPACK_IMPORTED_MODULE_4__.isMobile)()||(i.current=((c=(e=t.composedPath)==null?void 0:e.call(t))==null?void 0:c[0])||t.target)},!0),(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_3__.useDocumentEvent)(o,"pointerup",t=>{if((0,_utils_platform_js__WEBPACK_IMPORTED_MODULE_4__.isMobile)()||!i.current)return;let e=i.current;return i.current=null,s(t,()=>e)},!0);let l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({x:0,y:0});(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_3__.useDocumentEvent)(o,"touchstart",t=>{l.current.x=t.touches[0].clientX,l.current.y=t.touches[0].clientY},!0),(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_3__.useDocumentEvent)(o,"touchend",t=>{let e={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY};if(!(Math.abs(e.x-l.current.x)>=C||Math.abs(e.y-l.current.y)>=C))return s(t,()=>_utils_dom_js__WEBPACK_IMPORTED_MODULE_5__.isHTMLorSVGElement(t.target)?t.target:null)},!0),(0,_use_window_event_js__WEBPACK_IMPORTED_MODULE_6__.useWindowEvent)(o,"blur",t=>s(t,()=>_utils_dom_js__WEBPACK_IMPORTED_MODULE_5__.isHTMLIframeElement(window.document.activeElement)?window.document.activeElement:null),!0)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-owner.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-owner.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOwnerDocument: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_owner_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
function n(...e){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_1__.getOwnerDocument)(...e),[...e])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-quick-release.js":
/*!************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-quick-release.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ g),
/* harmony export */   useQuickRelease: () => (/* binding */ k)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _use_document_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-document-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-document-event.js");
var m=(e=>(e[e.Ignore=0]="Ignore",e[e.Select=1]="Select",e[e.Close=2]="Close",e))(m||{});const g={Ignore:{kind:0},Select:r=>({kind:1,target:r}),Close:{kind:2}},E=200;function k(r,{trigger:n,action:s,close:e,select:a}){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_1__.useDocumentEvent)(r&&n!==null,"pointerdown",t=>{_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isNode(t==null?void 0:t.target)&&n!=null&&n.contains(t.target)&&(o.current=new Date)}),(0,_use_document_event_js__WEBPACK_IMPORTED_MODULE_1__.useDocumentEvent)(r&&n!==null,"pointerup",t=>{if(o.current===null||!_utils_dom_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLorSVGElement(t.target))return;let i=s(t),u=new Date().getTime()-o.current.getTime();switch(o.current=null,i.kind){case 0:return;case 1:{u>E&&(a(i.target),e());break}case 2:{e();break}}},{capture:!0})}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useResolveButtonType: () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
function e(t,u){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>{var n;if(t.type)return t.type;let r=(n=t.as)!=null?n:"button";if(typeof r=="string"&&r.toLowerCase()==="button"||(u==null?void 0:u.tagName)==="BUTTON"&&!u.hasAttribute("type"))return"button"},[t.type,t.as,u])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-root-containers.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-root-containers.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MainTreeProvider: () => (/* binding */ P),
/* harmony export */   useMainTreeNode: () => (/* binding */ y),
/* harmony export */   useRootContainers: () => (/* binding */ H)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _internal_hidden_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../internal/hidden.js */ "./node_modules/@headlessui/react/dist/internal/hidden.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _utils_owner_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _use_owner_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-owner.js */ "./node_modules/@headlessui/react/dist/hooks/use-owner.js");
function H({defaultContainers:r=[],portals:n,mainTreeNode:o}={}){let l=(0,_use_owner_js__WEBPACK_IMPORTED_MODULE_1__.useOwnerDocument)(o),u=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(()=>{var i,c;let t=[];for(let e of r)e!==null&&(_utils_dom_js__WEBPACK_IMPORTED_MODULE_3__.isElement(e)?t.push(e):"current"in e&&_utils_dom_js__WEBPACK_IMPORTED_MODULE_3__.isElement(e.current)&&t.push(e.current));if(n!=null&&n.current)for(let e of n.current)t.push(e);for(let e of(i=l==null?void 0:l.querySelectorAll("html > *, body > *"))!=null?i:[])e!==document.body&&e!==document.head&&_utils_dom_js__WEBPACK_IMPORTED_MODULE_3__.isElement(e)&&e.id!=="headlessui-portal-root"&&(o&&(e.contains(o)||e.contains((c=o==null?void 0:o.getRootNode())==null?void 0:c.host))||t.some(d=>e.contains(d))||t.push(e));return t});return{resolveContainers:u,contains:(0,_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(t=>u().some(i=>i.contains(t)))}}let a=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);function P({children:r,node:n}){let[o,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),u=y(n!=null?n:o);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(a.Provider,{value:u},r,u===null&&react__WEBPACK_IMPORTED_MODULE_0__.createElement(_internal_hidden_js__WEBPACK_IMPORTED_MODULE_4__.Hidden,{features:_internal_hidden_js__WEBPACK_IMPORTED_MODULE_4__.HiddenFeatures.Hidden,ref:t=>{var i,c;if(t){for(let e of(c=(i=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_5__.getOwnerDocument)(t))==null?void 0:i.querySelectorAll("html > *, body > *"))!=null?c:[])if(e!==document.body&&e!==document.head&&_utils_dom_js__WEBPACK_IMPORTED_MODULE_3__.isElement(e)&&e!=null&&e.contains(t)){l(e);break}}}}))}function y(r=null){var n;return(n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(a))!=null?n:r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-scroll-lock.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-scroll-lock.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useScrollLock: () => (/* binding */ f)
/* harmony export */ });
/* harmony import */ var _document_overflow_use_document_overflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./document-overflow/use-document-overflow.js */ "./node_modules/@headlessui/react/dist/hooks/document-overflow/use-document-overflow.js");
/* harmony import */ var _use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-is-top-layer.js */ "./node_modules/@headlessui/react/dist/hooks/use-is-top-layer.js");
function f(e,c,n=()=>[document.body]){let r=(0,_use_is_top_layer_js__WEBPACK_IMPORTED_MODULE_0__.useIsTopLayer)(e,"scroll-lock");(0,_document_overflow_use_document_overflow_js__WEBPACK_IMPORTED_MODULE_1__.useDocumentOverflowLockedEffect)(r,c,t=>{var o;return{containers:[...(o=t.containers)!=null?o:[],n]}})}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useServerHandoffComplete: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
function s(){let r=typeof document=="undefined";return"useSyncExternalStore" in /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))?(o=>o.useSyncExternalStore)(/*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2))))(()=>()=>{},()=>!1,()=>!r):!1}function l(){let r=s(),[e,n]=react__WEBPACK_IMPORTED_MODULE_0__.useState(_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isHandoffComplete);return e&&_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.isHandoffComplete===!1&&n(!1),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{e!==!0&&n(!0)},[e]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>_utils_env_js__WEBPACK_IMPORTED_MODULE_1__.env.handoff(),[]),r?!1:e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-store.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-store.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useStore: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
function o(t){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore)(t.subscribe,t.getSnapshot,t.getSnapshot)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js":
/*!********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionalRef: () => (/* binding */ T),
/* harmony export */   useSyncRefs: () => (/* binding */ y)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
let u=Symbol();function T(t,n=!0){return Object.assign(t,{[u]:n})}function y(...t){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n.current=t},[t]);let c=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(e=>{for(let o of n.current)o!=null&&(typeof o=="function"?o(e):o.current=e)});return t.every(e=>e==null||(e==null?void 0:e[u]))?void 0:c}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-tab-direction.js":
/*!************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-tab-direction.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Direction: () => (/* binding */ a),
/* harmony export */   useTabDirection: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_window_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-window-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-window-event.js");
var a=(r=>(r[r.Forwards=0]="Forwards",r[r.Backwards=1]="Backwards",r))(a||{});function u(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);return (0,_use_window_event_js__WEBPACK_IMPORTED_MODULE_1__.useWindowEvent)(!0,"keydown",r=>{r.key==="Tab"&&(e.current=r.shiftKey?1:0)},!0),e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-text-value.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-text-value.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTextValue: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_get_text_value_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/get-text-value.js */ "./node_modules/@headlessui/react/dist/utils/get-text-value.js");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
function s(c){let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(""),r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)("");return (0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(()=>{let e=c.current;if(!e)return"";let u=e.innerText;if(t.current===u)return r.current;let n=(0,_utils_get_text_value_js__WEBPACK_IMPORTED_MODULE_2__.getTextValue)(e).trim().toLowerCase();return t.current=u,r.current=n,n})}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-tracked-pointer.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-tracked-pointer.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTrackedPointer: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
function t(e){return[e.screenX,e.screenY]}function u(){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([-1,-1]);return{wasMoved(r){let n=t(r);return e.current[0]===n[0]&&e.current[1]===n[1]?!1:(e.current=n,!0)},update(r){e.current=t(r)}}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-transition.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-transition.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transitionDataAttributes: () => (/* binding */ R),
/* harmony export */   useTransition: () => (/* binding */ x)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _use_disposables_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _use_flags_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-flags.js */ "./node_modules/@headlessui/react/dist/hooks/use-flags.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
var T,b;typeof process!="undefined"&&typeof globalThis!="undefined"&&typeof Element!="undefined"&&((T=process==null?void 0:process.env)==null?void 0:T["NODE_ENV"])==="test"&&typeof((b=Element==null?void 0:Element.prototype)==null?void 0:b.getAnimations)=="undefined"&&(Element.prototype.getAnimations=function(){return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.","Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.","","Example usage:","```js","import { mockAnimationsApi } from 'jsdom-testing-mocks'","mockAnimationsApi()","```"].join(`
`)),[]});var L=(r=>(r[r.None=0]="None",r[r.Closed=1]="Closed",r[r.Enter=2]="Enter",r[r.Leave=4]="Leave",r))(L||{});function R(t){let n={};for(let e in t)t[e]===!0&&(n[`data-${e}`]="");return n}function x(t,n,e,i){let[r,o]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(e),{hasFlag:s,addFlag:a,removeFlag:l}=(0,_use_flags_js__WEBPACK_IMPORTED_MODULE_1__.useFlags)(t&&r?3:0),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),f=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),E=(0,_use_disposables_js__WEBPACK_IMPORTED_MODULE_2__.useDisposables)();return (0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__.useIsoMorphicEffect)(()=>{var d;if(t){if(e&&o(!0),!n){e&&a(3);return}return(d=i==null?void 0:i.start)==null||d.call(i,e),C(n,{inFlight:u,prepare(){f.current?f.current=!1:f.current=u.current,u.current=!0,!f.current&&(e?(a(3),l(4)):(a(4),l(2)))},run(){f.current?e?(l(3),a(4)):(l(4),a(3)):e?l(1):a(1)},done(){var p;f.current&&typeof n.getAnimations=="function"&&n.getAnimations().length>0||(u.current=!1,l(7),e||o(!1),(p=i==null?void 0:i.end)==null||p.call(i,e))}})}},[t,e,n,E]),t?[r,{closed:s(1),enter:s(2),leave:s(4),transition:s(2)||s(4)}]:[e,{closed:void 0,enter:void 0,leave:void 0,transition:void 0}]}function C(t,{prepare:n,run:e,done:i,inFlight:r}){let o=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__.disposables)();return j(t,{prepare:n,inFlight:r}),o.nextFrame(()=>{e(),o.requestAnimationFrame(()=>{o.add(M(t,i))})}),o.dispose}function M(t,n){var o,s;let e=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_4__.disposables)();if(!t)return e.dispose;let i=!1;e.add(()=>{i=!0});let r=(s=(o=t.getAnimations)==null?void 0:o.call(t).filter(a=>a instanceof CSSTransition))!=null?s:[];return r.length===0?(n(),e.dispose):(Promise.allSettled(r.map(a=>a.finished)).then(()=>{i||n()}),e.dispose)}function j(t,{inFlight:n,prepare:e}){if(n!=null&&n.current){e();return}let i=t.style.transition;t.style.transition="none",e(),t.offsetHeight,t.style.transition=i}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTreeWalker: () => (/* binding */ F)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _utils_owner_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
/* harmony import */ var _use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
function F(c,{container:e,accept:t,walk:r}){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(r);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{o.current=t,l.current=r},[t,r]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{if(!e||!c)return;let n=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(e);if(!n)return;let f=o.current,p=l.current,i=Object.assign(m=>f(m),{acceptNode:f}),u=n.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,i,!1);for(;u.nextNode();)p(u.currentNode)},[e,c,o,l])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-watch.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-watch.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useWatch: () => (/* binding */ m)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
function m(u,t){let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),r=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__.useEvent)(u);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{let o=[...e.current];for(let[a,l]of t.entries())if(e.current[a]!==l){let n=r(t,o);return e.current=t,n}},[r,...t])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/hooks/use-window-event.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/hooks/use-window-event.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useWindowEvent: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-latest-value.js */ "./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");
function s(t,e,o,n){let i=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.useLatestValue)(o);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{if(!t)return;function r(d){i.current(d)}return window.addEventListener(e,r,n),()=>window.removeEventListener(e,r,n)},[t,e,n])}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/close-provider.js":
/*!************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/close-provider.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CloseProvider: () => (/* binding */ C),
/* harmony export */   useClose: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
"use client";let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(()=>{});function u(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(e)}function C({value:t,children:o}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(e.Provider,{value:t},o)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/disabled.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/disabled.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisabledProvider: () => (/* binding */ l),
/* harmony export */   useDisabled: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(void 0);function a(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(e)}function l({value:t,children:o}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(e.Provider,{value:t},o)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/floating.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/floating.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FloatingProvider: () => (/* binding */ Ae),
/* harmony export */   useFloatingPanel: () => (/* binding */ Re),
/* harmony export */   useFloatingPanelProps: () => (/* binding */ Te),
/* harmony export */   useFloatingReference: () => (/* binding */ Fe),
/* harmony export */   useFloatingReferenceProps: () => (/* binding */ be),
/* harmony export */   useResolvedAnchor: () => (/* binding */ ye)
/* harmony export */ });
/* harmony import */ var _floating_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/react */ "./node_modules/@floating-ui/react/dist/floating-ui.react.mjs");
/* harmony import */ var _floating_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @floating-ui/react */ "./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs");
/* harmony import */ var _floating_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @floating-ui/react */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hooks/use-disposables.js */ "./node_modules/@headlessui/react/dist/hooks/use-disposables.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hooks/use-iso-morphic-effect.js */ "./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");
/* harmony import */ var _utils_dom_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
let y=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({styles:void 0,setReference:()=>{},setFloating:()=>{},getReferenceProps:()=>({}),getFloatingProps:()=>({}),slot:{}});y.displayName="FloatingContext";let $=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);$.displayName="PlacementContext";function ye(e){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>e?typeof e=="string"?{to:e}:e:null,[e])}function Fe(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(y).setReference}function be(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(y).getReferenceProps}function Te(){let{getFloatingProps:e,slot:t}=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(y);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...n)=>Object.assign({},e(...n),{"data-anchor":t.anchor}),[e,t])}function Re(e=null){e===!1&&(e=null),typeof e=="string"&&(e={to:e});let t=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)($),n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>e,[JSON.stringify(e,(l,o)=>{var u;return(u=o==null?void 0:o.outerHTML)!=null?u:o})]);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{t==null||t(n!=null?n:null)},[t,n]);let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(y);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>[r.setFloating,e?r.styles:{}],[r.setFloating,e,r.styles])}let D=4;function Ae({children:e,enabled:t=!0}){let[n,r]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[l,o]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),[f,s]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);ce(f);let i=t&&n!==null&&f!==null,{to:F="bottom",gap:E=0,offset:A=0,padding:c=0,inner:h}=ge(n,f),[a,p="center"]=F.split(" ");(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{i&&o(0)},[i]);let{refs:b,floatingStyles:S,context:g}=(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_2__.useFloating)({open:i,placement:a==="selection"?p==="center"?"bottom":`bottom-${p}`:p==="center"?`${a}`:`${a}-${p}`,strategy:"absolute",transform:!1,middleware:[(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_3__.offset)({mainAxis:a==="selection"?0:E,crossAxis:A}),(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_3__.shift)({padding:c}),a!=="selection"&&(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_3__.flip)({padding:c}),a==="selection"&&h?(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_2__.inner)({...h,padding:c,overflowRef:u,offset:l,minItemsVisible:D,referenceOverflowThreshold:c,onFallbackChange(P){var L,N;if(!P)return;let d=g.elements.floating;if(!d)return;let M=parseFloat(getComputedStyle(d).scrollPaddingBottom)||0,I=Math.min(D,d.childElementCount),W=0,B=0;for(let m of(N=(L=g.elements.floating)==null?void 0:L.childNodes)!=null?N:[])if(_utils_dom_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement(m)){let x=m.offsetTop,k=x+m.clientHeight+M,H=d.scrollTop,U=H+d.clientHeight;if(x>=H&&k<=U)I--;else{B=Math.max(0,Math.min(k,U)-Math.max(x,H)),W=m.clientHeight;break}}I>=1&&o(m=>{let x=W*I-B+M;return m>=x?m:x})}}):null,(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_3__.size)({padding:c,apply({availableWidth:P,availableHeight:d,elements:M}){Object.assign(M.floating.style,{overflow:"auto",maxWidth:`${P}px`,maxHeight:`min(var(--anchor-max-height, 100vh), ${d}px)`})}})].filter(Boolean),whileElementsMounted:_floating_ui_react__WEBPACK_IMPORTED_MODULE_5__.autoUpdate}),[w=a,V=p]=g.placement.split("-");a==="selection"&&(w="selection");let G=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({anchor:[w,V].filter(Boolean).join(" ")}),[w,V]),K=(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_2__.useInnerOffset)(g,{overflowRef:u,onChange:o}),{getReferenceProps:Q,getFloatingProps:X}=(0,_floating_ui_react__WEBPACK_IMPORTED_MODULE_2__.useInteractions)([K]),Y=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)(P=>{s(P),b.setFloating(P)});return react__WEBPACK_IMPORTED_MODULE_0__.createElement($.Provider,{value:r},react__WEBPACK_IMPORTED_MODULE_0__.createElement(y.Provider,{value:{setFloating:Y,setReference:b.setReference,styles:S,getReferenceProps:Q,getFloatingProps:X,slot:G}},e))}function ce(e){(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{if(!e)return;let t=new MutationObserver(()=>{let n=window.getComputedStyle(e).maxHeight,r=parseFloat(n);if(isNaN(r))return;let l=parseInt(n);isNaN(l)||r!==l&&(e.style.maxHeight=`${Math.ceil(r)}px`)});return t.observe(e,{attributes:!0,attributeFilter:["style"]}),()=>{t.disconnect()}},[e])}function ge(e,t){var o,u,f;let n=O((o=e==null?void 0:e.gap)!=null?o:"var(--anchor-gap, 0)",t),r=O((u=e==null?void 0:e.offset)!=null?u:"var(--anchor-offset, 0)",t),l=O((f=e==null?void 0:e.padding)!=null?f:"var(--anchor-padding, 0)",t);return{...e,gap:n,offset:r,padding:l}}function O(e,t,n=void 0){let r=(0,_hooks_use_disposables_js__WEBPACK_IMPORTED_MODULE_7__.useDisposables)(),l=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_6__.useEvent)((s,i)=>{if(s==null)return[n,null];if(typeof s=="number")return[s,null];if(typeof s=="string"){if(!i)return[n,null];let F=J(s,i);return[F,E=>{let A=q(s);{let c=A.map(h=>window.getComputedStyle(i).getPropertyValue(h));r.requestAnimationFrame(function h(){r.nextFrame(h);let a=!1;for(let[b,S]of A.entries()){let g=window.getComputedStyle(i).getPropertyValue(S);if(c[b]!==g){c[b]=g,a=!0;break}}if(!a)return;let p=J(s,i);F!==p&&(E(p),F=p)})}return r.dispose}]}return[n,null]}),o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>l(e,t)[0],[e,t]),[u=o,f]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();return (0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.useIsoMorphicEffect)(()=>{let[s,i]=l(e,t);if(f(s),!!i)return i(f)},[e,t]),u}function q(e){let t=/var\((.*)\)/.exec(e);if(t){let n=t[1].indexOf(",");if(n===-1)return[t[1]];let r=t[1].slice(0,n).trim(),l=t[1].slice(n+1).trim();return l?[r,...q(l)]:[r]}return[]}function J(e,t){let n=document.createElement("div");t.appendChild(n),n.style.setProperty("margin-top","0px","important"),n.style.setProperty("margin-top",e,"important");let r=parseFloat(window.getComputedStyle(n).marginTop)||0;return t.removeChild(n),r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/hidden.js":
/*!****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/hidden.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hidden: () => (/* binding */ f),
/* harmony export */   HiddenFeatures: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./node_modules/@headlessui/react/dist/utils/render.js");
let a="span";var s=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(s||{});function l(t,r){var n;let{features:d=1,...e}=t,o={ref:r,"aria-hidden":(d&2)===2?!0:(n=e["aria-hidden"])!=null?n:void 0,hidden:(d&4)===4?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(d&4)===4&&(d&2)!==2&&{display:"none"}}};return (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.useRender)()({ourProps:o,theirProps:e,slot:{},defaultTag:a,name:"Hidden"})}let f=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.forwardRefWithAs)(l);


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/id.js":
/*!************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/id.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IdProvider: () => (/* binding */ f),
/* harmony export */   useProvidedId: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(void 0);function u(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(e)}function f({id:t,children:r}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(e.Provider,{value:t},r)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/open-closed.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/open-closed.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenClosedProvider: () => (/* binding */ c),
/* harmony export */   ResetOpenClosedProvider: () => (/* binding */ s),
/* harmony export */   State: () => (/* binding */ i),
/* harmony export */   useOpenClosed: () => (/* binding */ u)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);n.displayName="OpenClosedContext";var i=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(i||{});function u(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(n)}function c({value:o,children:t}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(n.Provider,{value:o},t)}function s({children:o}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(n.Provider,{value:null},o)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/internal/portal-force-root.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/internal/portal-force-root.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForcePortalRoot: () => (/* binding */ l),
/* harmony export */   usePortalRoot: () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
let e=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(!1);function a(){return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(e)}function l(o){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(e.Provider,{value:o.force},o.children)}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/machine.js":
/*!********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/machine.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Machine: () => (/* binding */ E),
/* harmony export */   batch: () => (/* binding */ x),
/* harmony export */   shallowEqual: () => (/* binding */ j)
/* harmony export */ });
/* harmony import */ var _utils_default_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/default-map.js */ "./node_modules/@headlessui/react/dist/utils/default-map.js");
/* harmony import */ var _utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
var p=Object.defineProperty;var h=(t,e,r)=>e in t?p(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var f=(t,e,r)=>(h(t,typeof e!="symbol"?e+"":e,r),r),b=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)};var n=(t,e,r)=>(b(t,e,"read from private field"),r?r.call(t):e.get(t)),c=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},u=(t,e,r,s)=>(b(t,e,"write to private field"),s?s.call(t,r):e.set(t,r),r);var i,a,o;class E{constructor(e){c(this,i,{});c(this,a,new _utils_default_map_js__WEBPACK_IMPORTED_MODULE_0__.DefaultMap(()=>new Set));c(this,o,new Set);f(this,"disposables",(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables)());u(this,i,e)}dispose(){this.disposables.dispose()}get state(){return n(this,i)}subscribe(e,r){let s={selector:e,callback:r,current:e(n(this,i))};return n(this,o).add(s),this.disposables.add(()=>{n(this,o).delete(s)})}on(e,r){return n(this,a).get(e).add(r),this.disposables.add(()=>{n(this,a).get(e).delete(r)})}send(e){let r=this.reduce(n(this,i),e);if(r!==n(this,i)){u(this,i,r);for(let s of n(this,o)){let l=s.selector(n(this,i));j(s.current,l)||(s.current=l,s.callback(l))}for(let s of n(this,a).get(e.type))s(n(this,i),e)}}}i=new WeakMap,a=new WeakMap,o=new WeakMap;function j(t,e){return Object.is(t,e)?!0:typeof t!="object"||t===null||typeof e!="object"||e===null?!1:Array.isArray(t)&&Array.isArray(e)?t.length!==e.length?!1:d(t[Symbol.iterator](),e[Symbol.iterator]()):t instanceof Map&&e instanceof Map||t instanceof Set&&e instanceof Set?t.size!==e.size?!1:d(t.entries(),e.entries()):y(t)&&y(e)?d(Object.entries(t)[Symbol.iterator](),Object.entries(e)[Symbol.iterator]()):!1}function d(t,e){do{let r=t.next(),s=e.next();if(r.done&&s.done)return!0;if(r.done||s.done||!Object.is(r.value,s.value))return!1}while(!0)}function y(t){if(Object.prototype.toString.call(t)!=="[object Object]")return!1;let e=Object.getPrototypeOf(t);return e===null||Object.getPrototypeOf(e)===null}function x(t){let[e,r]=t(),s=(0,_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.disposables)();return(...l)=>{e(...l),s.dispose(),s.microTask(r)}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/machines/stack-machine.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/machines/stack-machine.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* binding */ k),
/* harmony export */   stackMachines: () => (/* binding */ x)
/* harmony export */ });
/* harmony import */ var _machine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../machine.js */ "./node_modules/@headlessui/react/dist/machine.js");
/* harmony import */ var _utils_default_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/default-map.js */ "./node_modules/@headlessui/react/dist/utils/default-map.js");
/* harmony import */ var _utils_match_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
var a=Object.defineProperty;var r=(e,c,t)=>c in e?a(e,c,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[c]=t;var p=(e,c,t)=>(r(e,typeof c!="symbol"?c+"":c,t),t);var k=(t=>(t[t.Push=0]="Push",t[t.Pop=1]="Pop",t))(k||{});let y={[0](e,c){let t=c.id,s=e.stack,i=e.stack.indexOf(t);if(i!==-1){let n=e.stack.slice();return n.splice(i,1),n.push(t),s=n,{...e,stack:s}}return{...e,stack:[...e.stack,t]}},[1](e,c){let t=c.id,s=e.stack.indexOf(t);if(s===-1)return e;let i=e.stack.slice();return i.splice(s,1),{...e,stack:i}}};class o extends _machine_js__WEBPACK_IMPORTED_MODULE_0__.Machine{constructor(){super(...arguments);p(this,"actions",{push:t=>this.send({type:0,id:t}),pop:t=>this.send({type:1,id:t})});p(this,"selectors",{isTop:(t,s)=>t.stack[t.stack.length-1]===s,inStack:(t,s)=>t.stack.includes(s)})}static new(){return new o({stack:[]})}reduce(t,s){return (0,_utils_match_js__WEBPACK_IMPORTED_MODULE_1__.match)(s.type,y,t,s)}}const x=new _utils_default_map_js__WEBPACK_IMPORTED_MODULE_2__.DefaultMap(()=>o.new());


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/react-glue.js":
/*!***********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/react-glue.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSlice: () => (/* binding */ S)
/* harmony export */ });
/* harmony import */ var use_sync_external_store_with_selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! use-sync-external-store/with-selector */ "./node_modules/use-sync-external-store/with-selector.js");
/* harmony import */ var _hooks_use_event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hooks/use-event.js */ "./node_modules/@headlessui/react/dist/hooks/use-event.js");
/* harmony import */ var _machine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./machine.js */ "./node_modules/@headlessui/react/dist/machine.js");
function S(e,n,r=_machine_js__WEBPACK_IMPORTED_MODULE_1__.shallowEqual){return (0,use_sync_external_store_with_selector__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStoreWithSelector)((0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(i=>e.subscribe(s,i)),(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(()=>e.state),(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(()=>e.state),(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_2__.useEvent)(n),r)}function s(e){return e}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/active-element-history.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/active-element-history.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   history: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _document_ready_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./document-ready.js */ "./node_modules/@headlessui/react/dist/utils/document-ready.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _focus_management_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./focus-management.js */ "./node_modules/@headlessui/react/dist/utils/focus-management.js");
let n=[];(0,_document_ready_js__WEBPACK_IMPORTED_MODULE_0__.onDocumentReady)(()=>{function e(t){if(!_dom_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLorSVGElement(t.target)||t.target===document.body||n[0]===t.target)return;let r=t.target;r=r.closest(_focus_management_js__WEBPACK_IMPORTED_MODULE_2__.focusableSelector),n.unshift(r!=null?r:t.target),n=n.filter(o=>o!=null&&o.isConnected),n.splice(10)}window.addEventListener("click",e,{capture:!0}),window.addEventListener("mousedown",e,{capture:!0}),window.addEventListener("focus",e,{capture:!0}),document.body.addEventListener("click",e,{capture:!0}),document.body.addEventListener("mousedown",e,{capture:!0}),document.body.addEventListener("focus",e,{capture:!0})});


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/bugs.js":
/*!***********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/bugs.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDisabledReactIssue7711: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
function s(l){let e=l.parentElement,t=null;for(;e&&!_dom_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLFieldSetElement(e);)_dom_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLLegendElement(e)&&(t=e),e=e.parentElement;let i=(e==null?void 0:e.getAttribute("disabled"))==="";return i&&r(t)?!1:i}function r(l){if(!l)return!1;let e=l.previousElementSibling;for(;e!==null;){if(_dom_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLLegendElement(e))return!1;e=e.previousElementSibling}return!0}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/calculate-active-index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/calculate-active-index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Focus: () => (/* binding */ c),
/* harmony export */   calculateActiveIndex: () => (/* binding */ f)
/* harmony export */ });
function u(l){throw new Error("Unexpected object: "+l)}var c=(i=>(i[i.First=0]="First",i[i.Previous=1]="Previous",i[i.Next=2]="Next",i[i.Last=3]="Last",i[i.Specific=4]="Specific",i[i.Nothing=5]="Nothing",i))(c||{});function f(l,n){let t=n.resolveItems();if(t.length<=0)return null;let r=n.resolveActiveIndex(),s=r!=null?r:-1;switch(l.focus){case 0:{for(let e=0;e<t.length;++e)if(!n.resolveDisabled(t[e],e,t))return e;return r}case 1:{s===-1&&(s=t.length);for(let e=s-1;e>=0;--e)if(!n.resolveDisabled(t[e],e,t))return e;return r}case 2:{for(let e=s+1;e<t.length;++e)if(!n.resolveDisabled(t[e],e,t))return e;return r}case 3:{for(let e=t.length-1;e>=0;--e)if(!n.resolveDisabled(t[e],e,t))return e;return r}case 4:{for(let e=0;e<t.length;++e)if(n.resolveId(t[e],e,t)===l.id)return e;return r}case 5:return null;default:u(l)}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/class-names.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/class-names.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   classNames: () => (/* binding */ t)
/* harmony export */ });
function t(...r){return Array.from(new Set(r.flatMap(n=>typeof n=="string"?n.split(" "):[]))).filter(Boolean).join(" ")}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/default-map.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/default-map.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultMap: () => (/* binding */ a)
/* harmony export */ });
class a extends Map{constructor(t){super();this.factory=t}get(t){let e=super.get(t);return e===void 0&&(e=this.factory(t),this.set(t,e)),e}}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/disposables.js":
/*!******************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/disposables.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disposables: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var _micro_task_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./micro-task.js */ "./node_modules/@headlessui/react/dist/utils/micro-task.js");
function o(){let s=[],r={addEventListener(e,t,n,i){return e.addEventListener(t,n,i),r.add(()=>e.removeEventListener(t,n,i))},requestAnimationFrame(...e){let t=requestAnimationFrame(...e);return r.add(()=>cancelAnimationFrame(t))},nextFrame(...e){return r.requestAnimationFrame(()=>r.requestAnimationFrame(...e))},setTimeout(...e){let t=setTimeout(...e);return r.add(()=>clearTimeout(t))},microTask(...e){let t={current:!0};return (0,_micro_task_js__WEBPACK_IMPORTED_MODULE_0__.microTask)(()=>{t.current&&e[0]()}),r.add(()=>{t.current=!1})},style(e,t,n){let i=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:n}),this.add(()=>{Object.assign(e.style,{[t]:i})})},group(e){let t=o();return e(t),this.add(()=>t.dispose())},add(e){return s.includes(e)||s.push(e),()=>{let t=s.indexOf(e);if(t>=0)for(let n of s.splice(t,1))n()}},dispose(){for(let e of s.splice(0))e()}};return r}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/document-ready.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/document-ready.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onDocumentReady: () => (/* binding */ t)
/* harmony export */ });
function t(n){function e(){document.readyState!=="loading"&&(n(),document.removeEventListener("DOMContentLoaded",e))}typeof window!="undefined"&&typeof document!="undefined"&&(document.addEventListener("DOMContentLoaded",e),e())}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/dom.js":
/*!**********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/dom.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasInlineStyle: () => (/* binding */ r),
/* harmony export */   isElement: () => (/* binding */ t),
/* harmony export */   isHTMLElement: () => (/* binding */ n),
/* harmony export */   isHTMLFieldSetElement: () => (/* binding */ a),
/* harmony export */   isHTMLIframeElement: () => (/* binding */ u),
/* harmony export */   isHTMLInputElement: () => (/* binding */ l),
/* harmony export */   isHTMLLabelElement: () => (/* binding */ m),
/* harmony export */   isHTMLLegendElement: () => (/* binding */ E),
/* harmony export */   isHTMLTextAreaElement: () => (/* binding */ s),
/* harmony export */   isHTMLorSVGElement: () => (/* binding */ i),
/* harmony export */   isInteractiveElement: () => (/* binding */ L),
/* harmony export */   isNode: () => (/* binding */ o)
/* harmony export */ });
function o(e){return typeof e!="object"||e===null?!1:"nodeType"in e}function t(e){return o(e)&&"tagName"in e}function n(e){return t(e)&&"accessKey"in e}function i(e){return t(e)&&"tabIndex"in e}function r(e){return t(e)&&"style"in e}function u(e){return n(e)&&e.nodeName==="IFRAME"}function l(e){return n(e)&&e.nodeName==="INPUT"}function s(e){return n(e)&&e.nodeName==="TEXTAREA"}function m(e){return n(e)&&e.nodeName==="LABEL"}function a(e){return n(e)&&e.nodeName==="FIELDSET"}function E(e){return n(e)&&e.nodeName==="LEGEND"}function L(e){return t(e)?e.matches('a[href],audio[controls],button,details,embed,iframe,img[usemap],input:not([type="hidden"]),label,select,textarea,video[controls]'):!1}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/env.js":
/*!**********************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/env.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   env: () => (/* binding */ s)
/* harmony export */ });
var i=Object.defineProperty;var d=(t,e,n)=>e in t?i(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var r=(t,e,n)=>(d(t,typeof e!="symbol"?e+"":e,n),n);class o{constructor(){r(this,"current",this.detect());r(this,"handoffState","pending");r(this,"currentId",0)}set(e){this.current!==e&&(this.handoffState="pending",this.currentId=0,this.current=e)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window=="undefined"||typeof document=="undefined"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete")}get isHandoffComplete(){return this.handoffState==="complete"}}let s=new o;


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/focus-management.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/focus-management.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Focus: () => (/* binding */ T),
/* harmony export */   FocusResult: () => (/* binding */ y),
/* harmony export */   FocusableMode: () => (/* binding */ h),
/* harmony export */   focusElement: () => (/* binding */ I),
/* harmony export */   focusFrom: () => (/* binding */ j),
/* harmony export */   focusIn: () => (/* binding */ g),
/* harmony export */   focusableSelector: () => (/* binding */ f),
/* harmony export */   getAutoFocusableElements: () => (/* binding */ O),
/* harmony export */   getFocusableElements: () => (/* binding */ b),
/* harmony export */   isFocusableElement: () => (/* binding */ A),
/* harmony export */   restoreFocusIfNecessary: () => (/* binding */ V),
/* harmony export */   sortByDomNode: () => (/* binding */ P)
/* harmony export */ });
/* harmony import */ var _disposables_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disposables.js */ "./node_modules/@headlessui/react/dist/utils/disposables.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
/* harmony import */ var _owner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./owner.js */ "./node_modules/@headlessui/react/dist/utils/owner.js");
let f=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(","),F=["[data-autofocus]"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var T=(n=>(n[n.First=1]="First",n[n.Previous=2]="Previous",n[n.Next=4]="Next",n[n.Last=8]="Last",n[n.WrapAround=16]="WrapAround",n[n.NoScroll=32]="NoScroll",n[n.AutoFocus=64]="AutoFocus",n))(T||{}),y=(o=>(o[o.Error=0]="Error",o[o.Overflow=1]="Overflow",o[o.Success=2]="Success",o[o.Underflow=3]="Underflow",o))(y||{}),S=(t=>(t[t.Previous=-1]="Previous",t[t.Next=1]="Next",t))(S||{});function b(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(f)).sort((r,t)=>Math.sign((r.tabIndex||Number.MAX_SAFE_INTEGER)-(t.tabIndex||Number.MAX_SAFE_INTEGER)))}function O(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(F)).sort((r,t)=>Math.sign((r.tabIndex||Number.MAX_SAFE_INTEGER)-(t.tabIndex||Number.MAX_SAFE_INTEGER)))}var h=(t=>(t[t.Strict=0]="Strict",t[t.Loose=1]="Loose",t))(h||{});function A(e,r=0){var t;return e===((t=(0,_owner_js__WEBPACK_IMPORTED_MODULE_0__.getOwnerDocument)(e))==null?void 0:t.body)?!1:(0,_match_js__WEBPACK_IMPORTED_MODULE_1__.match)(r,{[0](){return e.matches(f)},[1](){let l=e;for(;l!==null;){if(l.matches(f))return!0;l=l.parentElement}return!1}})}function V(e){let r=(0,_owner_js__WEBPACK_IMPORTED_MODULE_0__.getOwnerDocument)(e);(0,_disposables_js__WEBPACK_IMPORTED_MODULE_2__.disposables)().nextFrame(()=>{r&&_dom_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLorSVGElement(r.activeElement)&&!A(r.activeElement,0)&&I(e)})}var H=(t=>(t[t.Keyboard=0]="Keyboard",t[t.Mouse=1]="Mouse",t))(H||{});typeof window!="undefined"&&typeof document!="undefined"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));function I(e){e==null||e.focus({preventScroll:!0})}let w=["textarea","input"].join(",");function _(e){var r,t;return(t=(r=e==null?void 0:e.matches)==null?void 0:r.call(e,w))!=null?t:!1}function P(e,r=t=>t){return e.slice().sort((t,l)=>{let o=r(t),c=r(l);if(o===null||c===null)return 0;let u=o.compareDocumentPosition(c);return u&Node.DOCUMENT_POSITION_FOLLOWING?-1:u&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function j(e,r){return g(b(),r,{relativeTo:e})}function g(e,r,{sorted:t=!0,relativeTo:l=null,skipElements:o=[]}={}){let c=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,u=Array.isArray(e)?t?P(e):e:r&64?O(e):b(e);o.length>0&&u.length>1&&(u=u.filter(s=>!o.some(a=>a!=null&&"current"in a?(a==null?void 0:a.current)===s:a===s))),l=l!=null?l:c.activeElement;let n=(()=>{if(r&5)return 1;if(r&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),x=(()=>{if(r&1)return 0;if(r&2)return Math.max(0,u.indexOf(l))-1;if(r&4)return Math.max(0,u.indexOf(l))+1;if(r&8)return u.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),M=r&32?{preventScroll:!0}:{},m=0,d=u.length,i;do{if(m>=d||m+d<=0)return 0;let s=x+m;if(r&16)s=(s+d)%d;else{if(s<0)return 3;if(s>=d)return 1}i=u[s],i==null||i.focus(M),m+=n}while(i!==c.activeElement);return r&6&&_(i)&&i.select(),2}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/get-text-value.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/get-text-value.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTextValue: () => (/* binding */ F)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/@headlessui/react/dist/utils/dom.js");
let a=/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;function o(e){var l,n;let i=(l=e.innerText)!=null?l:"",t=e.cloneNode(!0);if(!_dom_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement(t))return i;let u=!1;for(let f of t.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))f.remove(),u=!0;let r=u?(n=t.innerText)!=null?n:"":i;return a.test(r)&&(r=r.replace(a,"")),r}function F(e){let i=e.getAttribute("aria-label");if(typeof i=="string")return i.trim();let t=e.getAttribute("aria-labelledby");if(t){let u=t.split(" ").map(r=>{let l=document.getElementById(r);if(l){let n=l.getAttribute("aria-label");return typeof n=="string"?n.trim():o(l).trim()}return null}).filter(Boolean);if(u.length>0)return u.join(", ")}return o(e).trim()}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/match.js":
/*!************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/match.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   match: () => (/* binding */ u)
/* harmony export */ });
function u(r,n,...a){if(r in n){let e=n[r];return typeof e=="function"?e(...a):e}let t=new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,u),t}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/micro-task.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/micro-task.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   microTask: () => (/* binding */ t)
/* harmony export */ });
function t(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(o=>setTimeout(()=>{throw o}))}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/owner.js":
/*!************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/owner.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOwnerDocument: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env.js */ "./node_modules/@headlessui/react/dist/utils/env.js");
function o(n){var e,r;return _env_js__WEBPACK_IMPORTED_MODULE_0__.env.isServer?null:n?"ownerDocument"in n?n.ownerDocument:"current"in n?(r=(e=n.current)==null?void 0:e.ownerDocument)!=null?r:document:null:document}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/platform.js":
/*!***************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/platform.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAndroid: () => (/* binding */ i),
/* harmony export */   isIOS: () => (/* binding */ t),
/* harmony export */   isMobile: () => (/* binding */ n)
/* harmony export */ });
function t(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}function i(){return/Android/gi.test(window.navigator.userAgent)}function n(){return t()||i()}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/render.js":
/*!*************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/render.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RenderFeatures: () => (/* binding */ O),
/* harmony export */   RenderStrategy: () => (/* binding */ A),
/* harmony export */   compact: () => (/* binding */ m),
/* harmony export */   forwardRefWithAs: () => (/* binding */ K),
/* harmony export */   mergeProps: () => (/* binding */ _),
/* harmony export */   useRender: () => (/* binding */ L)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _class_names_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./class-names.js */ "./node_modules/@headlessui/react/dist/utils/class-names.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./match.js */ "./node_modules/@headlessui/react/dist/utils/match.js");
var O=(a=>(a[a.None=0]="None",a[a.RenderStrategy=1]="RenderStrategy",a[a.Static=2]="Static",a))(O||{}),A=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(A||{});function L(){let n=U();return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(r=>C({mergeRefs:n,...r}),[n])}function C({ourProps:n,theirProps:r,slot:e,defaultTag:a,features:s,visible:t=!0,name:l,mergeRefs:i}){i=i!=null?i:$;let o=P(r,n);if(t)return F(o,e,a,l,i);let y=s!=null?s:0;if(y&2){let{static:f=!1,...u}=o;if(f)return F(u,e,a,l,i)}if(y&1){let{unmount:f=!0,...u}=o;return (0,_match_js__WEBPACK_IMPORTED_MODULE_1__.match)(f?0:1,{[0](){return null},[1](){return F({...u,hidden:!0,style:{display:"none"}},e,a,l,i)}})}return F(o,e,a,l,i)}function F(n,r={},e,a,s){let{as:t=e,children:l,refName:i="ref",...o}=h(n,["unmount","static"]),y=n.ref!==void 0?{[i]:n.ref}:{},f=typeof l=="function"?l(r):l;"className"in o&&o.className&&typeof o.className=="function"&&(o.className=o.className(r)),o["aria-labelledby"]&&o["aria-labelledby"]===o.id&&(o["aria-labelledby"]=void 0);let u={};if(r){let d=!1,p=[];for(let[c,T]of Object.entries(r))typeof T=="boolean"&&(d=!0),T===!0&&p.push(c.replace(/([A-Z])/g,g=>`-${g.toLowerCase()}`));if(d){u["data-headlessui-state"]=p.join(" ");for(let c of p)u[`data-${c}`]=""}}if(t===react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&(Object.keys(m(o)).length>0||Object.keys(m(u)).length>0))if(!(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(f)||Array.isArray(f)&&f.length>1){if(Object.keys(m(o)).length>0)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(m(o)).concat(Object.keys(m(u))).map(d=>`  - ${d}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(d=>`  - ${d}`).join(`
`)].join(`
`))}else{let d=f.props,p=d==null?void 0:d.className,c=typeof p=="function"?(...R)=>(0,_class_names_js__WEBPACK_IMPORTED_MODULE_2__.classNames)(p(...R),o.className):(0,_class_names_js__WEBPACK_IMPORTED_MODULE_2__.classNames)(p,o.className),T=c?{className:c}:{},g=P(f.props,m(h(o,["ref"])));for(let R in u)R in g&&delete u[R];return (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(f,Object.assign({},g,u,y,{ref:s(H(f),y.ref)},T))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(t,Object.assign({},h(o,["ref"]),t!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&y,t!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&u),f)}function U(){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e=>{for(let a of n.current)a!=null&&(typeof a=="function"?a(e):a.current=e)},[]);return(...e)=>{if(!e.every(a=>a==null))return n.current=e,r}}function $(...n){return n.every(r=>r==null)?void 0:r=>{for(let e of n)e!=null&&(typeof e=="function"?e(r):e.current=r)}}function P(...n){var a;if(n.length===0)return{};if(n.length===1)return n[0];let r={},e={};for(let s of n)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((a=e[t])!=null||(e[t]=[]),e[t].push(s[t])):r[t]=s[t];if(r.disabled||r["aria-disabled"])for(let s in e)/^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s)&&(e[s]=[t=>{var l;return(l=t==null?void 0:t.preventDefault)==null?void 0:l.call(t)}]);for(let s in e)Object.assign(r,{[s](t,...l){let i=e[s];for(let o of i){if((t instanceof Event||(t==null?void 0:t.nativeEvent)instanceof Event)&&t.defaultPrevented)return;o(t,...l)}}});return r}function _(...n){var a;if(n.length===0)return{};if(n.length===1)return n[0];let r={},e={};for(let s of n)for(let t in s)t.startsWith("on")&&typeof s[t]=="function"?((a=e[t])!=null||(e[t]=[]),e[t].push(s[t])):r[t]=s[t];for(let s in e)Object.assign(r,{[s](...t){let l=e[s];for(let i of l)i==null||i(...t)}});return r}function K(n){var r;return Object.assign((0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(n),{displayName:(r=n.displayName)!=null?r:n.name})}function m(n){let r=Object.assign({},n);for(let e in r)r[e]===void 0&&delete r[e];return r}function h(n,r=[]){let e=Object.assign({},n);for(let a of r)a in e&&delete e[a];return e}function H(n){return react__WEBPACK_IMPORTED_MODULE_0__.version.split(".")[0]>="19"?n.props.ref:n.ref}


/***/ }),

/***/ "./node_modules/@headlessui/react/dist/utils/store.js":
/*!************************************************************!*\
  !*** ./node_modules/@headlessui/react/dist/utils/store.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStore: () => (/* binding */ a)
/* harmony export */ });
function a(o,r){let t=o(),n=new Set;return{getSnapshot(){return t},subscribe(e){return n.add(e),()=>n.delete(e)},dispatch(e,...s){let i=r[e].call(t,...s);i&&(t=i,n.forEach(c=>c()))}}}


/***/ }),

/***/ "./node_modules/@heroicons/react/20/solid/esm/ArrowDownIcon.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@heroicons/react/20/solid/esm/ArrowDownIcon.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ArrowDownIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    d: "M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z",
    clipRule: "evenodd"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ArrowDownIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/20/solid/esm/ArrowUpIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/20/solid/esm/ArrowUpIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ArrowUpIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    d: "M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z",
    clipRule: "evenodd"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ArrowUpIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/20/solid/esm/ChevronDownIcon.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@heroicons/react/20/solid/esm/ChevronDownIcon.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ChevronDownIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    d: "M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z",
    clipRule: "evenodd"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ChevronDownIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function MagnifyingGlassIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    d: "M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z",
    clipRule: "evenodd"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(MagnifyingGlassIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function PlusIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(PlusIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function AcademicCapIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(AcademicCapIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/ArrowDownTrayIcon.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/ArrowDownTrayIcon.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ArrowDownTrayIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ArrowDownTrayIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/ArrowTrendingUpIcon.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/ArrowTrendingUpIcon.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ArrowTrendingUpIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ArrowTrendingUpIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function Bars3Icon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(Bars3Icon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/BellIcon.js":
/*!******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/BellIcon.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function BellIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(BellIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/BriefcaseIcon.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/BriefcaseIcon.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function BriefcaseIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(BriefcaseIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function CalendarIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(CalendarIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ClockIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ClockIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/CurrencyDollarIcon.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/CurrencyDollarIcon.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function CurrencyDollarIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(CurrencyDollarIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/GlobeAltIcon.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/GlobeAltIcon.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function GlobeAltIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(GlobeAltIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/HomeIcon.js":
/*!******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/HomeIcon.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function HomeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(HomeIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/MapPinIcon.js":
/*!********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/MapPinIcon.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function MapPinIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(MapPinIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function MusicalNoteIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(MusicalNoteIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/PlayIcon.js":
/*!******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/PlayIcon.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function PlayIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(PlayIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/PlusIcon.js":
/*!******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/PlusIcon.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function PlusIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 4.5v15m7.5-7.5h-15"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(PlusIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function SparklesIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(SparklesIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js":
/*!********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function TrophyIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(TrophyIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/UserGroupIcon.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/UserGroupIcon.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function UserGroupIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(UserGroupIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function UsersIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(UsersIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/VideoCameraIcon.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/VideoCameraIcon.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function VideoCameraIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(VideoCameraIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function XMarkIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18 18 6M6 6l12 12"
  }));
}
const ForwardRef = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(XMarkIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@react-aria/focus/dist/useFocusRing.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/@react-aria/focus/dist/useFocusRing.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFocusRing: () => (/* binding */ $f7dceffc5ad7768b$export$4e328f61c538687f)
/* harmony export */ });
/* harmony import */ var _react_aria_interactions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-aria/interactions */ "./node_modules/@react-aria/interactions/dist/useFocusVisible.mjs");
/* harmony import */ var _react_aria_interactions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-aria/interactions */ "./node_modules/@react-aria/interactions/dist/useFocus.mjs");
/* harmony import */ var _react_aria_interactions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-aria/interactions */ "./node_modules/@react-aria/interactions/dist/useFocusWithin.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");





function $f7dceffc5ad7768b$export$4e328f61c538687f(props = {}) {
    let { autoFocus: autoFocus = false, isTextInput: isTextInput, within: within } = props;
    let state = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
        isFocused: false,
        isFocusVisible: autoFocus || (0, _react_aria_interactions__WEBPACK_IMPORTED_MODULE_1__.isFocusVisible)()
    });
    let [isFocused, setFocused] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    let [isFocusVisibleState, setFocusVisible] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(()=>state.current.isFocused && state.current.isFocusVisible);
    let updateState = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>setFocusVisible(state.current.isFocused && state.current.isFocusVisible), []);
    let onFocusChange = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((isFocused)=>{
        state.current.isFocused = isFocused;
        setFocused(isFocused);
        updateState();
    }, [
        updateState
    ]);
    (0, _react_aria_interactions__WEBPACK_IMPORTED_MODULE_1__.useFocusVisibleListener)((isFocusVisible)=>{
        state.current.isFocusVisible = isFocusVisible;
        updateState();
    }, [], {
        isTextInput: isTextInput
    });
    let { focusProps: focusProps } = (0, _react_aria_interactions__WEBPACK_IMPORTED_MODULE_2__.useFocus)({
        isDisabled: within,
        onFocusChange: onFocusChange
    });
    let { focusWithinProps: focusWithinProps } = (0, _react_aria_interactions__WEBPACK_IMPORTED_MODULE_3__.useFocusWithin)({
        isDisabled: !within,
        onFocusWithinChange: onFocusChange
    });
    return {
        isFocused: isFocused,
        isFocusVisible: isFocusVisibleState,
        focusProps: within ? focusWithinProps : focusProps
    };
}



//# sourceMappingURL=useFocusRing.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/interactions/dist/useFocus.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@react-aria/interactions/dist/useFocus.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFocus: () => (/* binding */ $a1ea59d68270f0dd$export$f8168d8dd8fd66e6)
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.mjs */ "./node_modules/@react-aria/interactions/dist/utils.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/DOMFunctions.mjs");




/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions



function $a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
    let { isDisabled: isDisabled, onFocus: onFocusProp, onBlur: onBlurProp, onFocusChange: onFocusChange } = props;
    const onBlur = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e)=>{
        if (e.target === e.currentTarget) {
            if (onBlurProp) onBlurProp(e);
            if (onFocusChange) onFocusChange(false);
            return true;
        }
    }, [
        onBlurProp,
        onFocusChange
    ]);
    const onSyntheticFocus = (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_1__.useSyntheticBlurEvent)(onBlur);
    const onFocus = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e)=>{
        // Double check that document.activeElement actually matches e.target in case a previously chained
        // focus handler already moved focus somewhere else.
        const ownerDocument = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(e.target);
        const activeElement = ownerDocument ? (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.getActiveElement)(ownerDocument) : (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.getActiveElement)();
        if (e.target === e.currentTarget && activeElement === (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e.nativeEvent)) {
            if (onFocusProp) onFocusProp(e);
            if (onFocusChange) onFocusChange(true);
            onSyntheticFocus(e);
        }
    }, [
        onFocusChange,
        onFocusProp,
        onSyntheticFocus
    ]);
    return {
        focusProps: {
            onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
            onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : undefined
        }
    };
}



//# sourceMappingURL=useFocus.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/interactions/dist/useFocusVisible.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@react-aria/interactions/dist/useFocusVisible.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addWindowFocusTracking: () => (/* binding */ $507fabe10e71c6fb$export$2f1888112f558a7d),
/* harmony export */   getInteractionModality: () => (/* binding */ $507fabe10e71c6fb$export$630ff653c5ada6a9),
/* harmony export */   hasSetupGlobalListeners: () => (/* binding */ $507fabe10e71c6fb$export$d90243b58daecda7),
/* harmony export */   isFocusVisible: () => (/* binding */ $507fabe10e71c6fb$export$b9b3dfddab17db27),
/* harmony export */   setInteractionModality: () => (/* binding */ $507fabe10e71c6fb$export$8397ddfc504fdb9a),
/* harmony export */   useFocusVisible: () => (/* binding */ $507fabe10e71c6fb$export$ffd9e5021c1fb2d6),
/* harmony export */   useFocusVisibleListener: () => (/* binding */ $507fabe10e71c6fb$export$ec71b4b83ac08ec3),
/* harmony export */   useInteractionModality: () => (/* binding */ $507fabe10e71c6fb$export$98e20ec92f614cfe)
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.mjs */ "./node_modules/@react-aria/interactions/dist/utils.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/platform.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/isVirtualEvent.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _react_aria_ssr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @react-aria/ssr */ "./node_modules/@react-aria/ssr/dist/SSRProvider.mjs");





/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions




let $507fabe10e71c6fb$var$currentModality = null;
let $507fabe10e71c6fb$var$changeHandlers = new Set();
let $507fabe10e71c6fb$export$d90243b58daecda7 = new Map(); // We use a map here to support setting event listeners across multiple document objects.
let $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
let $507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
// Only Tab or Esc keys will make focus visible on text input elements
const $507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
    Tab: true,
    Escape: true
};
function $507fabe10e71c6fb$var$triggerChangeHandlers(modality, e) {
    for (let handler of $507fabe10e71c6fb$var$changeHandlers)handler(modality, e);
}
/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */ function $507fabe10e71c6fb$var$isValidKey(e) {
    // Control and Shift keys trigger when navigating back to the tab with keyboard.
    return !(e.metaKey || !(0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__.isMac)() && e.altKey || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}
function $507fabe10e71c6fb$var$handleKeyboardEvent(e) {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    if ($507fabe10e71c6fb$var$isValidKey(e)) {
        $507fabe10e71c6fb$var$currentModality = 'keyboard';
        $507fabe10e71c6fb$var$triggerChangeHandlers('keyboard', e);
    }
}
function $507fabe10e71c6fb$var$handlePointerEvent(e) {
    $507fabe10e71c6fb$var$currentModality = 'pointer';
    if (e.type === 'mousedown' || e.type === 'pointerdown') {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        $507fabe10e71c6fb$var$triggerChangeHandlers('pointer', e);
    }
}
function $507fabe10e71c6fb$var$handleClickEvent(e) {
    if ((0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__.isVirtualClick)(e)) {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        $507fabe10e71c6fb$var$currentModality = 'virtual';
    }
}
function $507fabe10e71c6fb$var$handleFocusEvent(e) {
    // Firefox fires two extra focus events when the user first clicks into an iframe:
    // first on the window, then on the document. We ignore these events so they don't
    // cause keyboard focus rings to appear.
    if (e.target === window || e.target === document || (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_3__.ignoreFocusEvent) || !e.isTrusted) return;
    // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
    // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
    if (!$507fabe10e71c6fb$var$hasEventBeforeFocus && !$507fabe10e71c6fb$var$hasBlurredWindowRecently) {
        $507fabe10e71c6fb$var$currentModality = 'virtual';
        $507fabe10e71c6fb$var$triggerChangeHandlers('virtual', e);
    }
    $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    $507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
}
function $507fabe10e71c6fb$var$handleWindowBlur() {
    if (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_3__.ignoreFocusEvent) return;
    // When the window is blurred, reset state. This is necessary when tabbing out of the window,
    // for example, since a subsequent focus event won't be fired.
    $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
    $507fabe10e71c6fb$var$hasBlurredWindowRecently = true;
}
/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */ function $507fabe10e71c6fb$var$setupGlobalFocusEvents(element) {
    if (typeof window === 'undefined' || typeof document === 'undefined' || $507fabe10e71c6fb$export$d90243b58daecda7.get((0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(element))) return;
    const windowObject = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(element);
    const documentObject = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerDocument)(element);
    // Programmatic focus() calls shouldn't affect the current input modality.
    // However, we need to detect other cases when a focus event occurs without
    // a preceding user event (e.g. screen reader focus). Overriding the focus
    // method on HTMLElement.prototype is a bit hacky, but works.
    let focus = windowObject.HTMLElement.prototype.focus;
    windowObject.HTMLElement.prototype.focus = function() {
        $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
        focus.apply(this, arguments);
    };
    documentObject.addEventListener('keydown', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    documentObject.addEventListener('keyup', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    documentObject.addEventListener('click', $507fabe10e71c6fb$var$handleClickEvent, true);
    // Register focus events on the window so they are sure to happen
    // before React's event listeners (registered on the document).
    windowObject.addEventListener('focus', $507fabe10e71c6fb$var$handleFocusEvent, true);
    windowObject.addEventListener('blur', $507fabe10e71c6fb$var$handleWindowBlur, false);
    if (typeof PointerEvent !== 'undefined') {
        documentObject.addEventListener('pointerdown', $507fabe10e71c6fb$var$handlePointerEvent, true);
        documentObject.addEventListener('pointermove', $507fabe10e71c6fb$var$handlePointerEvent, true);
        documentObject.addEventListener('pointerup', $507fabe10e71c6fb$var$handlePointerEvent, true);
    } else if (false) // removed by dead control flow
{}
    // Add unmount handler
    windowObject.addEventListener('beforeunload', ()=>{
        $507fabe10e71c6fb$var$tearDownWindowFocusTracking(element);
    }, {
        once: true
    });
    $507fabe10e71c6fb$export$d90243b58daecda7.set(windowObject, {
        focus: focus
    });
}
const $507fabe10e71c6fb$var$tearDownWindowFocusTracking = (element, loadListener)=>{
    const windowObject = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(element);
    const documentObject = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerDocument)(element);
    if (loadListener) documentObject.removeEventListener('DOMContentLoaded', loadListener);
    if (!$507fabe10e71c6fb$export$d90243b58daecda7.has(windowObject)) return;
    windowObject.HTMLElement.prototype.focus = $507fabe10e71c6fb$export$d90243b58daecda7.get(windowObject).focus;
    documentObject.removeEventListener('keydown', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    documentObject.removeEventListener('keyup', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
    documentObject.removeEventListener('click', $507fabe10e71c6fb$var$handleClickEvent, true);
    windowObject.removeEventListener('focus', $507fabe10e71c6fb$var$handleFocusEvent, true);
    windowObject.removeEventListener('blur', $507fabe10e71c6fb$var$handleWindowBlur, false);
    if (typeof PointerEvent !== 'undefined') {
        documentObject.removeEventListener('pointerdown', $507fabe10e71c6fb$var$handlePointerEvent, true);
        documentObject.removeEventListener('pointermove', $507fabe10e71c6fb$var$handlePointerEvent, true);
        documentObject.removeEventListener('pointerup', $507fabe10e71c6fb$var$handlePointerEvent, true);
    } else if (false) // removed by dead control flow
{}
    $507fabe10e71c6fb$export$d90243b58daecda7.delete(windowObject);
};
function $507fabe10e71c6fb$export$2f1888112f558a7d(element) {
    const documentObject = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerDocument)(element);
    let loadListener;
    if (documentObject.readyState !== 'loading') $507fabe10e71c6fb$var$setupGlobalFocusEvents(element);
    else {
        loadListener = ()=>{
            $507fabe10e71c6fb$var$setupGlobalFocusEvents(element);
        };
        documentObject.addEventListener('DOMContentLoaded', loadListener);
    }
    return ()=>$507fabe10e71c6fb$var$tearDownWindowFocusTracking(element, loadListener);
}
// Server-side rendering does not have the document object defined
// eslint-disable-next-line no-restricted-globals
if (typeof document !== 'undefined') $507fabe10e71c6fb$export$2f1888112f558a7d();
function $507fabe10e71c6fb$export$b9b3dfddab17db27() {
    return $507fabe10e71c6fb$var$currentModality !== 'pointer';
}
function $507fabe10e71c6fb$export$630ff653c5ada6a9() {
    return $507fabe10e71c6fb$var$currentModality;
}
function $507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
    $507fabe10e71c6fb$var$currentModality = modality;
    $507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}
function $507fabe10e71c6fb$export$98e20ec92f614cfe() {
    $507fabe10e71c6fb$var$setupGlobalFocusEvents();
    let [modality, setModality] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)($507fabe10e71c6fb$var$currentModality);
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        let handler = ()=>{
            setModality($507fabe10e71c6fb$var$currentModality);
        };
        $507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            $507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    }, []);
    return (0, _react_aria_ssr__WEBPACK_IMPORTED_MODULE_5__.useIsSSR)() ? null : modality;
}
const $507fabe10e71c6fb$var$nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset'
]);
/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */ function $507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e) {
    let document1 = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerDocument)(e === null || e === void 0 ? void 0 : e.target);
    const IHTMLInputElement = typeof window !== 'undefined' ? (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(e === null || e === void 0 ? void 0 : e.target).HTMLInputElement : HTMLInputElement;
    const IHTMLTextAreaElement = typeof window !== 'undefined' ? (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(e === null || e === void 0 ? void 0 : e.target).HTMLTextAreaElement : HTMLTextAreaElement;
    const IHTMLElement = typeof window !== 'undefined' ? (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(e === null || e === void 0 ? void 0 : e.target).HTMLElement : HTMLElement;
    const IKeyboardEvent = typeof window !== 'undefined' ? (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(e === null || e === void 0 ? void 0 : e.target).KeyboardEvent : KeyboardEvent;
    // For keyboard events that occur on a non-input element that will move focus into input element (aka ArrowLeft going from Datepicker button to the main input group)
    // we need to rely on the user passing isTextInput into here. This way we can skip toggling focus visiblity for said input element
    isTextInput = isTextInput || document1.activeElement instanceof IHTMLInputElement && !$507fabe10e71c6fb$var$nonTextInputTypes.has(document1.activeElement.type) || document1.activeElement instanceof IHTMLTextAreaElement || document1.activeElement instanceof IHTMLElement && document1.activeElement.isContentEditable;
    return !(isTextInput && modality === 'keyboard' && e instanceof IKeyboardEvent && !$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}
function $507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {}) {
    let { isTextInput: isTextInput, autoFocus: autoFocus } = props;
    let [isFocusVisibleState, setFocusVisible] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27());
    $507fabe10e71c6fb$export$ec71b4b83ac08ec3((isFocusVisible)=>{
        setFocusVisible(isFocusVisible);
    }, [
        isTextInput
    ], {
        isTextInput: isTextInput
    });
    return {
        isFocusVisible: isFocusVisibleState
    };
}
function $507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
    $507fabe10e71c6fb$var$setupGlobalFocusEvents();
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        let handler = (modality, e)=>{
            // We want to early return for any keyboard events that occur inside text inputs EXCEPT for Tab and Escape
            if (!$507fabe10e71c6fb$var$isKeyboardFocusEvent(!!(opts === null || opts === void 0 ? void 0 : opts.isTextInput), modality, e)) return;
            fn($507fabe10e71c6fb$export$b9b3dfddab17db27());
        };
        $507fabe10e71c6fb$var$changeHandlers.add(handler);
        return ()=>{
            $507fabe10e71c6fb$var$changeHandlers.delete(handler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}



//# sourceMappingURL=useFocusVisible.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/interactions/dist/useFocusWithin.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@react-aria/interactions/dist/useFocusWithin.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFocusWithin: () => (/* binding */ $9ab94262bd0047c7$export$420e68273165f4ec)
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.mjs */ "./node_modules/@react-aria/interactions/dist/utils.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/useGlobalListeners.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/DOMFunctions.mjs");




/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions



function $9ab94262bd0047c7$export$420e68273165f4ec(props) {
    let { isDisabled: isDisabled, onBlurWithin: onBlurWithin, onFocusWithin: onFocusWithin, onFocusWithinChange: onFocusWithinChange } = props;
    let state = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
        isFocusWithin: false
    });
    let { addGlobalListener: addGlobalListener, removeAllGlobalListeners: removeAllGlobalListeners } = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__.useGlobalListeners)();
    let onBlur = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e)=>{
        // Ignore events bubbling through portals.
        if (!e.currentTarget.contains(e.target)) return;
        // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
        // when moving focus inside the element. Only trigger if the currentTarget doesn't
        // include the relatedTarget (where focus is moving).
        if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
            state.current.isFocusWithin = false;
            removeAllGlobalListeners();
            if (onBlurWithin) onBlurWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(false);
        }
    }, [
        onBlurWithin,
        onFocusWithinChange,
        state,
        removeAllGlobalListeners
    ]);
    let onSyntheticFocus = (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_2__.useSyntheticBlurEvent)(onBlur);
    let onFocus = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e)=>{
        // Ignore events bubbling through portals.
        if (!e.currentTarget.contains(e.target)) return;
        // Double check that document.activeElement actually matches e.target in case a previously chained
        // focus handler already moved focus somewhere else.
        const ownerDocument = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.getOwnerDocument)(e.target);
        const activeElement = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getActiveElement)(ownerDocument);
        if (!state.current.isFocusWithin && activeElement === (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getEventTarget)(e.nativeEvent)) {
            if (onFocusWithin) onFocusWithin(e);
            if (onFocusWithinChange) onFocusWithinChange(true);
            state.current.isFocusWithin = true;
            onSyntheticFocus(e);
            // Browsers don't fire blur events when elements are removed from the DOM.
            // However, if a focus event occurs outside the element we're tracking, we
            // can manually fire onBlur.
            let currentTarget = e.currentTarget;
            addGlobalListener(ownerDocument, 'focus', (e)=>{
                if (state.current.isFocusWithin && !(0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.nodeContains)(currentTarget, e.target)) {
                    let nativeEvent = new ownerDocument.defaultView.FocusEvent('blur', {
                        relatedTarget: e.target
                    });
                    (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_2__.setEventTarget)(nativeEvent, currentTarget);
                    let event = (0, _utils_mjs__WEBPACK_IMPORTED_MODULE_2__.createSyntheticEvent)(nativeEvent);
                    onBlur(event);
                }
            }, {
                capture: true
            });
        }
    }, [
        onFocusWithin,
        onFocusWithinChange,
        onSyntheticFocus,
        addGlobalListener,
        onBlur
    ]);
    if (isDisabled) return {
        focusWithinProps: {
            // These cannot be null, that would conflict in mergeProps
            onFocus: undefined,
            onBlur: undefined
        }
    };
    return {
        focusWithinProps: {
            onFocus: onFocus,
            onBlur: onBlur
        }
    };
}



//# sourceMappingURL=useFocusWithin.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/interactions/dist/useHover.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@react-aria/interactions/dist/useHover.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useHover: () => (/* binding */ $6179b936705e76d3$export$ae780daf29e6d456)
/* harmony export */ });
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/useGlobalListeners.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/DOMFunctions.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");



/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions


// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
let $6179b936705e76d3$var$hoverCount = 0;
function $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
    $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = true;
    // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
    // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
    // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
    // the distant future because a user previously touched the element.
    setTimeout(()=>{
        $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
    }, 50);
}
function $6179b936705e76d3$var$handleGlobalPointerEvent(e) {
    if (e.pointerType === 'touch') $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}
function $6179b936705e76d3$var$setupGlobalTouchEvents() {
    if (typeof document === 'undefined') return;
    if (typeof PointerEvent !== 'undefined') document.addEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);
    else if (false) // removed by dead control flow
{}
    $6179b936705e76d3$var$hoverCount++;
    return ()=>{
        $6179b936705e76d3$var$hoverCount--;
        if ($6179b936705e76d3$var$hoverCount > 0) return;
        if (typeof PointerEvent !== 'undefined') document.removeEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);
        else if (false) // removed by dead control flow
{}
    };
}
function $6179b936705e76d3$export$ae780daf29e6d456(props) {
    let { onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, isDisabled: isDisabled } = props;
    let [isHovered, setHovered] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    let state = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
        isHovered: false,
        ignoreEmulatedMouseEvents: false,
        pointerType: '',
        target: null
    }).current;
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)($6179b936705e76d3$var$setupGlobalTouchEvents, []);
    let { addGlobalListener: addGlobalListener, removeAllGlobalListeners: removeAllGlobalListeners } = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__.useGlobalListeners)();
    let { hoverProps: hoverProps, triggerHoverEnd: triggerHoverEnd } = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>{
        let triggerHoverStart = (event, pointerType)=>{
            state.pointerType = pointerType;
            if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) return;
            state.isHovered = true;
            let target = event.currentTarget;
            state.target = target;
            // When an element that is hovered over is removed, no pointerleave event is fired by the browser,
            // even though the originally hovered target may have shrunk in size so it is no longer hovered.
            // However, a pointerover event will be fired on the new target the mouse is over.
            // In Chrome this happens immediately. In Safari and Firefox, it happens upon moving the mouse one pixel.
            addGlobalListener((0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(event.target), 'pointerover', (e)=>{
                if (state.isHovered && state.target && !(0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.nodeContains)(state.target, e.target)) triggerHoverEnd(e, e.pointerType);
            }, {
                capture: true
            });
            if (onHoverStart) onHoverStart({
                type: 'hoverstart',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(true);
            setHovered(true);
        };
        let triggerHoverEnd = (event, pointerType)=>{
            let target = state.target;
            state.pointerType = '';
            state.target = null;
            if (pointerType === 'touch' || !state.isHovered || !target) return;
            state.isHovered = false;
            removeAllGlobalListeners();
            if (onHoverEnd) onHoverEnd({
                type: 'hoverend',
                target: target,
                pointerType: pointerType
            });
            if (onHoverChange) onHoverChange(false);
            setHovered(false);
        };
        let hoverProps = {};
        if (typeof PointerEvent !== 'undefined') {
            hoverProps.onPointerEnter = (e)=>{
                if ($6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
                triggerHoverStart(e, e.pointerType);
            };
            hoverProps.onPointerLeave = (e)=>{
                if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, e.pointerType);
            };
        } else if (false) // removed by dead control flow
{}
        return {
            hoverProps: hoverProps,
            triggerHoverEnd: triggerHoverEnd
        };
    }, [
        onHoverStart,
        onHoverChange,
        onHoverEnd,
        isDisabled,
        state,
        addGlobalListener,
        removeAllGlobalListeners
    ]);
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (isDisabled) triggerHoverEnd({
            currentTarget: state.target
        }, state.pointerType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isDisabled
    ]);
    return {
        hoverProps: hoverProps,
        isHovered: isHovered
    };
}



//# sourceMappingURL=useHover.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/interactions/dist/utils.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/@react-aria/interactions/dist/utils.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSyntheticEvent: () => (/* binding */ $8a9cb279dc87e130$export$525bc4921d56d4a),
/* harmony export */   ignoreFocusEvent: () => (/* binding */ $8a9cb279dc87e130$export$fda7da73ab5d4c48),
/* harmony export */   preventFocus: () => (/* binding */ $8a9cb279dc87e130$export$cabe61c495ee3649),
/* harmony export */   setEventTarget: () => (/* binding */ $8a9cb279dc87e130$export$c2b7abe5d61ec696),
/* harmony export */   useSyntheticBlurEvent: () => (/* binding */ $8a9cb279dc87e130$export$715c682d09d639cc)
/* harmony export */ });
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/useLayoutEffect.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/useEffectEvent.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/isFocusable.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var _react_aria_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @react-aria/utils */ "./node_modules/@react-aria/utils/dist/focusWithoutScrolling.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");



/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 

function $8a9cb279dc87e130$export$525bc4921d56d4a(nativeEvent) {
    let event = nativeEvent;
    event.nativeEvent = nativeEvent;
    event.isDefaultPrevented = ()=>event.defaultPrevented;
    // cancelBubble is technically deprecated in the spec, but still supported in all browsers.
    event.isPropagationStopped = ()=>event.cancelBubble;
    event.persist = ()=>{};
    return event;
}
function $8a9cb279dc87e130$export$c2b7abe5d61ec696(event, target) {
    Object.defineProperty(event, 'target', {
        value: target
    });
    Object.defineProperty(event, 'currentTarget', {
        value: target
    });
}
function $8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
    let stateRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
        isFocused: false,
        observer: null
    });
    // Clean up MutationObserver on unmount. See below.
    (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(()=>{
        const state = stateRef.current;
        return ()=>{
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
        };
    }, []);
    let dispatchBlur = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_2__.useEffectEvent)((e)=>{
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    });
    // This function is called during a React onFocus event.
    return (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e)=>{
        // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
        // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
        // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
        // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
            stateRef.current.isFocused = true;
            let target = e.target;
            let onBlurHandler = (e)=>{
                stateRef.current.isFocused = false;
                if (target.disabled) {
                    // For backward compatibility, dispatch a (fake) React synthetic event.
                    let event = $8a9cb279dc87e130$export$525bc4921d56d4a(e);
                    dispatchBlur(event);
                }
                // We no longer need the MutationObserver once the target is blurred.
                if (stateRef.current.observer) {
                    stateRef.current.observer.disconnect();
                    stateRef.current.observer = null;
                }
            };
            target.addEventListener('focusout', onBlurHandler, {
                once: true
            });
            stateRef.current.observer = new MutationObserver(()=>{
                if (stateRef.current.isFocused && target.disabled) {
                    var _stateRef_current_observer;
                    (_stateRef_current_observer = stateRef.current.observer) === null || _stateRef_current_observer === void 0 ? void 0 : _stateRef_current_observer.disconnect();
                    let relatedTargetEl = target === document.activeElement ? null : document.activeElement;
                    target.dispatchEvent(new FocusEvent('blur', {
                        relatedTarget: relatedTargetEl
                    }));
                    target.dispatchEvent(new FocusEvent('focusout', {
                        bubbles: true,
                        relatedTarget: relatedTargetEl
                    }));
                }
            });
            stateRef.current.observer.observe(target, {
                attributes: true,
                attributeFilter: [
                    'disabled'
                ]
            });
        }
    }, [
        dispatchBlur
    ]);
}
let $8a9cb279dc87e130$export$fda7da73ab5d4c48 = false;
function $8a9cb279dc87e130$export$cabe61c495ee3649(target) {
    // The browser will focus the nearest focusable ancestor of our target.
    while(target && !(0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_3__.isFocusable)(target))target = target.parentElement;
    let window = (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_4__.getOwnerWindow)(target);
    let activeElement = window.document.activeElement;
    if (!activeElement || activeElement === target) return;
    $8a9cb279dc87e130$export$fda7da73ab5d4c48 = true;
    let isRefocusing = false;
    let onBlur = (e)=>{
        if (e.target === activeElement || isRefocusing) e.stopImmediatePropagation();
    };
    let onFocusOut = (e)=>{
        if (e.target === activeElement || isRefocusing) {
            e.stopImmediatePropagation();
            // If there was no focusable ancestor, we don't expect a focus event.
            // Re-focus the original active element here.
            if (!target && !isRefocusing) {
                isRefocusing = true;
                (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_5__.focusWithoutScrolling)(activeElement);
                cleanup();
            }
        }
    };
    let onFocus = (e)=>{
        if (e.target === target || isRefocusing) e.stopImmediatePropagation();
    };
    let onFocusIn = (e)=>{
        if (e.target === target || isRefocusing) {
            e.stopImmediatePropagation();
            if (!isRefocusing) {
                isRefocusing = true;
                (0, _react_aria_utils__WEBPACK_IMPORTED_MODULE_5__.focusWithoutScrolling)(activeElement);
                cleanup();
            }
        }
    };
    window.addEventListener('blur', onBlur, true);
    window.addEventListener('focusout', onFocusOut, true);
    window.addEventListener('focusin', onFocusIn, true);
    window.addEventListener('focus', onFocus, true);
    let cleanup = ()=>{
        cancelAnimationFrame(raf);
        window.removeEventListener('blur', onBlur, true);
        window.removeEventListener('focusout', onFocusOut, true);
        window.removeEventListener('focusin', onFocusIn, true);
        window.removeEventListener('focus', onFocus, true);
        $8a9cb279dc87e130$export$fda7da73ab5d4c48 = false;
        isRefocusing = false;
    };
    let raf = requestAnimationFrame(cleanup);
    return cleanup;
}



//# sourceMappingURL=utils.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/ssr/dist/SSRProvider.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@react-aria/ssr/dist/SSRProvider.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SSRProvider: () => (/* binding */ $b5e257d569688ac6$export$9f8ac96af4b1b2ae),
/* harmony export */   useIsSSR: () => (/* binding */ $b5e257d569688ac6$export$535bd6ca7f90a273),
/* harmony export */   useSSRSafeId: () => (/* binding */ $b5e257d569688ac6$export$619500959fc48b26)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ // We must avoid a circular dependency with @react-aria/utils, and this useLayoutEffect is
// guarded by a check that it only runs on the client side.
// eslint-disable-next-line rulesdir/useLayoutEffectRule

// Default context value to use in case there is no SSRProvider. This is fine for
// client-only apps. In order to support multiple copies of React Aria potentially
// being on the page at once, the prefix is set to a random number. SSRProvider
// will reset this to zero for consistency between server and client, so in the
// SSR case multiple copies of React Aria is not supported.
const $b5e257d569688ac6$var$defaultContext = {
    prefix: String(Math.round(Math.random() * 10000000000)),
    current: 0
};
const $b5e257d569688ac6$var$SSRContext = /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createContext($b5e257d569688ac6$var$defaultContext);
const $b5e257d569688ac6$var$IsSSRContext = /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createContext(false);
// This is only used in React < 18.
function $b5e257d569688ac6$var$LegacySSRProvider(props) {
    let cur = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)($b5e257d569688ac6$var$SSRContext);
    let counter = $b5e257d569688ac6$var$useCounter(cur === $b5e257d569688ac6$var$defaultContext);
    let [isSSR, setIsSSR] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
    let value = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({
            // If this is the first SSRProvider, start with an empty string prefix, otherwise
            // append and increment the counter.
            prefix: cur === $b5e257d569688ac6$var$defaultContext ? '' : `${cur.prefix}-${counter}`,
            current: 0
        }), [
        cur,
        counter
    ]);
    // If on the client, and the component was initially server rendered,
    // then schedule a layout effect to update the component after hydration.
    if (typeof document !== 'undefined') // This if statement technically breaks the rules of hooks, but is safe
    // because the condition never changes after mounting.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(()=>{
        setIsSSR(false);
    }, []);
    return /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createElement($b5e257d569688ac6$var$SSRContext.Provider, {
        value: value
    }, /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createElement($b5e257d569688ac6$var$IsSSRContext.Provider, {
        value: isSSR
    }, props.children));
}
let $b5e257d569688ac6$var$warnedAboutSSRProvider = false;
function $b5e257d569688ac6$export$9f8ac96af4b1b2ae(props) {
    if (typeof (0, react__WEBPACK_IMPORTED_MODULE_0__)['useId'] === 'function') {
        if ( true && !$b5e257d569688ac6$var$warnedAboutSSRProvider) {
            console.warn('In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.');
            $b5e257d569688ac6$var$warnedAboutSSRProvider = true;
        }
        return /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createElement((0, react__WEBPACK_IMPORTED_MODULE_0__).Fragment, null, props.children);
    }
    return /*#__PURE__*/ (0, react__WEBPACK_IMPORTED_MODULE_0__).createElement($b5e257d569688ac6$var$LegacySSRProvider, props);
}
let $b5e257d569688ac6$var$canUseDOM = Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
let $b5e257d569688ac6$var$componentIds = new WeakMap();
function $b5e257d569688ac6$var$useCounter(isDisabled = false) {
    let ctx = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)($b5e257d569688ac6$var$SSRContext);
    let ref = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    // eslint-disable-next-line rulesdir/pure-render
    if (ref.current === null && !isDisabled) {
        var _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner, _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        // In strict mode, React renders components twice, and the ref will be reset to null on the second render.
        // This means our id counter will be incremented twice instead of once. This is a problem because on the
        // server, components are only rendered once and so ids generated on the server won't match the client.
        // In React 18, useId was introduced to solve this, but it is not available in older versions. So to solve this
        // we need to use some React internals to access the underlying Fiber instance, which is stable between renders.
        // This is exposed as ReactCurrentOwner in development, which is all we need since StrictMode only runs in development.
        // To ensure that we only increment the global counter once, we store the starting id for this component in
        // a weak map associated with the Fiber. On the second render, we reset the global counter to this value.
        // Since React runs the second render immediately after the first, this is safe.
        // @ts-ignore
        let currentOwner = (_React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = (0, react__WEBPACK_IMPORTED_MODULE_0__).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === void 0 ? void 0 : (_React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner = _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner) === null || _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner === void 0 ? void 0 : _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner.current;
        if (currentOwner) {
            let prevComponentValue = $b5e257d569688ac6$var$componentIds.get(currentOwner);
            if (prevComponentValue == null) // On the first render, and first call to useId, store the id and state in our weak map.
            $b5e257d569688ac6$var$componentIds.set(currentOwner, {
                id: ctx.current,
                state: currentOwner.memoizedState
            });
            else if (currentOwner.memoizedState !== prevComponentValue.state) {
                // On the second render, the memoizedState gets reset by React.
                // Reset the counter, and remove from the weak map so we don't
                // do this for subsequent useId calls.
                ctx.current = prevComponentValue.id;
                $b5e257d569688ac6$var$componentIds.delete(currentOwner);
            }
        }
        // eslint-disable-next-line rulesdir/pure-render
        ref.current = ++ctx.current;
    }
    // eslint-disable-next-line rulesdir/pure-render
    return ref.current;
}
function $b5e257d569688ac6$var$useLegacySSRSafeId(defaultId) {
    let ctx = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)($b5e257d569688ac6$var$SSRContext);
    // If we are rendering in a non-DOM environment, and there's no SSRProvider,
    // provide a warning to hint to the developer to add one.
    if (ctx === $b5e257d569688ac6$var$defaultContext && !$b5e257d569688ac6$var$canUseDOM && "development" !== 'production') console.warn('When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.');
    let counter = $b5e257d569688ac6$var$useCounter(!!defaultId);
    let prefix = ctx === $b5e257d569688ac6$var$defaultContext && "development" === 'test' ? 0 : `react-aria${ctx.prefix}`;
    return defaultId || `${prefix}-${counter}`;
}
function $b5e257d569688ac6$var$useModernSSRSafeId(defaultId) {
    let id = (0, react__WEBPACK_IMPORTED_MODULE_0__).useId();
    let [didSSR] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)($b5e257d569688ac6$export$535bd6ca7f90a273());
    let prefix = didSSR || "development" === 'test' ? 'react-aria' : `react-aria${$b5e257d569688ac6$var$defaultContext.prefix}`;
    return defaultId || `${prefix}-${id}`;
}
const $b5e257d569688ac6$export$619500959fc48b26 = typeof (0, react__WEBPACK_IMPORTED_MODULE_0__)['useId'] === 'function' ? $b5e257d569688ac6$var$useModernSSRSafeId : $b5e257d569688ac6$var$useLegacySSRSafeId;
function $b5e257d569688ac6$var$getSnapshot() {
    return false;
}
function $b5e257d569688ac6$var$getServerSnapshot() {
    return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function $b5e257d569688ac6$var$subscribe(onStoreChange) {
    // noop
    return ()=>{};
}
function $b5e257d569688ac6$export$535bd6ca7f90a273() {
    // In React 18, we can use useSyncExternalStore to detect if we're server rendering or hydrating.
    if (typeof (0, react__WEBPACK_IMPORTED_MODULE_0__)['useSyncExternalStore'] === 'function') return (0, react__WEBPACK_IMPORTED_MODULE_0__)['useSyncExternalStore']($b5e257d569688ac6$var$subscribe, $b5e257d569688ac6$var$getSnapshot, $b5e257d569688ac6$var$getServerSnapshot);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)($b5e257d569688ac6$var$IsSSRContext);
}



//# sourceMappingURL=SSRProvider.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/DOMFunctions.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/DOMFunctions.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getActiveElement: () => (/* binding */ $d4ee10de306f2510$export$cd4e5573fbe2b576),
/* harmony export */   getEventTarget: () => (/* binding */ $d4ee10de306f2510$export$e58f029f0fbfdb29),
/* harmony export */   nodeContains: () => (/* binding */ $d4ee10de306f2510$export$4282f70798064fe0)
/* harmony export */ });
/* harmony import */ var _domHelpers_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domHelpers.mjs */ "./node_modules/@react-aria/utils/dist/domHelpers.mjs");
/* harmony import */ var _react_stately_flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @react-stately/flags */ "./node_modules/@react-stately/flags/dist/import.mjs");



// Source: https://github.com/microsoft/tabster/blob/a89fc5d7e332d48f68d03b1ca6e344489d1c3898/src/Shadowdomize/DOMFunctions.ts#L16


function $d4ee10de306f2510$export$4282f70798064fe0(node, otherNode) {
    if (!(0, _react_stately_flags__WEBPACK_IMPORTED_MODULE_0__.shadowDOM)()) return otherNode && node ? node.contains(otherNode) : false;
    if (!node || !otherNode) return false;
    let currentNode = otherNode;
    while(currentNode !== null){
        if (currentNode === node) return true;
        if (currentNode.tagName === 'SLOT' && currentNode.assignedSlot) // Element is slotted
        currentNode = currentNode.assignedSlot.parentNode;
        else if ((0, _domHelpers_mjs__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(currentNode)) // Element is in shadow root
        currentNode = currentNode.host;
        else currentNode = currentNode.parentNode;
    }
    return false;
}
const $d4ee10de306f2510$export$cd4e5573fbe2b576 = (doc = document)=>{
    var _activeElement_shadowRoot;
    if (!(0, _react_stately_flags__WEBPACK_IMPORTED_MODULE_0__.shadowDOM)()) return doc.activeElement;
    let activeElement = doc.activeElement;
    while(activeElement && 'shadowRoot' in activeElement && ((_activeElement_shadowRoot = activeElement.shadowRoot) === null || _activeElement_shadowRoot === void 0 ? void 0 : _activeElement_shadowRoot.activeElement))activeElement = activeElement.shadowRoot.activeElement;
    return activeElement;
};
function $d4ee10de306f2510$export$e58f029f0fbfdb29(event) {
    if ((0, _react_stately_flags__WEBPACK_IMPORTED_MODULE_0__.shadowDOM)() && event.target.shadowRoot) {
        if (event.composedPath) return event.composedPath()[0];
    }
    return event.target;
}



//# sourceMappingURL=DOMFunctions.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/domHelpers.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/domHelpers.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOwnerDocument: () => (/* binding */ $431fbd86ca7dc216$export$b204af158042fbac),
/* harmony export */   getOwnerWindow: () => (/* binding */ $431fbd86ca7dc216$export$f21a1ffae260145a),
/* harmony export */   isShadowRoot: () => (/* binding */ $431fbd86ca7dc216$export$af51f0f06c0f328a)
/* harmony export */ });
const $431fbd86ca7dc216$export$b204af158042fbac = (el)=>{
    var _el_ownerDocument;
    return (_el_ownerDocument = el === null || el === void 0 ? void 0 : el.ownerDocument) !== null && _el_ownerDocument !== void 0 ? _el_ownerDocument : document;
};
const $431fbd86ca7dc216$export$f21a1ffae260145a = (el)=>{
    if (el && 'window' in el && el.window === el) return el;
    const doc = $431fbd86ca7dc216$export$b204af158042fbac(el);
    return doc.defaultView || window;
};
/**
 * Type guard that checks if a value is a Node. Verifies the presence and type of the nodeType property.
 */ function $431fbd86ca7dc216$var$isNode(value) {
    return value !== null && typeof value === 'object' && 'nodeType' in value && typeof value.nodeType === 'number';
}
function $431fbd86ca7dc216$export$af51f0f06c0f328a(node) {
    return $431fbd86ca7dc216$var$isNode(node) && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in node;
}



//# sourceMappingURL=domHelpers.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/focusWithoutScrolling.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/focusWithoutScrolling.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   focusWithoutScrolling: () => (/* binding */ $7215afc6de606d6b$export$de79e2c695e052f3)
/* harmony export */ });
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function $7215afc6de606d6b$export$de79e2c695e052f3(element) {
    if ($7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
        preventScroll: true
    });
    else {
        let scrollableElements = $7215afc6de606d6b$var$getScrollableElements(element);
        element.focus();
        $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
    }
}
let $7215afc6de606d6b$var$supportsPreventScrollCached = null;
function $7215afc6de606d6b$var$supportsPreventScroll() {
    if ($7215afc6de606d6b$var$supportsPreventScrollCached == null) {
        $7215afc6de606d6b$var$supportsPreventScrollCached = false;
        try {
            let focusElem = document.createElement('div');
            focusElem.focus({
                get preventScroll () {
                    $7215afc6de606d6b$var$supportsPreventScrollCached = true;
                    return true;
                }
            });
        } catch  {
        // Ignore
        }
    }
    return $7215afc6de606d6b$var$supportsPreventScrollCached;
}
function $7215afc6de606d6b$var$getScrollableElements(element) {
    let parent = element.parentNode;
    let scrollableElements = [];
    let rootScrollingElement = document.scrollingElement || document.documentElement;
    while(parent instanceof HTMLElement && parent !== rootScrollingElement){
        if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
            element: parent,
            scrollTop: parent.scrollTop,
            scrollLeft: parent.scrollLeft
        });
        parent = parent.parentNode;
    }
    if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
    });
    return scrollableElements;
}
function $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
    for (let { element: element, scrollTop: scrollTop, scrollLeft: scrollLeft } of scrollableElements){
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
    }
}



//# sourceMappingURL=focusWithoutScrolling.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/isFocusable.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/isFocusable.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFocusable: () => (/* binding */ $b4b717babfbb907b$export$4c063cf1350e6fed),
/* harmony export */   isTabbable: () => (/* binding */ $b4b717babfbb907b$export$bebd5a1431fec25d)
/* harmony export */ });
const $b4b717babfbb907b$var$focusableElements = [
    'input:not([disabled]):not([type=hidden])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'a[href]',
    'area[href]',
    'summary',
    'iframe',
    'object',
    'embed',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable^="false"])'
];
const $b4b717babfbb907b$var$FOCUSABLE_ELEMENT_SELECTOR = $b4b717babfbb907b$var$focusableElements.join(':not([hidden]),') + ',[tabindex]:not([disabled]):not([hidden])';
$b4b717babfbb907b$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
const $b4b717babfbb907b$var$TABBABLE_ELEMENT_SELECTOR = $b4b717babfbb907b$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');
function $b4b717babfbb907b$export$4c063cf1350e6fed(element) {
    return element.matches($b4b717babfbb907b$var$FOCUSABLE_ELEMENT_SELECTOR);
}
function $b4b717babfbb907b$export$bebd5a1431fec25d(element) {
    return element.matches($b4b717babfbb907b$var$TABBABLE_ELEMENT_SELECTOR);
}



//# sourceMappingURL=isFocusable.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/isVirtualEvent.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/isVirtualEvent.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isVirtualClick: () => (/* binding */ $6a7db85432448f7f$export$60278871457622de),
/* harmony export */   isVirtualPointerEvent: () => (/* binding */ $6a7db85432448f7f$export$29bf1b5f2c56cf63)
/* harmony export */ });
/* harmony import */ var _platform_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform.mjs */ "./node_modules/@react-aria/utils/dist/platform.mjs");


/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 
function $6a7db85432448f7f$export$60278871457622de(event) {
    // JAWS/NVDA with Firefox.
    if (event.mozInputSource === 0 && event.isTrusted) return true;
    // Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
    // If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
    // to detect TalkBack virtual clicks.
    if ((0, _platform_mjs__WEBPACK_IMPORTED_MODULE_0__.isAndroid)() && event.pointerType) return event.type === 'click' && event.buttons === 1;
    return event.detail === 0 && !event.pointerType;
}
function $6a7db85432448f7f$export$29bf1b5f2c56cf63(event) {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
    // Talkback double tap from Windows Firefox touch screen press
    return !(0, _platform_mjs__WEBPACK_IMPORTED_MODULE_0__.isAndroid)() && event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}



//# sourceMappingURL=isVirtualEvent.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/platform.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/platform.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAndroid: () => (/* binding */ $c87311424ea30a05$export$a11b0059900ceec8),
/* harmony export */   isAppleDevice: () => (/* binding */ $c87311424ea30a05$export$e1865c3bedcd822b),
/* harmony export */   isChrome: () => (/* binding */ $c87311424ea30a05$export$6446a186d09e379e),
/* harmony export */   isFirefox: () => (/* binding */ $c87311424ea30a05$export$b7d78993b74f766d),
/* harmony export */   isIOS: () => (/* binding */ $c87311424ea30a05$export$fedb369cb70207f1),
/* harmony export */   isIPad: () => (/* binding */ $c87311424ea30a05$export$7bef049ce92e4224),
/* harmony export */   isIPhone: () => (/* binding */ $c87311424ea30a05$export$186c6964ca17d99),
/* harmony export */   isMac: () => (/* binding */ $c87311424ea30a05$export$9ac100e40613ea10),
/* harmony export */   isWebKit: () => (/* binding */ $c87311424ea30a05$export$78551043582a6a98)
/* harmony export */ });
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ function $c87311424ea30a05$var$testUserAgent(re) {
    var _window_navigator_userAgentData;
    if (typeof window === 'undefined' || window.navigator == null) return false;
    return ((_window_navigator_userAgentData = window.navigator['userAgentData']) === null || _window_navigator_userAgentData === void 0 ? void 0 : _window_navigator_userAgentData.brands.some((brand)=>re.test(brand.brand))) || re.test(window.navigator.userAgent);
}
function $c87311424ea30a05$var$testPlatform(re) {
    var _window_navigator_userAgentData;
    return typeof window !== 'undefined' && window.navigator != null ? re.test(((_window_navigator_userAgentData = window.navigator['userAgentData']) === null || _window_navigator_userAgentData === void 0 ? void 0 : _window_navigator_userAgentData.platform) || window.navigator.platform) : false;
}
function $c87311424ea30a05$var$cached(fn) {
    if (false) // removed by dead control flow
{}
    let res = null;
    return ()=>{
        if (res == null) res = fn();
        return res;
    };
}
const $c87311424ea30a05$export$9ac100e40613ea10 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testPlatform(/^Mac/i);
});
const $c87311424ea30a05$export$186c6964ca17d99 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testPlatform(/^iPhone/i);
});
const $c87311424ea30a05$export$7bef049ce92e4224 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testPlatform(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    $c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
});
const $c87311424ea30a05$export$fedb369cb70207f1 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$export$186c6964ca17d99() || $c87311424ea30a05$export$7bef049ce92e4224();
});
const $c87311424ea30a05$export$e1865c3bedcd822b = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$export$9ac100e40613ea10() || $c87311424ea30a05$export$fedb369cb70207f1();
});
const $c87311424ea30a05$export$78551043582a6a98 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !$c87311424ea30a05$export$6446a186d09e379e();
});
const $c87311424ea30a05$export$6446a186d09e379e = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testUserAgent(/Chrome/i);
});
const $c87311424ea30a05$export$a11b0059900ceec8 = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testUserAgent(/Android/i);
});
const $c87311424ea30a05$export$b7d78993b74f766d = $c87311424ea30a05$var$cached(function() {
    return $c87311424ea30a05$var$testUserAgent(/Firefox/i);
});



//# sourceMappingURL=platform.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/useEffectEvent.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/useEffectEvent.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEffectEvent: () => (/* binding */ $8ae05eaa5c114e9c$export$7f54fc3180508a52)
/* harmony export */ });
/* harmony import */ var _useLayoutEffect_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useLayoutEffect.mjs */ "./node_modules/@react-aria/utils/dist/useLayoutEffect.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");



/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 

function $8ae05eaa5c114e9c$export$7f54fc3180508a52(fn) {
    const ref = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    (0, _useLayoutEffect_mjs__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(()=>{
        ref.current = fn;
    }, [
        fn
    ]);
    // @ts-ignore
    return (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...args)=>{
        const f = ref.current;
        return f === null || f === void 0 ? void 0 : f(...args);
    }, []);
}



//# sourceMappingURL=useEffectEvent.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/useGlobalListeners.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/useGlobalListeners.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useGlobalListeners: () => (/* binding */ $03deb23ff14920c4$export$4eaf04e54aa8eed6)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 
function $03deb23ff14920c4$export$4eaf04e54aa8eed6() {
    let globalListeners = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map());
    let addGlobalListener = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((eventTarget, type, listener, options)=>{
        // Make sure we remove the listener after it is called with the `once` option.
        let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args)=>{
            globalListeners.current.delete(listener);
            listener(...args);
        } : listener;
        globalListeners.current.set(listener, {
            type: type,
            eventTarget: eventTarget,
            fn: fn,
            options: options
        });
        eventTarget.addEventListener(type, fn, options);
    }, []);
    let removeGlobalListener = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((eventTarget, type, listener, options)=>{
        var _globalListeners_current_get;
        let fn = ((_globalListeners_current_get = globalListeners.current.get(listener)) === null || _globalListeners_current_get === void 0 ? void 0 : _globalListeners_current_get.fn) || listener;
        eventTarget.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
    }, []);
    let removeAllGlobalListeners = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        globalListeners.current.forEach((value, key)=>{
            removeGlobalListener(value.eventTarget, value.type, key, value.options);
        });
    }, [
        removeGlobalListener
    ]);
    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        return removeAllGlobalListeners;
    }, [
        removeAllGlobalListeners
    ]);
    return {
        addGlobalListener: addGlobalListener,
        removeGlobalListener: removeGlobalListener,
        removeAllGlobalListeners: removeAllGlobalListeners
    };
}



//# sourceMappingURL=useGlobalListeners.module.js.map


/***/ }),

/***/ "./node_modules/@react-aria/utils/dist/useLayoutEffect.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@react-aria/utils/dist/useLayoutEffect.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLayoutEffect: () => (/* binding */ $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");


/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 
const $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof document !== 'undefined' ? (0, react__WEBPACK_IMPORTED_MODULE_0__).useLayoutEffect : ()=>{};



//# sourceMappingURL=useLayoutEffect.module.js.map


/***/ }),

/***/ "./node_modules/@react-stately/flags/dist/import.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@react-stately/flags/dist/import.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enableShadowDOM: () => (/* binding */ $f4e2df6bd15f8569$export$12b151d9882e9985),
/* harmony export */   enableTableNestedRows: () => (/* binding */ $f4e2df6bd15f8569$export$d9d8a0f82de49530),
/* harmony export */   shadowDOM: () => (/* binding */ $f4e2df6bd15f8569$export$98658e8c59125e6a),
/* harmony export */   tableNestedRows: () => (/* binding */ $f4e2df6bd15f8569$export$1b00cb14a96194e6)
/* harmony export */ });
/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ let $f4e2df6bd15f8569$var$_tableNestedRows = false;
let $f4e2df6bd15f8569$var$_shadowDOM = false;
function $f4e2df6bd15f8569$export$d9d8a0f82de49530() {
    $f4e2df6bd15f8569$var$_tableNestedRows = true;
}
function $f4e2df6bd15f8569$export$1b00cb14a96194e6() {
    return $f4e2df6bd15f8569$var$_tableNestedRows;
}
function $f4e2df6bd15f8569$export$12b151d9882e9985() {
    $f4e2df6bd15f8569$var$_shadowDOM = true;
}
function $f4e2df6bd15f8569$export$98658e8c59125e6a() {
    return $f4e2df6bd15f8569$var$_shadowDOM;
}



//# sourceMappingURL=module.js.map


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/tabbable/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/tabbable/dist/index.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   focusable: () => (/* binding */ focusable),
/* harmony export */   getTabIndex: () => (/* binding */ getTabIndex),
/* harmony export */   isFocusable: () => (/* binding */ isFocusable),
/* harmony export */   isTabbable: () => (/* binding */ isTabbable),
/* harmony export */   tabbable: () => (/* binding */ tabbable)
/* harmony export */ });
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
// CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
//  the entire query to fail, resulting in no nodes found, which will break a lot
//  of things... so we have to rely on JS to identify nodes inside an inert container
var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node is inert or in an inert ancestor.
 * @param {Element} [node]
 * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
 *  see if any of them are inert. If false, only `node` itself is considered.
 * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
 *  False if `node` is falsy.
 */
var isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  //  JS API property; we have to check the attribute, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's an active element
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
  var inert = inertAtt === '' || inertAtt === 'true';

  // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
  //  if it weren't for `matches()` not being a function on shadow roots; the following
  //  code works for any kind of node
  // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
  //  so it likely would not support `:is([inert] *)` either...
  var result = inert || lookUp && node && isInert(node.parentNode); // recursive

  return result;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */
var getCandidates = function getCandidates(el, includeContainer, filter) {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};

/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidateScope
 * @property {Element} scopeParent contains inner candidates
 * @property {Element[]} candidates list of candidates found in the scope parent
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidateScope>}
 */
var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }
    if (element.tagName === 'SLOT') {
      // add shadow dom slot scope (slot itself cannot be focusable)
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      // check candidate element
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      var shadowRoot = element.shadowRoot ||
      // check for an undisclosed shadow
      typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};

/**
 * @private
 * Determines if the node has an explicitly specified `tabindex` attribute.
 * @param {HTMLElement} node
 * @returns {boolean} True if so; false if not.
 */
var hasTabIndex = function hasTabIndex(node) {
  return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
};

/**
 * Determine the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number} Tab order (negative, 0, or positive number).
 * @throws {Error} If `node` is falsy.
 */
var getTabIndex = function getTabIndex(node) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};

/**
 * Determine the tab index of a given node __for sort order purposes__.
 * @param {HTMLElement} node
 * @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
 *  has tabIndex -1, but needs to be sorted by document order in order for its content to be
 *  inserted into the correct sort position.
 * @returns {number} Tab order (negative, 0, or positive number).
 */
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled ||
  // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};

/**
 * @param {Array.<Element|CandidateScope>} candidates
 * @returns Element[]
 */
var sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function (item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');
var isFocusable = function isFocusable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function is(x, y) {
      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "react"),
      objectIs = "function" === typeof Object.is ? Object.is : is,
      useSyncExternalStore = React.useSyncExternalStore,
      useRef = React.useRef,
      useEffect = React.useEffect,
      useMemo = React.useMemo,
      useDebugValue = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function (
      subscribe,
      getSnapshot,
      getServerSnapshot,
      selector,
      isEqual
    ) {
      var instRef = useRef(null);
      if (null === instRef.current) {
        var inst = { hasValue: !1, value: null };
        instRef.current = inst;
      } else inst = instRef.current;
      instRef = useMemo(
        function () {
          function memoizedSelector(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = !0;
              memoizedSnapshot = nextSnapshot;
              nextSnapshot = selector(nextSnapshot);
              if (void 0 !== isEqual && inst.hasValue) {
                var currentSelection = inst.value;
                if (isEqual(currentSelection, nextSnapshot))
                  return (memoizedSelection = currentSelection);
              }
              return (memoizedSelection = nextSnapshot);
            }
            currentSelection = memoizedSelection;
            if (objectIs(memoizedSnapshot, nextSnapshot))
              return currentSelection;
            var nextSelection = selector(nextSnapshot);
            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
              return (memoizedSnapshot = nextSnapshot), currentSelection;
            memoizedSnapshot = nextSnapshot;
            return (memoizedSelection = nextSelection);
          }
          var hasMemo = !1,
            memoizedSnapshot,
            memoizedSelection,
            maybeGetServerSnapshot =
              void 0 === getServerSnapshot ? null : getServerSnapshot;
          return [
            function () {
              return memoizedSelector(getSnapshot());
            },
            null === maybeGetServerSnapshot
              ? void 0
              : function () {
                  return memoizedSelector(maybeGetServerSnapshot());
                }
          ];
        },
        [getSnapshot, getServerSnapshot, selector, isEqual]
      );
      var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
      useEffect(
        function () {
          inst.hasValue = !0;
          inst.value = value;
        },
        [value]
      );
      useDebugValue(value);
      return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ }),

/***/ "./node_modules/use-sync-external-store/with-selector.js":
/*!***************************************************************!*\
  !*** ./node_modules/use-sync-external-store/with-selector.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/use-sync-external-store-with-selector.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js");
}


/***/ }),

/***/ "./src/scripts/MakerBlocks.js":
/*!************************************!*\
  !*** ./src/scripts/MakerBlocks.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _apps_flowstate_FlowState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apps/flowstate/FlowState */ "./src/scripts/apps/flowstate/FlowState.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



class MakerBlocks {
  constructor() {
    this.componentRegistry = [{
      id: "flowstate-app",
      component: _apps_flowstate_FlowState__WEBPACK_IMPORTED_MODULE_1__["default"],
      name: "FlowState"
    }];
    this.init();
  }
  parseComponentProps(element, componentName) {
    const propsData = element.getAttribute("component-data");
    let props = {};
    if (propsData) {
      try {
        props = JSON.parse(propsData);
      } catch (e) {
        console.warn(`Failed to parse ${componentName} component props:`, e);
      }
    }
    return props;
  }
  mountComponent(config, element) {
    const {
      component: Component,
      name
    } = config;
    const props = this.parseComponentProps(element, name);
    try {
      const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot)(element);
      root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Component, {
        ...props
      }));
    } catch (error) {
      console.error(`Failed to mount ${name} component:`, error);
    }
  }
  initializeComponents() {
    this.componentRegistry.forEach(config => {
      const element = document.getElementById(config.id);
      if (element) {
        this.mountComponent(config, element);
      }
    });
  }
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }
  mountById(componentId) {
    const config = this.componentRegistry.find(c => c.id === componentId);
    const element = document.getElementById(componentId);
    if (config && element) {
      this.mountComponent(config, element);
    } else {
      console.warn(`Component or element not found for ID: ${componentId}`);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MakerBlocks);

/***/ }),

/***/ "./src/scripts/apps/flowstate/FlowState.js":
/*!*************************************************!*\
  !*** ./src/scripts/apps/flowstate/FlowState.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FlowState)
/* harmony export */ });
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _layouts_DashboardLayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layouts/DashboardLayout */ "./src/scripts/apps/flowstate/layouts/DashboardLayout.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function FlowState(props) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_context_AppContext__WEBPACK_IMPORTED_MODULE_0__.AppProvider, {
    ...props,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_layouts_DashboardLayout__WEBPACK_IMPORTED_MODULE_1__["default"], {})
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/masterclasses/MasterclassCard.js":
/*!********************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/masterclasses/MasterclassCard.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MasterclassCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/UserGroupIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function MasterclassCard({
  masterclass,
  onEnroll,
  onView
}) {
  const getDifficultyVariant = level => {
    const variants = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
      all_levels: 'info'
    };
    return variants[level] || 'default';
  };
  const formatPrice = (price, isFree) => {
    if (isFree) return 'Free';
    if (!price) return 'Free';
    return `$${price}`;
  };
  const formatDuration = minutes => {
    if (!minutes) return 'Variable';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow",
    children: [masterclass.coverImageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "aspect-video w-full",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
        src: masterclass.coverImageUrl,
        alt: masterclass.title,
        className: "h-full w-full object-cover"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-5",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
            className: "text-base font-semibold text-gray-900 line-clamp-2",
            children: masterclass.title
          }), masterclass.instructorName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
            className: "text-sm text-gray-500 mt-1",
            children: ["by ", masterclass.instructorName]
          })]
        }), masterclass.difficultyLevel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
          variant: getDifficultyVariant(masterclass.difficultyLevel),
          size: "sm",
          children: masterclass.difficultyLevel.replace('_', ' ')
        })]
      }), masterclass.description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "mt-3 text-sm text-gray-600 line-clamp-2",
        children: masterclass.description
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 flex items-center space-x-4 text-sm text-gray-500",
        children: [masterclass.durationMinutes && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
            className: "h-4 w-4 mr-1"
          }), formatDuration(masterclass.durationMinutes)]
        }), masterclass.enrollmentCount !== undefined && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
            className: "h-4 w-4 mr-1"
          }), masterclass.enrollmentCount, " enrolled"]
        }), masterclass.category && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "text-xs",
          children: masterclass.category
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 flex items-center justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "text-lg font-bold text-gray-900",
          children: formatPrice(masterclass.price, masterclass.isFree)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex space-x-2",
          children: [onView && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            onClick: () => onView(masterclass),
            className: "inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
            children: "View"
          }), onEnroll && masterclass.status === 'published' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
            type: "button",
            onClick: () => onEnroll(masterclass),
            className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
              className: "h-4 w-4 mr-1"
            }), "Enroll"]
          })]
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/masterclasses/MasterclassList.js":
/*!********************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/masterclasses/MasterclassList.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MasterclassList)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* harmony import */ var _MasterclassCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MasterclassCard */ "./src/scripts/apps/flowstate/components/masterclasses/MasterclassCard.js");
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/EmptyState */ "./src/scripts/apps/flowstate/components/shared/EmptyState.js");
/* harmony import */ var _shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function MasterclassList({
  masterclasses,
  isLoading,
  onEnroll,
  onView,
  onCreate
}) {
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  if (!masterclasses || masterclasses.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__["default"], {
      icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
      title: "No masterclasses available",
      description: "Check back soon for new learning opportunities.",
      actionLabel: onCreate ? 'Create Masterclass' : null,
      onAction: onCreate
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
    children: masterclasses.map(masterclass => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_MasterclassCard__WEBPACK_IMPORTED_MODULE_0__["default"], {
      masterclass: masterclass,
      onEnroll: onEnroll,
      onView: onView
    }, masterclass.id))
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/placements/PlacementCard.js":
/*!***************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/placements/PlacementCard.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlacementCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CurrencyDollarIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/GlobeAltIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function PlacementCard({
  placement
}) {
  const getStatusVariant = status => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      released: 'success',
      cancelled: 'danger'
    };
    return variants[status] || 'default';
  };
  const getTypeVariant = type => {
    const variants = {
      sync: 'purple',
      artist: 'info',
      label: 'success',
      publishing: 'warning',
      other: 'default'
    };
    return variants[type] || 'default';
  };
  const formatDate = dateString => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatCurrency = (value, currency = 'USD') => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-5",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
            className: "text-base font-semibold text-gray-900 truncate",
            children: placement.projectName
          }), placement.clientName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
            className: "text-sm text-gray-500 mt-1",
            children: placement.clientName
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex flex-col items-end space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
            variant: getStatusVariant(placement.status),
            size: "sm",
            children: placement.status
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
            variant: getTypeVariant(placement.placementType),
            size: "sm",
            children: placement.placementType
          })]
        })]
      }), placement.trackTitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-3 text-sm text-gray-600",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "font-medium",
          children: "Track:"
        }), " ", placement.trackTitle]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 grid grid-cols-2 gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              className: "text-xs text-gray-500",
              children: "Value"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              className: "font-medium text-gray-900",
              children: formatCurrency(placement.value, placement.currency)
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              className: "text-xs text-gray-500",
              children: "Date"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              className: "font-medium text-gray-900",
              children: formatDate(placement.placementDate)
            })]
          })]
        })]
      }), placement.territory && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-3 flex items-center text-sm text-gray-500",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "h-5 w-5 mr-2 text-gray-400"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          children: placement.territory
        })]
      }), placement.royaltyPercentage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-3 text-sm text-gray-600",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "font-medium",
          children: "Royalty:"
        }), " ", placement.royaltyPercentage, "%"]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/placements/PlacementList.js":
/*!***************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/placements/PlacementList.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlacementList)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BriefcaseIcon.js");
/* harmony import */ var _PlacementCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PlacementCard */ "./src/scripts/apps/flowstate/components/placements/PlacementCard.js");
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/EmptyState */ "./src/scripts/apps/flowstate/components/shared/EmptyState.js");
/* harmony import */ var _shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function PlacementList({
  placements,
  isLoading,
  onCreate
}) {
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  if (!placements || placements.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__["default"], {
      icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
      title: "No placements yet",
      description: "Record your first placement to track your success.",
      actionLabel: onCreate ? 'Add Placement' : null,
      onAction: onCreate
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
    children: placements.map(placement => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_PlacementCard__WEBPACK_IMPORTED_MODULE_0__["default"], {
      placement: placement
    }, placement.id))
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/shared/Badge.js":
/*!***************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/shared/Badge.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Badge)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function Badge({
  children,
  variant = 'default',
  size = 'md'
}) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    pioneer: 'bg-indigo-100 text-indigo-800'
  };
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
    className: `inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`,
    children: children
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/shared/EmptyState.js":
/*!********************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/shared/EmptyState.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmptyState)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/PlusIcon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);


function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
    className: "text-center py-12",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "mx-auto h-12 w-12 text-gray-400",
      children: Icon ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
        className: "h-12 w-12"
      }) : null
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
      className: "mt-2 text-sm font-semibold text-gray-900",
      children: title
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "mt-1 text-sm text-gray-500",
      children: description
    }), actionLabel && onAction && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "mt-6",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
        type: "button",
        onClick: onAction,
        className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__["default"], {
          "aria-hidden": "true",
          className: "-ml-0.5 mr-1.5 h-5 w-5"
        }), actionLabel]
      })
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js":
/*!************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoadingSpinner)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function LoadingSpinner({
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: `flex justify-center items-center ${className}`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: `animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`,
      role: "status",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
        className: "sr-only",
        children: "Loading..."
      })
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/stats/ContributionScore.js":
/*!**************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/stats/ContributionScore.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContributionScore)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function ContributionScore({
  score,
  breakdown,
  membershipType
}) {
  const getMembershipVariant = type => {
    const variants = {
      pioneer: 'pioneer',
      elite: 'purple',
      board: 'success',
      regular: 'default'
    };
    return variants[type] || 'default';
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "rounded-md bg-yellow-500 p-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
              className: "h-6 w-6 text-white",
              "aria-hidden": "true"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "ml-4",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
              className: "text-sm font-medium text-gray-500",
              children: "Contribution Score"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
              className: "text-3xl font-bold text-gray-900",
              children: score
            })]
          })]
        }), membershipType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
          variant: getMembershipVariant(membershipType),
          children: membershipType
        })]
      }), breakdown && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-6 space-y-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "text-sm font-medium text-gray-900 border-b border-gray-200 pb-2",
          children: "Score Breakdown"
        }), breakdown.tracks && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex justify-between text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "text-gray-600",
            children: ["Tracks Uploaded (", breakdown.tracks.count, ")"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "font-medium text-gray-900",
            children: [breakdown.tracks.points, " pts"]
          })]
        }), breakdown.placements && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex justify-between text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "text-gray-600",
            children: ["Placements (", breakdown.placements.count, ")"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "font-medium text-gray-900",
            children: [breakdown.placements.points, " pts"]
          })]
        }), breakdown.masterclasses && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex justify-between text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "text-gray-600",
            children: ["Masterclasses (", breakdown.masterclasses.count, ")"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "font-medium text-gray-900",
            children: [breakdown.masterclasses.points, " pts"]
          })]
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/stats/StatCard.js":
/*!*****************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/stats/StatCard.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StatCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/ArrowUpIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/ArrowDownIcon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);


function StatCard({
  name,
  value,
  icon: Icon,
  change,
  changeType = 'increase'
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white px-4 py-5 shadow-xs sm:p-6",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      className: "flex items-center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "flex-shrink-0",
        children: Icon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
          className: "rounded-md bg-indigo-500 p-3",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
            className: "h-6 w-6 text-white",
            "aria-hidden": "true"
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "ml-5 w-0 flex-1",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("dt", {
          className: "truncate text-sm font-medium text-gray-500",
          children: name
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("dd", {
          className: "flex items-baseline",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            className: "text-2xl font-semibold text-gray-900",
            children: value
          }), change && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: `ml-2 flex items-baseline text-sm font-semibold ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`,
            children: [changeType === 'increase' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_1__["default"], {
              className: "h-5 w-5 flex-shrink-0 self-center text-green-500",
              "aria-hidden": "true"
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_2__["default"], {
              className: "h-5 w-5 flex-shrink-0 self-center text-red-500",
              "aria-hidden": "true"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
              className: "sr-only",
              children: [changeType === 'increase' ? 'Increased' : 'Decreased', " by"]
            }), change]
          })]
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/sync/SyncOpportunityCard.js":
/*!***************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/sync/SyncOpportunityCard.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SyncOpportunityCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CurrencyDollarIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function SyncOpportunityCard({
  opportunity,
  onSubmit,
  onView
}) {
  const getStatusVariant = status => {
    const variants = {
      open: 'success',
      in_review: 'warning',
      closed: 'default',
      awarded: 'info'
    };
    return variants[status] || 'default';
  };
  const getProjectTypeVariant = type => {
    const variants = {
      film: 'purple',
      tv: 'info',
      commercial: 'success',
      game: 'warning',
      trailer: 'danger',
      other: 'default'
    };
    return variants[type] || 'default';
  };
  const formatDate = dateString => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatBudget = (budget, currency = 'USD') => {
    if (!budget) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(budget);
  };
  const isDeadlineSoon = deadline => {
    if (!deadline) return false;
    const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil > 0;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-5",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
            className: "text-base font-semibold text-gray-900 line-clamp-2",
            children: opportunity.title
          }), opportunity.clientName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
            className: "text-sm text-gray-500 mt-1",
            children: opportunity.clientName
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex flex-col items-end space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
            variant: getStatusVariant(opportunity.status),
            size: "sm",
            children: opportunity.status.replace('_', ' ')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
            variant: getProjectTypeVariant(opportunity.projectType),
            size: "sm",
            children: opportunity.projectType
          })]
        })]
      }), opportunity.description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "mt-3 text-sm text-gray-600 line-clamp-2",
        children: opportunity.description
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 space-y-2",
        children: [opportunity.budget && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: "text-xs text-gray-500",
              children: "Budget: "
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: "font-medium text-gray-900",
              children: formatBudget(opportunity.budget, opportunity.budgetCurrency)
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: "text-xs text-gray-500",
              children: "Deadline: "
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: classNames('font-medium', isDeadlineSoon(opportunity.deadline) ? 'text-red-600' : 'text-gray-900'),
              children: formatDate(opportunity.deadline)
            })]
          })]
        }), opportunity.submissionCount !== undefined && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            children: [opportunity.submissionCount, opportunity.maxSubmissions && `/${opportunity.maxSubmissions}`, " submissions"]
          })]
        })]
      }), (opportunity.requiredGenre || opportunity.requiredMood) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-3 flex flex-wrap gap-2",
        children: [opportunity.requiredGenre && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700",
          children: opportunity.requiredGenre
        }), opportunity.requiredMood && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700",
          children: opportunity.requiredMood
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 flex space-x-2",
        children: [onView && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          onClick: () => onView(opportunity),
          className: "flex-1 inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
          children: "View Details"
        }), onSubmit && opportunity.status === 'open' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          onClick: () => onSubmit(opportunity),
          className: "flex-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500",
          children: "Submit Track"
        })]
      })]
    })
  });
}
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/sync/SyncOpportunityList.js":
/*!***************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/sync/SyncOpportunityList.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SyncOpportunityList)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js");
/* harmony import */ var _SyncOpportunityCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SyncOpportunityCard */ "./src/scripts/apps/flowstate/components/sync/SyncOpportunityCard.js");
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/EmptyState */ "./src/scripts/apps/flowstate/components/shared/EmptyState.js");
/* harmony import */ var _shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function SyncOpportunityList({
  opportunities,
  isLoading,
  onSubmit,
  onView,
  onCreate
}) {
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  if (!opportunities || opportunities.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__["default"], {
      icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
      title: "No sync opportunities available",
      description: "Check back soon for new licensing opportunities.",
      actionLabel: onCreate ? 'Post Opportunity' : null,
      onAction: onCreate
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
    children: opportunities.map(opportunity => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_SyncOpportunityCard__WEBPACK_IMPORTED_MODULE_0__["default"], {
      opportunity: opportunity,
      onSubmit: onSubmit,
      onView: onView
    }, opportunity.id))
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/tracks/TrackCard.js":
/*!*******************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/tracks/TrackCard.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TrackCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/PlayIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ArrowDownTrayIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function TrackCard({
  track,
  onPlay,
  onDownload
}) {
  const formatDuration = seconds => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const getStatusVariant = status => {
    const variants = {
      active: 'success',
      processing: 'warning',
      archived: 'default',
      rejected: 'danger'
    };
    return variants[status] || 'default';
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-start space-x-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "flex-shrink-0",
          children: track.coverArtUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
            src: track.coverArtUrl,
            alt: track.title,
            className: "h-16 w-16 rounded-md object-cover"
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
              className: "h-8 w-8 text-gray-400"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "flex items-start justify-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
                className: "text-sm font-semibold text-gray-900 truncate",
                children: track.title
              }), track.artistName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
                className: "text-sm text-gray-500 truncate",
                children: track.artistName
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
              variant: getStatusVariant(track.status),
              size: "sm",
              children: track.status
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "mt-2 flex items-center space-x-4 text-xs text-gray-500",
            children: [track.genre && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              children: track.genre
            }), track.bpm && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
              children: [track.bpm, " BPM"]
            }), track.keySignature && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              children: track.keySignature
            }), track.durationSeconds && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              children: formatDuration(track.durationSeconds)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "mt-2 flex items-center space-x-4 text-xs text-gray-500",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
              className: "flex items-center",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
                className: "h-4 w-4 mr-1"
              }), track.playCount || 0, " plays"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
              className: "flex items-center",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
                className: "h-4 w-4 mr-1"
              }), track.downloadCount || 0, " downloads"]
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 flex items-center space-x-2",
        children: [onPlay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          onClick: () => onPlay(track),
          className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
            className: "h-4 w-4 mr-1"
          }), "Play"]
        }), onDownload && track.isDownloadable && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          onClick: () => onDownload(track),
          className: "inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
            className: "h-4 w-4 mr-1"
          }), "Download"]
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/tracks/TrackList.js":
/*!*******************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/tracks/TrackList.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TrackList)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js");
/* harmony import */ var _TrackCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TrackCard */ "./src/scripts/apps/flowstate/components/tracks/TrackCard.js");
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/EmptyState */ "./src/scripts/apps/flowstate/components/shared/EmptyState.js");
/* harmony import */ var _shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function TrackList({
  tracks,
  isLoading,
  onPlay,
  onDownload,
  onUpload
}) {
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  if (!tracks || tracks.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__["default"], {
      icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
      title: "No tracks yet",
      description: "Upload your first track to get started.",
      actionLabel: onUpload ? 'Upload Track' : null,
      onAction: onUpload
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
    children: tracks.map(track => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TrackCard__WEBPACK_IMPORTED_MODULE_0__["default"], {
      track: track,
      onPlay: onPlay,
      onDownload: onDownload
    }, track.id))
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/workshops/WorkshopCard.js":
/*!*************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/workshops/WorkshopCard.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkshopCard)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/VideoCameraIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/MapPinIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js");
/* harmony import */ var _shared_Badge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/Badge */ "./src/scripts/apps/flowstate/components/shared/Badge.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);



function WorkshopCard({
  workshop,
  onJoin,
  onView
}) {
  const getStatusVariant = status => {
    const variants = {
      planned: 'info',
      active: 'success',
      completed: 'default',
      cancelled: 'danger'
    };
    return variants[status] || 'default';
  };
  const formatDate = dateString => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const isFull = workshop.maxParticipants && workshop.participantCount >= workshop.maxParticipants;
  const spotsLeft = workshop.maxParticipants ? workshop.maxParticipants - workshop.participantCount : null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-5",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
            className: "text-base font-semibold text-gray-900 line-clamp-2",
            children: workshop.title
          }), workshop.projectName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
            className: "text-sm text-gray-500 mt-1",
            children: workshop.projectName
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_shared_Badge__WEBPACK_IMPORTED_MODULE_0__["default"], {
          variant: getStatusVariant(workshop.status),
          size: "sm",
          children: workshop.status
        })]
      }), workshop.description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "mt-3 text-sm text-gray-600 line-clamp-2",
        children: workshop.description
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 space-y-2",
        children: [workshop.startDate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            children: [formatDate(workshop.startDate), workshop.endDate && ` - ${formatDate(workshop.endDate)}`]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: workshop.isVirtual ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
              className: "h-5 w-5 mr-2 text-gray-400"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              children: "Virtual"
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"], {
              className: "h-5 w-5 mr-2 text-gray-400"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              children: workshop.location || 'Location TBD'
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex items-center text-sm text-gray-500",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: "h-5 w-5 mr-2 text-gray-400"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            children: [workshop.participantCount || 0, workshop.maxParticipants && ` / ${workshop.maxParticipants}`, " participants"]
          })]
        })]
      }), spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-3 text-sm font-medium text-orange-600",
        children: ["Only ", spotsLeft, " spot", spotsLeft !== 1 ? 's' : '', " left!"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "mt-4 flex space-x-2",
        children: [onView && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          onClick: () => onView(workshop),
          className: "flex-1 inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
          children: "View Details"
        }), onJoin && workshop.status === 'planned' && !isFull && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          onClick: () => onJoin(workshop),
          className: "flex-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500",
          children: "Join Workshop"
        }), isFull && workshop.status === 'planned' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          disabled: true,
          className: "flex-1 inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-400 cursor-not-allowed",
          children: "Full"
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/components/workshops/WorkshopList.js":
/*!*************************************************************************!*\
  !*** ./src/scripts/apps/flowstate/components/workshops/WorkshopList.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkshopList)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js");
/* harmony import */ var _WorkshopCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WorkshopCard */ "./src/scripts/apps/flowstate/components/workshops/WorkshopCard.js");
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/EmptyState */ "./src/scripts/apps/flowstate/components/shared/EmptyState.js");
/* harmony import */ var _shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function WorkshopList({
  workshops,
  isLoading,
  onJoin,
  onView,
  onCreate
}) {
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  if (!workshops || workshops.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__["default"], {
      icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
      title: "No workshops available",
      description: "Join a workshop to collaborate with other producers.",
      actionLabel: onCreate ? 'Create Workshop' : null,
      onAction: onCreate
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
    children: workshops.map(workshop => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_WorkshopCard__WEBPACK_IMPORTED_MODULE_0__["default"], {
      workshop: workshop,
      onJoin: onJoin,
      onView: onView
    }, workshop.id))
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/context/AppContext.js":
/*!**********************************************************!*\
  !*** ./src/scripts/apps/flowstate/context/AppContext.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppProvider: () => (/* binding */ AppProvider),
/* harmony export */   useApp: () => (/* binding */ useApp)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const AppContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
function AppProvider({
  children,
  currentProfile
}) {
  const [currentUser, setCurrentUser] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [notifications, setNotifications] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Simulate fetching current user
    // In production, this would be an API call
    const mockUser = {
      id: 1,
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      email: 'tom@example.com',
      firstName: 'Tom',
      lastName: 'Cook',
      displayName: 'Tom Cook',
      userType: 'producer',
      isPioneer: true,
      isFounder: false,
      isBoardMember: false,
      contributionScore: 245,
      membershipType: 'pioneer'
    };
    setTimeout(() => {
      setCurrentUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, []);
  const addNotification = notification => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      ...notification,
      id
    }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    notifications,
    addNotification,
    removeNotification,
    currentProfile
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(AppContext.Provider, {
    value: value,
    children: children
  });
}
function useApp() {
  const context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/layouts/DashboardLayout.js":
/*!***************************************************************!*\
  !*** ./src/scripts/apps/flowstate/layouts/DashboardLayout.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardLayout)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/dialog/dialog.js");
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/transition/transition.js");
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/menu/menu.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/HomeIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BriefcaseIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BellIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/ChevronDownIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _pages_Lander__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/Lander */ "./src/scripts/apps/flowstate/pages/Lander.js");
/* harmony import */ var _pages_DashboardPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pages/DashboardPage */ "./src/scripts/apps/flowstate/pages/DashboardPage.js");
/* harmony import */ var _pages_TracksPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pages/TracksPage */ "./src/scripts/apps/flowstate/pages/TracksPage.js");
/* harmony import */ var _pages_PlacementsPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pages/PlacementsPage */ "./src/scripts/apps/flowstate/pages/PlacementsPage.js");
/* harmony import */ var _pages_MasterclassesPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pages/MasterclassesPage */ "./src/scripts/apps/flowstate/pages/MasterclassesPage.js");
/* harmony import */ var _pages_WorkshopsPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/WorkshopsPage */ "./src/scripts/apps/flowstate/pages/WorkshopsPage.js");
/* harmony import */ var _pages_SyncOpportunitiesPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pages/SyncOpportunitiesPage */ "./src/scripts/apps/flowstate/pages/SyncOpportunitiesPage.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
'use client';














const navigation = [{
  name: 'Home',
  href: 'home',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_10__["default"],
  component: _pages_Lander__WEBPACK_IMPORTED_MODULE_2__["default"]
}, {
  name: 'Dashboard',
  href: 'dashboard',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_11__["default"],
  component: _pages_DashboardPage__WEBPACK_IMPORTED_MODULE_3__["default"]
}, {
  name: 'Tracks',
  href: 'tracks',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_12__["default"],
  component: _pages_TracksPage__WEBPACK_IMPORTED_MODULE_4__["default"]
}, {
  name: 'Placements',
  href: 'placements',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_13__["default"],
  component: _pages_PlacementsPage__WEBPACK_IMPORTED_MODULE_5__["default"]
}, {
  name: 'Masterclasses',
  href: 'masterclasses',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_14__["default"],
  component: _pages_MasterclassesPage__WEBPACK_IMPORTED_MODULE_6__["default"]
}, {
  name: 'Workshops',
  href: 'workshops',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_15__["default"],
  component: _pages_WorkshopsPage__WEBPACK_IMPORTED_MODULE_7__["default"]
}, {
  name: 'Sync Opportunities',
  href: 'sync',
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_16__["default"],
  component: _pages_SyncOpportunitiesPage__WEBPACK_IMPORTED_MODULE_8__["default"]
}];
const userNavigation = [{
  name: 'Your profile',
  href: '/wp-admin'
}, {
  name: 'Settings',
  href: '/wp-admin'
}, {
  name: 'Sign out',
  href: '#'
}];
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
function DashboardLayout() {
  const {
    currentProfile,
    currentUser,
    notifications,
    removeNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [sidebarOpen, setSidebarOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('home');
  const handleNavigation = href => {
    setCurrentPage(href);
    setSidebarOpen(false);
  };
  const currentNavItem = navigation.find(item => item.href === currentPage);
  const PageComponent = currentNavItem?.component || _pages_Lander__WEBPACK_IMPORTED_MODULE_2__["default"];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_17__.Dialog, {
        open: sidebarOpen,
        onClose: setSidebarOpen,
        className: "relative z-50 lg:hidden",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_17__.DialogBackdrop, {
          transition: true,
          className: "fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "fixed inset-0 flex",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_17__.DialogPanel, {
            transition: true,
            className: "relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_18__.TransitionChild, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                className: "absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
                  type: "button",
                  onClick: () => setSidebarOpen(false),
                  className: "-m-2.5 p-2.5",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                    className: "sr-only",
                    children: "Close sidebar"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_19__["default"], {
                    "aria-hidden": "true",
                    className: "size-6 text-white"
                  })]
                })
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
              className: "flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                className: "flex h-16 shrink-0 items-center",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                  className: "text-xl font-bold text-white",
                  children: "FlowState"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("nav", {
                className: "flex flex-1 flex-col",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
                  role: "list",
                  className: "-mx-2 flex-1 space-y-1",
                  children: navigation.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
                      onClick: () => handleNavigation(item.href),
                      className: classNames(currentPage === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold w-full text-left'),
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(item.icon, {
                        "aria-hidden": "true",
                        className: "size-6 shrink-0"
                      }), item.name]
                    })
                  }, item.name))
                })
              })]
            })]
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "relative flex h-16 shrink-0 items-center justify-center",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
            alt: siteData.siteName,
            src: `${siteData.siteUrl}/wp-content/uploads/flowstate-final-white.png`,
            className: "h-12 w-auto"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("nav", {
          className: "relative mt-8",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
            role: "list",
            className: "flex flex-col items-center space-y-1",
            children: navigation.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
                onClick: () => handleNavigation(item.href),
                className: classNames(currentPage === item.href ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white', 'group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold'),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(item.icon, {
                  "aria-hidden": "true",
                  className: "size-6 shrink-0"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                  className: "sr-only",
                  children: item.name
                })]
              })
            }, item.name))
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "lg:pl-20",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
            type: "button",
            onClick: () => setSidebarOpen(true),
            className: "-m-2.5 p-2.5 text-gray-700 lg:hidden",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
              className: "sr-only",
              children: "Open sidebar"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_11__["default"], {
              "aria-hidden": "true",
              className: "size-6"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            "aria-hidden": "true",
            className: "h-6 w-px bg-gray-900/10 lg:hidden"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "flex flex-1 gap-x-4 self-stretch lg:gap-x-6",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("form", {
              action: "#",
              method: "GET",
              className: "grid flex-1 grid-cols-1",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
                name: "search",
                placeholder: "Search",
                "aria-label": "Search",
                className: "col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_20__["default"], {
                "aria-hidden": "true",
                className: "pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
              className: "flex items-center gap-x-4 lg:gap-x-6",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.Menu, {
                as: "div",
                className: "relative",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuButton, {
                  className: "-m-2.5 p-2.5 text-gray-400 hover:text-gray-500",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                    className: "sr-only",
                    children: "View notifications"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_22__["default"], {
                    "aria-hidden": "true",
                    className: "size-6"
                  }), notifications.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                    className: "absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuItems, {
                  transition: true,
                  className: "absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in",
                  children: notifications.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                    className: "px-4 py-3 text-sm text-gray-500",
                    children: "No new notifications"
                  }) : notifications.map(notification => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuItem, {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
                      className: "block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50",
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                        className: "font-medium",
                        children: notification.title
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                        className: "text-gray-500",
                        children: notification.message
                      })]
                    })
                  }, notification.id))
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                "aria-hidden": "true",
                className: "hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.Menu, {
                as: "div",
                className: "relative",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuButton, {
                  className: "relative flex items-center",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                    className: "absolute -inset-1.5"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                    className: "sr-only",
                    children: "Open user menu"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
                    alt: "",
                    src: currentProfile.profileImage || `${siteData.siteUrl}/wp-content/plugins/makerblocks/assets/images/extras/placeholder-account-image.png`,
                    className: "size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
                    className: "hidden lg:flex lg:items-center",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                      "aria-hidden": "true",
                      className: "ml-4 text-sm/6 font-semibold text-gray-900",
                      children: currentProfile.name || 'User'
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_23__["default"], {
                      "aria-hidden": "true",
                      className: "ml-2 size-5 text-gray-400"
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuItems, {
                  transition: true,
                  className: "absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in",
                  children: userNavigation.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_21__.MenuItem, {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
                      href: item.href,
                      className: "block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden",
                      children: item.name
                    })
                  }, item.name))
                })]
              })]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("main", {
          className: "py-10",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(PageComponent, {})
          })
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/DashboardPage.js":
/*!***********************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/DashboardPage.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/MusicalNoteIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BriefcaseIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ArrowTrendingUpIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_stats_StatCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/stats/StatCard */ "./src/scripts/apps/flowstate/components/stats/StatCard.js");
/* harmony import */ var _components_stats_ContributionScore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/stats/ContributionScore */ "./src/scripts/apps/flowstate/components/stats/ContributionScore.js");
/* harmony import */ var _components_tracks_TrackList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/tracks/TrackList */ "./src/scripts/apps/flowstate/components/tracks/TrackList.js");
/* harmony import */ var _components_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);








function DashboardPage() {
  const {
    currentProfile,
    currentUser,
    isLoading: userLoading
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [stats, setStats] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [recentTracks, setRecentTracks] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!userLoading && currentUser) {
      fetchDashboardData();
    }
  }, [userLoading, currentUser]);
  const fetchDashboardData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalTracks: 24,
        totalPlacements: 8,
        totalDownloads: 156,
        enrolledMasterclasses: 3
      });

      // Mock recent tracks
      setRecentTracks([{
        id: 1,
        title: 'Summer Vibes',
        artistName: currentUser.displayName,
        genre: 'Hip Hop',
        bpm: 140,
        keySignature: 'C# Minor',
        durationSeconds: 195,
        playCount: 45,
        downloadCount: 12,
        status: 'active',
        isDownloadable: true
      }, {
        id: 2,
        title: 'Night Drive',
        artistName: currentUser.displayName,
        genre: 'R&B',
        bpm: 85,
        keySignature: 'A Minor',
        durationSeconds: 210,
        playCount: 32,
        downloadCount: 8,
        status: 'active',
        isDownloadable: true
      }, {
        id: 3,
        title: 'Trap Banger',
        artistName: currentUser.displayName,
        genre: 'Trap',
        bpm: 150,
        keySignature: 'G Minor',
        durationSeconds: 180,
        playCount: 67,
        downloadCount: 23,
        status: 'active',
        isDownloadable: true
      }]);
      setIsLoading(false);
    }, 800);
  };
  if (userLoading || isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_5__["default"], {
      size: "lg",
      className: "py-12"
    });
  }
  const scoreBreakdown = {
    tracks: {
      count: stats.totalTracks,
      points: stats.totalTracks * 5
    },
    placements: {
      count: stats.totalPlacements,
      points: stats.totalPlacements * 20
    },
    masterclasses: {
      count: 2,
      points: 100
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("h1", {
        className: "text-2xl font-bold text-gray-900",
        children: ["Welcome back, ", currentProfile.name, "!"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "mt-1 text-sm text-gray-500",
        children: "Here's what's happening with your music today."
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_stats_StatCard__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: "Total Tracks",
        value: stats.totalTracks,
        icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_7__["default"],
        change: "+3 this month"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_stats_StatCard__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: "Placements",
        value: stats.totalPlacements,
        icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_8__["default"],
        change: "+2 this month"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_stats_StatCard__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: "Total Downloads",
        value: stats.totalDownloads,
        icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_9__["default"],
        change: "+12%"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_stats_StatCard__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: "Masterclasses",
        value: stats.enrolledMasterclasses,
        icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_10__["default"],
        change: "+1 this week"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_stats_ContributionScore__WEBPACK_IMPORTED_MODULE_3__["default"], {
      score: currentUser?.contributionScore || 0,
      breakdown: scoreBreakdown,
      membershipType: currentUser?.membershipType
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "space-y-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
          className: "text-lg font-semibold text-gray-900",
          children: "Recent Tracks"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "#/tracks",
          className: "text-sm font-medium text-indigo-600 hover:text-indigo-500",
          children: "View all"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_tracks_TrackList__WEBPACK_IMPORTED_MODULE_4__["default"], {
        tracks: recentTracks,
        isLoading: false,
        onPlay: track => console.log('Play:', track)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "rounded-lg bg-indigo-50 p-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        className: "text-base font-semibold text-gray-900",
        children: "Quick Actions"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "#/tracks/upload",
          className: "flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
          children: "Upload New Track"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "#/placements/new",
          className: "flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
          children: "Record Placement"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "#/masterclasses",
          className: "flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
          children: "Browse Masterclasses"
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/Lander.js":
/*!****************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/Lander.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lander)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function Lander() {
  const currentYear = new Date().getFullYear();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
    id: "main",
    className: "bg-slate-950 text-slate-200 antialiased font-sans selection:bg-emerald-300/30",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
      href: "#main",
      className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2",
      children: "Skip to content"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
      className: "py-24 sm:py-32 flex flex-col justify-center items-center px-6 text-center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "mb-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
          alt: siteData.siteName,
          src: `${siteData.siteUrl}/wp-content/uploads/flowstate-final-white.png`,
          className: "h-64"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "max-w-[70ch]",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
          className: "text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-50",
          children: "Music Management and Artist Development"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
          className: "mt-4 text-base sm:text-lg leading-relaxed text-slate-300",
          children: "Manage tracks, placements, artist development, and collaborations in one powerful platform."
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      id: "about",
      className: "py-16 sm:py-20 border-t border-white/10",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
          className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
          children: "A Full-Stack Producer Economy"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
          className: "mt-4 max-w-[75ch] text-base leading-relaxed text-slate-300",
          children: "FlowState is a transparent ecosystem where producers upload tracks, enroll in programs, submit to sync opportunities, track placements, and manage financial outcomes. Every step\u2014contribution, enrollment, placement, transaction\u2014is logged for clarity and audit."
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: "mt-10 grid md:grid-cols-3 gap-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-emerald-300 mb-2",
              children: "Foundation"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "text-lg font-semibold text-slate-50",
              children: "Users & Roles"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-2 text-sm text-slate-300",
              children: "Producers, artists, partners, investors with role-based permissions and secure auth (OAuth + JWT)."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-emerald-300 mb-2",
              children: "Content"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "text-lg font-semibold text-slate-50",
              children: "Tracks & Metadata"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-2 text-sm text-slate-300",
              children: "Title, genre, BPM, key, file info, tags, and contribution logs\u2014searchable & filterable."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-emerald-300 mb-2",
              children: "Activity"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "text-lg font-semibold text-slate-50",
              children: "Placements & Revenue"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-2 text-sm text-slate-300",
              children: "Budgets, statuses, media and transactions; all actions appear in audit logs."
            })]
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      id: "producers",
      className: "py-16 sm:py-20",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: "grid lg:grid-cols-2 gap-10 items-start",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
              className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
              children: "Producer Profiles & Analytics"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-4 text-slate-300",
              children: "Producers get a profile that showcases:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
              className: "mt-4 space-y-3 text-slate-300",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Name, bio, links, location, socials (JSON)."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Producer score (calculated from contributions)."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Upload history, track analytics, genre preferences."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Collaboration roles (producer, engineer, mixing)."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Account status (active / inactive / banned)."]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-4 text-xs text-slate-400",
              children: ["Backed by ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "users"
              }), ", ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "user_analytics"
              }), ", and ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "contributions"
              }), "."]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-violet-400",
                "aria-hidden": "true"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                  className: "font-semibold text-slate-50",
                  children: "J. Beats"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "text-sm text-slate-400",
                  children: "Producer, Engineer"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
              className: "mt-4 grid grid-cols-3 gap-3 text-sm",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "text-slate-400 text-xs",
                  children: "Uploads"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "font-semibold text-emerald-300",
                  children: "47"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "text-slate-400 text-xs",
                  children: "Placements"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "font-semibold text-emerald-300",
                  children: "12"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "text-slate-400 text-xs",
                  children: "Score"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                  className: "font-semibold text-emerald-300",
                  children: "88"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-4 text-xs text-slate-400",
              children: ["Profile updated daily via ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "calculate_producer_score"
              }), " routine."]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      id: "programs",
      className: "py-16 sm:py-20 bg-slate-900/50 border-y border-white/10",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: "grid lg:grid-cols-2 gap-10 items-start",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "mt-2 text-xl font-semibold text-slate-50",
              children: "R&B Production Masterclass"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-2 text-sm text-slate-300",
              children: "Instructor: Ray Carter \u2022 Duration: 8 weeks \u2022 Status: Open"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
              className: "mt-4 rounded-lg bg-slate-950 p-3 text-xs text-slate-300 ring-1 ring-white/10",
              children: "Enrollments: 32 / 50"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
              className: "mt-4 inline-flex items-center text-sm text-emerald-300 hover:underline",
              href: "#",
              "aria-label": "View details about R&B Production Masterclass",
              children: "View details \u2192"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-3 text-xs text-slate-400",
              children: ["Backed by ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "programs"
              }), " & ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "program_enrollments"
              }), "."]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
              className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
              children: "Masterclasses, Workshops & Sound Camps"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-4 text-slate-300",
              children: "Programs allow producers to learn, network, and grow through structured offerings:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
              className: "mt-4 space-y-3 text-slate-300",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Program types: masterclass, workshop, sound camp."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Instructors (linked to users), dates, capacity, enrollment status."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Track enrollments, attendance, participation via JSON metadata."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Program-specific contributions (e.g., teaching, organizing)."]
              })]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      id: "opps",
      className: "py-16 sm:py-20",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: "grid lg:grid-cols-2 gap-10 items-start",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
              className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
              children: "Sync Opportunities & Placements"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-4 text-slate-300",
              children: "Partners create briefs and producers submit tracks for licensing:"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
              className: "mt-4 space-y-3 text-slate-300",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Brief: title, description, budget, deadline, requirements (JSON)."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Privacy: public or invite-only (invite list IDs)."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Status: open \u2192 in review \u2192 closed/awarded."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Submission caps per opportunity."]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                className: "flex gap-3",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                  className: "w-2 h-2 mt-2 rounded-full bg-emerald-300"
                }), "Transparent placement & revenue records."]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
              className: "flex items-center justify-between",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                className: "text-[11px] px-2 py-1 rounded-full bg-emerald-300/15 text-emerald-300 ring-1 ring-emerald-300/30",
                children: "Open"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "mt-3 text-xl font-semibold text-slate-50",
              children: "High-energy Pop for Trailer"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-2 text-sm text-slate-300",
              children: "Budget: $12,000 \u2022 Deadline: 14 days \u2022 Mood: Uplifting / Confident \u2022 Duration: :30 / :60"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
              className: "mt-4 grid sm:grid-cols-3 gap-3 text-sm",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: "Max submissions: 3"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: "Submitted: 1"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "rounded-lg bg-slate-950 p-3 ring-1 ring-white/10",
                children: "Private: No"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-3 text-xs text-slate-400",
              children: ["Backed by ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "sync_opportunities"
              }), " & ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "placements"
              }), "."]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      id: "partners",
      className: "py-16 sm:py-20 bg-slate-900/50 border-y border-white/10",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: "grid lg:grid-cols-2 gap-10",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
              className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
              children: "Industry Partners"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-4 text-slate-300",
              children: "Labels, publishers, agencies, brands, and platforms can open briefs, review talent, and track outcomes."
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-3 text-xs text-slate-400",
              children: ["Backed by ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "industry_partners"
              }), " with partnership tiers and statuses."]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            id: "investors",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
              className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
              children: "Investors"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "mt-4 text-slate-300",
              children: "Structured reporting on placements, enrollments, and revenue events with audit logs and role-based access."
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
              className: "mt-3 text-xs text-slate-400",
              children: ["Backed by ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "investors"
              }), ", ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "transactions"
              }), ", and ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("em", {
                children: "audit_logs"
              }), "."]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("section", {
      className: "py-16 sm:py-20",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
          className: "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50",
          children: "Roadmap"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ol", {
          className: "mt-8 relative border-l border-white/15 ml-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
            className: "pl-6 pb-8 relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
              className: "absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-300",
              "aria-hidden": "true"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-slate-400",
              children: "Phase 1"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "font-semibold text-slate-50",
              children: "Private Beta (Creators)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-slate-300",
              children: "Tracks, tagging, search, roles, analytics. Producer profiles & contribution scores."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
            className: "pl-6 pb-8 relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
              className: "absolute -left-2 top-0 w-4 h-4 rounded-full bg-violet-400",
              "aria-hidden": "true"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-slate-400",
              children: "Phase 2"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "font-semibold text-slate-50",
              children: "Programs & Briefs"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-slate-300",
              children: "Masterclasses, workshops, sound camps; sync opportunity flow; placement tracking."
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
            className: "pl-6 relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
              className: "absolute -left-2 top-0 w-4 h-4 rounded-full bg-white/70",
              "aria-hidden": "true"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-[11px] uppercase tracking-widest text-slate-400",
              children: "Phase 3"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
              className: "font-semibold text-slate-50",
              children: "Revenue & Partners"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
              className: "text-slate-300",
              children: "Transactions, partner portals, investor reports, advanced audit trails."
            })]
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "bg-black mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500",
        children: ["\xA9 ", currentYear, " FlowState. All rights reserved."]
      })
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/MasterclassesPage.js":
/*!***************************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/MasterclassesPage.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MasterclassesPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_masterclasses_MasterclassList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/masterclasses/MasterclassList */ "./src/scripts/apps/flowstate/components/masterclasses/MasterclassList.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function MasterclassesPage() {
  const {
    currentUser,
    addNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [masterclasses, setMasterclasses] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [filterDifficulty, setFilterDifficulty] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchMasterclasses();
  }, []);
  const fetchMasterclasses = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockMasterclasses = [{
        id: 1,
        title: 'Advanced Mixing Techniques for Hip Hop',
        instructorName: 'DJ Premier',
        description: 'Learn professional mixing techniques used in top hip hop productions.',
        difficultyLevel: 'advanced',
        category: 'Mixing',
        price: 149.99,
        isFree: false,
        durationMinutes: 240,
        enrollmentCount: 234,
        status: 'published',
        coverImageUrl: null
      }, {
        id: 2,
        title: 'Trap Production Masterclass',
        instructorName: 'Metro Boomin',
        description: 'Create chart-topping trap beats from scratch.',
        difficultyLevel: 'intermediate',
        category: 'Production',
        price: 199.99,
        isFree: false,
        durationMinutes: 360,
        enrollmentCount: 567,
        status: 'published',
        coverImageUrl: null
      }, {
        id: 3,
        title: 'Music Theory Fundamentals',
        instructorName: 'Sarah Johnson',
        description: 'Essential music theory every producer should know.',
        difficultyLevel: 'beginner',
        category: 'Theory',
        price: 0,
        isFree: true,
        durationMinutes: 120,
        enrollmentCount: 1023,
        status: 'published',
        coverImageUrl: null
      }, {
        id: 4,
        title: 'Sound Design for Producers',
        instructorName: 'Flume',
        description: 'Create unique sounds and textures for your productions.',
        difficultyLevel: 'intermediate',
        category: 'Sound Design',
        price: 179.99,
        isFree: false,
        durationMinutes: 300,
        enrollmentCount: 445,
        status: 'published',
        coverImageUrl: null
      }, {
        id: 5,
        title: 'Vocal Production & Comping',
        instructorName: 'Serban Ghenea',
        description: 'Professional vocal recording and editing techniques.',
        difficultyLevel: 'advanced',
        category: 'Recording',
        price: 169.99,
        isFree: false,
        durationMinutes: 210,
        enrollmentCount: 312,
        status: 'published',
        coverImageUrl: null
      }, {
        id: 6,
        title: 'Getting Started with FL Studio',
        instructorName: 'Mike Thompson',
        description: 'Complete beginner guide to FL Studio DAW.',
        difficultyLevel: 'beginner',
        category: 'DAW',
        price: 0,
        isFree: true,
        durationMinutes: 180,
        enrollmentCount: 2341,
        status: 'published',
        coverImageUrl: null
      }];
      setMasterclasses(mockMasterclasses);
      setIsLoading(false);
    }, 600);
  };
  const handleEnroll = masterclass => {
    addNotification({
      type: 'success',
      title: 'Enrolled Successfully',
      message: `You've enrolled in: ${masterclass.title}`
    });
  };
  const handleView = masterclass => {
    addNotification({
      type: 'info',
      title: 'View Masterclass',
      message: `Opening details for: ${masterclass.title}`
    });
  };
  const filteredMasterclasses = masterclasses.filter(mc => {
    const matchesSearch = mc.title.toLowerCase().includes(searchQuery.toLowerCase()) || mc.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) || mc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || mc.difficultyLevel === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
        className: "text-2xl font-bold text-gray-900",
        children: "Masterclasses"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "mt-1 text-sm text-gray-500",
        children: "Learn from industry professionals and level up your skills"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "flex-1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__["default"], {
            className: "pointer-events-none absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400",
            "aria-hidden": "true"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            placeholder: "Search masterclasses...",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            className: "block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "sm:w-48",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
          value: filterDifficulty,
          onChange: e => setFilterDifficulty(e.target.value),
          className: "block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "all",
            children: "All Levels"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "beginner",
            children: "Beginner"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "intermediate",
            children: "Intermediate"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "advanced",
            children: "Advanced"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "all_levels",
            children: "All Levels"
          })]
        })
      })]
    }), !isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center space-x-6 text-sm text-gray-500",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "font-medium text-gray-900",
          children: filteredMasterclasses.length
        }), " masterclasses"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "font-medium text-gray-900",
          children: masterclasses.filter(mc => mc.isFree).length
        }), ' ', "free courses"]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_masterclasses_MasterclassList__WEBPACK_IMPORTED_MODULE_2__["default"], {
      masterclasses: filteredMasterclasses,
      isLoading: isLoading,
      onEnroll: handleEnroll,
      onView: handleView
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/PlacementsPage.js":
/*!************************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/PlacementsPage.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlacementsPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_placements_PlacementList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/placements/PlacementList */ "./src/scripts/apps/flowstate/components/placements/PlacementList.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function PlacementsPage() {
  const {
    currentProfile,
    currentUser,
    addNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [placements, setPlacements] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [filterStatus, setFilterStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchPlacements();
  }, []);
  const fetchPlacements = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockPlacements = [{
        id: 1,
        projectName: 'Netflix Original Series',
        clientName: 'Netflix',
        placementType: 'sync',
        value: 15000,
        currency: 'USD',
        placementDate: '2024-11-01',
        status: 'confirmed',
        trackTitle: 'Summer Vibes',
        territory: 'Worldwide',
        royaltyPercentage: 50
      }, {
        id: 2,
        projectName: 'Nike Commercial',
        clientName: 'Nike Inc.',
        placementType: 'sync',
        value: 25000,
        currency: 'USD',
        placementDate: '2024-10-15',
        status: 'released',
        trackTitle: 'Night Drive',
        territory: 'North America',
        royaltyPercentage: 50
      }, {
        id: 3,
        projectName: 'Artist Album',
        clientName: 'Drake',
        placementType: 'artist',
        value: 10000,
        currency: 'USD',
        placementDate: '2024-09-20',
        status: 'released',
        trackTitle: 'Trap Banger',
        territory: 'Worldwide',
        royaltyPercentage: 25
      }, {
        id: 4,
        projectName: 'Video Game Soundtrack',
        clientName: 'EA Sports',
        placementType: 'sync',
        value: 8000,
        currency: 'USD',
        placementDate: null,
        status: 'pending',
        trackTitle: 'Dark Drill',
        territory: 'Worldwide',
        royaltyPercentage: 50
      }];
      setPlacements(mockPlacements);
      setIsLoading(false);
    }, 600);
  };
  const handleCreate = () => {
    addNotification({
      type: 'info',
      title: 'Create Placement',
      message: 'Placement creation modal would open here'
    });
  };
  const filteredPlacements = placements.filter(placement => {
    if (filterStatus === 'all') return true;
    return placement.status === filterStatus;
  });
  const totalValue = placements.reduce((sum, p) => sum + (p.value || 0), 0);
  const confirmedCount = placements.filter(p => p.status === 'confirmed' || p.status === 'released').length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("h1", {
          className: "text-2xl font-bold text-gray-900",
          children: [currentProfile.name, "'s Placements"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "mt-1 text-sm text-gray-500",
          children: "Track your music placements and deals"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        type: "button",
        onClick: handleCreate,
        className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "h-5 w-5 mr-1.5"
        }), "Add Placement"]
      })]
    }), !isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Total Placements"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: placements.length
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Confirmed"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: confirmedCount
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Total Value"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: ["$", totalValue.toLocaleString()]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center space-x-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
        htmlFor: "status-filter",
        className: "text-sm font-medium text-gray-700",
        children: "Filter by status:"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
        id: "status-filter",
        value: filterStatus,
        onChange: e => setFilterStatus(e.target.value),
        className: "rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "all",
          children: "All Statuses"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "pending",
          children: "Pending"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "confirmed",
          children: "Confirmed"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "released",
          children: "Released"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
          value: "cancelled",
          children: "Cancelled"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_placements_PlacementList__WEBPACK_IMPORTED_MODULE_2__["default"], {
      placements: filteredPlacements,
      isLoading: isLoading,
      onCreate: handleCreate
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/SyncOpportunitiesPage.js":
/*!*******************************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/SyncOpportunitiesPage.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SyncOpportunitiesPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_sync_SyncOpportunityList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/sync/SyncOpportunityList */ "./src/scripts/apps/flowstate/components/sync/SyncOpportunityList.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function SyncOpportunitiesPage() {
  const {
    currentUser,
    addNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [opportunities, setOpportunities] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [filterStatus, setFilterStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  const [filterType, setFilterType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchOpportunities();
  }, []);
  const fetchOpportunities = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOpportunities = [{
        id: 1,
        title: 'Action Thriller Film Score',
        clientName: 'Universal Pictures',
        description: 'Looking for intense, high-energy tracks for an upcoming action thriller.',
        projectType: 'film',
        budget: 20000,
        budgetCurrency: 'USD',
        isPaid: true,
        deadline: '2024-12-15T23:59:59',
        requiredGenre: 'Cinematic',
        requiredMood: 'Intense',
        submissionCount: 45,
        maxSubmissions: 100,
        status: 'open'
      }, {
        id: 2,
        title: 'Nike Commercial Campaign',
        clientName: 'Nike',
        description: 'Upbeat, motivational music for global ad campaign.',
        projectType: 'commercial',
        budget: 35000,
        budgetCurrency: 'USD',
        isPaid: true,
        deadline: '2024-11-30T23:59:59',
        requiredGenre: 'Hip Hop',
        requiredMood: 'Energetic',
        submissionCount: 89,
        maxSubmissions: 100,
        status: 'open'
      }, {
        id: 3,
        title: 'Indie Game Soundtrack',
        clientName: 'Pixel Studios',
        description: 'Atmospheric electronic music for sci-fi adventure game.',
        projectType: 'game',
        budget: 5000,
        budgetCurrency: 'USD',
        isPaid: true,
        deadline: '2025-01-20T23:59:59',
        requiredGenre: 'Electronic',
        requiredMood: 'Atmospheric',
        submissionCount: 23,
        maxSubmissions: 50,
        status: 'open'
      }, {
        id: 4,
        title: 'Netflix Series Main Theme',
        clientName: 'Netflix',
        description: 'Original theme music for new drama series.',
        projectType: 'tv',
        budget: 50000,
        budgetCurrency: 'USD',
        isPaid: true,
        deadline: '2024-11-25T23:59:59',
        requiredGenre: 'Cinematic',
        requiredMood: 'Dramatic',
        submissionCount: 100,
        maxSubmissions: 100,
        status: 'in_review'
      }, {
        id: 5,
        title: 'Movie Trailer Music',
        clientName: 'Warner Bros',
        description: 'Epic trailer music for summer blockbuster.',
        projectType: 'trailer',
        budget: 15000,
        budgetCurrency: 'USD',
        isPaid: true,
        deadline: '2024-12-01T23:59:59',
        requiredGenre: 'Cinematic',
        requiredMood: 'Epic',
        submissionCount: 67,
        maxSubmissions: 75,
        status: 'open'
      }];
      setOpportunities(mockOpportunities);
      setIsLoading(false);
    }, 600);
  };
  const handleSubmit = opportunity => {
    addNotification({
      type: 'success',
      title: 'Track Submitted',
      message: `Your track has been submitted to: ${opportunity.title}`
    });
  };
  const handleView = opportunity => {
    addNotification({
      type: 'info',
      title: 'View Opportunity',
      message: `Opening details for: ${opportunity.title}`
    });
  };
  const handleCreate = () => {
    addNotification({
      type: 'info',
      title: 'Post Opportunity',
      message: 'Opportunity creation modal would open here'
    });
  };
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || opp.clientName && opp.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || opp.description && opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || opp.status === filterStatus;
    const matchesType = filterType === 'all' || opp.projectType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });
  const openCount = opportunities.filter(o => o.status === 'open').length;
  const totalBudget = opportunities.filter(o => o.status === 'open' && o.budget).reduce((sum, o) => sum + o.budget, 0);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
          className: "text-2xl font-bold text-gray-900",
          children: "Sync Opportunities"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "mt-1 text-sm text-gray-500",
          children: "Browse and submit to licensing opportunities"
        })]
      }), currentUser?.userType === 'industry_partner' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        type: "button",
        onClick: handleCreate,
        className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "h-5 w-5 mr-1.5"
        }), "Post Opportunity"]
      })]
    }), !isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Open Opportunities"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: openCount
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Total Opportunities"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: opportunities.length
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Total Budget (Open)"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: ["$", totalBudget.toLocaleString()]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "flex-1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: "pointer-events-none absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400",
            "aria-hidden": "true"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            placeholder: "Search opportunities...",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            className: "block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "sm:w-48",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
          value: filterType,
          onChange: e => setFilterType(e.target.value),
          className: "block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "all",
            children: "All Types"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "film",
            children: "Film"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "tv",
            children: "TV"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "commercial",
            children: "Commercial"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "game",
            children: "Game"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "trailer",
            children: "Trailer"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "other",
            children: "Other"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "sm:w-48",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
          value: filterStatus,
          onChange: e => setFilterStatus(e.target.value),
          className: "block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "all",
            children: "All Status"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "open",
            children: "Open"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "in_review",
            children: "In Review"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "closed",
            children: "Closed"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "awarded",
            children: "Awarded"
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_sync_SyncOpportunityList__WEBPACK_IMPORTED_MODULE_2__["default"], {
      opportunities: filteredOpportunities,
      isLoading: isLoading,
      onSubmit: handleSubmit,
      onView: handleView,
      onCreate: handleCreate
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/TracksPage.js":
/*!********************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/TracksPage.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TracksPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_tracks_TrackList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/tracks/TrackList */ "./src/scripts/apps/flowstate/components/tracks/TrackList.js");
/* harmony import */ var _components_shared_LoadingSpinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/shared/LoadingSpinner */ "./src/scripts/apps/flowstate/components/shared/LoadingSpinner.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);






function TracksPage() {
  const {
    currentProfile,
    currentUser,
    addNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [tracks, setTracks] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [filterGenre, setFilterGenre] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchTracks();
  }, []);
  const fetchTracks = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockTracks = [{
        id: 1,
        title: 'Summer Vibes',
        artistName: currentUser.displayName,
        genre: 'Hip Hop',
        bpm: 140,
        keySignature: 'C# Minor',
        durationSeconds: 195,
        playCount: 45,
        downloadCount: 12,
        status: 'active',
        isDownloadable: true
      }, {
        id: 2,
        title: 'Night Drive',
        artistName: currentUser.displayName,
        genre: 'R&B',
        bpm: 85,
        keySignature: 'A Minor',
        durationSeconds: 210,
        playCount: 32,
        downloadCount: 8,
        status: 'active',
        isDownloadable: true
      }, {
        id: 3,
        title: 'Trap Banger',
        artistName: currentUser.displayName,
        genre: 'Trap',
        bpm: 150,
        keySignature: 'G Minor',
        durationSeconds: 180,
        playCount: 67,
        downloadCount: 23,
        status: 'active',
        isDownloadable: true
      }, {
        id: 4,
        title: 'Chill Lofi',
        artistName: currentUser.displayName,
        genre: 'Lofi',
        bpm: 75,
        keySignature: 'D Major',
        durationSeconds: 165,
        playCount: 89,
        downloadCount: 34,
        status: 'active',
        isDownloadable: true
      }, {
        id: 5,
        title: 'Pop Anthem',
        artistName: currentUser.displayName,
        genre: 'Pop',
        bpm: 128,
        keySignature: 'F Major',
        durationSeconds: 205,
        playCount: 123,
        downloadCount: 45,
        status: 'active',
        isDownloadable: true
      }, {
        id: 6,
        title: 'Dark Drill',
        artistName: currentUser.displayName,
        genre: 'Drill',
        bpm: 140,
        keySignature: 'B Minor',
        durationSeconds: 175,
        playCount: 56,
        downloadCount: 19,
        status: 'active',
        isDownloadable: true
      }];
      setTracks(mockTracks);
      setIsLoading(false);
    }, 600);
  };
  const handlePlay = track => {
    addNotification({
      type: 'info',
      title: 'Playing track',
      message: `Now playing: ${track.title}`
    });
  };
  const handleDownload = track => {
    addNotification({
      type: 'success',
      title: 'Download started',
      message: `Downloading: ${track.title}`
    });
  };
  const handleUpload = () => {
    addNotification({
      type: 'info',
      title: 'Upload feature',
      message: 'Track upload modal would open here'
    });
  };
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || track.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === 'all' || track.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });
  const genres = ['all', ...new Set(tracks.map(t => t.genre))];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("h1", {
          className: "text-2xl font-bold text-gray-900",
          children: [currentProfile.name, "'s Tracks"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "mt-1 text-sm text-gray-500",
          children: "Manage and share your music library"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
        type: "button",
        onClick: handleUpload,
        className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__["default"], {
          className: "h-5 w-5 mr-1.5"
        }), "Upload Track"]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "flex-1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "relative",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: "pointer-events-none absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400",
            "aria-hidden": "true"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            placeholder: "Search tracks...",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            className: "block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "sm:w-48",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("select", {
          value: filterGenre,
          onChange: e => setFilterGenre(e.target.value),
          className: "block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
          children: genres.map(genre => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
            value: genre,
            children: genre === 'all' ? 'All Genres' : genre
          }, genre))
        })
      })]
    }), !isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex items-center space-x-6 text-sm text-gray-500",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
          className: "font-medium text-gray-900",
          children: filteredTracks.length
        }), " tracks"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
          className: "font-medium text-gray-900",
          children: tracks.reduce((sum, t) => sum + t.playCount, 0)
        }), ' ', "total plays"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
          className: "font-medium text-gray-900",
          children: tracks.reduce((sum, t) => sum + t.downloadCount, 0)
        }), ' ', "total downloads"]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_tracks_TrackList__WEBPACK_IMPORTED_MODULE_2__["default"], {
      tracks: filteredTracks,
      isLoading: isLoading,
      onPlay: handlePlay,
      onDownload: handleDownload
    })]
  });
}

/***/ }),

/***/ "./src/scripts/apps/flowstate/pages/WorkshopsPage.js":
/*!***********************************************************!*\
  !*** ./src/scripts/apps/flowstate/pages/WorkshopsPage.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkshopsPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js");
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AppContext */ "./src/scripts/apps/flowstate/context/AppContext.js");
/* harmony import */ var _components_workshops_WorkshopList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/workshops/WorkshopList */ "./src/scripts/apps/flowstate/components/workshops/WorkshopList.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function WorkshopsPage() {
  const {
    currentUser,
    addNotification
  } = (0,_context_AppContext__WEBPACK_IMPORTED_MODULE_1__.useApp)();
  const [workshops, setWorkshops] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [filterStatus, setFilterStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchWorkshops();
  }, []);
  const fetchWorkshops = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockWorkshops = [{
        id: 1,
        title: 'Hip Hop Production Workshop',
        projectName: 'Beat Making Intensive',
        description: 'Learn advanced hip hop production techniques in this hands-on workshop.',
        startDate: '2024-12-01',
        endDate: '2024-12-03',
        location: 'Los Angeles, CA',
        isVirtual: false,
        maxParticipants: 15,
        participantCount: 12,
        status: 'planned'
      }, {
        id: 2,
        title: 'Virtual Mixing Masterclass',
        projectName: null,
        description: 'Online workshop covering professional mixing techniques.',
        startDate: '2024-11-20',
        endDate: '2024-11-20',
        location: null,
        isVirtual: true,
        maxParticipants: 50,
        participantCount: 34,
        status: 'planned'
      }, {
        id: 3,
        title: 'Songwriting Camp',
        projectName: 'Summer Sessions',
        description: 'Collaborative songwriting with top artists and producers.',
        startDate: '2024-10-15',
        endDate: '2024-10-20',
        location: 'Miami, FL',
        isVirtual: false,
        maxParticipants: 20,
        participantCount: 20,
        status: 'completed'
      }, {
        id: 4,
        title: 'Trap Production Bootcamp',
        projectName: 'Bass Heavy',
        description: 'Intensive trap production workshop focusing on 808s and hard-hitting drums.',
        startDate: '2024-11-18',
        endDate: '2024-11-19',
        location: 'Atlanta, GA',
        isVirtual: false,
        maxParticipants: 12,
        participantCount: 8,
        status: 'planned'
      }];
      setWorkshops(mockWorkshops);
      setIsLoading(false);
    }, 600);
  };
  const handleJoin = workshop => {
    addNotification({
      type: 'success',
      title: 'Joined Workshop',
      message: `You've joined: ${workshop.title}`
    });
  };
  const handleView = workshop => {
    addNotification({
      type: 'info',
      title: 'View Workshop',
      message: `Opening details for: ${workshop.title}`
    });
  };
  const handleCreate = () => {
    addNotification({
      type: 'info',
      title: 'Create Workshop',
      message: 'Workshop creation modal would open here'
    });
  };
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) || workshop.projectName && workshop.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || workshop.description && workshop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workshop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const upcomingCount = workshops.filter(w => w.status === 'planned').length;
  const activeCount = workshops.filter(w => w.status === 'active').length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
          className: "text-2xl font-bold text-gray-900",
          children: "Workshops"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "mt-1 text-sm text-gray-500",
          children: "Collaborate with other producers in focused sessions"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        type: "button",
        onClick: handleCreate,
        className: "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_4__["default"], {
          className: "h-5 w-5 mr-1.5"
        }), "Create Workshop"]
      })]
    }), !isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Total Workshops"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: workshops.length
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Upcoming"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: upcomingCount
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "bg-white rounded-lg shadow-xs px-5 py-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dt", {
          className: "text-sm font-medium text-gray-500 truncate",
          children: "Active"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("dd", {
          className: "mt-1 text-3xl font-semibold text-gray-900",
          children: activeCount
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "flex-1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: "pointer-events-none absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400",
            "aria-hidden": "true"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            placeholder: "Search workshops...",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            className: "block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "sm:w-48",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("select", {
          value: filterStatus,
          onChange: e => setFilterStatus(e.target.value),
          className: "block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "all",
            children: "All Status"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "planned",
            children: "Planned"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "active",
            children: "Active"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "completed",
            children: "Completed"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("option", {
            value: "cancelled",
            children: "Cancelled"
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_workshops_WorkshopList__WEBPACK_IMPORTED_MODULE_2__["default"], {
      workshops: filteredWorkshops,
      isLoading: isLoading,
      onJoin: handleJoin,
      onView: handleView,
      onCreate: handleCreate
    })]
  });
}

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MakerBlocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MakerBlocks */ "./src/scripts/MakerBlocks.js");

new _MakerBlocks__WEBPACK_IMPORTED_MODULE_0__["default"]();
})();

/******/ })()
;
//# sourceMappingURL=index.js.map