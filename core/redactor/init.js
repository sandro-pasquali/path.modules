path
.open("module/core/redactor")
.ready(function() {
	var params = this.params;
	this.$view.redactor({
		air			: params.air === void 0 ? true : params.air === "true" ? true : false,
		airButtons 	: params.buttons || [
				"formatting",
				"|",
				"bold",
				"italic"
		],
		s3: 'your-server-side-script.php'
	});
});