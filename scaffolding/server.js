var express = require("express");
var app = express();
var path = require("path");
app.use(express.static(__dirname + "/_public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/_views");
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/testeAjax", (request, response) => {
    response.json({ name: "douglas", idade: "30" });
});

app.post("/testeAjax", (request, response) => {
    var nome = request.body.nome;

    console.log(nome);

    response.json({ dadoRetornado: "laura" });
});

app.get("/", (request, response) => {
    response.render("protocolos", {
        action1: false,
        action2: false,
        action3: false,
    });
});

app.get("/:action1", (request, response) => {
    response.render("protocolos", {
        action1: request.params.action1,
        action2: false,
        action3: false,
    });
});

app.get("/:action1/:action2", (request, response) => {
    response.render("protocolos", {
        action1: request.params.action1,
        action2: request.params.action2,
        action3: false,
    });
});

app.get("/:action1/:action2/:action3", (request, response) => {
    response.render("protocolos", {
        action1: request.params.action1,
        action2: request.params.action2,
        action3: request.params.action3,
    });
});

app.listen(8080);
console.clear();
console.log("Rodando no localhost:8080");
