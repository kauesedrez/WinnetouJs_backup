/*
    WinnetouJs Framework
    Use freely keeping this header 
    Author:  Winetu Kaue Sedrez Bilhalva
    Contact: kaue.sedrez@gmail.com
*/
class Winnetou {
    constructor(debug = "", next) {
        this.debug = debug;
        this.version = "0.10.1";
        this.construtorId = 0;
        this.$base = [];
        if (this.debug == "debug") {
            console.log("\nWinnetou LOG Construtos --- \n")
        }
        Array.from(Componentes).forEach(componente => {
            var id = componente.innerHTML.match(/\[\[\s?(.*?)\s?\]\]/)[1];
            // limpa o tbody
            // isso ainda é necessário? testar.
            var tbodyClean = componente
                .innerHTML
                .replace(/\<tbody\>/g, "")
                .replace(/\<\/tbody\>/g, "");
            this.$base[id] = tbodyClean;
            if (this.debug == "debug") {
                console.log("id: " + id)
                console.log("construto: " + tbodyClean + "\n");
            }
        })

        Componentes = null; // garbage collecthis.debug == "debug" 

    };

    /*

        TODO

        [ok] - Tirar jquery do create.

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
        let identifier;
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

        // $.each(elements, function(item) {
        //     // reg = new RegExp('{{(' + item + ')}}|{{( ' + item + ' )}}');
        //     let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
        //     $vdom = $vdom.replace(reg, elements[item]);
        // });

        for (let item in elements) {

            let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
            $vdom = $vdom.replace(reg, elements[item]);
        };

        // this.construtorId++;
        if (options && options.clear) {
            document.querySelector(output).innerHTML = $vdom;
        } else if (options && options.reverse) {
            document.querySelector(output).innerHTML = $vdom + document.querySelector(output).innerHTML;
        } else {
            try {
                document.querySelector(output).innerHTML = document.querySelector(output).innerHTML + $vdom;
                if (this.debug == "debug") console.log(`The element <<${construto}>> was sewn up successfully in <<${output}>>`);
            } catch (e) {
                if (this.debug == "debug")
                    console.log(
                        "winnetou error",
                        `\nAppend error, trying to add <<${construto}>> in: <<${output}>>\n`,
                        "The output is correct?",
                        "\nUsually the output is an already sewn html element, such as an #id, a .class, or a <tag>.\n\n",
                        e.message);
            }
        }
    };

    destroy(construto) {
        let el = document.querySelector(construto);
        el.remove();

    };
};