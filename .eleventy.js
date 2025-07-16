const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "intranet/images": "images" });

  eleventyConfig.addCollection("papers", function (collection) {
    return collection.getFilteredByGlob("./intranet/papers/*.md");
  });

  const md = markdownIt({ html: true }).use(markdownItFootnote);
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "intranet",
      includes: "../_includes",
      output: "_site"
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};