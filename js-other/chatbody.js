// load complete URL into iframe
window.onload = function() {
	
	window.addEventListener('resize', pageResize);
	
	pageResize();
	
	chatFrame.src = 'https://www.passlok.com/chat/chat.html' + location.hash;
}

//resizes iframe to fit the browser
function pageResize(){
	chatFrame.style.height = document.documentElement.clientHeight + "px";
	chatFrame.style.width = (document.documentElement.clientWidth - 10) + "px"
}