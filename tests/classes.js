class Msg {
	constructor(msg,color){
		this.msg = msg;
		this.color = color;
	}
	show(){
		let ola = "Ola variavel modificada";
		document.body.innerHTML += "<h1 style='color:"+this.color+"'>"+this.msg+"</h1> Teste de estilo no body "+ola;
	}
}