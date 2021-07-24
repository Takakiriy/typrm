/// <reference types="node" />
import * as readline from 'readline';
export declare function copyFolderSync(sourceFolderPath: string, destinationFolderPath: string): Promise<void>;
export declare function copyFileSync(sourceFilePath: string, destinationFilePath: string): void;
export declare function getFullPath(relativePath: string, basePath: string): string;
export declare function getHomePath(): string;
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
export {};
