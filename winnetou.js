// WinnetouJs Framework
// Use free keeping this header
// author Winetu Kaue Sedrez Bilhalva
// kaue.sedrez@gmail.com

// ultima modificação em 28/06/2019

// need jquery
// recommended bootstrap
// recomended themes https://bootstrap.build/themes

var Winnetou = function() {
	this.version = '1.0';

	this.construtorId = 0; // identificador de cada modal que chamaremos de 'construtos'.

	var $base = [];

	const $baseHTML = Componentes;

	this.init = function() {
		// cria o V-Dom a partir do html

		$($baseHTML)
			.filter('.winnetou')
			.each(function() {
				var $elem = $(this);

				var id = $elem.html().match(/\[\[\s?(.*?)\s?\]\]/)[1];

				$base[id] = $elem.html();

				$elem.remove(); // remove o elemento base do html e deixa apenas no v-dom
			});
	};

	this.create = function(construto, output, elements, identifier) {
		if (identifier === undefined) {
			this.construtorId++;

			identifier = this.construtorId;
		}

		identifier = 'WinnetouComponent-' + identifier;

		var $vdom = $base[construto].replace(/\[\[\s*?(.*?)\s*?\]\]/g, '$1-' + identifier);

		$.each(elements, function(item) {
            // reg = new RegExp('{{(' + item + ')}}|{{( ' + item + ' )}}');
            reg = new RegExp('{{\\s*?(' + item + ')\\s*?}}');

			$vdom = $vdom.replace(reg, elements[item]);
		});

		// this.construtorId++;

		$(output).append($vdom);
	};
};

var log = function(x) {
	console.log(x);
};
