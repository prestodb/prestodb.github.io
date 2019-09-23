/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Facebook',
    image: '/img/facebook.png',
    pinned: true,
  },
  {
    caption: 'AirBnB',
    image: '/img/airbnb_vertical_lockup_web-high-res.png',
    infoLink: 'https://airbnb.com',
    pinned: true,
  },
  {
     caption: 'Dropbox',
    image: '/img/DropboxGlyph_Blue.png',
    pinned: true,
  },
  {
    caption: 'LinkedIn',
    image: '/img/LinkedIn-Logo-2C-34px-TM.png',
    pinned: true,
  },
  {
    caption: 'Uber',
    image: '/img/uber.png',
    pinned: true,
  },
  {
    caption: 'Lyft',
    image: '/img/lyft.svg',
    pinned: true,
   }
];

prestoBaseUrl =  '/'

const siteConfig = {
  title: '',
  tagline: 'Faster big data with SQL on everything',
  url: 'https://prestodb.io', // Your website URL
  baseUrl: prestoBaseUrl, // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'prestodb.github.io',
  organizationName: 'prestodb',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {href: prestoBaseUrl + 'overview.html', label: 'OVERVIEW'},
    {href: prestoBaseUrl + 'docs/current', label: 'DOCS'},
    {href: prestoBaseUrl + 'index.html', label: 'BLOG'},
    {href: prestoBaseUrl + 'faq.html', label: 'FAQ'},
    {href: prestoBaseUrl + 'community.html', label: 'COMMUNITY'},
    {href: prestoBaseUrl + 'resources.html', label: 'RESOURCES'},
    {href: 'https://github.com/facebook/presto', label: 'GITHUB'},
  ],
  // headerLinks: [
  //   {doc: 'overview', label: 'Overview'},
  //   {doc: 'docs', label: 'Docs'},
  //   {page: 'community', label: 'Community'},
  //   {page: 'resources', label: 'Resources'},
  //   {page: 'development', label: 'Development'},
  //   {blog: true, label: 'Blog'},
  // ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/presto.png',
  footerIcon: 'img/presto-logo.png',
  favicon: 'img/presto-logo.png',

  /* Colors for website */
  colors: {
    primaryColor: '#000',
    secondaryColor: '#374665',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © 2013-${new Date().getFullYear()} Presto Foundation`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  separateCss: ['static/basic.css', 'static/haiku.css', 'static/presto.css']
  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
