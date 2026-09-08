# Chapter cover images

Drop an image in here and name it from a chapter's frontmatter:

```yaml
---
id: org
num: 1
cover: enterprise-structures.jpg
---
```

The build inlines it as a base64 data URI, so the site stays one self-contained
file. `.jpg`, `.png`, `.webp` and `.avif` are accepted; anything else fails the
build, as does a name that is not in this folder.

**Size matters more than usual.** Base64 adds about 33%, and the whole site is
currently under 300 KB. Resize to roughly 1600×400 and compress hard — a good
cover is 80–150 KB. The build warns above 400 KB, and seventeen covers at that
size would be a 9 MB page.

Covers render at 132px tall, cropped to fill, at 50% opacity over the chapter's
colour gradient — so they read as a tint, not as a photograph you study. Pick
images that work as texture: architecture, abstract detail, materials. Faces and
busy scenes turn to mush at that height.

A chapter with no `cover:` gets a generated pattern in its own hue instead
(`coverArt()` in `src/icons.js`), which is why this folder can stay empty.

**Licensing is on you.** Nothing here ships with the repo. Use images you own,
or ones under a licence that permits redistribution — the site is MIT and public,
so a "personal use only" stock image is not compatible with it. Record the source
and licence of anything you add below.

| File | Source | Licence |
| --- | --- | --- |
| _(none yet)_ | | |
