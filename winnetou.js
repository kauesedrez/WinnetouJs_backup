// WinnetouJs Framework
// Use free keeping this header
// author Winetu Kaue Sedrez Bilhalva
// kaue.sedrez@gmail.com

// ultima modificação em 28/06/2019

// need jquery
// recommended bootstrap
// recomended themes https://bootstrap.build/themes

// teste de suporte es6
$(function() {
    var supportsES6 = function() {
        try {
            new Function("(a = 0) => a");
            return 'ES6 rock!';
        } catch (err) {
            return "Not so fun =(";
        }
    }();

    console.log(supportsES6)
})

var Winnetou = function() {
    this.version = "1.0";

    this.debug = false; // if true print os consoles.log

    this.construtorId = 0; // identificador de cada modal que chamaremos de 'construtos'.

    var $base = [];

    const $baseHTML = Componentes;
    // eliminar da memoria $baseHTML e Componentes,
    // na verdade nao precisa de $baseHTML

    this.init = function() {
        // cria o V-Dom a partir do html

        $($baseHTML)
            .filter(".winnetou")
            .each(function() {
                var $elem = $(this);

                var id = $elem.html().match(/\[\[\s?(.*?)\s?\]\]/)[1];

                // limpa o tbody
                var tbodyClean = $elem
                    .html()
                    .replace(/\<tbody\>/g, "")
                    .replace(/\<\/tbody\>/g, "");

                $base[id] = tbodyClean;

                $elem.remove(); // remove o elemento base do html e deixa apenas no v-dom
            });

        if (this.debug) console.log("winnetou log", $base);
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

        identifier = "WinnetouComponent-" + identifier;

        var $vdom = $base[construto].replace(
            /\[\[\s*?(.*?)\s*?\]\]/g,
            "$1-" + identifier
        );

        $.each(elements, function(item) {
            // reg = new RegExp('{{(' + item + ')}}|{{( ' + item + ' )}}');
            reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");

            $vdom = $vdom.replace(reg, elements[item]);
        });

        // this.construtorId++;
        if (options && options.clear) {
            $(output).html($vdom);
        } else if (options && options.reverse) {
            $(output).prepend($vdom);
        } else {
            try {
                $(output).append($vdom);
                if (this.debug) console.log("inserido", output);
            } catch (e) {
                if (this.debug)
                    console.log("winnetou error", "erro no append", e.message);
            }
        }
    };

    this.destroy = (construto, modal) => {
        if (modal) {
            $(construto).modal("hide");
            $(construto).on("hidden.bs.modal", function() {
                $(construto).remove();
            });
        } else {
            $(construto).remove();
        }
    };
};