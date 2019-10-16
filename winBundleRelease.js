/*

    Suporte apenas para IE9+

    Não funciona no IE8

*/

const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");
const config = require('./winConfig.json');
const uuid = require('uuid/v4');
const request = require('Request');
const UglifyCss = require('uglifycss');
const sass = require('node-sass');

console.log('Bem Vindo ao WinnetouJS');

// vai ler o arquivo de configurações
const construtos_path = config.construtos_path;
const output = config.output;
var code = {};
var mini = [];

var codeCss = [];
var miniCss = [];

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

const BundleRelease = (dados) => {
    console.log('Gerando Bundle');

    var result = UglifyJS.minify(dados);

    result = result.code;

    mini.forEach(item => {
        result = item + result;
    })

    fs.writeFile('./bundleWinnetou.min.js', result, function(err) {
        // usar output
        console.log('\n\n === Bundle JS Finished === \n\n');
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    });
}

const BundleCss = (dados) => {
    console.log('Gerando Bundle CSS');

    let stringU = "";
    dados.forEach(item => {
        stringU += item;
    })
    var result = UglifyCss.processString(stringU);

    miniCss.forEach(item => {
        result = item + result;
    })

    fs.writeFile('./bundleWinnetouStyles.min.css', result, function(err) {
        // usar output
        console.log('\n\n === Bundle CSS Finished === \n\n');
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    });
}

const Perform = async () => {

    // adicina js CDNs via winConfig.json

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
        let arquivo = await adicionarArquivoAoBundle(config.js[i]);
        code["file-" + uuid()] = arquivo;
    }
    // config.js.forEach(async item => {
    // erro
    // });

    return code;
};

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
        let arquivo = await adicionarArquivoAoBundleCss(config.css[i]);
        codeCss.push(arquivo);
    }

    for (let i = 0; i < config.sass.length; i++) {
        let arquivo = await adicionarSassAoBundleCss(config.sass[i]);
        codeCss.push(arquivo);
    }

    return codeCss;

}

Perform().then(resultado => {
    BundleRelease(resultado);
});

PerformCss().then(resultado => {
    BundleCss(resultado)
})