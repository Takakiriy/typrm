const _fs = require('fs');
const _path = require('path');

function  main() {
    addJsExtensionToImports('./build');
    copyDotJsFiles('./src', './build');
}

function  addJsExtensionToImports(directory) {
    const  files = _fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            const  folderName = file.name;
            addJsExtensionToImports(_path.join(directory, folderName));
        } else if (file.name.endsWith('.js')) {
            const  filePath = _path.join(directory, file.name);
            let    content = _fs.readFileSync(filePath, 'utf8');
            const  relativePath = '../'.repeat(countOccurrences(filePath, '/|\\\\') - 1).substring(1);
            // const  relativePath = './';

            content = content.replace(/(from|import)\s+['"]((.+?)\/(.+?))['"]/g, (match, p1, p2) => {
                if (p2.endsWith('.js') || p2.endsWith('.cjs')  || p2.endsWith('.mjs') || p2.startsWith('http') || p2.startsWith('/')) {
                    return match;
                } else if (p2.endsWith('_esm')) {
                    return `${p1} '${p2}.mjs'`;
                } else {
                    return `${p1} '${p2}.js'`;
                }
            });
            content = content.replace(/@src\//g, relativePath);

            _fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}

function  countOccurrences(target, keywordRegExp) {
    return  (target.match(new RegExp(keywordRegExp, 'gi')) || []).length;
}

function  copyDotJsFiles(sourceDirectory, destinationDirectory) {
    _fs.copyFileSync(`${sourceDirectory}/lib-cjs.cjs`,  `${destinationDirectory}/lib-cjs.cjs`);
}

main();
