const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function updateRepoLinksInChangedFiles() {
    let changedFiles = [];
    try {
        const gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
        let stdout = '';
        try {
            stdout = execSync('git diff --cached --name-only --diff-filter=d', { encoding: 'utf8' });
        } catch (e) {}

        if (!stdout.trim()) {
            try {
                stdout = execSync('git diff HEAD --name-only --diff-filter=d', { encoding: 'utf8' });
            } catch (e) {}
        }

        changedFiles = stdout
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
            .map(f => (path.isAbsolute(f) ? f : path.resolve(gitRoot, f)))
            .filter(f => f.endsWith('.html') || f.endsWith('.htm'));
    } catch (err) {
        console.error('Error finding changed files for link updates:', err.message);
        return;
    }

    if (changedFiles.length === 0) {
        return;
    }

    const aTagRegex = /<a\b[^>]*href=["'][^"']*repo1\.maven\.org[^"']*["'][^>]*>/gi;

    for (const filePath of changedFiles) {
        if (!fs.existsSync(filePath)) continue;
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = originalContent.replace(aTagRegex, tag => {
            const relMatch = /rel=["']([^"']*)["']/i.exec(tag);
            if (relMatch) {
                const currentRel = relMatch[1];
                const tokens = currentRel.split(/\s+/).filter(Boolean);
                if (!tokens.includes('noopener')) tokens.push('noopener');
                if (!tokens.includes('noreferrer')) tokens.push('noreferrer');
                const newRel = tokens.join(' ');
                if (newRel === currentRel) return tag;
                return tag.replace(/rel=["'][^"']*["']/i, `rel="${newRel}"`);
            } else {
                return tag.replace(/<a\b/i, '<a rel="noopener noreferrer"');
            }
        });

        if (updatedContent !== originalContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`Updated repo1.maven.org links in: ${filePath}`);
            try {
                execSync(`git add "${filePath}"`);
            } catch (e) {}
        }
    }
}

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

async function main() {
    updateRepoLinksInChangedFiles();
    await updateSphinxThemeFiles();
}

main().catch(console.error);

