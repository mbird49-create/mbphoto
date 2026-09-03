#!/usr/bin/env node
// Scaffold a new Observations post: creates blog/<slug>.html and adds its
// entry to the top of blog.html. Usage:
//   node scripts/new-post.js "Post Title" "One sentence excerpt for the index."

const fs = require("fs");
const path = require("path");

const [, , title, excerpt] = process.argv;

if (!title || !excerpt) {
  console.error('Usage: node scripts/new-post.js "Post Title" "Excerpt for the index"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const root = path.join(__dirname, "..");
const postPath = path.join(root, "blog", `${slug}.html`);
const indexPath = path.join(root, "blog.html");

if (fs.existsSync(postPath)) {
  console.error(`blog/${slug}.html already exists.`);
  process.exit(1);
}

const date = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const postHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Michael Bird Photography</title>
    <link href="/mebcss.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400&family=Jost:wght@400&family=Spectral:wght@400&display=swap"
        rel="stylesheet">
    <script data-cookie-category="analytics" data-goatcounter="https://michaelbird.goatcounter.com/count"
        type="text/plain" async src="//gc.zgo.at/count.js"></script>
</head>

<body data-page-title="${title}">
    <div id="site-header"></div>
    <div id="site-nav"></div>

    <main class="container py-4" style="max-width: 720px;">
        <p class="mb-4"><a class="text-decoration-none" href="/blog.html">&larr; Back to Observations</a></p>

        <h1>${title}</h1>
        <p class="text-muted mb-4" style="font-family: 'Jost', sans-serif; font-size: 0.9rem;">${date}</p>

        <p class="lead">${excerpt}</p>

        <!-- Write the rest of the post here. -->

    </main>

    <div id="site-footer"></div>

    <script src="/mebshared.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script data-cookie-category="marketing" type="text/plain"
        src="//widget.fotomoto.com/stores/script/1c66d998b2549532f9d8e669fa04b52240d7d31e.js"></script>
    <noscript>If Javascript is disabled in your browser, to place orders please visit the page where I <a href="https://my.fotomoto.com/store/1c66d998b2549532f9d8e669fa04b52240d7d31e">sell my photos</a>, powered by <a href="https://my.fotomoto.com/">Fotomoto</a>.</noscript>
</body>

</html>
`;

fs.writeFileSync(postPath, postHtml);

const indexEntry = `            <article>
                <h2 class="h4 mb-1">
                    <a class="text-decoration-none" href="/blog/${slug}.html">${title}</a>
                </h2>
                <p class="text-muted mb-2" style="font-family: 'Jost', sans-serif; font-size: 0.9rem;">${date}</p>
                <p class="lead mb-0">${excerpt}</p>
            </article>

`;

const indexHtml = fs.readFileSync(indexPath, "utf8");
const marker = '<div class="d-flex flex-column gap-4 mt-4">\n';
const markerIndex = indexHtml.indexOf(marker);

if (markerIndex === -1) {
  console.error("Could not find the post list marker in blog.html — add the entry manually.");
  process.exit(1);
}

const insertAt = markerIndex + marker.length;
const updatedIndex = indexHtml.slice(0, insertAt) + indexEntry + indexHtml.slice(insertAt);
fs.writeFileSync(indexPath, updatedIndex);

console.log(`Created blog/${slug}.html and added it to blog.html.`);
console.log(`Next: write the post body in blog/${slug}.html, then git add/commit/push.`);
