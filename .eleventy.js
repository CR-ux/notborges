module.exports = function (eleventyConfig) {
  // Copy static images from intranet/images to _site/images
  eleventyConfig.addPassthroughCopy({ "intranet/images": "images" });

  // Define the papers collection
  eleventyConfig.addCollection("papers", function (collection) {
    return collection.getFilteredByGlob("./intranet/papers/*.md");
  });

  return {
    dir: {
      input: "intranet",
      includes: "../_includes",
      output: "_site"
    },
    // Prevent Eleventy from parsing {} in .md files
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};