// JavaScript Document

function findhere(){
	if(this.t1.value!=null && this.t1.value!=''){
		parent.findString(this.t1.value);
		return(false);
	}
}

window.onload = function() {
	
document.getElementById('searchBox').addEventListener('submit', findhere);
}