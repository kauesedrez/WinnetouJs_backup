/**
 *
 * WinnetouJs winBundleRelase.js
 *
 */

// #region IMPORTS

const fs = require("fs");
const babel = require("@babel/core");
const UglifyJS = require("uglify-js");
const uuid = require("uuid/v4");
const request = require("request");
const UglifyCss = require("uglifycss");
const sass = require("sass");
const htmlMinify = require("html-minifier").minify;
const fse = require("fs-extra");
var version;
try {
  version = require("./version.json");
} catch (e) {
  version = "Warning! Arquivo version.json não localizado.";
}
var config;

// #endregion

// #region LOGS

var contadorDeErros = 0;
var contadorDeWarnings = 0;

const drawLine = (size = 80) => {
  let line = "";
  for (let i = 0; i < size; i++) {
    if (i == 1) line += " ";
    else if (i == size - 2) line += " ";
    else line += "=";
  }
  console.log(line);
};

const drawText = (text = "", size = 80) => {
  let line = "= " + text;

  let tamanho = line.length;

  for (let i = 0; i < size - tamanho; i++) {
    if (i == size - tamanho - 1) line += "=";
    else line += " ";
  }

  console.log(line);
};

const drawTextBlock = (text) => {
  let arr = text.match(/.{1,74}/g);

  arr.forEach((item) => {
    drawText(item);
  });
};

const drawBlankLine = () => {
  drawText();
};

const drawSpace = () => {
  console.log("\n");
};

const drawError = (text) => {
  contadorDeErros++;
  drawLine();
  drawBlankLine();
  console.log("\x1b[1;37;41m");
  drawText("[ X ] Error");
  console.log("\x1b[0m");
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawText("Find online help in");
  drawText("www.cedrosdev.com.br/winnetoujs");
  drawBlankLine();
  drawLine();
  drawSpace();
};

const drawWarning = (text) => {
  contadorDeWarnings++;
  drawLine();
  drawBlankLine();
  drawText("[ ! ] Warning");
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawText("Find online help in");
  drawText("www.cedrosdev.com.br/winnetoujs");
  drawBlankLine();
  drawLine();
  drawSpace();
};

const drawWelcome = () => {
  console.clear();
  drawLine();
  drawBlankLine();
  drawBlankLine();
  drawText("W I N N E T O U J S ");
  drawBlankLine();
  drawText("T h e  i n d i e  j a v a s c r i p t  c o n s t r u c t o r");
  drawBlankLine();
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawText("Find online help and docs");
  drawText("www.cedrosdev.com.br/winnetoujs");
  drawBlankLine();
  drawText("Fork on GitHub");
  drawText("https://github.com/kauesedrez/WinnetouJs.git");
  drawBlankLine();
  drawText("(c) Cedros Development");
  drawText("@winetukaue | kaue.sedrez@gmail.com");
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawText(" -- version: " + version.version);
  drawBlankLine();
  drawLine();
  drawSpace();
};

const drawAdd = (text) => {
  console.log("> [added] " + text);
};

const drawAddError = (text) => {
  contadorDeErros++;

  console.log("\n> [error on add (skip)] " + text + "\n");
};

const drawHtmlMin = (text) => {
  console.log("> [html minifield] " + text);
};

const drawEnd = (text) => {
  console.log("> [Bundle Release Finished] " + text);
};

const drawChange = (text) => {
  console.log("> [Modified file] " + text);
};

const drawFinal = () => {
  drawLine();
  drawBlankLine();
  drawText("All tasks completed");
  drawBlankLine();
  if (contadorDeErros > 0) {
    drawText("... with " + contadorDeErros + " errors");
    drawBlankLine();
  }
  if (contadorDeWarnings > 0) {
    drawText("... with " + contadorDeWarnings + " warnings");
    drawBlankLine();
  }
  if (config.livereload) {
    drawText("... watching " + config.livereload);
    drawBlankLine();
  }
  drawLine();
  drawSpace();
};

drawWelcome();

// #endregion

// #region WINCONFIG VALIDATION

try {
  config = require("./winConfig.json");
} catch (e) {
  drawError(
    "Configuration file (winConfig.json) error or missing; original error: " + e.message
  );
  return;
}

