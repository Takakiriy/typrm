import * as commander from 'commander';
import * as main from './main';
import * as lib from './lib';
function exitFromCommander(e) {
    if (e.code !== 'commander.version') {
        console.log(e.message);
    }
}
async function callMain() {
    commander.program.version('1.3.0') // previous revision of new features, update package.json, commit and add git tag
        .exitOverride(exitFromCommander)
        .option("-l, --locale <s>")
        .option("-t, --test")
        .option("-d, --folder <>", "The root path of searching folder", process.env.TYPRM_FOLDER)
        .option("-n, --found-count-max <i>", "Max number of showing found lines in search", process.env.TYPRM_FOUND_COUNT_MAX || main.foundCountMaxDefault)
        .option("-s, --snippet-line-count <i>", "Max number of snippet line count", process.env.TYPRM_SNIPPET_LINE_COUNT || main.snippetLineCountDefault)
        .option("--command-symbol <s>", "The charactor before shell command", process.env.TYPRM_COMMAND_SYMBOL)
        .option("--command-folder <s>", "The charactor before shell command", process.env.TYPRM_COMMAND_FOLDER)
        .option("--color")
        .option("--thesaurus <>", "The thesaurus CSV file path", process.env.TYPRM_THESAURUS)
        .option("--disable-find-all")
        .option("--replace-mode")
        .option("--stdout-buffer")
        .option("--inherit-dotenv", "false: (default) .env variables are not inherited to child processes. true: inherit")
        .option("--verbose")
        .parse(process.argv);
    for (const arg of commander.program.args) {
        main.programArguments.push(arg);
    }
    Object.assign(main.programOptions, commander.program.opts());
    await main.main()
        .catch((e) => {
        if (main.programOptions.test) {
            throw e;
        }
        else {
            console.log(`ERROR: ${e.message}`);
            const timeOver = new Date();
            timeOver.setSeconds(timeOver.getSeconds() + 1);
            while ((new Date()).getTime() < timeOver.getTime()) {
            }
        }
    })
        .finally(() => {
        lib.getInputObject().close();
    });
}
callMain();
//# sourceMappingURL=typrm.js.map