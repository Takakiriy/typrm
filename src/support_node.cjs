const fs = require('fs');
const path = require('path');

function  main() {
    addJsExtensionToImports('./build');
}

function  addJsExtensionToImports(directory) {
    const  files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            addJsExtensionToImports(path.join(directory, file.name));
        } else if (file.name.endsWith('.js')) {
            const  filePath = path.join(directory, file.name);
            let    content = fs.readFileSync(filePath, 'utf8');
            const  relativePath = '../'.repeat(countOccurrences(filePath, '/|\\\\')).substring(1);

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

            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}

function  countOccurrences(target, keywordRegExp) {
    return  (target.match(new RegExp(keywordRegExp, 'gi')) || []).length;
}

main();
