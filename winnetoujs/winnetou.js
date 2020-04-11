/*
    WinnetouJs Framework
    Use freely keeping this header 
    Author:  Winnetou Kaue Sedrez Bilhalva
    Contact: kaue.sedrez@gmail.com
*/
class Winnetou {
    //

    constructor(debug = "", next) {
        this.string = [];
        this.debug = debug;
        this.version = "0.10.1";
        this.constructorId = 0;
        this.$base = [];
        this.$history = [];
        if (this.debug == "debug") {
            console.log("\nWinnetou LOG Constructos --- \n");
        }

        var $debug = this.debug;

        Array.from(Componentes).forEach((componente) => {
            var id = componente.innerHTML.match(/\[\[\s?(.*?)\s?\]\]/)[1];
            // limpa o tbody
            // isso ainda é necessário? testar.
            var tbodyClean = componente.innerHTML
                .replace(/\<tbody\>/g, "")
                .replace(/\<\/tbody\>/g, "");
            this.$base[id] = tbodyClean;
            if ($debug == "debug") {
                console.log("id: " + id);
                console.log("constructo: " + tbodyClean + "\n");
            }
        });

        Componentes = null; // garbage collec$debug == "debug"

        // 0.30 - popstate nativo

        if (window.history && window.history.pushState) {
            var $history = this.$history;

            window.onpopstate = function (event) {
                if ($debug == "debug") {
                    console.log(
                        `location: ${document.location}, state: ${JSON.stringify(
                            event.state
                        )}`
                    );
                }

                // dentro de um evento o this muda de contexto

                event.preventDefault();

                if (event.state == null) {
                    WINNETOU_ROUTES["/"]();
                } else {
                    WINNETOU_ROUTES[event.state]();
                }
            };
        } else {
            $debug === "debug"
                ? console.log("History Api not allowed in this browser.")
                : null;
        }
    }

    /**
     * Allows WinnetouJs to navigate between pages on the app. Needs a valid const routes already set.
     * @param action (anonymous function) a function to be called when user use back button on a pc ou mobile phone. Needs to be an anonymous function ()=>{} whithou params. 
     * @tutorial W.navigate('/perfil/public');
     
     */
    navigate(url) {
        var $this = this;
        if (window.history && window.history.pushState) {
            try {
                history.pushState(url, "", url);
            } catch (e) {
                history.pushState(url, null);
            }

            try {
                WINNETOU_ROUTES[url]();
            } catch (e) {
                $this.debug === "debug"
                    ? console.error(
                          "WinnetouJs Error: the provided URL was not found or the WINNETOU_ROUTES const not have been declared as a valid object of named functions. See WinnetouJs docs for more information.",
                          url,
                          e
                      )
                    : null;
                try {
                    WINNETOU_ROUTES["/404"]();
                } catch (e) {
                    if ($this.debug === "debug")
                        console.warn(
                            "Winnetou Warning: the /404 route was not defined in the WINNETOU_ROUTES."
                        );
                    document.write(
                        "<h1>WinnetouJs</h1><h2>The indie javascript framework</h2>"
                    );
                }
            }
        } else {
            $this.debug === "debug"
                ? console.log("History Api not allowed in this browser.")
                : null;
        }
    }

