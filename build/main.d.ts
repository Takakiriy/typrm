/// <reference types="node" />
import * as readline from 'readline';
export declare function main(): Promise<void>;
export declare const debugOut: string[];
declare class StandardInputBuffer {
    readlines: readline.Interface | undefined;
    inputBuffer: string[];
    inputResolver?: (answer: string) => void;
    delayedConstructor(): void;
    input(guide: string): Promise<string>;
    close(): void;
}
export declare const InputObject: StandardInputBuffer;
export declare function callMainFromJest(parameters?: string[], options?: {
    [name: string]: string;
}): Promise<void>;
export declare var stdout: string;
export declare var programArguments: string[];
export declare var programOptions: {
    [key: string]: any;
};
export {};