if (
  (!config.constructos || config.constructos.length < 1) &&
  (!config.constructosUrl || config.constructosUrl.length < 1)
) {
  drawError(
    "winConfig.json missing or wrong constructos value. Must be <array> of <strings> or constructosUrl, <array> of <string> uris."
  );
  return;
}
if (!config.outputs) config.outputs = [];
if (!config.outputs.js) {
  config.outputs.js = "./public/js";
  drawWarning(
    "Javascript bundle file output not defined. Using defaults: './public/js' ."
  );
}
if (!config.outputs.css) {
  config.outputs.css = "./public/css";
  drawWarning("CSS bundle file output not defined. Using defaults: './public/css' .");
}
if (!config.bundleJsUrl) config.bundleJsUrl = [];
if (!config.bundleCssUrl) config.bundleCssUrl = [];
if (!config.js) config.js = [];
if (!config.css) config.css = [];
if (!config.sass) config.sass = [];
if (!config.bundleCssUrl) config.bundleCssUrl = [];
if (!config.builtIns) config.builtIns = [];
if (!config.builtIns.jquery) config.builtIns.jquery = "none";
if (!config.builtIns.bootstrapJs) config.builtIns.bootstrapJs = "none";
if (!config.builtIns.fontawesome) config.builtIns.fontawesome = "none";
if (!config.builtIns.bootstrapCss) config.builtIns.bootstrapCss = "none";
if (!config.extras) config.extras = [];
if (!config.extras.minifyHTML) config.extras.minifyHTML = [];

// #endregion

// #region VARIÁVEIS

const output = config.output;
var code = {};
var code2 = {};
var mini = [];
var codeCss = [];
var miniCss = [];
var codeHTML = [];
var performAllControl = false;

// #endregion

// #region LIMPACACHE
ClearCache = () => {
  code = {};
  mini = [];
  codeCss = [];
  miniCss = [];
  codeHTML = [];
  performAllControl = false;
  contadorDeErros = 0;
  contadorDeWarnings = 0;
};

// #endregion

// #region LIVERELOAD

if (config.livereload) {
  var watch = require("node-watch");

  var locaisWinnetou = [];

  for (let i = 0; i < config.constructos.length; i++) {
    locaisWinnetou.push(config.constructos[i]);
  }

  for (let i = 0; i < config.js.length; i++) {
    locaisWinnetou.push(config.js[i]);
  }

  for (let i = 0; i < config.css.length; i++) {
    locaisWinnetou.push(config.css[i]);
  }

  for (let i = 0; i < config.sass.length; i++) {
    locaisWinnetou.push(config.sass[i]);
  }

  for (let i = 0; i < config.extras.minifyHTML.length; i++) {
    locaisWinnetou.push(config.extras.minifyHTML[i]);
  }

  try {
    watch(locaisWinnetou, { recursive: false }, function (evt, name) {
      if (performAllControl) {
        performAllControl = false;
        console.clear();
        drawWelcome();
        drawChange(name);
        ClearCache();
        PerformAll();
      }
    });
  } catch (e) {
    drawError(
      "Watch error: " +
        e.message +
        ". Unless you fix this error watch will not work fully."
    );
  }
}

// #endregion

// ==> ==================================== [[FUNÇÕES PRINCIPAIS]]

