const fs = require('fs');
const babel = require('@babel/core');
const UglifyJS = require("uglify-js");

console.log('Bem Vindo ao WinnetouJS');

fs.readFile('./construtos.html', function(err, data) {
    const arq = `const Componentes =
\`
${data}
\`;`;
    console.log("babel")
    try {
        babel.transform(arq, { presets: ["@babel/preset-env"] }, function(err, result) {

            var resultU = UglifyJS.minify(result.code);

            fs.writeFile('./construtos.js', resultU.code, function(err) {
                console.log('Finalizado');
            });
        });
    } catch (e) {
        console.log(e.message)  
    }


});