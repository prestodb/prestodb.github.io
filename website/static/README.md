This website is currently a hybrid of static hand coded html, generated Sphinx documentation, and a Docusaurus generated blog. Changes are built and deployed to master by [TravisCI](https://travis-ci.com/prestodb/prestodb.github.io) when changes are merged to the [source](https://github.com/prestodb/prestodb.github.io/tree/source) branch.

To test locally follow the [Docusarus instructions](https://docusaurus.io/docs/en/next/tutorial-setup) to install node.js and yarn. Then follow the instructions in [README.md](website/README.md).

To summarize you need to `brew install node` then `brew install yarn`. Once you have node and yarn you can run `yarn` from the website subdir to install the dependencies. Then you can run `yarn start` at any time to run a web server that will host the site from source or invoke `yarn build` to see what will be created when the site is compiled.

Static HTML portions of the site are stored under [website/static](website/static), and blog posts are stored as markdown under [website/blog](website/blog).