// #region 1 ==> PERFORMJS
const PerformJs = async () => {
  /**
   * PerformJS
   * ---------------------
   *
   * A principal função deste método é preencher a variável global [code]
   * que será usada pelo bundleJs para gerar o arquivo
   * bundleWinnetou.min.js
   *
   * Para isso, a PerformJs chama outras funções auxiliares para
   * transpilar no babel cada código js definido no winConfig.js
   * e encontrado no inline dos constructos.
   *
   * O importante é lembrar a ordem em que os scripts devem ser adicionados
   * ao bundle:
   * 1º -> Componentes
   * 2º -> Winnetou Core
   * 3º -> Variável global W (new Winnetou)
   * 4º -> outros scripts
   *
   * É vital que os componentes estejam antes do winnetou core pois este usa a
   * variável [componentes] que é criada ao adicionar os constructos.
   *
   */

  // Adiciona os componentes
  //---------------------------

  /**
   * ICONES
   *
   * Antes de adicionar os constructos tem que verificar se precisa criar o arquivo html
   * do constructo de icones que será transpilado pelo [adicionarConstrutosAoBundle] também
   */

  await adicionarIconesAoBundle();

  /**
   * CONSTRUCTOS
   *
   * Adiciona ao code a string dos constructos winnetou
   * devidamente transpilados em componentes html
   *
   */

  let construtos = await adicionarConstrutosAoBundle();
  code["construtos.js"] = construtos;

  /**
   * WINNETOU CORE
   *
   * Adiciona o arquivo winnetou.js ao code
   *
   */

  let winnetou = await adicionarWinnetouAoBundle();
  code["winnetou.js"] = winnetou;

  /**
   * NEW WINNETOU
   *
   * Cria a instância W que será usada para
   * acessar as funções WinnetouJs no projeto
   *
   */

  code["new winnetou"] = `var W=new Winnetou("${
    config.debug ? config.debug : "production"
  }")`;

  /**
   * OUTROS SCRIPTS
   *
   * Todos os outros scripts já podem ser adicionados ao
   * code pois os constructos e o winnetou já
   * foram adicionados
   *
   */

  /**
   * CODE 2
   *
   * Variável que armazena os inline scripts
   * dos constructos
   *
   */

  Object.keys(code2).forEach((item) => {
    code[item] = code2[item];
  });

  /**
   * Jquery
   *
   * chama o adicionarURLAoBundle para adicionar uma biblioteca
   * js externa
   */

  if (config.builtIns.jquery === "latest") {
    let jquery = await adicionarURLAoBundle("https://code.jquery.com/jquery-3.4.1.js");
    code["BUILT-IN JQUERY.JS 3.4.1"] = jquery.codigo;
  }

  for (let i = 0; i < config.bundleJsUrl.length; i++) {
    let arquivo = await adicionarURLAoBundle(config.bundleJsUrl[i]);
    if (arquivo) code[arquivo.nome] = arquivo.codigo;
  }

  /**
   * bootstrap.js builtin
   */

  if (config.builtIns.bootstrapJs === "latest") {
    let bootstrap = await adicionarURLAoBundle(
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.js"
    );

    code["BUILT-IN BOOTSTRAP.JS 4.3.1"] = bootstrap.codigo;
  }

  /**
   * traduções
   */

  if (config.defaultLang) {
    code["traducoes.js"] = `
            var defaultLang = "${config.defaultLang}";
        `;
  }

  /**
   * Adiciona outros scripts do projeto
   * --------------------------------------------------------
   * definidos no winConfig.js
   */
  // apenas for pode ser usado em função assíncrono
  // forEach não funciona.
  for (let i = 0; i < config.js.length; i++) {
    // aqui entra o algoritmo das pastas ou arquivos
    // temos que testar o final do arquivo
    let nome = config.js[i];
    if (nome.includes(".js")) {
      let arquivo = await adicionarArquivoAoBundle(config.js[i]);
      code[arquivo.nome] = arquivo.codigo;
    } else {
      // é pasta
      // roda o algoritmo que varre as pastas

      try {
        let files = fs.readdirSync(nome);

        for (let a = 0; a < files.length; a++) {
          if (files[a].includes(".js")) {
            let arquivo = await adicionarArquivoAoBundle(nome + "/" + files[a]);

            code[arquivo.nome] = arquivo.codigo;
          }
        }
      } catch (e) {
        drawAddError(e.message);
      }
    }
  }

  /**
   * retorna a variável code
   */

  return code;
};
// #endregion

// #region 1.1 -> BUNDLEJS

/**
 *
 * Função que monta o arquivo final
 * bundleWinnetou.min.js
 *
 * @param {json} dados variável com nome,code definidos
 * @returns promise true
 */
const BundleJs = async (dados) => {
  var result;

  if (config.map === true || typeof config.map === "undefined") {
    result = UglifyJS.minify(dados, {
      sourceMap: {
        root: "/winnetoujs",
        filename: "bundleWinnetou.min.js",
        url: "bundleWinnetou.min.js.map",
      },
    });
  } else {
    result = UglifyJS.minify(dados);
  }

  if (result.error) {
    drawError(`Fatal Error on uglify: ${result.error}`);
    return;
  }

  var resultJs = result.code;

  mini.forEach((item) => {
    resultJs = item + resultJs;
  });

  let error = false;
  let promisse = await fse.outputFile(
    config.outputs.js + "/bundleWinnetou.min.js",
    resultJs,
    function (err) {
      if (err) error = err;
    }
  );
  let promisse2 = promisse;

  // sourcemap
  let promisse3 = await fse.outputFile(
    config.outputs.js + "/bundleWinnetou.min.js.map",
    result.map,
    function (err) {
      if (err) error = err;
    }
  );
  let promisse4 = promisse3;

  drawEnd("bundleWinnetou.min.js");
  return new Promise((resolve, reject) => {
    if (error) reject(error);
    else resolve(true);
  });
};
// #endregion

// #region 2 ==> PERFORMCSS

/**
 * Função responsável por varrer os arquivos
 * sass, scss e css definidos no winConfig.json
 * e adicionar à variável global codeCss
 * que será processada pelo bundle css
 *
 * @returns array codeCss
 */
