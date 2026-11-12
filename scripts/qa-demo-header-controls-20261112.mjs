#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const names = ["nail-room","seasonal-brew","soluna-yoga","velmora","wok-social","yummm"];
for (const name of names) {
  const source = fs.readFileSync("demos/" + name + "/index.html","utf8");
  assert.match(source,new RegExp('data-tle-demo-brand="' + name + '"[^>]+https://thelaunchera[.]com/assets/tle-demo-header-controls-20261112[.]js'),name + ": missing topbar enhancer");
}
console.log("Six secondary portfolio topbar entries verified.");
