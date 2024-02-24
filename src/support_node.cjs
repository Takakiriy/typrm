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

            content = content.replace(/from\s+['"]((.+?)\/(.+?))['"]/g, (match, p1) => {
                if (p1.endsWith('.js') || p1.endsWith('.cjs') || p1.startsWith('http') || p1.startsWith('/')) {
                    return match;
                } else {
                    return `from '${p1}.js'`;
                }
            });

            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}

main();
