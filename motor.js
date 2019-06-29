$(function() {
	var W = new Winnetou();

    W.init();
    
    W.create('componenteTexto1', 'body', {
		texto: 'Dentro do construtos.html escrever todo os componentes envoltos da div winnetou',
	});

	W.create('componenteTexto1', 'body', {
		texto: 'Rodar node wcli.js para transformar o construtos.html em .js',
    });
    
    W.create('componenteTexto1', 'body', {
		texto: 'Ao alterar o construtos.html rodar o wcli novamente para atualizar o js',
	});

	
});
