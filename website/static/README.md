This website is currently a hybrid of Wordpress and generated Sphinx documentation. Doc changes are built and deployed to master by [GitHub Actions](https://github.com/prestodb/prestodb.github.io/actions) when changes are merged to the [source](https://github.com/prestodb/prestodb.github.io/tree/source) branch.

To test docs locally, follow the [Docusarus instructions](https://docusaurus.io/docs/en/next/tutorial-setup) to install node.js and yarn. Then follow the instructions in [README.md](website/README.md).

To summarize, you need to `brew install node` then `brew install yarn`. Once you have `node` and `yarn` you can run `yarn` from the website subdirectory to install the dependencies. Then you can run `yarn start` at any time to run a web server that will host the site from source or invoke `yarn build` to see what will be created when the site is compiled.

Static HTML portions of the site including blogs are hosted on Wordpress. If you'd like to contribute a blog or suggest a website update or change, please send an email to community@prestodb.io
