import { Editor as CodeMirror } from "codemirror";
import { Editor, CursorOffset, SearchResult } from "@textcomplete/core";
export declare class CodeMirrorEditor extends Editor {
    readonly cm: CodeMirror;
    constructor(cm: CodeMirror);
    destroy(): this;
    /**
     * @implements {@link Editor#applySearchResult}
     */
    applySearchResult(searchResult: SearchResult): void;
    /**
     * @implements {@link Editor#getCursorOffset}
     */
    getCursorOffset(): CursorOffset;
    /**
     * @implements {@link Editor#getBeforeCursor}
     */
    getBeforeCursor(): string;
    private getAfterCursor;
    private getLines;
    private onKeydown;
    private onKeyup;
    private startListening;
    private stopListening;
}
