This website is currently a hybrid of static hand coded html, generated Sphinx documentation, and a Docusaurus generated blog. Changes are built and deployed to master by [TravisCI](https://travis-ci.com/prestodb/prestodb.github.io) when changes are merged to the [gh-pages](https://github.com/prestodb/prestodb.github.io/tree/gh-pages) branch.

To test locally follow the [Docusarus instructions](https://docusaurus.io/docs/en/next/tutorial-setup) to install node.js and yarn. Then follow the instructions in [README.md](website/README.md).

Static HTML parts of the site are stored under [website/static](website/static), and blog posts are stored as markdown under [website/blog](website/blog).
