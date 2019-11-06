// ------------------------ WinnetouJs Bundler
//region
/*

    Suporte apenas para IE9+

    Não funciona no IE8

*/
//endregion

// ------------------------ imports
//region
const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");
const uuid = require('uuid/v4');
const request = require('Request');
const UglifyCss = require('uglifycss');
const sass = require('node-sass');
const htmlMinify = require('html-minifier').minify;
const fse = require('fs-extra');
var version;
try {
    version = require('./version.json');
} catch (e) {
    version = "Warning! Arquivo version.json não localizado."
}
var config;
//endregion

// ------------------------ padronização de logs
//region

var contadorDeErros = 0;
var contadorDeWarnings = 0;

const drawLine = (size = 80) => {
    let line = "";
    for (let i = 0; i < size; i++) {
        if (i == 1) line += " ";
        else if (i == (size - 2)) line += " ";
        else line += "=";
    }
    console.log(line);
}

const drawText = (text = "", size = 80) => {

    let line = "= " + text;

    let tamanho = line.length;

    for (let i = 0; i < (size - tamanho); i++) {

        if (i == (size - tamanho - 1))
            line += "=";
        else
            line += " ";
    }

    console.log(line);
}

const drawTextBlock = (text) => {

    let arr = text.match(/.{1,74}/g);

    arr.forEach(item => {
        drawText(item)
    })

}

const drawBlankLine = () => {

    drawText();

}

const drawSpace = () => {

    console.log("\n");

}

const drawError = text => {
    contadorDeErros++;
    drawLine();
    drawBlankLine();
    drawText("[ X ] Error");
    drawBlankLine();
    drawLine();
    drawBlankLine();
    drawTextBlock(text);
    drawBlankLine();
    drawText("Find online help in");
    drawText("www.cedrosdev.com.br/winnetoujs");
    drawBlankLine();
    drawLine();
    drawSpace();
}

const drawWarning = text => {
    contadorDeWarnings++;
    drawLine();
    drawBlankLine();
    drawText("[ ! ] Warning");
    drawBlankLine();
    drawLine();
    drawBlankLine();
    drawTextBlock(text);
    drawBlankLine();
    drawText("Find online help in");
    drawText("www.cedrosdev.com.br/winnetoujs");
    drawBlankLine();
    drawLine();
    drawSpace();
}

const drawWelcome = () => {
    console.clear();
    drawLine();
    drawBlankLine();
    drawBlankLine();
    drawText("W I N N E T O U J S ");
    drawBlankLine();
    drawText("T h e  i n d i e  j a v a s c r i p t  c o n s t r u c t o r");
    drawBlankLine();
    drawBlankLine();
    drawLine();
    drawBlankLine();
    drawText("Find online help and docs");
    drawText("www.cedrosdev.com.br/winnetoujs");
    drawBlankLine();
    drawText("Fork on GitHub");
    drawText("https://github.com/kauesedrez/WinnetouJs.git");
    drawBlankLine();
    drawText("(c) Cedros Development");
    drawText("@winetukaue | kaue.sedrez@gmail.com");
    drawBlankLine();
    drawLine();
    drawBlankLine();
    drawText(" -- version: " + version.version);
    drawBlankLine();
    drawLine();
    drawSpace();

}

const drawAdd = text => {

    console.log("> [added] " + text);

}

const drawAddError = text => {

    contadorDeErros++;

    console.log("\n> [error on add (skip)] " + text + "\n");

}

const drawHtmlMin = text => {

    console.log("> [html minifield] " + text);

}

const drawEnd = text => {

    console.log("> [Bundle Release Finished] " + text);

}

const drawChange = text => {

    console.log("> [Modified file] " + text);

}

const drawFinal = () => {

    drawLine();
    drawBlankLine();
    drawText("All tasks completed");
    drawBlankLine();
    if (contadorDeErros > 0) {
        drawText("... with " + contadorDeErros + " errors");
        drawBlankLine();
    }
    if (contadorDeWarnings > 0) {
        drawText("... with " + contadorDeWarnings + " warnings");
        drawBlankLine();
    }
    if (config.livereload) {
        drawText("... watching " + config.livereload);
        drawBlankLine();
    }
    drawLine();
    drawSpace();

}

drawWelcome();

//endregion

// ------------------------ validação do arquivo winConfig.json
//region

