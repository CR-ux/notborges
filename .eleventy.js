const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "intranet/images": "images" });

  eleventyConfig.addCollection("papers", function (collection) {
    return collection.getFilteredByGlob("./intranet/papers/*.md");
  });

  // Create markdown-it instance
  const md = markdownIt({ html: true }).use(markdownItFootnote);

  // Add custom plugin for ![[Note]] transclusions
  md.use(function(md) {
    md.inline.ruler.after("link", "transclude", function(state, silent) {
      const start = state.pos;
      const marker = "![[";
      if (state.src.startsWith(marker, start)) {
        const end = state.src.indexOf("]]", start);
        if (end !== -1) {
          if (!silent) {
            const filename = state.src.slice(start + marker.length, end).trim();
            let filepath = path.join("intranet", "notes", `${filename}.md`);
            let content = "";

            try {
              content = fs.readFileSync(filepath, "utf8");
            } catch (e) {
              content = `<em>Missing transclusion: ${filename}</em>`;
            }

            // Render the included note as markdown
            const token = state.push("html_inline", "", 0);
            token.content = md.render(content);
          }
          state.pos = end + 2;
          return true;
        }
      }
      return false;
    });
  });

  // Tell Eleventy to use this md engine
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "intranet",       // your content folder
      includes: "../_includes",
      output: "_site"
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};