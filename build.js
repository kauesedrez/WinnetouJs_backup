/**
 * Todo:
 * Saudação profissional ao instalar o winnetoujs
 * com dicas sobre tutoriais e próximos passos
 *
 */

const fs = require("fs");
const path = require("path");

const p1 = path.join(__dirname, "/scaffolding/package.json");
const dest = path.join(__dirname, "../../package.json");

fs.copyFile(p1, dest, err => {
  if (err) throw err;
  console.log("package.json was copied to root");
});
