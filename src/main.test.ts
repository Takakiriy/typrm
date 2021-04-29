import * as fs from 'fs';
import * as path from 'path';
import * as main from './main';
const  callMain = main.callMainFromJest;

if (path.basename(process.cwd()) !== 'src') {  // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir('src');
}
const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;

describe('search tag', () => {

    test.each([
        [
            '1st',
            ['search', 'ABC'],
            {'folder': 'test_data/search/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n'
        ],[
            'not found',
            ['search', 'notFound'],
            {'folder': 'test_data/search/1', 'test': ''},
            ''
        ],[
            'acronym',
            ['s', 'ABC'],
            {'folder': 'test_data/search/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n'
        ],[
            'space',
            ['search', 'do it'],
            {'folder': 'test_data/search/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n'
        ],[
            'comma',
            ['search', 'a,b'],
            {'folder': 'test_data/search/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n'
        ],[
            'double quotation',
            ['search', 'double quotation is ".'],
            {'folder': 'test_data/search/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:4:#keyword: "double quotation is ""."\n'
        ],[
            'word(1)',
            ['search', 'AB'],
            {'folder': 'test_data/search/1', 'test': ''},
            ''
        ],[
            'word(2)',
            ['search', 'do'],
            {'folder': 'test_data/search/1', 'test': ''},
            ''
        ]
    ])('%s', async (_caseName, arguments_, options, answer) => {

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe('glossary tag', () => {

    test.each([
        [
            '1st',
            ['search', 'ABC'],
			{'folder': 'test_data/search/glossary/1', 'test': ''},
            '${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml:7:    ABC: abc\n'
        ],[
            'word',
            ['search', 'AB'],
            {'folder': 'test_data/search/glossary/1', 'test': ''},
            ''
        ]
    ])('%s', async (_caseName, arguments_, options, answer) => {

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

// deleteFile
function  deleteFile(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// getFullPath
function  getFullPath(relativePath: string, basePath: string): string {
	var  fullPath = '';
	if (relativePath.substr(0,1) === '/') {
		fullPath = relativePath;
	} else {
		fullPath = path.join(basePath, relativePath);
	}
	return  fullPath;
}

// printDifferentPaths
function  printDifferentPaths(path1: string, path2: string) {
	console.log(`Error: different between the following files`);
	console.log(`  Path1: ${testFolderFullPath + path1}`);
	console.log(`  Path2: ${testFolderFullPath + path2}`);
}

const  testFolderFullPath = getFullPath( `../src/${testFolderPath}`, __dirname);

export {};
declare global {  // for TypeScript
    namespace jest {
        interface Matchers<R> {
            because: (expected: string) => CustomMatcherResult;
        }
    }
}
expect.extend({

    because(isPassed: boolean, errorMessage: string) {
        return {
            pass: isPassed,
            message: () => errorMessage,
        };
    },
});
