//	Based on the work of Ondřej Žára here: http://jsfiddle.net/ondras/hYfN3/
//

this.$view.append('<table></table>');

var rows = this.param('rows') || 8;

//	Limit to A-Z
//
var cols = Math.min(this.param('cols') || 8, 26);

var module = this.$view.get(0);

var DATA 	= {};
var INPUTS;

this.events({
	'focusin' : function() {
		console.log('focused');
	}
});

var x;
var y = 0;

var computeAll = function() {
    INPUTS.forEach(function(elm) { 
    	try { 
    		elm.value = DATA[elm.id.toLowerCase()]; 
    	} catch(e) {} 
    });
};

for(; y < rows; y++) {

    var row = module.querySelector("table").insertRow(-1);
    
    for(x=0; x < cols; x++) {
    
    	//	Columns A-Z. Because of x/y axis labels, -1 (charCode(A) -1 = '@')
    	//
        var letter = String.fromCharCode("A".charCodeAt(0) +x -1);
        row.insertCell(-1).innerHTML = y && x ? "<input id='" + (letter + y) + "'/>" : y || letter;
    }
}

INPUTS = [].slice.call(module.querySelectorAll("input"));

INPUTS.forEach(function(elm) {

	var eid = elm.id.toLowerCase();

    elm.onfocus = function() {
        elm.value = localStorage[eid] || "";
    };
    
    elm.onblur = function() {
        localStorage[eid] = elm.value;
        computeAll();
    };
    
    var getter = function() {
    
        var value 		= localStorage[eid] || "";
        var floatVal	= parseFloat(value);
        
        if(value.charAt(0) === "=") {
        
        	//	Converts a formula =A1+B7+G8 to string-> `data.a1+data.b7+data.g8`
        	//	A 
        	//
        	var transp = value.substring(1).replace(/[a-z]+/gi, function(char) { 
        		return "data." + char.toLowerCase(); 
        	});
           	
           	return(new Function("data", "return " + transp + ";")(DATA));
        
        } else { 
        
        	return isNaN(floatVal) ? value : floatVal; 
        }
    };

    Object.defineProperty(DATA, eid, {
    	get	: getter
    });
});

computeAll();

