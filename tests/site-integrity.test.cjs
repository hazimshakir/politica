/* Static-site integrity checks. Run with: node tests/site-integrity.test.cjs */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const base = "https://politica-ynnr.onrender.com";
const sitemap = read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.ok(urls.length >= 5, "sitemap should contain the main public pages");
assert.equal(new Set(urls).size, urls.length, "sitemap URLs should be unique");

const ideologyData = JSON.parse(read("data/ideologies.json"));
const sourceData = JSON.parse(read("data/sources.json"));
const ideologyIds = new Set(ideologyData.records.map(x => x.id));
const sourceIds = new Set(sourceData.records.map(x => x.id));
assert.equal(ideologyIds.size, ideologyData.records.length, "ideology IDs should be unique");
for (const item of ideologyData.records) {
  for (const id of item.source_ids || []) {
    assert.ok(sourceIds.has(id), item.id + " references missing source " + id);
  }
}
for (const source of sourceData.records) {
  assert.ok(/^https:\/\//.test(source.url), "source URL must use HTTPS: " + source.id);
}

const requiredPages = ["/", "/assessment.html", "/seven-dimensions.html", "/thinkers-library.html", "/ideologies.html"];
for (const route of requiredPages) assert.ok(urls.includes(base + route), "sitemap missing " + route);
for (const id of ideologyIds) {
  assert.ok(urls.includes(base + "/ideology.html?id=" + encodeURIComponent(id)),
    "sitemap missing ideology detail: " + id);
}
for (const url of urls) {
  assert.ok(url.startsWith(base + "/"), "sitemap URL is outside the canonical site: " + url);
  const route = new URL(url).pathname;
  const target = route === "/" ? "index.html" : route.slice(1);
  assert.ok(fs.existsSync(path.join(root, target)), "sitemap route has no local page: " + route);
  if (route === "/ideology.html") {
    const id = new URL(url).searchParams.get("id");
    assert.ok(ideologyIds.has(id), "sitemap contains unknown ideology ID: " + id);
  }
}

for (const file of ["index.html", ...requiredPages.filter(x => x !== "/").map(x => x.slice(1))]) {
  const html = read(file);
  assert.match(html, /<title>[^<]+<\/title>/i, file + " needs a title");
  assert.match(html, /<meta name="description" content="[^"]+"/i, file + " needs a description");
  if (file !== "index.html") assert.ok(html.includes('rel="canonical"'), file + " needs a canonical URL");
}
assert.equal(ideologyData.records.length, 27, "update this expectation deliberately when catalogue grows");
console.log("PASS: sitemap routes, canonical pages, ideology IDs, and source references");
