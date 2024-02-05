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
    contentsIndentLength: number;
    partsLineNum: number;
    partsLine: string;
    partsIndentLength: number;
    indentDiff: number;
}
export declare function getFullPath(relativePath: string, basePath: string): string;
export declare function isFullPath(path: string): boolean;
export declare function isInFileSystem(path_: string): boolean;
export declare function getExistingParentPath(path_: string): string;
export declare function replacePathToSlashed(path_: string): string;
export declare function replaceToPathForWindows(path_: string): string;
export declare function checkNotInGitWorking(): void;
export declare function getTestWorkFolderFullPath(): string;
export declare function getHomePath(): string;
export declare function getGlobbyParameters(targetPath: string, baseFullPath: string): Promise<GlobbyParameters>;
interface GlobbyParameters {
    targetFolderFullPath: string;
    globbyParameters: string[];
}
export declare function cutLeftOf(input: string, keyword: string): string;
export declare function cutLast(input: string, keyword: string): string;
export declare function cutIndent(lines: string[]): string[];
export declare function unexpandVariable(expanded: string, keyValues: string[][], out_replacedIndices?: number[] | null): string;
export declare function checkExpectedTextContents(testingContents: string[], expectedParts: string[], anyLinesTag: string): UnexpectedLine | null;
export declare function coloredDiff(redLine: string, greenLine: string, redHeaderLength?: number, greenHeaderLength?: number): ColoredDiff;
export declare function toWordArray(idiom: string): string[];
export declare function getWordCount(idiom: string): number;
export declare function splitIdioms(idioms: string, words: string[]): string;
export declare function chageToAlphabets(inputString: string): string;
interface ColoredDiff {
    greenLine: string;
    redLine: string;
}
export declare function parseCSVColumns(columns: string): Promise<string[]>;
export declare function parseCSVColumnPositions(csv: string, columns: string[]): number[];
export declare function getAllQuotedCSVLine(columns: string[] | number[]): string;
export declare function escapeRegularExpression(expression: string): string;
export declare function replace(input: string, replacers: ReplaceParameter[]): string;
export declare function replaceAsync(input: string, replacers: ReplaceParameter[]): Promise<string>;
interface ReplaceParameter {
    from?: string;
    fromCSV?: string;
    lineNum?: number;
    to: string;
}
declare type Secrets = {
    [name: string]: string | undefined;
};
export declare function loadDotEnvSecrets(inheritProcessEnv?: boolean): void;
export declare function getDotEnvSecrets(): Secrets;
export declare function getProcessEnvAndDotEnvSecrets(): Secrets;
export declare const indentRegularExpression: RegExp;
export declare const indentHyphenRegularExpression: RegExp;
export declare function isSameArray<T>(log: T[], answer: T[]): boolean;
export declare function isSameArrayOf<T>(arr1: T[], arr2: T[]): boolean;
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
export declare function mark(object: any, label?: string | number | boolean): void;
export declare namespace time {
    function start(label: string): void;
    function end(label: string): void;
    class TimeFrame {
        label: string;
        start: number;
        elapsed: number;
        count: number;
        getString(): string;
    }
    const timeFrames: Map<string, TimeFrame>;
    function get(label: string): TimeFrame;
    function getTimeFrames(labelPattern: string): TimeFrame[];
    function getTimeFramesString(labelPattern: string): string;
}
export declare function jsonStringify(object: any, dummy?: any, space?: string): string;
export declare function pp(message: any): string[];
declare global {
    export var debugOut: string[];
}
export declare function ppClear(): string[];
export declare function ff(conditionName: string, condition?: boolean | null): boolean;
export declare const ffFlags: {
    [name: string]: boolean;
};
export declare function cc(targetCount?: number | null, label?: string): {
    isTarget: boolean;
    debugOut: string[];
};
declare global {
    export var ccCount: {
        [name: string]: number;
    };
}
export {};
