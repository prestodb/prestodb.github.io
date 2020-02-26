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
        <section className="copyright">Copyright &copy; The Presto Foundation.
All rights reserved. The Linux Foundation has registered trademarks and uses
trademarks. For a list of trademarks of The Linux Foundation, please see our <a
href="https://www.linuxfoundation.org/trademark-usage">Trademark Usage</a> page.
Linux is a registered trademark of Linus Torvalds. <a
href="http://www.linuxfoundation.org/privacy">Privacy Policy</a> and <a
href="http://www.linuxfoundation.org/terms">Terms of Use</a>.</section>
      </footer>
    );
  }
}

module.exports = Footer;