try {
    config = require('./winConfig.json');
} catch (e) {

    drawError("Configuration file (winConfig.json) error or missing; original error: " + e.message);
    return;
}

// rotinas de inspeção

// construtos_path [mandatory!]
if (typeof config.construtos_path != "string") {
    drawError("winConfig.json missing or wrong construtos_path value. Must be <string>.");
    return;
}

if (typeof config.livereload == "string") {
    if (config.livereload != "winnetou" && config.livereload != "sass") {
        drawWarning("Live Reload needs to be 'winnetou' or 'sass' in current version.Insert into your winConfig.json this value: \"livereload\":\"winnetou\"");
    }
}
if (!config.outputs) config.outputs = [];
if (!config.outputs.js) {
    config.outputs.js = "./public/js";
    drawWarning("Javascript bundle file output not defined. Using defaults: './public/js' .")
}
if (!config.outputs.css) {
    config.outputs.css = "./public/css";
    drawWarning("CSS bundle file output not defined. Using defaults: './public/css' .")
}

if (!config.bundleJsUrl) config.bundleJsUrl = [];
if (!config.bundleCssUrl) config.bundleCssUrl = [];
if (!config.js) config.js = [];
if (!config.css) config.css = [];
if (!config.sass) config.sass = [];
if (!config.bundleCssUrl) config.bundleCssUrl = [];

if (!config.builtIns) config.builtIns = [];

if (!config.builtIns.jquery) config.builtIns.jquery = "none";
if (!config.builtIns.bootstrapJs) config.builtIns.bootstrapJs = "none";
if (!config.builtIns.bootstrapCss) config.builtIns.bootstrapCss = "none";

if (!config.extras) config.extras = [];
if (!config.extras.minifyHTML) config.extras.minifyHTML = [];

//endregion

// ------------------------ variáveis globais
//region
const construtos_path = config.construtos_path;
const output = config.output;
var code = {};
var mini = [];
var codeCss = [];
var miniCss = [];
var codeHTML = [];
var performAllControl = false;

ClearCache = () => {

    code = {};
    mini = [];
    codeCss = [];
    miniCss = [];
    codeHTML = [];
    performAllControl = false;

}

//endregion

// ------------------------ livereload
//region

if (config.livereload) {

    var watch = require('node-watch');

    switch (config.livereload) {

        case "sass":

            var locaisSass = [];

            for (let i = 0; i < config.sass.length; i++) {

                locaisSass.push(config.sass[i])
            }

            watch(locaisSass, { recursive: false }, function(evt, name) {
                if (performAllControl) {
                    performAllControl = false;
                    sassDev(name);
                }
            });
            break;

        case "winnetou":

            var locaisWinnetou = [];

            locaisWinnetou.push(config.construtos_path);

            for (let i = 0; i < config.js.length; i++) {

                locaisWinnetou.push(config.js[i])
            }

            for (let i = 0; i < config.css.length; i++) {

                locaisWinnetou.push(config.css[i])
            }

            for (let i = 0; i < config.sass.length; i++) {

                locaisWinnetou.push(config.sass[i])
            }

            for (let i = 0; i < config.extras.minifyHTML.length; i++) {

                locaisWinnetou.push(config.extras.minifyHTML[i])
            }

            try {
                watch(locaisWinnetou, { recursive: false }, function(evt, name) {

                    if (performAllControl) {
                        performAllControl = false;
                        console.clear();
                        drawWelcome();
                        drawChange(name);
                        ClearCache();
                        PerformAll();
                    }

                })
            } catch (e) {
                drawError("Watch error: " + e.message + ". Unless you fix this error watch will not work fully.")
            }

            break;

    }

}

const sassDev = arquivo => {

    sass.render({
        file: arquivo
    }, function(err, result) {
        console.log("\n\ndentro do result sass render")
        // result.css

        var newName = config.outputs.css + "/" + arquivo.replace("scss", "css");

        fse.outputFile(newName, result.css, function(err) {

            console.log("\n\n>>> Live Reload transpile SASS: " + arquivo);
            return true;

        });

    });

}

//endregion

