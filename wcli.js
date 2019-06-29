const fs = require('fs');

console.log('Bem Vindo ao WinnetouJS');

fs.readFile('./construtos.html', function(err, data) {
    const arq = `const Componentes =
\`
${data}
\`;`;

	fs.writeFile('./construtos.js', arq, function(err) {
		console.log('Finalizado');
	});
});
