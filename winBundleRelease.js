const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");
const config = require('./_winConfig.json');
const uuid = require('uuid/v4');


console.log('Bem Vindo ao WinnetouJS');

// vai ler o arquivo de configurações
const construtos_path = config.construtos_path;
const output = config.output;

var resultWinnetou = "";
var resultConstrutos = "";
var resultArquivos = "";
var code;

const adicionarWinnetouAoBundle = async () => {
    fs.readFile('./winnetou.js', function(err, data) {
        const arq = data;
        try {
            babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                resultWinnetou = result.code;
                code = { "winnetou.js": resultWinnetou };
                console.log('Adicionando Winnetou');
            });
        } catch (e) {
            console.log(e.message)
        }
    });
}

const adicionarConstrutosAoBundle = async () => {
    fs.readFile(construtos_path, function(err, data) {
        const arq = `const Componentes =\`${data}\`;`;
        try {
            babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                resultConstrutos = result.code;
                code["construtos.js"] = resultConstrutos;
                console.log('Adicionando construtos');
            });
        } catch (e) {
            console.log(e.message)
        }
    });
}

const adicionarArquivoAoBundle = async (arquivo) => {
    fs.readFile(arquivo, function(err, data) {
        const arq = data;
        try {
            babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {
                // result.code
                code["file-" + uuid()] = result.code;
                console.log('Adicionando ' + arquivo);
            });
        } catch (e) {
            console.log(e.message)
        }
    });
}

const BundleRelease = async () => {
	console.log('Gerando Bundle');
    var result = UglifyJS.minify(code);
    fs.writeFile('./bundleWinnetou.min.js', result.code, function(err) {
    	// usar output
        console.log('Finalizado com sucesso.');
    });
}

const Perform = async () => {
    await adicionarWinnetouAoBundle();
    await adicionarConstrutosAoBundle();
    // config.js.forEach(async item => {
    //     await adicionarArquivoAoBundle(item);
    // });
    BundleRelease();
};

Perform();

//var result = UglifyJS.minify(code);

// var resultU = UglifyJS.minify(result.code);
// fs.writeFile('./bundleWinnetou.min.js', resultU.code, function(err) {
//     console.log('Finalizado');
// });