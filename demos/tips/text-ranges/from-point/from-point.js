
document.addEventListener('click', function onclick(e) {
	var r;
	if (document.caretRangeFromPoint) { // standard (WebKit)
	  r = document.caretRangeFromPoint(e.pageX, e.pageY);
	} else if (e.rangeParent) { // Mozilla
	  r = document.createRange();
	  r.setStart(e.rangeParent, e.rangeOffset);
	}
	
	var t = r.startContainer; // should be a text node
	var s = r.startOffset; // number of chars from the start of text
	var e = s;
	
	while (s > 0) {
	  s -= 1;
	  r.setStart(t, s);
	  if (/^\s/.test(r.toString())) {
		r.setStart(t, s += 1);
		break;
	  }
	}
	var l = t.nodeValue.length;
	while (e < l) {
	  e += 1;
	  r.setEnd(t, e);
	  if (/\s$/.test(r.toString())) {
		r.setEnd(t, e -= 1);
		break;
	  }
	}
	
	window.getSelection().addRange(r);
	alert(r.toString());

}, false);