"use strict";

var Componentes = "\n<div class=\"winnetou\">\n\t<div class=\"card text-white bg-primary mb-3\" id=\"[[componenteTexto1]]\">\n\t\t{{ texto }}\n\t</div>\n</div>\n\n<table class=\"winnetou\">\n\t<tr id=\"[[tabela]]\">\n\t  <td>{{ nome }}</td>\n\t  <td>{{ uid }}</td>\n\t  <td>{{ plano }}</td>\n\t  <td>{{ subscription }}</td>\n\t  <td>{{ criado }}</td>\n\t  <td>{{ proxima }}</td>\n\t  <td>{{ metodo }}</td>\n\t</tr>\n  </table>\n  \n";
var Div = document.createElement('div');
Div.innerHTML = Componentes;
Componentes = Div.getElementsByClassName("winnetou");
Div = null;