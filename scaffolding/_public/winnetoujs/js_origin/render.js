const W = new Winnetou("debug");

function render() {
    // ----------------------------------------------------------
    // menu flutuante -------------------------------------------
    // ----------------------------------------------------------
    W.create(
        "menuFlutuanteMobile",
        "#app",
        {},
        { reverse: true, identifier: "menu", clear: true }
    );
    W.create("winIcons", "#app");
    W.create("modal", "#app", {}, { identifier: "opc" });

    // ----------------------------------------------------------
    // menu da esquerda -----------------------------------------
    // ----------------------------------------------------------
    W.create("panel", "#menuLeft", {}, {});

    // ----------------------------------------------------------
    // slidescreen ----------------------------------------------
    // ----------------------------------------------------------
    W.create("slideScreen", "#app", {}, { identifier: "main" });

    // ----------------------------------------------------------
    // screens --------------------------------------------------
    // ----------------------------------------------------------
    // 0 : screen-win-pagina1
    W.create("screen", "#slideScreen-win-main", {}, { identifier: "pagina1" });

    // 1 : screen-win-pagina2
    W.create("screen", "#slideScreen-win-main", {}, { identifier: "pagina2" });

    // 2 : screen-win-pagina3
    W.create("screen", "#slideScreen-win-main", {}, { identifier: "pagina3" });

    // ----------------------------------------------------------
    // inicializa o slideScreen ---------------------------------
    // ----------------------------------------------------------
    slideScreen("slideScreen-win-main");

    // ----------------------------------------------------------
    // adiciona conteúdo às screens -----------------------------
    // ----------------------------------------------------------

    const icon_brazil = W.pull("useIcon", {
        id: "coloredIcons_brazil",
        class: "winIcons",
    });
    const icon_eua = W.pull("useIcon", { id: "coloredIcons_eua", class: "winIcons" });

    const conteudo = `
        
        <button onclick="W.changeLang('pt-BR')" class='button'>${icon_brazil} pt-BR</button>
        <button onclick="W.changeLang('en-US')" class='button'>${icon_eua} en-US</button>
    
    `;

    W.create("div", "#screen-win-pagina1", {
        title: W.string.titulo,
        subtitle: W.string.subtitulo,
        content: conteudo + buttons,
    });

    W.create("div", "#screen-win-pagina2", {
        title: `Página 2`,
    });

    W.create("div", "#screen-win-pagina3", {
        title: `Página 3`,
    });
}

const buttons = `
    <hr> 
    <button class='button is-primary' onclick="darkTheme()">Dark</button>
    <button class='button is-primary' onclick="lightTheme()">Light</button>
    <button class='button is-primary' onclick="colorTheme()">Colorful</button>
    <hr>
     <button class='button is-danger' onclick="modal()">Modal de opções</button>

    `;

function darkTheme() {
    W.newTheme({
        "--main-bg-color": "#333",
        "--main-fg-color": "#ddd",
    });
}

function lightTheme() {
    W.newTheme({
        "--main-bg-color": "#fff",
        "--main-fg-color": "#222",
    });
}

function colorTheme() {
    W.newTheme({
        "--main-bg-color": "#999",
        "--main-fg-color": "#0f0",
    });
}

function modal() {
    W.active("#modal-win-opc", "hideModal");
}