const PerformCss = async () => {
  /**
   * adiciona css passado via url
   */
  for (let i = 0; i < config.bundleCssUrl.length; i++) {
    let arquivo = await adicionarURLAoBundleCss(config.bundleCssUrl[i]);

    config.bundleCssUrl[i].includes("min")
      ? miniCss.push(arquivo)
      : (codeCss["URL-" + uuid()] = arquivo);
  }

  /**
   * Adiciona o bootstrap
   */
  if (config.builtIns.bootstrapCss === "latest") {
    let bootstrapCss = await adicionarURLAoBundleCss(
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    );
    miniCss.push(bootstrapCss);
  }

  /**
   * Adiciona os arquivos css
   * indicados no winConfig.json
   * através da função adicionarArquivoAoBundleCss
   */
  for (let i = 0; i < config.css.length; i++) {
    let nome = config.css[i];
    if (nome.includes(".css")) {
      let arquivo = await adicionarArquivoAoBundleCss(config.css[i]);
      codeCss.push(arquivo);
    } else {
      // é pasta css
      try {
        let files = fs.readdirSync(nome);
        for (let a = 0; a < files.length; a++) {
          if (files[a].includes(".css")) {
            let arquivo = await adicionarArquivoAoBundleCss(nome + "/" + files[a]);
            codeCss.push(arquivo);
          }
        }
      } catch (e) {
        drawAddError(e.message);
      }
    }
  }

  /**
   * Adiciona os arquivos .scss e .sass
   */
  for (let i = 0; i < config.sass.length; i++) {
    let nome = config.sass[i];
    if (nome.includes(".scss") || nome.includes(".sass")) {
      let arquivo = await adicionarSassAoBundleCss(config.sass[i]);
      codeCss.push(arquivo);
    } else {
      // pastas sass
      try {
        let files = fs.readdirSync(nome);
        for (let a = 0; a < files.length; a++) {
          if (files[a].includes(".scss") || files[a].includes(".sass")) {
            let arquivo = await adicionarSassAoBundleCss(nome + "/" + files[a]);
            codeCss.push(arquivo);
          }
        }
      } catch (e) {
        drawAddError(e.message);
      }
    }
  }

  /**
   * retorna o codeCss com todos os arquivos css
   */

  return codeCss;
};
// #endregion

// #region 2.1 -> BUNDLECSS
/**
 * Função responsável por transformar a variável
 * global codeCss no arquivo
 * bundleWinnetouStyles.min.css
 *
 * @param {array} dados codeCss
 */
const BundleCss = async (dados) => {
  //css predefinidos para o funcionamento do winnetoujs
  let stringU = `       
        .winnetou_display_none {
            display: none !important;
        }                
    `;

  dados.forEach((item) => {
    stringU += item;
  });
  var result = UglifyCss.processString(stringU);

  miniCss.forEach((item) => {
    result = item + result;
  });

  let error = false;
  let promisse = await fse.outputFile(
    config.outputs.css + "/bundleWinnetouStyles.min.css",
    result,
    function (err) {
      if (err) {
        console.log(">>ERR", err);
        error = err;
      }
    }
  );
  let promisse2 = promisse;

  drawEnd("bundleWinnetouStyles.min.css");
  return new Promise((resolve, reject) => {
    if (error) reject(false);
    else resolve(true);
  });
};
// #endregion

// #region 3 ==> PERFORMEXTRAS
/**
 * Função responsável por minificar os arquivos
 * html passados no minifyHTML do winConfig.json
 * e adicioná-los na variável codeHTML
 * para ser processada pelo bundle extras
 *
 */
const PerformExtras = async () => {
  for (let i = 0; i < config.extras.minifyHTML.length; i++) {
    let nome = config.extras.minifyHTML[i];

    if (nome.includes(".html") || nome.includes(".htm")) {
      let arquivo = await minifyHTML(config.extras.minifyHTML[i]);
      // arquivo é o codigo html já minificado
      // config.extras.minifyHTML[i] é o nome e o path relativo do arquivo
      if (arquivo)
        codeHTML.push({
          code: arquivo,
          path: config.extras.minifyHTML[i],
        });
    } else {
      // é diretório

      try {
        let files = fs.readdirSync(nome);

        for (let a = 0; a < files.length; a++) {
          if (files[a].includes(".html") || files[a].includes(".htm")) {
            let arquivo = await minifyHTML(nome + "/" + files[a]);
            // arquivo é o codigo html já minificado
            // config.extras.minifyHTML[i] é o nome e o
            // path relativo do arquivo
            codeHTML.push({
              code: arquivo,
              path: nome + "/" + files[a],
            });
            // ------
          }
        }
      } catch (e) {
        drawAddError(e.message);
      }
    }
  }
  return codeHTML;
};
// #endregion

// #region 3.1 -> BUNDLEEXTRAS
/**
 * Função responsável por ler a variável dados (codeHTML)
 * e criar os arquivos minificados html
 * @param {array} dados lista de strings com os códigos html
 */
const BundleExtras = async (dados) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < dados.length; i++) {
        //console.log("extras: ",dados[i])
        let promisse = await fs.writeFile(
          dados[i].path.replace(".html", ".min.html").replace(".htm", ".min.htm"),
          dados[i].code,
          (err) => {}
        );

        let promisse2 = promisse;
      }

      drawEnd("Minifields html sources");
      resolve(true);
    } catch (e) {
      reject(e.message);
    }
  });
};
// #endregion