    /**
     * Adds the indicated constructo to the defined element.
     * @param constructo A component defined in the html of the constructs previously set by winConfig.json
     * @param output  An html component in the project's index that makes the call to the winnetou bundle. It can be a tag, a #id or a .class.
     * @param elements Substitutions within the constructo defined by {{id}}
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

        // -----------------------------------------------------------------
        var $vdom = "";
        var $this = this;
        function imprime(opt = "") {
            function geraIdentifier() {
                let identifier;
                if (!options || options.identifier === undefined) {
                    $this.constructorId++;
                    identifier = $this.constructorId;
                } else {
                    if (!output.includes("#")) {
                        if ($this.debug === "debug")
                            console.warn(
                                "WinnetouJs Warning: When identifier is set the output must be a unique #id.",
                                `Constructo: ${constructo} | Identifier: ${options.identifier}`
                            );
                    }
                    identifier = options.identifier;
                }
                identifier = "win-" + identifier;
                $vdom = $this.$base[constructo].replace(
                    /\[\[\s*?(.*?)\s*?\]\]/g,
                    "$1-" + identifier
                );

                for (let item in elements) {
                    //--------------
                    let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");

                    $vdom = $vdom.replace(reg, elements[item]);
                    //-------------
                }

                // limpa os elements que não foram setados
                let reg2 = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
                $vdom = $vdom.replace(reg2, "");
            }

            let el = document.querySelectorAll(output);
            el.forEach((item) => {
                geraIdentifier();
                if (opt === "clear") item.innerHTML = $vdom;
                if (opt === "reverse") item.innerHTML = $vdom + item.innerHTML;
                if (opt === "") item.innerHTML += $vdom;
            });
        }

        // -----------------------------------------------------------------

        if (options && options.clear) {
            // document.querySelector(output).innerHTML = $vdom;

            //this.select(output).html($vdom);

            imprime("clear");

            if (this.debug == "debug")
                console.log(
                    `The element <<${constructo}>> was sewn up successfully in <<${output}>> in clear mode`
                );
        } else if (options && options.reverse) {
            //this.select(output).prepend($vdom);

            imprime("reverse");

            if (this.debug == "debug")
                console.log(
                    `The element <<${constructo}>> was sewn up successfully in <<${output}>> in reverse`
                );
        } else {
            try {
                // this.select(output).append($vdom);

                imprime();

                if (this.debug == "debug")
                    console.log(
                        `The element <<${constructo}>> was sewn up successfully in <<${output}>>`
                    );
            } catch (e) {
                if (this.debug == "debug")
                    console.error(
                        "winnetou error",
                        `\nAppend error, trying to add <<${constructo}>> in: <<${output}>>\n`,
                        "The output is correct?",
                        "\nUsually the output is an already sewn html element, such as an #id, a .class, or a <tag>.\n\n",
                        e.message
                    );
            }
        }
    }

    /**
     * Returns the html string from constructo to be included inline in app. It don't have a output param once ir return a value.
     * @param constructo A component defined in the html of the constructs previously set by winConfig.json
     * @param elements Substitutions within the constructo defined by {{id}}
     * @param options Options that control insertion behavior. Accepted options are: identifier.
     */
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
        }

        return $vdom;
    }

    /**
     * Remove the indicated constructo
     * @param constructo A component defined in the html of the constructs previously set by winConfig.json
     */
    destroy(constructo = "") {
        let el = document.querySelector(constructo);
        el.remove();
    }

    /**
     * Select the indicated element
     * @param selector html element. A tag, id ou class.
     */
    select(selector = "") {
        var el;

        const obj = {
            getEl(selector) {
                if (el) return el;
                else {
                    if (selector.includes("#")) {
                        selector = selector.replace("#", "");
                        return [document.getElementById(selector)];
                    } else if (selector.includes(".")) {
                        selector = selector.replace(".", "");
                        return Array.from(document.getElementsByClassName(selector));
                    } else {
                        return Array.from(document.getElementsByTagName(selector));
                    }
                }
            },
            html(texto) {
                el.forEach((item) => {
                    item.innerHTML = texto;
                });
                return this;
            },
            append(texto) {
                // el.innerHTML = texto + el.innerHTML;
                el.forEach((item) => {
                    item.innerHTML += texto;
                });
                return this;
            },
            prepend(texto) {
                // el.innerHTML = texto + el.innerHTML;
                el.forEach((item) => {
                    item.innerHTML = texto + item.innerHTML;
                });
                return this;
            },
            css(property, value) {
                el.forEach((item) => {
                    if (typeof value == "number") value += "px";
                    item.style[property] = value;
                });
                return this;
            },
            toggleClass(classe) {
                el.forEach((item) => {
                    item.classList.toggle(classe);
                });
                return this;
            },
            addClass(classe) {
                el.forEach((item) => {
                    item.classList.add(classe);
                });
                return this;
            },
            removeClass(classe) {
                el.forEach((item) => {
                    item.classList.remove(classe);
                });
                return this;
            },
            hide() {
                el.forEach((item) => {
                    item.classList.add("hide_asz__");
                });
            },
            show() {
                el.forEach((item) => {
                    item.classList.remove("hide_asz__");
                });
            },
        };

        el = obj.getEl(selector);

        return obj;
    }

    //0.31 - Delegate
    /**
     * Event Handler
     * @param eventName
     * @param elementSelector
     * @param handler
     */
    on(eventName, elementSelector, handler) {
        document.addEventListener(
            eventName,
            function (e) {
                // loop parent nodes from the target to the delegation node
                for (
                    var target = e.target;
                    target && target != this;
                    target = target.parentNode
                ) {
                    if (target.matches(elementSelector)) {
                        handler.call(target, e);
                        break;
                    }
                }
            },
            false
        );
    }

    // 0.35 - Languages support
    /**
     * Activate translations
     * @param next callback
     */
    lang(next) {
        if (!defaultLang) var defaultLang = "default";
        let localLang = window.localStorage.getItem("lang");
        if (localLang) defaultLang = localLang;

        var $this = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let trad = this.responseXML;
                let el = trad.getElementsByTagName("winnetou");
                let frases = el[0].childNodes;
                frases.forEach((item) => {
                    $this.string[item.nodeName] = item.textContent;
                });
                //console.log("frases", frases);
                next();
            }
        };
        xhttp.open("GET", `/winnetoujs/translations/${defaultLang}.xml`, true);
        xhttp.send();
    }

    // 0.35
    /**
     * Change language
     * @param lang string language
     */
    changeLang(lang) {
        window.localStorage.setItem("lang", lang);
        location.reload();
    }

    // 0.36

    /**
     * Ajax
     * @param options json object (url, method, data, cacheThenServer, cacheOnly, recache)
     * @param callback called function when completes
     */
    ajax(options, callback) {
        var $debug = this.debug;

        // -----------------------------
        // caches
        // -----------------------------

        if (options.cacheOnly === true) {
            try {
                let localRes = window.localStorage.getItem(options.url);

                try {
                    localRes = JSON.parse(localRes);
                } catch (e) {}

                if (localRes) {
                    callback(false, localRes);
                    if (options.recache) {
                        requestAjax((e, s) => true);
                    }
                } else {
                    requestAjax((e, s) => callback(e, s));
                }
            } catch (e) {
                callback("Winnetou Ajax Cache error: " + e.message, false);
                if ($debug === "debug")
                    console.error("Winnetou Ajax Cache error: " + e.message);
            }
        } else if (options.cacheThenServer) {
            //
            try {
                let localRes = window.localStorage.getItem(options.url);

                try {
                    localRes = JSON.parse(localRes);
                } catch (e) {}

                if (localRes) {
                    callback(false, localRes);
                    requestAjax((e, s) => callback(e, s));
                } else {
                    requestAjax((e, s) => callback(e, s));
                }
            } catch (e) {
                callback("Winnetou Ajax Cache error: " + e.message, false);
                if ($debug === "debug")
                    console.error("Winnetou Ajax Cache error: " + e.message);
            }
        } else {
            requestAjax((e, s) => callback(e, s));
        }

        function requestAjax(callback2) {
            var httpRequest;

            if (window.XMLHttpRequest) {
                // Mozilla, Safari, ...
                httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                // IE
                try {
                    httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {}
                }
            }

            if (!httpRequest) {
                if ($debug === "debug")
                    console.error(
                        "Winnetou Error: Giving up :( Cannot create an XMLHTTP instance"
                    );
                callback2("The browser doesn't support ajax", false);
                return false;
            }
            //
            httpRequest.onreadystatechange = alertContents;
            //
            if (options.method) {
                httpRequest.open(options.method, options.url);
            } else {
                httpRequest.open("GET", options.url);
            }
            //
            httpRequest.setRequestHeader("Content-Type", "application/json");
            //
            if ($debug === "debug") console.log("Data sent: ", options.data);
            //
            if (options.method == "GET") {
                httpRequest.send();
            } else {
                httpRequest.send(JSON.stringify(options.data));
            }
            //
            function alertContents() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        //
                        if (options.cacheOnly || options.cacheThenServer) {
                            if (httpRequest.responseText) {
                                //
                                window.localStorage.setItem(
                                    options.url,
                                    httpRequest.responseText
                                );
                                //
                            } else {
                                if ($debug === "debug") {
                                    console.error(
                                        "Winnetou Ajax: Caches dont support XML responses."
                                    );
                                }
                            }
                        }

                        //
                        switch (options.responseType) {
                            //
                            case "json":
                                callback2(false, JSON.parse(httpRequest.responseText));
                                break;
                            //
                            case "text":
                                callback2(false, httpRequest.responseText);
                                break;
                            //
                            case "xml":
                                callback2(false, httpRequest.responseXML);
                                break;
                            //
                            default:
                                callback2(false, JSON.parse(httpRequest.responseText));
                                break;
                        }
                        //
                    } else {
                        callback2("Erro: " + httpRequest.status, false);
                    }
                }
            }
        }
    }
}
