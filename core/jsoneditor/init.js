"use strict";

path
.open('_/module/core/jsoneditor')
.ready(function() {

	var container = this.$view;
//
	var editor = new jsoneditor.JSONEditor(container.get(0));

	var json = {
	  'array': [1, 2, 3],
	  'boolean': true,
	  'null': null,
	  'number': 123,
	  'object': {'a': 'b', 'c': 'd'},
	  'string': 'Hello World'
	};
	editor.set(json);

    //var json = editor.get();
    //alert(JSON.stringify(json, null, 2));

})

