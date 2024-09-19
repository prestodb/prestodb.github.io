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
   },
   {
    caption: "Alibaba Group",
    image: '/img/alibaba-logo.png',
    pinned: true,
   }
];

prestoBaseUrl =  '/'

const siteConfig = {
  title: "",
  tagline: "Fast and Reliable SQL for Data Analytics and the Open Lakehouse",
  url: "https://prestodb.github.io", // Your website URL
  cname: "prestodb.github.io",
  baseUrl: prestoBaseUrl, // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: "prestodb.github.io",
  organizationName: "prestodb",

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { href: prestoBaseUrl + "getting-started.html", label: "Get Started" },
    { href: prestoBaseUrl + "what-is-presto.html", label: "Learn" },
    { href: prestoBaseUrl + "community.html", label: "Community" },
    {
      href: "/blog",
      label: "Blog",
      external: false,
    },
    {
      href: "/docs/current",
      label: "Docs",
      external: true,
    },
    { href: "https://communityinviter.com/apps/prestodb/prestodb", 
      label: "Slack", 
      external: true },
    {
      href: "https://github.com/prestodb/presto",
      label: "GitHub",
      external: true,
    },
    {
      href: "https://stackoverflow.com/questions/tagged/presto",
      label: "Stackoverflow",
      external: true,
    }, 
    { href: "https://twitter.com/prestodb", label: "Twitter", external: true },
    {
      href: "https://www.linkedin.com/company/presto-foundation/",
      label: "LinkedIn",
      external: true,
    },
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
  headerIcon: "img/logo-presto-white.svg",
  footerIcon: "img/logo-presto-white.svg",
  favicon: "img/icon-presto-dots-color.svg",

  /* Colors for website */
  colors: {
    primaryColor: "#1c1e21",
    secondaryColor: "#5D88D6",
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
  //    copyright: ``
  //  copyright: `Copyright © 2013-${new Date().getFullYear()} Presto Foundation`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "default",
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ["https://buttons.github.io/buttons.js","https://js.hs-scripts.com/39785153.js"],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/presto-logo-stacked.png",
  twitterImage: "img/presto-logo-stacked.png",

  separateCss: [
    "static/css/",

    // styles for docs
    "static/copybutton.css",
    "static/material.css",
    "static/sphinx_immaterial_theme.37dfeca1a5899a14e.min.css",
    "static/presto.css",
    "static/pygments.css",
    "static/fonts/material-icons.css",
    "static/fonts/font-awesome.css",
    "static/stylesheets/application-fixes.css",
    "static/stylesheets/application-palette.css",
    "static/stylesheets/application.css",

  ],
  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
  stylesheets: [
    "/css/bootstrap.min.css",
    "/css/custom.css",
  ],
};

module.exports = siteConfig;
