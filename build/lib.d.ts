/// <reference types="node" />
import * as readline from 'readline';
export declare function copyFolderSync(sourceFolderPath: string, destinationFolderPath: string): Promise<void>;
export declare function copyFileSync(sourceFilePath: string, destinationFilePath: string): void;
export declare function getFullPath(relativePath: string, basePath: string): string;
export declare function isFullPath(path: string): boolean;
export declare function getHomePath(): string;
export declare function cutLeftOf(input: string, keyword: string): string;
export declare function parseCSVColumns(columns: string): Promise<string[]>;
export declare function parseCSVColumnPositions(csv: string, columns: string[]): number[];
export declare function getGlobbyParameters(targetPath: string, baseFullPath: string): GlobbyParameters;
interface GlobbyParameters {
    targetFolderFullPath: string;
    wildcard: string;
}
declare class StandardInputBuffer {
    readlines: readline.Interface | undefined;
    inputBuffer: string[];
    inputResolver?: (answer: string) => void;
    delayedConstructor(): void;
    input(guide: string): Promise<string>;
    close(): void;
}
export declare function input(guide: string): Promise<string>;
export declare function getInputObject(): StandardInputBuffer;
export declare function inputPath(guide: string): Promise<string>;
export declare function inputSkip(count: number): void;
export declare function pathResolve(path_: string): string;
export declare function checkNotInGitWorking(): void;
export declare function getTestWorkFolderFullPath(): string;
export declare function getSnapshot(label: string): any;
export declare function pp(message: any): string[];
export declare const debugOut: string[];
export declare function cc(targetCount?: number, label?: string): {
    isTarget: boolean;
    debugOut: string[];
};
export {};
