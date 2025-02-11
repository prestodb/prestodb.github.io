const fs = require('fs');
const path = require('path');

async function updateSphinxThemeFiles() {
    const siteConfigPath = path.join(__dirname, './siteConfig.js');
    const staticDocsPath = path.join(__dirname, 'static/docs');

    let content = fs.readFileSync(siteConfigPath, 'utf8');
    let lines = content.split('\n');

    const pattern = /\Wstatic\/sphinx_immaterial_theme\.[a-f0-9]+\.min\.css\W/;
    const insertLineIndex = lines.findIndex(line => pattern.test(line));

    if (insertLineIndex === -1) {
        console.error('Could not find sphinx theme file references in siteConfig.js');
        process.exit(1);
    }

    matchSet = new Set();
    lines = lines.filter(line => {
        if ( !pattern.test(line) ){
            return true;
        } else {
            matchSet.add(line.trim());
            return false;
        }
    });

    const versionFolders = fs.readdirSync(staticDocsPath)
        .filter(folder => /^\d+\.\d+(\.\d+)?$/.test(folder));

    if (versionFolders.length === 0) {
        console.error('No version folders found');
        process.exit(1);
    }

    const allCssFiles = [];
    const fileSet = new Set();
    for (const version of versionFolders) {
        const staticPath = path.join(staticDocsPath, version, '_static');
        if (fs.existsSync(staticPath)) {
            const files = fs.readdirSync(staticPath)
                .sort()
                .filter(file => file.startsWith('sphinx_immaterial_theme.') && file.endsWith('.min.css'))
                .filter(file => {
                    if ( fileSet.has(file) ) return false;
                    fileSet.add(file);
                    return true;
                })
                .map(file => `    "static/${file}",`);
            allCssFiles.push(...files);
        }
    }

    if (matchSet.size === allCssFiles.length && 
        allCssFiles.every(file => matchSet.has(file.trim()))) {
        process.exit(1);
    }

    console.info('Found CSS files:', allCssFiles);
    lines.splice(insertLineIndex, 0, ...allCssFiles);

    fs.writeFileSync(siteConfigPath, lines.join('\n'));
    console.log('Successfully updated sphinx theme file references');
    process.exit(0);
}

updateSphinxThemeFiles().catch(console.error);