/*
    WinnetouJs Framework
    Use freely keeping this header 
    Author:  Winnetou Kaue Sedrez Bilhalva
    Contact: kaue.sedrez@gmail.com
*/
class Winnetou {
  //

  constructor(debug = "", next) {
    this.mutable = {};
    this.usingMutable = {};
    this.strings = [];
    this.debug = debug;
    this.version = "0.10.1";
    this.constructorId = 0;
    this.$base = [];
    this.$history = [];

    //rotas
    this.routes = {};
    this.paramRoutes = {};

    var $debug = this.debug;
    var $this = this;

    if (this.debug == "debug") {
      console.log("\nWinnetou LOG Constructos --- \n");
    }

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

    // ---------------------------------------------------------
    // ctrol + m para modificar algum mutable

    if ($debug === "debug") {
      document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.which === 77) {
          let mutable = prompt("Mutable name");
          let mutableValue = prompt("Mutable value");
          $this.setMutable(mutable, mutableValue);
        }
      });
    }

    // ---------------------------------------------------------
    // esc para ativar o popstate
    // https://css-tricks.com/snippets/javascript/javascript-keycodes/
    document.addEventListener("keydown", (event) => {
      if (event.which === 27) {
        history.go(-1);
      }
    });

    // 0.30 - popstate nativo

    if (window.history && window.history.pushState) {
      window.onpopstate = function (event) {
        if ($debug == "debug") {
          console.log(
            `location: ${document.location}, state: ${JSON.stringify(event.state)}`
          );
        }

        // dentro de um evento o this muda de contexto

        event.preventDefault();

        if (event.state == null) {
          $this.routes["/"]();
        } else {
          try {
            // apenas aqui
            // $this.routes[event.state]();
            $this.callRoute(event.state);
          } catch (e) {
            console.error(
              `WinnetouJs Error: Given route is not available "${event.state}". Please verify given route. Original Error: ${e}`
            );
          }
        }
      };
    } else {
      $debug === "debug" ? console.log("History Api not allowed in this browser.") : null;
    }

    // temas

    var theme = window.localStorage.getItem("theme");
    if (theme) {
      theme = JSON.parse(theme);
      let root = document.documentElement;
      Object.keys(theme).forEach(function (item) {
        if ($debug === "debug") console.log(item + " = " + theme[item]);

        root.style.setProperty(item, theme[item]);
      });
      if ($debug === "debug") console.log("Altered theme loaded.");
    } else {
      if ($debug === "debug") console.log("Default theme loaded.");
    }
  }

  log(i, a = "", b = "", c = "", d = "", e = "", f = "", g = "", h = "") {
    if (i === 5)
      console.warn(
        "\n\nWINNETOU DEVELOPMENT INTERNAL LOG\n",
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        "\n\n"
      );
  }

  /**
   * Gets the value of passed winnetou mutable
   * @param mutable string that represents a winnetou mutable
   * @returns string value
   */
  getMutable(mutable) {
    let local_mutable = window.localStorage.getItem(`mutable_${mutable}`) || false;
    if (!local_mutable) local_mutable = this.mutable[mutable] || false;
    return local_mutable;
  }

  /**
   * Sets the value of passed winnetou mutable
   * @param mutable string that represents a winnetou mutable
   * @param value string value to be associated to mutable
   */
  setMutable(mutable, value, localStorage = true) {
    var $log = this.log;
    var $this = this;

    if (localStorage) window.localStorage.setItem(`mutable_${mutable}`, value);
    else this.mutable[mutable] = value;

    // se estiver usando mutable no localstorage nao atualiza o constructo?

    if (this.usingMutable[mutable]) {
      let tmpArr = this.usingMutable[mutable];
      this.usingMutable[mutable] = [];

      tmpArr.forEach((item) => {
        let old_ = document.getElementById(item.id);

        // deveria manter o mesmo id ...
        // como obter isso

        let new_ = document
          .createRange()
          .createContextualFragment(
            this.pull(item.constructo, item.elements, item.options, "replacestore")
          );

        this.replace(new_, old_);
      });
    }
  }

  createRoutes() {
    /**
     * Analise da variável this.routes ------------------
     *
     */

    var $this = this;

    Object.keys($this.routes).forEach((key) => {
      if (key.includes("/:")) {
        // /protocolo/:numero -->
        // /perfil/:usuario/:acao -->

        // Preciso separa em duas variáveis

        let separatedRoutes = key.split("/:");

        // armazeno o 0 como identificador de rota especial

        $this.paramRoutes[separatedRoutes[0]] = separatedRoutes[1];
      }
    });

    $this.log(4, "$this.paramRoutes", $this.paramRoutes);

    // -------------------------------------------------------
  }

  /**
   * Creates a popstate of interaction without url changes
   * @param f value to be passed to popstate when returning
   */
  popstate(f) {
    var $this = this;
    if (window.history && window.history.pushState) {
      history.replaceState(f, null);
      history.pushState(f, null);
    } else {
      $this.debug === "debug"
        ? console.log("History Api not allowed in this browser.")
        : null;
    }
  }

  // internal
  callRoute(url) {
    var $this = this;
    try {
      let separatedRoutes = url.split("/");
      $this.log(4, "separatedRoutes", separatedRoutes);
      if (separatedRoutes.length > 2) {
        if (Object.keys($this.paramRoutes).indexOf("/" + separatedRoutes[1]) != -1) {
          // existe a ocorrencia
          $this.log(
            4,
            "existe a ocorrencia",
            `/${separatedRoutes[1]}/:${$this.paramRoutes["/" + separatedRoutes[1]]}`
          );
          $this.routes[
            `/${separatedRoutes[1]}/:${$this.paramRoutes["/" + separatedRoutes[1]]}`
          ](separatedRoutes[2]);
        } else {
          $this.routes[url]();
        }
      } else {
        $this.routes[url]();
      }
    } catch (e) {
      $this.debug === "debug"
        ? console.error(
            "WinnetouJs Error: the provided URL was not found or the this.routes const not have been declared as a valid object of named functions. See WinnetouJs docs for more information.",
            url,
            e
          )
        : null;
      try {
        $this.routes["/404"]();
      } catch (e) {
        if ($this.debug === "debug")
          console.warn(
            "Winnetou Warning: the /404 route was not defined in the this.routes."
          );
        document.write("<h1>WinnetouJs</h1><h2>The indie javascript framework</h2>");
      }
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

      $this.callRoute(url);
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
    var $log = this.log;

    // usada para retornar todos os ids referenciados
    var retorno = {};

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
    if (output == "body" && options && options.clear) {
      if (this.debug === "debug") {
        console.error(`
Winnetou Error: 
\n
\n
You not allowed to clear body tag.
\n
Constructo: ${constructo}
\n
Output: ${output}               
                `);
      }
      return;
    }

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

        // preenche o retorno
        var regId = /\[\[\s*?(.*?)\s*?\]\]/g;
        var matchIds = $this.$base[constructo].match(regId);
        matchIds = matchIds.map((item) => item.replace("[[", "").replace("]]", ""));
        matchIds = matchIds.map((item) => item + "-" + identifier);

        matchIds.forEach((item) => {
          let nome = item.split("-win-")[0];
          retorno[nome] = "#" + item;
        });

        // altera o vdom
        $vdom = $this.$base[constructo].replace(
          /\[\[\s*?(.*?)\s*?\]\]/g,
          "$1-" + identifier
        );

        // ----------------------------------------------------------------
        // elements replace -----------------------------------------------
        // ----------------------------------------------------------------

        //
        for (let item in elements) {
          //

          if (typeof elements[item] === "object") {
            //
            let str = $this.getMutable(elements[item].mutable);
            let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
            $vdom = $vdom.replace(reg, str);

            // agora preciso criar uma lista de constructos que esta usando
            // este mutable

            if (!$this.usingMutable[elements[item].mutable])
              $this.usingMutable[elements[item].mutable] = [];

            let obj = {
              constructo: constructo,
              id: `${constructo}-${identifier}`,
              elements: elements,
              options: options,
            };

            $this.usingMutable[elements[item].mutable].push(obj);

            $log(3, "usingMutable dentro do create", $this.usingMutable);

            //
          } else {
            //
            let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}", "g");
            $vdom = $vdom.replace(reg, elements[item]);
            //
          }
        }
        // limpa os elements que não foram setados
        let reg2 = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
        $vdom = $vdom.replace(reg2, "");
        // ----------------------------------------------------------------
      }

      let el = document.querySelectorAll(output);
      el.forEach((item) => {
        geraIdentifier();

        if (opt === "clear") {
          item.innerHTML = "";
          let frag = document.createRange().createContextualFragment($vdom);
          item.appendChild(frag);
        }

        if (opt === "reverse") {
          let frag = document.createRange().createContextualFragment($vdom);
          item.prepend(frag);
          // item.innerHTML = $vdom + item.innerHTML;
        }
        if (opt === "") {
          let frag = document.createRange().createContextualFragment($vdom);
          item.appendChild(frag);
        }
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

    return retorno;
  }

  /**
   * Internal function to replace a constructo
   * @param new_ DOM Element
   * @param old_ DOM Element
   */
  replace(new_, old_) {
    // agora o replace tem que dar o replace no usingMutable tambem
    // este replace será feito direto no pull

    let ele_ = old_.parentNode;

    ele_.replaceChild(new_, old_);
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

    const $log = this.log;
    const $this = this;

    try {
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

      // ----------------------------------------------------------------
      // elements replace -----------------------------------------------
      // ----------------------------------------------------------------

      //
      for (let item in elements) {
        //

        if (typeof elements[item] === "object") {
          //
          let str = $this.getMutable(elements[item].mutable);
          let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
          $vdom = $vdom.replace(reg, str);

          //
          if (!$this.usingMutable[elements[item].mutable])
            $this.usingMutable[elements[item].stamutablete] = [];

          let obj = {
            constructo: constructo,
            id: `${constructo}-${identifier}`,
            elements: elements,
            options: options,
          };

          $this.usingMutable[elements[item].mutable].push(obj);

          //
        } else {
          //
          let reg = new RegExp("{{\\s*?(" + item + ")\\s*?}}");
          $vdom = $vdom.replace(reg, elements[item]);
          //
        }
      }
      // limpa os elements que não foram setados
      let reg2 = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
      $vdom = $vdom.replace(reg2, "");
      // ----------------------------------------------------------------

      return $vdom;
    } catch (e) {
      console.error(`Winnetou Error: W.pull('${constructo}') : ${e}`);
      // return "";
    }
  }

  /**
   * Creates a pipeline of contructos to be sew in final render output
   * @method pipe("constructo","elements") Store constructo
   * @method render("output") Sew up constructo
   */
  pipeline() {
    var result = "";
    var $this = this;
    const $log = this.log;

    const obj = {
      pipe(constructo = "", elements = {}) {
        result += $this.pull(constructo, elements);
        $log(1, result);

        return this;
      },
      render(output) {
        let el = document.querySelectorAll(output);
        el.forEach((item) => {
          let frag = document.createRange().createContextualFragment(result);
          item.appendChild(frag);
        });
      },
    };

    return obj;
  }

  /**
   * Remove the indicated constructo
   * @param constructo A component defined in the html of the constructs previously set by winConfig.json
   */
  destroy(component = "") {
    var $this = this;
    try {
      W.select(component).remove();
    } catch (e) {
      if ($this.debug === "debug")
        console.warn(`Winnetou Warning: The constructo ${component} doesn't exists.`);
    }
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
      remove() {
        el.forEach((item) => {
          item.remove();
        });
        return this;
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
          item.classList.add("winnetou_display_none");
        });
        return this;
      },
      show() {
        el.forEach((item) => {
          if (getComputedStyle(item).display == "none") item.style.display = "initial";
          item.classList.remove("winnetou_display_none");
        });
        return this;
      },
      getWidth() {
        return el[0].offsetWidth;
      },
      getVal() {
        return el[0].value;
      },
      setVal(value) {
        el.forEach((item) => {
          item.value = value;
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            item.dispatchEvent(evt);
          } else item.fireEvent("onchange");
        });
        return this;
      },
      setAttr(attr, value) {
        el.forEach((item) => {
          item.setAttribute(attr, value);
        });
        return this;
      },
      getAttr(attr) {
        return el[0].getAttribute(attr);
      },
    };

    el = obj.getEl(selector);

    return obj;
  }

  // 0.45
  /**
   * Função que adiciona o listener mousedown e touchstart aos elementos
   * @param {string} selector seletor (id ou class) do elemento
   * @param {function} callback ()=>{}
   */
  click(selector = "", callback) {
    var clickHandler =
      "ontouchstart" in document.documentElement ? "touchstart" : "click";

    this.on(clickHandler, selector, (el) => {
      callback(el);
    });
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
    var $this = this;
    let localLang = window.localStorage.getItem("lang");
    if (localLang) defaultLang = localLang;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let trad = this.responseXML;

        let el = trad.getElementsByTagName("winnetou");
        let frases = el[0].childNodes;

        frases.forEach((item) => {
          if (item.nodeName != "#text") {
            $this.strings[item.nodeName] = item.textContent;
          }
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
        if ($debug === "debug") console.error("Winnetou Ajax Cache error: " + e.message);
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
        if ($debug === "debug") console.error("Winnetou Ajax Cache error: " + e.message);
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
          console.error("Winnetou Error: Giving up :( Cannot create an XMLHTTP instance");
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
                window.localStorage.setItem(options.url, httpRequest.responseText);
                //
              } else {
                if ($debug === "debug") {
                  console.error("Winnetou Ajax: Caches dont support XML responses.");
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

  // 0.40
  /**
   * Change Theme
   * @param theme object
   */
  newTheme(theme) {
    var $debug = this.debug;
    let root = document.documentElement;

    Object.keys(theme).forEach(function (item) {
      if ($debug === "debug") console.log(item + " = " + theme[item]);

      root.style.setProperty(item, theme[item]);
    });

    window.localStorage.setItem("theme", JSON.stringify(theme));
  }
}
