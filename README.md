This website is currently a hybrid of static hand coded html, generated Sphinx documentation, and a Docusaurus generated blog.

To generate the blog follow the [Docusarus instructions](https://docusaurus.io/docs/en/next/tutorial-setup) to install node.js and yarn. Then follow the instructions in [README.md](website/README.md) to generate the documentation using 'yarn build'.

You can test the site by running 'python3 -m http.server 300' and connecting to the local web server that creates. 

There are symlinks to the Docusaurus generated directories in the root so that they can be served along with the hand coded HTML and Sphinx generated documentation.
