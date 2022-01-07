import * as commander from 'commander';
import * as main from './main';
import * as lib from './lib';

function  exitFromCommander(e: commander.CommanderError) {
    if (e.code !== 'commander.version') {
        console.log(e.message);
    }
}
async function  callMain() {
    commander.program.version('1.0.0')  // previous revision of new features, update package.json, commit and add git tag
        .exitOverride(exitFromCommander)
        .option("-l, --locale <s>")
        .option("-t, --test")
        .option("-d, --folder <>", "The root path of searching folder", process.env.TYPRM_FOLDER)
        .option("--color")
        .option("--thesaurus <>", "The thesaurus CSV file path", process.env.TYPRM_THESAURUS)
        .option("--replace-mode")
        .option("--stdout-buffer")
        .option("--verbose")
        .parse(process.argv);
    
    for (const arg of commander.program.args) {
        main.programArguments.push(arg);
    }
    Object.assign(main.programOptions, commander.program.opts());

    await  main.main()
        .catch( (e)=>{
            if (main.programOptions.test) {
                throw e;
            } else {

                console.log( `ERROR: ${e.message}` );
                const  timeOver = new Date();
                timeOver.setSeconds( timeOver.getSeconds() + 1 );

                while ((new Date()).getTime() < timeOver.getTime()) {
                }
            }
        })
        .finally(()=>{
            lib.getInputObject().close();
        });
}
callMain();