// ------------------------ adicionarConstrutosAoBundle
// Cria a const que armazena os construtos, passando de html para ES2019
// Usa Babel para ter compatibilidade ie9+ via polyfill no html
//region
const lerConstruto = async (arquivo) => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(arquivo, function(err, data) {

                return resolve(data);

            });
        } catch (e) {
            return reject(e.message);
        }

    });
}
const adicionarConstrutosAoBundle = async () => {
    return new Promise(async (resolve, reject) => {

        let files = fs.readdirSync(construtos_path);

        let res = "";

        for (let a = 0; a < files.length; a++) {
            let tmp = await lerConstruto(construtos_path + "/" + files[a]);
            res += tmp;
        }

        const arq = `
            var Componentes =\`${res}\`;
            var Div = document.createElement('div');
            Div.innerHTML = Componentes;
            Componentes = Div.getElementsByClassName("winnetou");
            Div = null;
            `;
        try {
            babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                drawAdd("Winnetou construtos")
                return resolve(result.code);
            });
        } catch (e) {
            console.log(e.message)
            return reject(e.message);
        }

    });
}
//endregion

// ------------------------ adicionarWinnetouAoBundle
//region
const adicionarWinnetouAoBundle = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./winnetou.js', function(err, data) {
            const arq = data;
            try {
                babel.transform(arq, {
                    "presets": [
                        "@babel/preset-env"
                    ],
                    retainLines: true
                }, function(err, result) {
                    if (err) { console.log(err); return; }

                    resultWinnetou = result.code;
                    drawAdd("Winnetou core")
                    return resolve(result.code);
                });
            } catch (e) {
                console.log(e.message)
                return reject(e.message);
            }
        });
    });
}
//endregion

// ------------------------ adicionarArquivoAoBundle JS
//region
const adicionarArquivoAoBundle = async (arquivo) => {
    return new Promise((resolve, reject) => {
        fs.readFile(arquivo, function(err, data) {
            if (err) {
                try {
                    drawAddError(arquivo + ", original error: " + err);
                    return resolve({ nome: arquivo, codigo: "" });
                } catch (e) { return reject(e); }

            }
            const arq = data;
            try {
                babel.transform(arq, { presets: ["@babel/preset-env"], retainLines: true }, function(err, result) {
                    drawAdd(arquivo)
                    if (err) console.log("\n\nERRO: " + err, arquivo)
                    return resolve({ nome: arquivo, codigo: result.code });
                });
            } catch (e) {
                console.log(e.message)
                return reject(e.message);
            }
        });
    });
}
//endregion

// ------------------------ adicionarSassAoBundleCss
//region
const adicionarSassAoBundleCss = async (arquivo) => {
    return new Promise((resolve, reject) => {
        try {
            sass.render({
                file: arquivo
            }, function(err, result) {

                if (err) {
                    try {
                        drawAddError(arquivo + ", original error: " + err);
                        return resolve("");
                    } catch (e) { return reject(e); }

                }

                drawAdd(arquivo)
                if (err) console.log("\n\nERRO: " + err, arquivo)
                return resolve(result.css);
            });
        } catch (e) {
            console.log(e.message)
            return reject(e.message);
        }

    });
}
//endregion

// ------------------------ adicionarArquivoAoBundleCss
//region
const adicionarArquivoAoBundleCss = async (arquivo) => {
    return new Promise((resolve, reject) => {
        fs.readFile(arquivo, function(err, data) {

            if (err) {
                try {
                    drawAddError(arquivo + ", original error: " + err);
                    return resolve("");
                } catch (e) { return reject(e); }

            }

            const arq = data;
            try {
                drawAdd(arquivo)

                return resolve(arq);

            } catch (e) {
                console.log(e.message)
                return reject(e.message);
            }
        });
    });
}
//endregion

// ------------------------ adicionarURLAoBundle
//region
const adicionarURLAoBundle = async (url) => {
    return new Promise((resolve, reject) => {
        if (url.includes("min")) {

            // não se pode adicionar min ao bundle pois quebra o mapping
            try {
                drawError("Don't add minifield js file into winnetouBundle. Please insert via tag in your html source. " + url);
                return resolve(false);
            } catch (e) {
                return reject(false);
            }

        } else {
            request(url, function(error, response, data) {
                const arq = data;
                try {
                    babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                        drawAdd(url);
                        return resolve({ nome: url, codigo: result.code });
                    });
                } catch (e) {
                    console.log(e.message)
                    return reject(e.message);
                }
            });
        }

    })
}
//endregion