// ==> ================================== [[FUNÇÕES DE APOIO JS]]

// #region ICONES
const adicionarIconesAoBundle = async () => {
  /**
   * Esta função cria um arquivo html minificado
   * icons.html dentro da pasta ./constructos
   *
   * Retorna uma promise.
   */
  return new Promise(async (resolve, reject) => {
    /**
     * Se tiver sido declarado no winConfig o caminho para encontrar
     * os icones performa, se não retorna reject.
     */
    if (
      (config.icons && config.icons.length > 0) ||
      (config.coloredIcons && config.coloredIcons.length > 0)
    ) {
      /**
       * declara a variável que conterá o conteúdo html
       */
      let constructoIcones = `
        <div class="winnetou">
        <svg display="none" id="[[winIcons]]">
        `;

      /**
       * Se for icone opaco pode-se trocar o fill via css
       * chama o adicionarIcones
       *
       * o laço for é o ideal para funções síncronas
       * pois espera um comando finalizar para chamar o outro
       */
      if (config.icons && config.icons.length > 0) {
        for (let i = 0; i < config.icons.length; i++) {
          // retorna uma string com todos os icones transpilados
          // do direorio passado

          let icones = await adicionarIcones(config.icons[i]);
          drawAdd("Icones adicionados: " + config.icons[i]);
          constructoIcones += icones;
        }
      }

      /**
       * Se for icone colorido não deve retirar o fill da tag
       * então se chama outra função de apoio
       * adicionarIconesColoridos
       */
      if (config.coloredIcons && config.coloredIcons.length > 0) {
        for (let i = 0; i < config.coloredIcons.length; i++) {
          let icones = await adicionarIconesColoridos(config.coloredIcons[i]);
          drawAdd("Icones adicionados: " + config.coloredIcons[i]);
          constructoIcones += icones;
        }
      }

      constructoIcones += `
            </svg>
            </div>
            <div class="winnetou">
                <svg class="{{class}}"id="[[useIcon]]">
                    <use xlink:href="#{{id}}" />
                </svg>
            </div>
            <style>
            svg {
                width:15px;
                height: 15px;
                fill: inherit;
            }
            </style>
        `;

      // agora deve gerar o constructo dentro da pasta definida pelo usuário para os constructos

      // console.log(constructoIcones)

      constructoIcones = htmlMinify(constructoIcones, {
        removeAttributeQuotes: false,
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
      }); // node module que minifica o HTML

      if (
        !config.constructos.includes("./constructos/icons.html") &&
        !config.constructos.includes("./constructos")
      ) {
        config.constructos.push("./constructos/icons.html");
      }

      let iconsSuccess = await fse.outputFile(
        "./constructos/icons.html",
        constructoIcones,
        (err) => {
          if (err) drawError(`Error create icons constructo: ${err}`);
        }
      );

      let iconsSuccess2 = iconsSuccess;
    } else {
      return resolve("No icons");
    }
  });
};
// #endregion

// #region ADICIONAR CONSTRUCTOS AO BUNDLE

/**
 * Função que lê o winConfig e trata cada
 * arquivo encontrado chamando o lerConstructo
 * adiciona o retorno string na variável res
 *
 *
 * @param teste variavel teste
 * @returns promise -> string contendo os constructos
 *
 */
