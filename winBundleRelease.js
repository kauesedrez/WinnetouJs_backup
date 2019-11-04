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
try {
    config = require('./winConfig.json');
} catch (e) {
    console.log("Configuration file error or missing; exit code 0.");
    return;
}

//endregion

// ------------------------ variáveis globais
//region
console.log('Bem Vindo ao WinnetouJS');
console.log('Version ' + version.version);
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

            console.log("\n\n>>> Watching Sass\n\n\n")

            var locaisSass = [];

            for (let i = 0; i < config.sass.length; i++) {

                locaisSass.push(config.sass[i])
            }

            watch(locaisSass, { recursive: false }, function(evt, name) {
                console.log("\n\n Teste: " + name)
                sassDev(name);
            });
            break;

        case "winnetou":
            watch(__dirname, { recursive: true }, function(evt, name) {
                // atenção, recursive não funciona no linux

                if (performAllControl) {
                    console.log("\n\n Arquivo alterado, recompilando winnetou: " + name)
                    performAllControl = false;
                    ClearCache();
                    PerformAll();
                }

            });
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
const adicionarConstrutosAoBundle = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(construtos_path, function(err, data) {
            const arq = `
            var Componentes =\`${data}\`;
            var Div = document.createElement('div');
            Div.innerHTML = Componentes;
            Componentes = Div.getElementsByClassName("winnetou");
            Div = null;
            `;
            try {
                babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                    console.log('Adicionando construtos');
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
                    ]
                }, function(err, result) {
                    if (err) { console.log(err); return; }

                    resultWinnetou = result.code;
                    console.log('Adicionando Winnetou');
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

// ------------------------ adicionarArquivoAoBundle
//region
const adicionarArquivoAoBundle = async (arquivo) => {
    return new Promise((resolve, reject) => {
        fs.readFile(arquivo, function(err, data) {
            const arq = data;
            try {
                babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                    console.log('Adicionando ' + arquivo);
                    if (err) console.log("\n\nERRO: " + err, arquivo)
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

// ------------------------ adicionarSassAoBundleCss
//region
const adicionarSassAoBundleCss = async (arquivo) => {
    return new Promise((resolve, reject) => {
        try {
            sass.render({
                file: arquivo
            }, function(err, result) {

                console.log('Adicionando SASS: ' + arquivo);
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
            const arq = data;
            try {
                console.log('Adicionando CSS: ' + arquivo);
                if (err) console.log("\n\nERRO adicionarArquivoAoBundleCss: " + err, arquivo)
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
            request(url, function(error, response, data) {
                const arq = data;
                try {
                    babel.transform(arq, function(err, result) {
                        console.log('MIN Adicionando ' + url);
                        return resolve(result.code);
                    });
                } catch (e) {
                    console.log(e.message)
                    return reject(e.message);
                }
            });
        } else {
            request(url, function(error, response, data) {
                const arq = data;
                try {
                    babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                        console.log('Adicionando ' + url);
                        return resolve(result.code);
                    });
                } catch (e) {
                    console.log(e.message)
                    return reject(e.message);
                }
            });
        }

    });
}
//endregion

// ------------------------ adicionarURLAoBundleCss
//region
const adicionarURLAoBundleCss = async (url) => {
    return new Promise((resolve, reject) => {

        request(url, function(error, response, data) {

            try {
                if (error) console.log("ERROR adicionarURLAoBundleCss", error)
                console.log('Css Url Adicionado: ' + url);
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

        const htmlString = fs.readFileSync(arquivo, "utf8");

        try {
            console.log('HTML Minificado: ' + arquivo);

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

            console.log("\n\nERRO [!] - Minificar HTML: " + e.message, "Arquivo com erro: " + arquivo + "\n\n")
            return reject(e.message);
        }

    });
}
//endregion

// ------------------------ PerformJs
//region
const PerformJs = async () => {

    for (let i = 0; i < config.bundleJsUrl.length; i++) {
        let arquivo = await adicionarURLAoBundle(config.bundleJsUrl[i]);
        config.bundleJsUrl[i].includes("min") ? mini.push(arquivo) : code["URL-" + uuid()] = arquivo;
    }

    // adiciona as bibliotecas opcionais via winConfig.json

    if (config.builtIns.bootstrapJs === "latest") {

        let popper = await adicionarURLAoBundle("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js");
        mini.push(popper);

        let bootstrap = await adicionarURLAoBundle("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js");
        mini.push(bootstrap);

    }

    if (config.builtIns.jquery === "latest") {
        let jquery = await adicionarURLAoBundle("https://code.jquery.com/jquery-3.4.1.min.js");
        mini.push(jquery);
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
            code["file-" + uuid()] = arquivo;

        } else {
            // é pasta
            // roda o algoritmo que varre as pastas

            try {
                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                    console.log("\n\n>>> files: " + nome + "/" + files[a])

                    let arquivo = await adicionarArquivoAoBundle(nome + "/" + files[a]);

                    code["file-" + uuid()] = arquivo;

                }
            } catch (e) {
                console.log("Ignored Error -> " + e.message)
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

                    console.log("\n\n>>> files: " + nome + "/" + files[a])

                    let arquivo = await adicionarArquivoAoBundleCss(nome + "/" + files[a]);

                    codeCss.push(arquivo);

                }

            } catch (e) {
                console.log("Ignored Error -> " + e.message)
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

                    console.log("\n\n>>> files: " + nome + "/" + files[a])

                    let arquivo = await adicionarSassAoBundleCss(nome + "/" + files[a]);

                    codeCss.push(arquivo);

                }

            } catch (e) {
                console.log("Ignored Error -> " + e.message)
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
            codeHTML.push({ code: arquivo, path: config.extras.minifyHTML[i] });
        } else {
            // é diretório

            try {
                let files = fs.readdirSync(nome);

                for (let a = 0; a < files.length; a++) {

                    console.log("\n\n>>> files: " + nome + "/" + files[a])

                    let arquivo = await minifyHTML(nome + "/" + files[a]);
                    // arquivo é o codigo html já minificado
                    // config.extras.minifyHTML[i] é o nome e o path relativo do arquivo
                    codeHTML.push({ code: arquivo, path: nome + "/" + files[a] });
                    // ------

                }

            } catch (e) {
                console.log("Ignored Error -> " + e.message)
            }

        }
    }
    return codeHTML;

}
//endregion

// ------------------------ BundleJs
//region
const BundleJs = async (dados) => {

    var result = UglifyJS.minify(dados);

    result = result.code;

    mini.forEach(item => {
        result = item + result;
    })

    let error = false;
    let promisse = await fse.outputFile(config.outputs.js + '/bundleWinnetou.min.js', result, function(err) {
        if (err) error = err;
    });
    let promisse2 = promisse;
    console.log('\n\n === Bundle JS Finished === \n\n');
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
    console.log('Gerando Bundle CSS');

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

    console.log('\n\n === Bundle CSS Finished === \n\n');
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

            console.log('\n\n === Bundle Extras Finished === \n\n');
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