// ------------------------ adicionarURLAoBundleCss
//region
const adicionarURLAoBundleCss = async (url) => {
    return new Promise((resolve, reject) => {

        request(url, function(error, response, data) {

            try {
                if (error) console.log("ERROR adicionarURLAoBundleCss", error)
                drawAdd(url)

                return resolve(data);

            } catch (e) {
                console.log(e.message)
                return reject(e.message);
            }
        });

    });
}
//endregion

// ------------------------ minifyHTML
//region
const minifyHTML = async (arquivo) => {

    return new Promise((resolve, reject) => {

        try {

            const htmlString = fs.readFileSync(arquivo, "utf8");

            drawHtmlMin(arquivo)

            var res = htmlMinify(htmlString, {
                removeAttributeQuotes: true,
                caseSensitive: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeComments: true,
                removeEmptyAttributes: true
            }); // node module que minifica o HTML

            return resolve(res);

        } catch (e) {

            try {
                drawAddError(arquivo + ", original error: " + e.message);
                return resolve(false)
            } catch (e2) {
                return reject(false);
            }
        }

    });
}
//endregion

// ------------------------ PerformJs
//region
const PerformJs = async () => {

    //jquery sempre primeiro
    if (config.builtIns.jquery === "latest") {

        let jquery = await adicionarURLAoBundle("https://code.jquery.com/jquery-3.4.1.js");
        code["BUILT-IN JQUERY.JS 3.4.1"] = jquery.codigo;

    }

    for (let i = 0; i < config.bundleJsUrl.length; i++) {
        let arquivo = await adicionarURLAoBundle(config.bundleJsUrl[i]);
        if (arquivo)
            code[arquivo.nome] = arquivo.codigo;
    }

    // adiciona as bibliotecas opcionais via winConfig.json

    if (config.builtIns.bootstrapJs === "latest") {

        let bootstrap = await adicionarURLAoBundle("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.js");

        code["BUILT-IN BOOTSTRAP.JS 4.3.1"] = bootstrap.codigo;

    }

    // adiciona assets winnetou
    let construtos = await adicionarConstrutosAoBundle();
    code["construtos.js"] = construtos;

    let winnetou = await adicionarWinnetouAoBundle();
    code["winnetou.js"] = winnetou;

    // apenas for pode ser usado em função assíncrono
    // forEach não funciona.
    for (let i = 0; i < config.js.length; i++) {

        // aqui entra o algoritmo das pastas ou arquivos
        // temos que testar o final do arquivo
        let nome = config.js[i];
        if (nome.includes(".js")) {

            let arquivo = await adicionarArquivoAoBundle(config.js[i]);
            code[arquivo.nome] = arquivo.codigo;

        } else {
            // é pasta
            // roda o algoritmo que varre as pastas

            try {
                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                    

                    let arquivo = await adicionarArquivoAoBundle(nome + "/" + files[a]);

                    code[arquivo.nome] = arquivo.codigo;

                }
            } catch (e) {

                drawAddError(e.message)
            }

        }
    }
    // config.js.forEach(async item => {
    // erro
    // });

    return code;
};
//endregion

// ------------------------ PerformCss and sass
//region
const PerformCss = async () => {

    for (let i = 0; i < config.bundleCssUrl.length; i++) {
        let arquivo = await adicionarURLAoBundleCss(config.bundleCssUrl[i]);

        config.bundleCssUrl[i].includes("min") ? miniCss.push(arquivo) : codeCss["URL-" + uuid()] = arquivo;
    }

    if (config.builtIns.bootstrapCss === "latest") {

        let bootstrapCss = await adicionarURLAoBundleCss("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");
        miniCss.push(bootstrapCss);

    }

    for (let i = 0; i < config.css.length; i++) {

        let nome = config.css[i];
        if (nome.includes(".css")) {

            let arquivo = await adicionarArquivoAoBundleCss(config.css[i]);
            codeCss.push(arquivo);

        } else {

            try {
                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                    

                    let arquivo = await adicionarArquivoAoBundleCss(nome + "/" + files[a]);

                    codeCss.push(arquivo);

                }

            } catch (e) {
                drawAddError(e.message)
            }

        }

    }

    for (let i = 0; i < config.sass.length; i++) {

        let nome = config.sass[i];
        if (nome.includes(".scss")) {

            let arquivo = await adicionarSassAoBundleCss(config.sass[i]);
            codeCss.push(arquivo);

        } else {

            try {

                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                    

                    let arquivo = await adicionarSassAoBundleCss(nome + "/" + files[a]);

                    codeCss.push(arquivo);

                }

            } catch (e) {
                drawAddError(e.message)
            }

        }
    }

    return codeCss;

}
//endregion

