/**
 *
 * Prototipes winnetou para funções javascript bulma
 *
 */

document.addEventListener("DOMContentLoaded", () => {
    //0.31
    W.on("click", ".navbar-burger", (el) => {
        W.select(".navbar-menu").toggleClass("is-active");
    });
});
