"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeMirrorEditor = void 0;
const core_1 = require("@textcomplete/core");
class CodeMirrorEditor extends core_1.Editor {
    constructor(cm) {
        super();
        this.cm = cm;
        this.onKeydown = (_cm, e) => {
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
        this.onKeyup = (_cm, e) => {
            const code = this.getCode(e);
            if (code !== "DOWN" && code !== "UP") {
                this.emitChangeEvent();
            }
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
        const replacement = searchResult.getReplacementData(this.getBeforeCursor());
        if (replacement) {
            this.cm.replaceRange(replacement.beforeCursor + replacement.afterCursor, this.cm.posFromIndex(replacement.start), this.cm.posFromIndex(replacement.end));
            this.cm.setCursor(this.cm.posFromIndex(replacement.start + replacement.beforeCursor.length));
        }
        this.cm.focus();
    }
    /**
     * @implements {@link Editor#getCursorOffset}
     */
    getCursorOffset() {
        const { left, top, bottom } = this.cm.cursorCoords();
        return { left, top: bottom, lineHeight: bottom - top };
    }
    /**
     * @implements {@link Editor#getBeforeCursor}
     */
    getBeforeCursor() {
        const { line, ch } = this.cm.getCursor();
        const lines = this.getLines();
        const linesBeforeCursor = lines.slice(0, line);
        const currentLineBeforeCursor = lines[line].slice(0, ch);
        return linesBeforeCursor
            .concat([currentLineBeforeCursor])
            .join(this.cm.lineSeparator());
    }
    getAfterCursor() {
        const { line, ch } = this.cm.getCursor();
        const lines = this.getLines();
        const linesAfterCursor = lines.slice(line + 1);
        const currentLineAfterCursor = lines[line].slice(ch);
        return [currentLineAfterCursor]
            .concat(linesAfterCursor)
            .join(this.cm.lineSeparator());
    }
    getLines() {
        return this.cm.getValue().split(this.cm.lineSeparator());
    }
    startListening() {
        this.cm.on("keydown", this.onKeydown);
        this.cm.on("keyup", this.onKeyup);
    }
    stopListening() {
        this.cm.off("keydown", this.onKeydown);
        this.cm.off("keyup", this.onKeyup);
    }
}
exports.CodeMirrorEditor = CodeMirrorEditor;
//# sourceMappingURL=CodeMirrorEditor.js.map