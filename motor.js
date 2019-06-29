$(function() {
	var W = new Winnetou();

	W.init();

	W.create('componenteTexto1', 'body', {
		texto: 'eu sou o construto #1',
	});

	W.create('componenteTexto1', 'body', {
		texto: 'eu sou o construto #2',
	});
});
