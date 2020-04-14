/**
 * @tutorial W.navigation('/profiles/contacts"');
 */
const WINNETOU_ROUTES = {
    "/": () => {
        document.title = "Home";
        render();
    },
    "/pagina1": () => {
        document.title = "Página 1";
        screenScroll("screen-win-pagina1");
        W.select(".menu")
            .removeClass("menuactive")
            .removeClass("animated")
            .removeClass("faster")
            .removeClass("tada");
        W.select(".menu1")
            .addClass("menuactive")
            .addClass("animated")
            .addClass("faster")
            .addClass("tada");
    },
    "/pagina2": () => {
        document.title = "Página 2";
        screenScroll("screen-win-pagina2");
        W.select(".menu")
            .removeClass("menuactive")
            .removeClass("animated")
            .removeClass("faster")
            .removeClass("tada");
        W.select(".menu2")
            .addClass("menuactive")
            .addClass("animated")
            .addClass("faster")
            .addClass("tada");
    },
    "/pagina3": () => {
        document.title = "Página 3";
        screenScroll("screen-win-pagina3");
        W.select(".menu")
            .removeClass("menuactive")
            .removeClass("animated")
            .removeClass("faster")
            .removeClass("tada");
        W.select(".menu3")
            .addClass("menuactive")
            .addClass("animated")
            .addClass("faster")
            .addClass("tada");
    },
    hideModal: () => {
        W.deactive("#modal-win-opc");
    },
    "/404": () => {
        document.title = "Lost in space";
        W.select("#app").html("<h1>Winnetou JS</h1><h2>Lost in the space</h2><p>404</p>");
    },
};
