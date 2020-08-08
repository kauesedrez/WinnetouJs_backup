/**
 * Todo:
 * Saudação profissional ao instalar o winnetoujs
 * com dicas sobre tutoriais e próximos passos
 *
 */

const fs = require("fs");

fs.copyFile("./scaffolding/package.json", "../../", err => {
  if (err) throw err;
  console.log("package.json was copied to root");
});
