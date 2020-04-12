Winnetou.prototype.dismis = (component) => {
    W.select(component).addClass("zoomOutLeft");
    setTimeout(() => {
        W.select(component)
            .hide()
            .removeClass("fast")
            .removeClass("animated")
            .removeClass("zoomOutLeft")
            .removeClass("fadeInLeft");
    }, 1000);
};

Winnetou.prototype.display = (component) => {
    W.select(component)
        .show()
        .addClass("fast")
        .addClass("animated")
        .addClass("fadeInLeft");
};