// ------------------------ PerformExtras
//region
const PerformExtras = async () => {

    for (let i = 0; i < config.extras.minifyHTML.length; i++) {

        let nome = config.extras.minifyHTML[i];

        if (nome.includes(".html") || nome.includes(".htm")) {

            let arquivo = await minifyHTML(config.extras.minifyHTML[i]);
            // arquivo é o codigo html já minificado
            // config.extras.minifyHTML[i] é o nome e o path relativo do arquivo
            if (arquivo)
                codeHTML.push({ code: arquivo, path: config.extras.minifyHTML[i] });
        } else {
            // é diretório

            try {
                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                   

                    let arquivo = await minifyHTML(nome + "/" + files[a]);
                    // arquivo é o codigo html já minificado
                    // config.extras.minifyHTML[i] é o nome e o path relativo do arquivo
                    codeHTML.push({ code: arquivo, path: nome + "/" + files[a] });
                    // ------

                }

            } catch (e) {
                drawAddError(e.message)
            }

        }
    }
    return codeHTML;

}
//endregion

// ------------------------ BundleJs
//region
const BundleJs = async (dados) => {

    var result = UglifyJS.minify(dados, {
        sourceMap: {
            filename: "./bundleWinnetou.min.js",
            url: "./bundleWinnetou.min.js.map"
        }
    });

    //console.log("\n\n\n\n\n",result.map,"\n\n\n\n\n");

    var resultJs = result.code;

    mini.forEach(item => {
        resultJs = item + resultJs;
    })

    let error = false;
    let promisse = await fse.outputFile(config.outputs.js + '/bundleWinnetou.min.js', resultJs, function(err) {
        if (err) error = err;
    });
    let promisse2 = promisse;

    // sourcemap
    let promisse3 = await fse.outputFile(config.outputs.js + '/bundleWinnetou.min.js.map', result.map, function(err) {
        if (err) error = err;
    });
    let promisse4 = promisse3;

    drawEnd('bundleWinnetou.min.js')
    return new Promise((resolve, reject) => {
        if (error) reject(error);
        else
            resolve(true);
    })
}
//endregion

// ------------------------ BundleCss
//region
const BundleCss = async (dados) => {

    let stringU = "";
    dados.forEach(item => {
        stringU += item;
    })
    var result = UglifyCss.processString(stringU);

    miniCss.forEach(item => {
        result = item + result;
    })

    let error = false;
    let promisse = await fse.outputFile(config.outputs.css + '/bundleWinnetouStyles.min.css', result, function(err) {
        if (err) {
            console.log(">>ERR", err);
            error = err;
        }
    });
    let promisse2 = promisse;

    drawEnd('bundleWinnetouStyles.min.css')
    return new Promise((resolve, reject) => {
        if (error) reject(false);
        else
            resolve(true);
    })
}
//endregion

// ------------------------ BundleExtras
//region
const BundleExtras = async (dados) => {

    // como nomear os arquivos html?
    // tem que ser o mesmo nome no mesmo path com .min.html

    // console.log('Analisando extras',dados);

    return new Promise(async (resolve, reject) => {

        try {
            for (let i = 0; i < dados.length; i++) {
                //console.log("extras: ",dados[i])
                let promisse = await fs.writeFile(dados[i].path.replace(".html", ".min.html").replace(".htm", ".min.htm"), dados[i].code, err => {});

                let promisse2 = promisse;

            }

            drawEnd('Minifields html sources')
            resolve(true);
        } catch (e) {
            reject(e.message)
        }

    })

}
//endregion

// ------------------------ [call] PerformAll
//region
const PerformAll = () => {

    PerformJs().then(resultadoJs => {
        BundleJs(resultadoJs).then(js => {
            PerformCss().then(resultadoCss => {
                BundleCss(resultadoCss).then(css => {
                    PerformExtras().then(resultadoExtras => {
                        BundleExtras(resultadoExtras).then(extras => {
                            setTimeout(() => {
                                performAllControl = true;
                                drawFinal();
                            }, 3000);
                        })
                    });
                })
            });
        });
    });

}
PerformAll();
//endregion