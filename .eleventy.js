module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("papers", function (collection) {
    return collection.getFilteredByGlob("./intranet/papers/*.md");
  });

  return {
    dir: {
      input: "intranet",
      includes: "../_includes",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"]
  };
};
