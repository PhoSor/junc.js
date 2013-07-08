module.exports = [
  {
    "path": "base.js",
    "content": "var base;\n\n"
  },
  {
    "path": "config.json",
    "content": "[\n  { \"basePath\": \".\",\n    \"defaultFiles\": [\"base.js\"],\n    \"entry\": \"mod-a\",\n    \"output\": \"mod-a.con.js\"\n  }\n]\n"
  },
  {
    "path": "mod-a.js",
    "content": "/**\n * @require mod-b\n */\n\nvar modA;\n\n"
  },
  {
    "path": "mod-b.js",
    "content": "/**\n * @require mod-c\n */\n\nvar modB;\n\n"
  },
  {
    "path": "mod-c.js",
    "content": "/**\n */\n\nvar modC;\n\n"
  }
];