const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");
const config = require('./_winConfig.json');
const uuid = require('uuid/v4');

console.log('Bem Vindo ao WinnetouJS');

// vai ler o arquivo de configurações
const construtos_path = config.construtos_path;
const output = config.output;

const adicionarConstrutosAoBundle = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(construtos_path, function(err, data) {
            const arq = `const Componentes =\`${data}\`;`;
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