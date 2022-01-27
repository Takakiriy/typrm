export declare function main(): Promise<void>;
export declare function mainMain(): Promise<void>;
declare function makeSettingTree(parser: Parser): Promise<SettingsTree>;
declare enum CommandEnum {
    unknown = 0,
    check = 1,
    replace = 2,
    search = 3
}
declare class SettingsTree {
    indices: Map<number, string>;
    indicesWithIf: Map<number, string>;
    outOfFalseBlocks: Map<number, boolean>;
    settings: {
        [index: string]: {
            [name: string]: Setting;
        };
    };
    settingsInformation: {
        [index: string]: SettingsInformation;
    };
    wasChanged: boolean;
    currentSettings: {
        [name: string]: Setting;
    };
    currentSettingIndex: string;
    currentIsOutOfFalseBlock: boolean;
    outOfScopeSettingIndices: string[];
    nextSettingsLineNum: number;
    nextLineNumIndex: number;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
    moveToLine(parser: Parser): void;
    moveToLine_Immutably(parser: Readonly<Parser>): SettingsTree_for_moveToLine;
    addCurrentSettingsInIfTag_Immutably(currentIndex: string, currentSettings: Readonly<{
        [name: string]: Setting;
    }>, parser: Parser): SettingsTree_addCurrentSettingsInIfTag;
    moveToEndOfFile(): void;
}
interface SettingsTree_for_moveToLine {
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    wasChanged: boolean;
    currentSettings: {
        [name: string]: Setting;
    };
    currentSettingIndex: string;
    currentIsOutOfFalseBlock: boolean;
    outOfScopeSettingIndices: string[];
    nextLineNumIndex: number;
    nextSettingsLineNum: number;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
}
interface SettingsTree_addCurrentSettingsInIfTag {
    currentSettings: {
        [name: string]: Setting;
    };
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
}
interface SettingsInformation {
    index: string;
    lineNum: number;
    indent: string;
    condition: string;
    inSettings: boolean;
}
interface Setting {
    value: string;
    lineNum: number;
    settingsIndex: string;
    tag: 'settings' | 'toInSettings' | 'toAfterTemplate' | 'original';
    isReferenced: boolean;
}
declare class Parser {
    command: CommandEnum;
    errorCount: number;
    warningCount: number;
    templateCount: number;
    verbose: boolean;
    filePath: string;
    lineNum: number;
    line: string;
}
export declare function startTestRedirect(): void;
export declare function endTestRedirect(): void;
export declare function callMainFromJest(parameters?: string[], options?: {
    [name: string]: string;
}): Promise<void>;
export declare const private_: {
    Parser: typeof Parser;
    makeSettingTree: typeof makeSettingTree;
};
export declare var stdout: string;
export declare var programArguments: string[];
export declare var programOptions: {
    [key: string]: any;
};
export declare const foundCountMaxDefault = "10";
export declare const snippetLineCountDefault = "8";
export {};
