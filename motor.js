$(function() {
	var W = new Winnetou("debug");

    W.create('componenteTexto1', 'body', {
		texto: 'Dentro do construtos.html escrever todo os componentes envoltos da div winnetou',
	});

	W.create('componenteTexto1', 'body', {
		texto: 'Rodar node wcli.js para transformar o construtos.html em .js',
    });
    
    W.create('componenteTexto1', 'body', {
		texto: 'Ao alterar o construtos.html rodar o wcli novamente para atualizar o js',
	}); 

	W.create('componenteTexto1', 'body', {
		texto: 'Para construir tabelas com winnetou, não se deve usar div winnetou e sim table winnetou, tem um exemplo nos construtos',
	}); 

	
});
