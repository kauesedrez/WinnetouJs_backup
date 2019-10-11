/*
    WinnetouJs Framework
    Use freely keeping this header 
    Author:  Winetu Kaue Sedrez Bilhalva
    Contact: kaue.sedrez@gmail.com
*/
class Winnetou {
    constructor(debug = "") {
        this.debug = debug;
        this.version = "0.10.0";
        this.construtorId = 0;
        this.$base = [];
        // cria o V-Dom a partir do html      
        //console.log(Componentes)
        Array.from(Componentes).forEach(componente => {
            var id = componente.innerHTML.match(/\[\[\s?(.*?)\s?\]\]/)[1];
            // limpa o tbody
            // isso ainda é necessário? testar.
            var tbodyClean = componente
                .innerHTML
                .replace(/\<tbody\>/g, "")
                .replace(/\<\/tbody\>/g, "");
            this.$base[id] = tbodyClean;
        })
        if (this.debug == "debug") console.log("winnetou log", this.$base);
        Componentes = null; // garbage collector
    };

    /*

        TODO

        Tirar jquery do create.

    */
    create(construto, output, elements, options) {
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
        var $vdom = this.$base[construto].replace(
            /\[\[\s*?(.*?)\s*?\]\]/g,
            "$1-" + identifier
        );
        $.each(elements, function(item) {
            // reg = new RegExp('{{(' + item + ')}}|{{( ' + item + ' )}}');
            let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
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
    destroy(construto, modal) {
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