const adicionarConstrutosAoBundle = async () => {
  return new Promise(async (resolve, reject) => {
    var res = "";

    /**
     * Varre os constructos
     */

    for (let i = 0; i < config.constructos.length; i++) {
      let nome = config.constructos[i];

      if (nome.includes(".htm") || nome.includes(".html")) {
        /**
         * É arquivo
         * chama o lerConstructo
         * adiciona o retorno string na variável res
         */
        let tmp = await lerConstructo(nome);
        res += tmp;

        drawAdd("Constructo: " + nome);
      } else {
        /**
         * É diretório
         * Lê o diretório e depois cria um laço
         * para chama o lerConstructo
         */
        let files = fs.readdirSync(nome);

        for (let a = 0; a < files.length; a++) {
          let tmp = await lerConstructo(nome + "/" + files[a]);
          res += tmp;
          drawAdd("Constructo: " + nome + "/" + files[a]);
        }
      }
    }

    /**
     * Constructo passado via url
     * chama o adicionarConstructoURL
     */
    if (config.constructosUrl && config.constructosUrl.length > 0) {
      for (let i = 0; i < config.constructosUrl.length; i++) {
        let arq = await adicionarConstructoURL(config.constructosUrl[i]);
        res += arq;
        drawAdd("Constructo: " + config.constructosUrl[i]);
      }
    }

    /**
     * Neste ponto temos na variável res todos
     * os constructos html
     *
     * Agora deve ser retirado o style inline
     * e os scrits inline
     *
     * Mas na verdade não precisa.
     *
     * De acordo com a ordem que o PerformJs precisa
     * seguir, o inline js deve ser o ultimo a ser adiciona
     * à variável code.
     */

    // 0.29 aqui deve ser tratado o style inline

    let styleReg = new RegExp("<style>(.*?)</style>", "gis");

    let array = [...res.matchAll(styleReg)];

    array.forEach((item) => {
      res = res.replace(item[0], "");

      sass.render(
        {
          data: item[1],
        },
        function (err, result) {
          try {
            codeCss.push(result.css);
          } catch (e) {
            drawError(
              `Winnetou Error: ${e.message} \n\n ${err} \n\n 
                            \nInline Style:\n

                            ${item[1]} `
            );
          }
        }
      );
    });

    /**
     * Deve-se armazenar este resultado para acrescentar depois
     * pois tem que obdecer a ordem do code
     * -> constructos
     * -> winnetou core
     * -> W = new Winnetou()
     * -> Outros scripts (inlinejs(code2), js_origin, etc.)
     */

    let jsReg = new RegExp("<script>(.*?)</script>", "gis");

    let jsarray = [...res.matchAll(jsReg)];

    jsarray.forEach((item) => {
      res = res.replace(item[0], "");
      950;

      babel.transform(
        item[1],
        {
          presets: ["@babel/preset-env"],
          compact: false,
          retainLines: true,
        },
        function (err, result) {
          if (err) {
            drawError(`Error on parsing inline JS Babel: ${err} \n ${item[0]}`);
          } else {
            code2[`inlineJs_${uuid()}`] = result.code;
          }
        }
      );
    });

    const arq = `
            var Componentes =\`${res}\`;
            var Div = document.createElement('div');        
            Div.innerHTML = Componentes;
            Componentes = Div.getElementsByClassName("winnetou");
            Div = null;   
            `;
    try {
      babel.transform(
        arq,
        {
          presets: ["@babel/preset-env"],
          compact: false,
          retainLines: true,
        },
        function (err, result) {
          return resolve(result.code);
        }
      );
    } catch (e) {
      console.log(e.message);
      return reject(e.message);
    }
  });
};
// #endregion

// #region ADICIONAR WINNETOU AO BUNDLE
/**
 * Função que transpila o arquivo winnetou.js
 * no babel e o serve em forma de string
 *
 * @returns string promise contendo winnetou.js transpilado
 */
const adicionarWinnetouAoBundle = () => {
  var resultWinnetou = "";
  return new Promise((resolve, reject) => {
    fs.readFile("./winnetou.js", function (err, data) {
      const arq = data;
      try {
        babel.transform(
          arq,
          {
            presets: ["@babel/preset-env"],
            compact: false,
            retainLines: true,
          },
          function (err, result) {
            if (err) {
              drawError(`Error on add Winnetou Core: ${err}`);
              return reject(err);
            }
            resultWinnetou += result.code;
            drawAdd("Winnetou core");
            return resolve(resultWinnetou);
          }
        );
      } catch (e) {
        drawError(`Error on add Winnetou Core: ${e.message}`);
        return reject(e.message);
      }
    });
  });
};
// #endregion

// #region ADICIONAR URL AO BUNDLE JS
/**
 * Função que adiciona scriptsjs externos via url
 * transpila o arquivo no babel
 *
 * @param {string} url url do arquivo js *não minificado*
 * @returns promise obj json nome,codigo
 */
const adicionarURLAoBundle = async (url) => {
  return new Promise((resolve, reject) => {
    if (url.includes("min")) {
      // não se pode adicionar min ao bundle pois quebra o mapping
      try {
        drawError(
          "Don't add minifield js file into winnetouBundle. Please insert via tag in your html source. " +
            url
        );
        return resolve(false);
      } catch (e) {
        return reject(false);
      }
    } else {
      request(url, function (error, response, data) {
        const arq = data;
        try {
          babel.transform(
            arq,
            {
              presets: ["@babel/preset-env"],
              compact: false,
              retainLines: true,
            },
            function (err, result) {
              drawAdd(url);
              return resolve({
                nome: url,
                codigo: result.code,
              });
            }
          );
        } catch (e) {
          console.log(e.message);
          return reject(e.message);
        }
      });
    }
  });
};
// #endregion

// #region ADICIONAR ARQUIVOS AO BUNDLE JS
/**
 * Funão responsável por ler o arquivo
 * passado via path e tranpilá-lo no babel
 * retornando o código
 *
 * @param {string} arquivo path do arquivo
 * @returns json {nome:string, codigo:string}
 */
