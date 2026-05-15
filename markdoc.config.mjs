import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";
import Markdoc from "@markdoc/markdoc";
import slugify from "slugify";

const { nodes, Tag } = Markdoc;

export default defineMarkdocConfig({
  tags: {
    details: {
      render: "details",
      children: nodes.document.children,
    },
    summary: {
      render: "summary",
      children: nodes.document.children,
    },
    sup: {
      render: "sup",
      children: nodes.strong.children,
    },
    sub: {
      render: "sub",
      children: nodes.strong.children,
    },
    abbr: {
      render: "abbr",
      attributes: {
        title: { type: String },
      },
      children: nodes.strong.children,
    },
    kbd: {
      render: "kbd",
      children: nodes.strong.children,
    },
    mark: {
      render: "mark",
      children: nodes.strong.children,
    },
    youtube: {
      render: component("./src/components/YouTubeEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
        label: { type: String, required: true },
      },
      selfClosing: true,
    },
    tweet: {
      render: component("./src/components/TweetEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
      },
      selfClosing: true,
    },
    codepen: {
      render: component("./src/components/CodePenEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
        title: { type: String, required: true },
      },
      selfClosing: true,
    },
    githubgist: {
      render: component("./src/components/GitHubGistEmbed.astro"),
      attributes: {
        id: { type: String, required: true },
      },
      selfClosing: true,
    },
  },
  nodes: {
    heading: {
      render: component("./src/components/Heading.astro"),
      attributes: {
        level: { type: Number, required: true },
        id: { type: String },
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        const headingText = children
          .filter((c) => typeof c === "string")
          .join("");
        const id = slugify(headingText.toLowerCase());
        return new Tag(this.render, { ...attributes, id }, children);
      },
    },
    fence: {
      render: component("./src/components/CodeBlock.astro"),
      attributes: {
        language: { type: String },
        content: { type: String },
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        // content lives in attributes for fence nodes; children is the fallback for older parsers
        const content =
          children.filter((c) => typeof c === "string").join("") ||
          attributes.content ||
          "";
        const language = attributes.language || "";
        return new Tag(this.render, { language, content }, []);
      },
    },
  },
});
