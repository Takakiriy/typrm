import * as commander from 'commander';
import * as main from './main';

function  exitFromCommander(e: commander.CommanderError) {
	console.log(e.message);
}
async function  callMain() {
	commander.program.version('0.1.1').exitOverride(exitFromCommander)
		.option("-l, --locale <s>")
		.option("-t, --test")
		.option("-d, --folder <>", "The root path of searching folder", process.env.TYPRM_FOLDER)
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
				timeOver.setSeconds( timeOver.getSeconds() + 5 );

				while ((new Date()).getTime() < timeOver.getTime()) {
				}
			}
		})
		.finally(()=>{
			main.InputObject.close();
		});
}
callMain();