const adicionarArquivoAoBundle = async (arquivo) => {
  return new Promise((resolve, reject) => {
    fs.readFile(arquivo, function (err, data) {
      if (err) {
        try {
          drawAddError(arquivo + ", original error: " + err);
          return resolve({ nome: arquivo, codigo: "" });
        } catch (e) {
          return reject(e);
        }
      }
      const arq = data;
      try {
        babel.transform(
          arq,
          {
            presets: ["@babel/preset-env"],
            compact: false,
            retainLines: true,
          },
          function (err, result) {
            drawAdd(arquivo);
            if (err) console.log("\n\nERRO: " + err, arquivo);
            return resolve({
              nome: arquivo,
              codigo: result.code,
            });
          }
        );
      } catch (e) {
        console.log(e.message);
        return reject(e.message);
      }
    });
  });
};
// #endregion

// --> ================================== [[FUNÇÕES SECUNDÁRIAS JS]]

// #region ADICIONAR ICONES
const adicionarIcones = async (path) => {
  /**
   * Função que lê o diretório de icones e chama a função
   * terciária adicionarSvg
   *
   * Retorna uma promise.
   */
  return new Promise(async (resolve, reject) => {
    try {
      let files = fs.readdirSync(path);
      let arqs = "";

      for (let a = 0; a < files.length; a++) {
        /**
         * Lê todos os arquivos do path passado
         * e para cada um chama a função adicionarSvg
         */
        let svgName = await adicionarSvg(path + "/" + files[a]);

        // adiciona o svg transpilado para dentro da var arqs
        arqs += "\n\t" + svgName;
      }

      // retorna a string contendo todos os svgs transpilados
      // do diretório passado
      return resolve(arqs);
    } catch (e) {
      return reject(`Erro no adicionarIcones(): ${e}`);
    }
  });
};
//#endregion

// #region ADICIONAR ICONES COLORIDOS

const adicionarIconesColoridos = async (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      let files = fs.readdirSync(path);
      let arqs = "";

      for (let a = 0; a < files.length; a++) {
        let svgName = await adicionarSvgColorido(path + "/" + files[a]);

        arqs += "\n\t" + svgName;
      }
      return resolve(arqs);
    } catch (e) {
      return reject(`Erro no adicionarIcones(): ${e}`);
    }
  });
};

// #endregion

// #region LER CONSTRUCTO
/**
 * Função que lê um arquivo e rotorna o seu conteúdo
 * @param {*} arquivo path do constructo html
 * @return promise
 */
const lerConstructo = async (arquivo) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(arquivo, function (err, data) {
        return resolve(data);
      });
    } catch (e) {
      return reject(e.message);
    }
  });
};
// #endregion

// #region ADICIONAR CONSTRUCTOS VIA URL
/**
 * Função que usa o request para ler um
 * arquivo de constructo html online
 * @param {string} url url do constructo
 * @returns promise
 */
const adicionarConstructoURL = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, data) {
      if (error) {
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });
};
// #endregion

// --> ================================== [[FUNÇÕES TERCIÁRIAS JS]]

// #region ADICIONAR SVG
const adicionarSvg = async (path) => {
  /**
   * Funçaõ que lê o arquivo SVG e o transpila
   * removendo seu interior e devolvendo na resolve da promise
   *
   * Retorna promise
   */
  return new Promise((resolve, reject) => {
    /**
     * Le o arquivo svg e faz as transpilações
     */
    let xmlString = fs.readFileSync(path, "utf8");

    let regPath = /[a-zA-Z]+/g;

    let id = path.match(regPath);

    id = id.filter((x) => x != "svg");

    id = id.join("_");

    let regVb = new RegExp('viewBox="(.*?)"', "gis");

    let reg = new RegExp("<svg(.*?)>(.*?)</svg>", "is");

    if (xmlString) {
      // trata o svg

      let viewBox = xmlString.match(regVb);

      let arr = xmlString.match(reg);

      let symbol = `<symbol ${viewBox} id="${id}">`;

      // limpa o fill para poder se trocar o fill
      // via css
      let cleanFill = arr[2].replace("fill", "data-fill");

      symbol += cleanFill;

      symbol += `</symbol>`;

      // agora tenho um array de paths
      // tenho que colocar dentro do symbol

      return resolve(symbol);
    } else {
      return reject(`Erro ao ler arquivo adicionarIcones() ${path}`);
    }
  });
};
// #endregion

// #region ADICIONAR SVG COLORIDO

