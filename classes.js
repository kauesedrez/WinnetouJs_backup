class Msg {
	constructor(msg,color){
		this.msg = msg;
		this.color = color;
	}
	show(){
		document.body.innerHTML += "<h1 style='color:"+this.color+"'>"+this.msg+"</h1> Teste de estilo no body"
	}
}