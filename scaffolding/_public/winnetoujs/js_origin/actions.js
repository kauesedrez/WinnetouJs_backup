/**
 * @tutorial W.navigation('/profiles/contacts"');
 */
const WINNETOU_ROUTES = {
    "/": () => {
        document.title = "Home";
        render();        
    },
    "/404": () => {
        document.title = "Lost in space";
        document.write("<h1>Winnetou JS</h1><h2>Lost in the space</h2><p>404</p>");
    },
};
