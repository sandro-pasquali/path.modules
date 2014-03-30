"use strict";
//
path
.open("/login")
.submit(function(data) {
	path.send("/login", data.formData) // automatic form data > post data format
})
.error(function() {
	console.log('login error');
	console.log(this);
})
.receive(function(data) {
	console.log("success");
	console.log(data);
	console.log(this);
});
