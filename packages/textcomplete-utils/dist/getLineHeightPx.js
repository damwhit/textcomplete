"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineHeightPx = void 0;
const CHAR_CODE_ZERO = "0".charCodeAt(0);
const CHAR_CODE_NINE = "9".charCodeAt(0);
const isDigit = (charCode) => CHAR_CODE_ZERO <= charCode && charCode <= CHAR_CODE_NINE;
const getLineHeightPx = (el) => {
    const computedStyle = getComputedStyle(el);
    const lineHeight = computedStyle.lineHeight;
    // If the char code starts with a digit, it is either a value in pixels,
    // or unitless, as per:
    // https://drafts.csswg.org/css2/visudet.html#propdef-line-height
    // https://drafts.csswg.org/css2/cascade.html#computed-value
    if (isDigit(lineHeight.charCodeAt(0))) {
        const floatLineHeight = parseFloat(lineHeight);
        // In real browsers the value is *always* in pixels, even for unit-less
        // line-heights. However, we still check as per the spec.
        return isDigit(lineHeight.charCodeAt(lineHeight.length - 1))
            ? floatLineHeight * parseFloat(computedStyle.fontSize)
            : floatLineHeight;
    }
    // Otherwise, the value is "normal".
    // If the line-height is "normal", calculate by font-size
    return calculateLineHeightPx(el.nodeName, computedStyle);
};
exports.getLineHeightPx = getLineHeightPx;
/**
 * Returns calculated line-height of the given node in pixels.
 */
const calculateLineHeightPx = (nodeName, computedStyle) => {
    const body = document.body;
    if (!body)
        return 0;
    const tempNode = document.createElement(nodeName);
    tempNode.innerHTML = "&nbsp;";
    Object.assign(tempNode.style, {
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        padding: "0",
    });
    body.appendChild(tempNode);
    // Make sure textarea has only 1 row
    if (tempNode instanceof HTMLTextAreaElement) {
        tempNode.rows = 1;
    }
    // Assume the height of the element is the line-height
    const height = tempNode.offsetHeight;
    body.removeChild(tempNode);
    return height;
};
//# sourceMappingURL=getLineHeightPx.js.map