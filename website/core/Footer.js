/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="copyright">
          Copyright &copy; The Presto Foundation.<br />
          All rights reserved. Presto is a registered trademark of LF Projects, LLC. <br />Please see our
          <a href="https://lfprojects.org/policies/trademark-policy/">Trademark Policy</a> for more
          information.<br />
          <a href="https://lfprojects.org/policies/privacy-policy/">Privacy Policy</a> |
          <a href="https://lfprojects.org/policies/terms-of-use/">Terms of Use</a>.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
