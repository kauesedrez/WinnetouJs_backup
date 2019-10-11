const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");
const config = require('./_winConfig.json');
const uuid = require('uuid/v4');
const request = require('Request');

console.log('Bem Vindo ao WinnetouJS');

// vai ler o arquivo de configurações
const construtos_path = config.construtos_path;
const output = config.output;

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
                babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
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
                    return resolve(result.code);
                });
            } catch (e) {
                console.log(e.message)
                return reject(e.message);
            }
        });
    });
}

const adicionarURLAoBundle = async (url) => {
    return new Promise((resolve, reject) => {
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
    });
}

const BundleRelease = (dados) => {
    console.log('Gerando Bundle');

    var result = UglifyJS.minify(dados);

    fs.writeFile('./bundleWinnetou.min.js', result.code, function(err) {
        // usar output
        console.log('Finalizado com sucesso.');
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    });
}

const Perform = async () => {
    let code = {};

    // adiciona as dependências padrão
    // isso poderá ser configurado via json no futuro
    let jquery = await adicionarURLAoBundle("https://code.jquery.com/jquery-3.4.1.min.js");
    code['jquery.js'] = jquery;
    let popper = await adicionarURLAoBundle("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js");
    code['popper.js'] = popper;
    let bootstrap = await adicionarURLAoBundle("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js");
    code['bootstrap.js'] = bootstrap;
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

Perform().then(resultado => {
    BundleRelease(resultado);
});