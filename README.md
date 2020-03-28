# WinnetouJs
Manipulação de VDom


## O que é o WinnetouJs

### WinnetouJs é mais que uma biblioteca ou framework, é uma ferramenta completa de desenvolvimento para a web. É tanto um Module Bundler quanto uma biblioteca JavaScript para a criação de interfaces de usuário.

Winnetou nasceu com a ideia de ser uma biblioteca javascript de montagem de layouts via componentes manipulando o vdom, porém se tornou muito mais do que isso no momento em que começou a compilar via nodejs sua própria maneira de escrever componentes. 

Hoje, o WinnetouJs é um bundler que junta em um único arquivo js tudo o que é necessário para rodar uma aplicação web moderna baseada em winnetou.js e trás consigo várias ferramentas que a tornam completa, por exemplo:

 - Sass parser integrado;
 - UglifyJs;
 - BabelJs;

Com essas 3 ferramentas integradas ao bundle é gerado apenas 1 arquivo js contendo tudo o que é necessário para rodar a aplicação web direto no navegador, podendo ter compatibilidade com IE9+.

Com o Sass integrado, todos os seus arquivos css e scss serão compilados em apenas 1 arquivo css, minificado e compactado.

O bundleWinnetou.min.js também é gerado com o arquivo .map para poder ser inspecionado pelo devtools. 

Veja mais informações na Wiki do projeto.
1
