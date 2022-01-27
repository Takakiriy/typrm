/// <reference types="node" />
import * as readline from 'readline';
import { ReadLineOptions } from 'readline';
export declare function copyFolderSync(sourceFolderPath: string, destinationFolderPath: string): Promise<void>;
export declare function copyFileSync(sourceFilePath: string, destinationFilePath: string): void;
export declare function rmdirSync(folderPath: string): void;
export declare function replaceFileSync(sourceFilePath: string, replaceFunction: {
    (text: string): string;
}, destinationFilePath?: string): void;
export declare function replaceFileAsync(sourceFilePath: string, replaceFunction: {
    (text: string): Promise<string>;
}, destinationFilePath?: string): Promise<void>;
export declare function searchAsTextSub(readlineOptions: ReadLineOptions, keyword: string, csvOption: boolean): Promise<number>;
export declare function pathResolve(path_: string): string;
export interface UnexpectedLine {
    contentsLineNum: number;
    contentsLine: string;
    partsLineNum: number;
    partsLine: string;
}
export declare function getFullPath(relativePath: string, basePath: string): string;
export declare function isFullPath(path: string): boolean;
export declare function checkNotInGitWorking(): void;
export declare function getTestWorkFolderFullPath(): string;
export declare function getHomePath(): string;
export declare function getGlobbyParameters(targetPath: string, baseFullPath: string): GlobbyParameters;
interface GlobbyParameters {
    targetFolderFullPath: string;
    wildcard: string;
}
export declare function cutLeftOf(input: string, keyword: string): string;
export declare function cutLast(input: string, keyword: string): string;
export declare function cutIndent(lines: string[]): string[];
export declare function checkTextContents(testingContents: string[], expectedParts: string[], anyLinesTag: string): UnexpectedLine | null;
export declare function parseCSVColumns(columns: string): Promise<string[]>;
export declare function parseCSVColumnPositions(csv: string, columns: string[]): number[];
export declare function escapeRegularExpression(expression: string): string;
export declare function replace(input: string, replacers: ReplaceParameter[]): string;
export declare function replaceAsync(input: string, replacers: ReplaceParameter[]): Promise<string>;
interface ReplaceParameter {
    from?: string;
    fromCSV?: string;
    lineNum?: number;
    to: string;
}
export declare const indentRegularExpression: RegExp;
export declare const indentHyphenRegularExpression: RegExp;
export declare function isSameArray<T>(log: T[], answer: T[]): boolean;
export declare function isSameArrayOf<T>(log: T[], answer: T[]): boolean;
export declare function getCommonItems<T>(arrayA: T[], arrayB: T[]): T[];
export declare function cutSameItems<T>(array: T[]): T[];
export declare function stableUniqueFilterFunction<T>(isSameFunction: {
    (element1: T, element2: T): boolean;
}): {
    (element: T, index: number, array: T[]): boolean;
};
export declare function lastUniqueFilterFunction<T>(isSameFunction: {
    (element1: T, element2: T): boolean;
}): {
    (element: T, index: number, array: T[]): boolean;
};
export declare function fastUniqueFilter<T>(array: T[], getKeyFunction: {
    (element1: T): any;
}): T[];
export declare function parseMap<keyT, valueT>(mapString: string): Promise<Map<keyT, valueT>>;
export declare function isAlphabetIndex(index: string): boolean;
export declare function getAlphabetIndex(num: number | string): string;
export declare function fromAlphabetIndex(index: string): number;
export declare function cutAlphabetInIndex(index: string): string;
export declare namespace hasInterfaceOf {
    function Error(object: any): object is Error;
}
export declare function getObjectID(object: any): any;
export declare class InputOption {
    inputLines: string[];
    nextLineIndex: number;
    nextParameterIndex: number;
    constructor(inputLines: string[]);
}
export declare function setInputOption(option: InputOption): void;
export declare function input(guide: string): Promise<string>;
export declare function inputPath(guide: string): Promise<string>;
export declare function inputSkip(count: number): void;
export declare function setInputEchoBack(isEnabled: boolean): void;
export declare function getInputEchoBack(): boolean;
declare class StandardInputBuffer {
    readlines: readline.Interface | undefined;
    inputBuffer: string[];
    inputResolver?: (answer: string) => void;
    delayedConstructor(): void;
    input(guide: string): Promise<string>;
    close(): void;
}
export declare function getInputObject(): StandardInputBuffer;
export declare function cutEscapeSequence(textWithEscapeSequence: string): string;
export declare function getSnapshot(label: string, deafultSnapshot?: string | undefined): string;
export declare function pp(message: any): string[];
export declare const debugOut: string[];
export declare function ppClear(): string[];
export declare function cc(targetCount?: number, label?: string): {
    isTarget: boolean;
    debugOut: string[];
};
export {};
