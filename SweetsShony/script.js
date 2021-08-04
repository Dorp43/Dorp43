var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


function movePack1(){
	window.location.href="enclosures.html?action=shadowpac1";
}

function movePack2(){
	window.location.href="enclosures.html?action=shadowpac2";
}

function movePack3(){
	window.location.href="enclosures.html?action=shadowpac3";
}

function checkpack(){
	var pac1 = document.getElementById("pack1");
	var pac2 = document.getElementById("pack2");
	var pac3 = document.getElementById("pack3");
	
	if(window.location.search == "?action=shadowpac1"){
		pac1.style.boxShadow = "0px 0px 12px pink";
		// pac1.style.animation = "select 0.7s alternate infinite";
		pac1.style.border = "solid 1px pink";
		pac1.style.background = "#cccccc";
		// window.location.href="#pack1";
	}
	else if(window.location.search == "?action=shadowpac2"){
		pac2.style.boxShadow = "0px 0px 12px pink";
		pac2.style.border = "solid 1px pink";
		pac2.style.background = "#cccccc";
		window.location.href="#pack1";
	}
	else if(window.location.search == "?action=shadowpac3"){
		pac3.style.boxShadow = "0px 0px 12px pink";
		pac3.style.border = "solid 1px pink";
		pac3.style.background = "#cccccc";
		window.location.href="#pack2";
	}
}


