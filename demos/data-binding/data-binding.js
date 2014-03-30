path
.set('another.node', 10)
.open("activator")
.click(function() {
	path.set('another.node', +path.get('another.node') +1)
})
.open("/demo/select")
.change(function(data) {
	console.log(data)
})

var b = 0;
var i;
for(i=0; i < 10; i++) {
	b = b + i;
	path.set("testdata", {
		data : b
	});
	console.log("CHANGE HAPPENS");
}

