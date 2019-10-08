var bodyParser = require("body-parser");
var express = require("express");
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var porta = process.env.PORT || 3000;
app.set("port", porta);
app.use(express.static(__dirname + "/_public")); // diretorio compartilhado entre as paginas do programa
app.set("views", "./_views");
app.set("view engine", "ejs");
var server = app.listen(app.get("port"));

console.log("Online: "+porta)

app.get("/", function(request, response) {
  // let parametros = [];
  // parametros["from"] = "teste";
  response.render("home/index");
});
