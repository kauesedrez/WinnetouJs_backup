var W = new Winnetou("production");

W.create('componenteTexto1', 'body', {
    texto: 'Dentro do construtos.html escrever todo os componentes envoltos da div winnetou',
    texto2: ' 2 Dentro do construtos.html escrever todo os componentes envoltos da div winnetou',
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

W.create('componenteTexto2', 'body', {
    texto: 'Texto 2',
});

W.create('componenteTexto3', 'body', {
    texto: 'Você não está logado',
});

var mensagem = new Msg("ola mundo", "blue");
mensagem.show();

var foo = Array.from("foo");
mensagem.msg = "Array.from dentro do winnetou " + foo[0];
mensagem.show();

var foo = Array.from("foo");
mensagem.msg = "Array.from fora do winnetou: " + foo[0];
mensagem.show();

// $("body").css("background-color","blue");