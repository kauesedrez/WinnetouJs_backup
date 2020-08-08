/**
 * Todo:
 * Saudação profissional ao instalar o winnetoujs
 * com dicas sobre tutoriais e próximos passos
 *
 */

const fs = require("fs");
const path = require("path");

const p1 = path.join(__dirname, "/scaffolding/package.json");
const p2 = path.join(__dirname, "/scaffolding/wbr.js");
const p3 = path.join(__dirname, "/scaffolding/win.config.js");
const dest = path.join(__dirname, "../../package.json");

fs.copyFile(p1, dest, err => {
  if (err) throw err;
  console.log("package.json was copied to root");
});

fs.copyFile(p2, dest, err => {
  if (err) throw err;
  console.log("wbr.js was copied to root");
});

fs.copyFile(p3, dest, err => {
  if (err) throw err;
  console.log("win.config.js was copied to root");
});