const adicionarSvgColorido = async (path) => {
  return new Promise((resolve, reject) => {
    let xmlString = fs.readFileSync(path, "utf8");

    let regPath = /[a-zA-Z]+/g;

    let id = path.match(regPath);

    id = id.filter((x) => x != "svg");

    id = id.join("_");

    let regVb = new RegExp('viewBox="(.*?)"', "gis");

    let reg = new RegExp("<svg(.*?)>(.*?)</svg>", "is");

    if (xmlString) {
      // trata o svg

      let viewBox = xmlString.match(regVb);

      let arr = xmlString.match(reg);

      let symbol = `<symbol ${viewBox} id="${id}">`;

      // let cleanFill = arr[2].replace("fill", "data-fill");

      let cleanFill = arr[2];

      symbol += cleanFill;

      symbol += `</symbol>`;

      // agora tenho um array de paths
      // tenho que colocar dentro do symbol

      return resolve(symbol);
    } else {
      return reject(`Erro ao ler arquivo adicionarIcones() ${path}`);
    }
  });
};

// #endregion

// --> ================================== [[FUNÇÕES DE APOIO CSS]]

// #region ADICIONAR URL AO BUNDLE CSS
/**
 * Funcção responsável por ler um url e devolver
 * ele em formato string
 *
 * @param {string} url url do arquivo css
 * @returns promise string css code
 */
const adicionarURLAoBundleCss = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, data) {
      try {
        if (error) console.log("ERROR adicionarURLAoBundleCss", error);
        drawAdd(url);

        return resolve(data);
      } catch (e) {
        console.log(e.message);
        return reject(e.message);
      }
    });
  });
};
// #endregion

// #region ADICIONAR ARQUIVO AO BUNDLE CSS
/**
 * Função responsável por ler um arquivo local css
 * e retornar o conteúdo em formato string
 *
 * @param {string} arquivo path do arquivo css
 * @returns promise string code css
 */
const adicionarArquivoAoBundleCss = async (arquivo) => {
  return new Promise((resolve, reject) => {
    fs.readFile(arquivo, function (err, data) {
      if (err) {
        try {
          drawAddError(arquivo + ", original error: " + err);
          return resolve("");
        } catch (e) {
          return reject(e);
        }
      }

      const arq = data;
      try {
        drawAdd(arquivo);

        return resolve(arq);
      } catch (e) {
        console.log(e.message);
        return reject(e.message);
      }
    });
  });
};
// #endregion

// #region ADICIONAR SASS AO BUNDLE CSS
/**
 * Função responsável por ler os arquivos sass (.sass e .scss)
 * e compilá-los no node-sass
 * retornando uma string com o código compilado.
 * @param {string} arquivo path
 * @returns {promise} promise string code css
 */
const adicionarSassAoBundleCss = async (arquivo) => {
  return new Promise((resolve, reject) => {
    try {
      sass.render(
        {
          file: arquivo,
        },
        function (err, result) {
          if (err) {
            try {
              drawAddError(arquivo + ", original error: " + err);
              return resolve("");
            } catch (e) {
              return reject(e);
            }
          }

          drawAdd(arquivo);
          if (err) console.log("\n\nERRO: " + err, arquivo);
          return resolve(result.css);
        }
      );
    } catch (e) {
      console.log(e.message);
      return reject(e.message);
    }
  });
};
// #endregion

// --> ================================== [[FUNÇÕES DE APOIO CSS]]

// #region MINIFY HTML
/**
 * Função responsável por ler o arquivo passado
 * e transpilá-lo no htmlMinify
 * retornando uma string com o código
 * html minificado
 *
 * @param {string} arquivo path do arquivo
 * @returns {promisse} string html minified code
 */
const minifyHTML = async (arquivo) => {
  return new Promise((resolve, reject) => {
    try {
      const htmlString = fs.readFileSync(arquivo, "utf8");

      drawHtmlMin(arquivo);

      var res = htmlMinify(htmlString, {
        removeAttributeQuotes: false,
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
      }); // node module que minifica o HTML

      return resolve(res);
    } catch (e) {
      try {
        drawAddError(arquivo + ", original error: " + e.message);
        return resolve(false);
      } catch (e2) {
        return reject(false);
      }
    }
  });
};
// #endregion
// ------------------------------------------------------------------------

// #region PERFOM ALL ---------
/**
 * Responsável por rodar o bundle, esta função aninha em async await tudo o
 * que é necessário para criar o bundleWinnetou.min.js
 *
 * FLUXOGRAMA
 * 1º -> PerfomJS         -> BundleJS
 * 2º -> PerformCss       -> BundleCss
 * 3º -> PerformExtras    -> BundleExtras
 *
 *
 */
(async () => {
  //
  let resultadoJs = await PerformJs();
  await BundleJs(resultadoJs);

  let resultadoCss = await PerformCss();
  await BundleCss(resultadoCss);

  let resultadoExtras = await PerformExtras();
  await BundleExtras(resultadoExtras);

  performAllControl = true;

  drawFinal();
  //
})();
// #endregion
