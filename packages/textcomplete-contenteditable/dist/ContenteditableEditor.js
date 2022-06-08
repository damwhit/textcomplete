"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContenteditableEditor = void 0;
const core_1 = require("@textcomplete/core");
const utils_1 = require("@textcomplete/utils");
class ContenteditableEditor extends core_1.Editor {
    constructor(el) {
        super();
        this.el = el;
        this.onInput = () => {
            this.emitChangeEvent();
        };
        this.onKeydown = (e) => {
            const code = this.getCode(e);
            let event;
            if (code === "UP" || code === "DOWN") {
                event = this.emitMoveEvent(code);
            }
            else if (code === "ENTER") {
                event = this.emitEnterEvent();
            }
            else if (code === "ESC") {
                event = this.emitEscEvent();
            }
            if (event && event.defaultPrevented) {
                e.preventDefault();
            }
        };
        this.startListening = () => {
            this.el.addEventListener("input", this.onInput);
            this.el.addEventListener("keydown", this.onKeydown);
        };
        this.stopListening = () => {
            this.el.removeEventListener("input", this.onInput);
            this.el.removeEventListener("keydown", this.onKeydown);
        };
        this.startListening();
    }
    destroy() {
        super.destroy();
        this.stopListening();
        return this;
    }
    /**
     * @implements {@link Editor#applySearchResult}
     */
    applySearchResult(searchResult) {
        const before = this.getBeforeCursor();
        const after = this.getAfterCursor();
        if (before != null && after != null) {
            const replace = searchResult.replace(before, after);
            if (Array.isArray(replace)) {
                const range = this.getRange();
                range.selectNode(range.startContainer);
                this.el.ownerDocument.execCommand("insertText", false, replace[0] + replace[1]);
                range.detach();
                const newRange = this.getRange();
                newRange.setStart(newRange.startContainer, replace[0].length);
                newRange.collapse(true);
            }
        }
    }
    /**
     * @implements {@link Editor#getCursorOffset}
     */
    getCursorOffset() {
        const range = this.getRange();
        const rangeRects = range.getBoundingClientRect();
        const docRects = this.el.ownerDocument.body.getBoundingClientRect();
        const container = range.startContainer;
        const el = (container instanceof Text ? container.parentElement : container);
        const left = rangeRects.left;
        const lineHeight = (0, utils_1.getLineHeightPx)(el);
        const top = rangeRects.top - docRects.top + lineHeight;
        return this.el.dir !== "rtl"
            ? { left, lineHeight, top }
            : { right: document.documentElement.clientWidth - left, lineHeight, top };
    }
    /**
     * @implements {@link Editor#getBeforeCursor}
     */
    getBeforeCursor() {
        const range = this.getRange();
        if (range.collapsed && range.startContainer instanceof Text) {
            return range.startContainer.wholeText.substring(0, range.startOffset);
        }
        return null;
    }
    getAfterCursor() {
        const range = this.getRange();
        if (range.collapsed && range.startContainer instanceof Text) {
            return range.startContainer.wholeText.substring(range.startOffset);
        }
        return null;
    }
    getRange(force) {
        var _a;
        const selection = (_a = this.el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getSelection();
        if (selection == null) {
            throw new Error("The element does not belong to view");
        }
        for (let i = 0, l = selection.rangeCount; i < l; i++) {
            const range = selection.getRangeAt(i);
            if (this.el.contains(range.startContainer)) {
                return range;
            }
        }
        // The element is not active.
        if (force) {
            throw new Error("Unexpected");
        }
        const activeElement = this.el.ownerDocument.activeElement;
        this.el.focus();
        const range = this.getRange(true);
        // Activate previous active element
        if (activeElement) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const el = activeElement;
            el.focus && el.focus();
        }
        return range;
    }
}
exports.ContenteditableEditor = ContenteditableEditor;
//# sourceMappingURL=ContenteditableEditor.js.map