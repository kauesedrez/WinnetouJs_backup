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

	this.create = function(construto, output, elements, options) {
		/*
		opções aceitas na versão 1.0
		----------------------------------------
		{
			// para dar um nome conhecido ao id do construto. 
			// Ideal se for usar o método destroy depois
			identifier:String,

			// para limpar a output antes de imprimir o construto com append novamente
			// ideal quando se está atulizando uma dashboard e não inserindo novos resultados
			clear:Boolean,

			// se reverse for true usa o método prepend
			// default se não definir é append
			reverse:Boolean
		}
		*/

		var identifier;

		if (!options || options.identifier === undefined) {
			this.construtorId++;

			identifier = this.construtorId;
		} else {
			identifier = options.identifier;
		}

		identifier = 'WinnetouComponent-' + identifier;

		var $vdom = $base[construto].replace(/\[\[\s*?(.*?)\s*?\]\]/g, '$1-' + identifier);

		$.each(elements, function(item) {
			// reg = new RegExp('{{(' + item + ')}}|{{( ' + item + ' )}}');
			reg = new RegExp('{{\\s*?(' + item + ')\\s*?}}');

			$vdom = $vdom.replace(reg, elements[item]);
		});

		// this.construtorId++;
		if (options && options.clear) {
			$(output).html($vdom);
		} else if (options && options.reverse) {
			
			$(output).prepend($vdom);
		} else {
			$(output).append($vdom);
		}
	};

	this.destroy = (construto, modal) => {
		if (modal) {
			$(construto).modal('hide');
			$(construto).on('hidden.bs.modal', function() {
				$(construto).remove();
			});
		} else {
			$(construto).remove();
		}
	};
};

var log = function(x) {
	console.log(x);
};
