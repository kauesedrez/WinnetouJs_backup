Winnetou.prototype.dismis = (component) => {
  W.select(component).addClass("animated").addClass("zoomOutLeft");
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
  W.select(component).show().addClass("fast").addClass("animated").addClass("fadeInLeft");
};

Winnetou.prototype.active = (component, popstate) => {
  W.select(component)
    .addClass("is-active")
    .addClass("animated")
    .addClass("fast")
    .addClass("bounceInRight");
  W.popstate(popstate);
};

Winnetou.prototype.deactive = (component) => {
  W.select(component).addClass("bounceOutRight");
  setTimeout(() => {
    W.select(component)
      .removeClass("is-active")
      .removeClass("animated")
      .removeClass("fast")
      .removeClass("bounceInRight")
      .removeClass("bounceOutRight");
  }, 1000);
};
