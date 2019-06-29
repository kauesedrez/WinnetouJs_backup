// WinnetouJs Framework
// Use free keeping this header
// author Winetu Kaue Sedrez Bilhalva
// kaue.sedrez@gmail.com

// ultima modificação em 28/06/2019

// need jquery
// recommended bootstrap
// recomended themes https://bootstrap.build/themes

var Winnetou = function() {
  this.version = "1.0";

  this.construtorId = 0; // identificador de cada modal que chamaremos de contrutos, porque eu quero! kkk

  $base = [];

  this.init = function() {
    // cria o V-Dom a partir do html

    $(".winnetou").each(function() {
      //tem que localizar o id

      $elem = $(this);

      id = $elem.html().match(/\[\[(.*?)\]\]/)[1];

      $base[id] = $elem.html();

      $elem.remove(); // remove o elemento base do html e deixa apenas no v-dom
    });

    this.create = function(construto, output, elements, identifier) {
   
      if (identifier == undefined) {
        this.construtorId++;

        identifier = this.construtorId;
      }

      this.construtorId++;

      identifier = this.construtorId;

      $vdom = $base[construto].replace(/\[\[(.*?)\]\]/g, "$1-" + identifier);

      $.each(elements, function(item) {
        reg = new RegExp("{{(" + item + ")}}");

        $vdom = $vdom.replace(reg, elements[item]);
      });

      // this.construtorId++;

      $(output).append($vdom);
    };
  };
};
