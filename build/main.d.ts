export declare function main(): Promise<void>;
export declare function mainMain(): Promise<void>;
declare function makeSettingTree(parser: Parser): Promise<SettingsTree>;
declare function makeReplaceToTagTree(parser: Parser, settingTree: Readonly<SettingsTree>): Promise<ReplaceToTagTree>;
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
declare class ReplaceToTagTree {
    replaceTo: {
        [index: string]: {
            [name: string]: Setting;
        };
    };
    outOfFalseBlocks: Map<number, boolean>;
    outOfFalseBlocksByOriginalTag: Map<number, boolean>;
    command: 'replace' | 'reset';
    get replaceToLength(): number;
    currentNewSettings: {
        [name: string]: Setting;
    };
    currentNewSettingsByOriginalTag: {
        [name: string]: Setting;
    };
    currentOldSettingsInIfBlock: {
        [name: string]: Setting;
    };
    currentNewSettingsInIfBlock: {
        [name: string]: Setting;
    };
    currentIsOutOfFalseBlock: boolean;
    currentNotFoundNameInSameAsTag: NotFoundNameInSameAsTag[];
    nextLineNumIndex: number;
    nextSettingsLineNum: number;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
    moveToLine(parser: Parser, settingsTree: SettingsTree): void;
    moveToLine_Immutably(parser: Parser, settingsTree: Readonly<SettingsTree>): ReplaceToTagTree_for_moveToLine;
    addCurrentSettingsInIfBlock_Immutably(currentIndex: string, currentNewSettings: Readonly<{
        [name: string]: Setting;
    }>, currentNewSettingsByOriginalTag: Readonly<{
        [name: string]: Setting;
    }>, settingsTree: Readonly<SettingsTree>, parser: Parser): ReplaceToTagTree_for_addCurrentSettingsInIfBlock;
}
interface ReplaceToTagTree_for_moveToLine {
    currentNewSettings: {
        [name: string]: Setting;
    };
    currentNewSettingsByOriginalTag: {
        [name: string]: Setting;
    };
    currentOldSettingsInIfBlock: {
        [name: string]: Setting;
    };
    currentNewSettingsInIfBlock: {
        [name: string]: Setting;
    };
    currentNotFoundNameInSameAsTag: NotFoundNameInSameAsTag[];
    nextLineNumIndex: number;
    nextSettingsLineNum: number;
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    outOfFalseBlocksByOriginalTag: Map</*lineNum*/ number, boolean>;
    currentIsOutOfFalseBlock: boolean;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
}
interface ReplaceToTagTree_for_addCurrentSettingsInIfBlock {
    currentNewSettings: {
        [name: string]: Setting;
    };
    currentNewSettingsByOriginalTag: {
        [name: string]: Setting;
    };
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    outOfFalseBlocksByOriginalTag: Map</*lineNum*/ number, boolean>;
}
interface NotFoundNameInSameAsTag {
    settingName: string;
    notFoundName: string;
    referencedVariableNames: string[];
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
    tag: 'settings' | 'toInSettings' | 'toAfterTemplate' | 'original' | 'copyArgument' | 'env';
    isReferenced: boolean;
    sameAs?: string;
    sameAsWasChecked?: boolean;
}
declare class Parser {
    command: CommandEnum;
    errorCount: number;
    warningCount: number;
    toTagError: boolean;
    templateCount: number;
    verbose: boolean;
    filePath: string;
    lineNum: number;
    line: string;
    ifTagErrorMessageIsEnabled: boolean;
    outputToTagList: boolean;
    toTagList: string[];
    totalToTagCount: number;
    originalTagList: string[];
    flushedOriginalTagListCount: number;
    flushToTagList(): void;
}
export declare function startTestRedirect(): void;
export declare function endTestRedirect(): void;
export declare function callMainFromJest(parameters?: string[], options?: {
    [name: string]: string;
}): Promise<void>;
export declare const private_: {
    Parser: typeof Parser;
    makeSettingTree: typeof makeSettingTree;
    makeReplaceToTagTree: typeof makeReplaceToTagTree;
};
export declare const foundCountMaxDefault = "10";
export declare const snippetLineCountDefault = "5";
export declare const wordSuperSeparatorsDefault: string;
export declare const wordSeparatorsDefault = "~!^&*#()=+-[{]}\\|;:'\"`,.<>/?\u3001\u3002\uFF08\uFF09\u300C\u300D\u3010\u3011";
export declare var stdout: string;
export declare var programArguments: string[];
export declare var programOptions: {
    [key: string]: any;
};
export declare var programOptionsWordSeparators: string;
export {};
