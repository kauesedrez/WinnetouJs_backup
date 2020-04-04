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
        this.constructorId = 0;
        this.$base = [];
        if (this.debug == "debug") {
            console.log("\nWinnetou LOG Constructos --- \n")
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
                console.log("constructo: " + tbodyClean + "\n");
            }
        })

        Componentes = null; // garbage collecthis.debug == "debug" 

    };

    /**
     * Adds the indicated construct to the defined element.
     * @param constructo A component defined in the html of the constructs previously set by winConfig.json
     * @param output  An html component in the project's index that makes the call to the winnetou bundle. It can be a tag, a #id or a .class.
     * @param elements Substitutions within the construct defined by {{id}}
     * @param options Options that control insertion behavior. Accepted options are: identifier, clear and reverse.
     */
    create(constructo = "", output = "", elements = {}, options = {}) {
        /*
          opções aceitas na versão 1.0
          ----------------------------------------
          {
              // para dar um nome conhecido ao id do constructo. 
              // Ideal se for usar o método destroy depois
              identifier:String,
  
              // para limpar a output antes de imprimir o constructo com append novamente
              // ideal quando se está atulizando uma dashboard e não inserindo novos resultados
              clear:Boolean,
  
              // se reverse for true usa o método prepend
              // default se não definir é append
              reverse:Boolean
          }
          */
        let identifier;
        if (!options || options.identifier === undefined) {
            this.constructorId++;
            identifier = this.constructorId;
        } else {
            identifier = options.identifier;
        }
        identifier = "win-" + identifier;
        var $vdom = this.$base[constructo].replace(
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

        // this.constructorId++;
        if (options && options.clear) {

            // document.querySelector(output).innerHTML = $vdom;

            this.select(output).html($vdom);

            if (this.debug == "debug") console.log(`The element <<${constructo}>> was sewn up successfully in <<${output}>> in clear mode`);

        } else if (options && options.reverse) {

            // document.querySelector(output).innerHTML = $vdom + document.querySelector(output).innerHTML;

            this.select(output).prepend($vdom)

            if (this.debug == "debug") console.log(`The element <<${constructo}>> was sewn up successfully in <<${output}>> in reverse`);

        } else {

            try {

                // document.querySelector(output).innerHTML = document.querySelector(output).innerHTML + $vdom;

                this.select(output).append($vdom)

                if (this.debug == "debug") console.log(`The element <<${constructo}>> was sewn up successfully in <<${output}>>`);

            } catch (e) {

                if (this.debug == "debug")
                    console.error(
                        "winnetou error",
                        `\nAppend error, trying to add <<${constructo}>> in: <<${output}>>\n`,
                        "The output is correct?",
                        "\nUsually the output is an already sewn html element, such as an #id, a .class, or a <tag>.\n\n",
                        e.message);

            }
        }
    };

    pull(constructo = "", elements = {}, options = {}) {
        /**
         * options:
         * identifier:String
         */

        let identifier;
        if (!options || options.identifier === undefined) {
            this.constructorId++;
            identifier = this.constructorId;
        } else {
            identifier = options.identifier;
        }
        identifier = "win-" + identifier;
        var $vdom = this.$base[constructo].replace(
            /\[\[\s*?(.*?)\s*?\]\]/g,
            "$1-" + identifier
        );

        for (let item in elements) {
            let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
            $vdom = $vdom.replace(reg, elements[item]);
        };

        return $vdom;

    }

    /**
    * Remove the indicated construct 
    * @param constructo A component defined in the html of the constructs previously set by winConfig.json
    */
    destroy(constructo = "") {
        let el = document.querySelector(constructo);
        el.remove();

    };

    /**
    * Select the indicated element
    * @param selector html element. A tag, id ou class.
    */
    select(selector = "") {

        var el;

        const obj = {
            getEl(selector) {
                if (el)
                    return el
                else
                    return document.querySelectorAll(selector)
            },
            html(texto) {
                el.forEach(item => {
                    item.innerHTML = texto;
                })
                return this;
            },
            append(texto) {
                el.forEach(item => {
                    item.innerHTML += texto;
                })
                return this;
            },
            prepend(texto) {
                el.forEach(item => {
                    item.innerHTML = texto + item.innerHTML;
                })
                return this;
            },
            css(property, value) {

                el.forEach(item => {
                    item.style[property] = value;
                })
                return this;
            },
            fadeOut() {
                el.forEach(item => {

                    item.classList.remove('show_asz__');
                    item.classList.add('hide_asz__');

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400)
                })
            },
            fadeIn() {
                el.forEach(item => {

                    item.style.display = '';
                    item.classList.remove('hide_asz__');

                })
            },
        };

        el = obj.getEl(selector);

        return obj;
    };

};