var fs = require("fs");
var _md = require("remarkable");
var mdfm = require("front-matter");
var toc = require("markdown-toc");
var mdx = [];
var opt = require("optimist").argv;

//markdown parser
var md = new _md();
var mdi;
for (mdi = 0; mdi < mdx.length; mdi++) {
  md.use(mdi[i]);
};

module.exports.amistad = function (data) {
  let out; let pfx = ""; var navbar;
  let ssl = `<link rel='stylesheet' href="https://gistcdn.githack.com/bleonard252/3165615ff3d3c8275b33e5eed1841b0b/raw/9dfcafeb5f2373fdb38eef16a32e0d50d6524183/github.css" from-fm-default>`;
  // toc // let datus = mdx.toc.insert(data);
  let front = mdfm(data);
  try {navbar = (front.attributes.navbar ? fs.readFileSync(front.attributes.navbar) : null)}
  catch(e){console.error(e);navbar = null;} console.debug(navbar);
  data = data.replace(/^---[\s\S]*?---/g,'');
  data = toc.insert(data);
  let datae = md.render(data);
       if (front.attributes.style == "gitiles") ssl = `<link rel='stylesheet' href="https://gistcdn.githack.com/bleonard252/3165615ff3d3c8275b33e5eed1841b0b/raw/2a83092c6aa56c7eda3fa22b712ee76c9a2e98ac/gitiles.css" from-fm-style>`;
  else if (front.attributes.style == "github") ssl = ssl;
  else if (front.attributes.style == "none") ssl = "<!-- none from-fm-style -->";
  if (front.attributes.stylesheet != undefined) ssl = `<link rel='stylesheet' href="${front.attributes.stylesheet}" from-front-matter>`;
  if (front.attributes.style == "gitiles") {
    datae = "<outerwrap><innerwrap>" + datae + "</innerwrap></outerwrap>"; 
    if (navbar !== null) try {pfx = `<header class="Site-header Site-header--withNavbar"><div class="Header"><div class="Header-title">${md.render(navbar,{}).match(/^<p><a(.*?)<\/a><\/p>/)[0]}</div></div><nav class="Header-nav" role="navigation"><ul>${md.render(navbar,{}).match(/<ul>(.*?)<\/ul>/)[1]}</ul></nav></header>` /* add navbar */} 
      catch(e) {console.error(e);pfx = `<header class="Site-header"><div class="Header"><div class="Header-title"></div></div></header>`}
    else pfx = `<header class="Site-header"><div class="Header"><div class="Header-title"></div></div></header>` /* add navbar */
  }
  return `<!DOCTYPE HTML><head>
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/styles/default.min.css"><script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/highlight.min.js"></script><script>hljs.initHighlightingOnLoad();</script>
  <meta content="width=device-width,maximum-scale=1.0,initial-scale=1.0,minimum-scale=1.0,user-scalable=no" name="viewport">
  <title>${front.attributes.title || "Untitled"}</title>${ssl}</head><body>` + pfx + datae + `</body>`
}
