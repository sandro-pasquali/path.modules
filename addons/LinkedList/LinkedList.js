//	@spasquali@pathframework.com
//
//	MIT licensed, with Path framework.
//
(function() {

var counter	= 1;

var isObj = function(v) {
	return typeof v === "object";
};

var createId = function(data) {
	return isObj(data)
		? data.id !== void 0
			? data.id
			: ++counter
		: ++counter;
};

//	NOTE:
//	The listDef definition can override any object methods, though note that
//	doing so moves the new method into the object, and out of the prototype.
//	you should probably not change any methods other than the following:
//
path.List = function() {

	var first 	= null;
	var last 	= null;
	var list 	= {};
  	var lastResult;

  	//	The total node count.
  	//
    var count = 0;

	//	Note that we're looking for undefined (void 0). NULL doesn't flag this,
	//	being a valid return value (null pointer).
	//
	this.response = function(r) {
		if(r !== void 0) {
			lastResult = r;
		}

		return this;
	};

	this.value = function() {
		return lastResult;
	};

	this.first = function(v) {
		if(isObj(v)) {
			first = v;
			return this.response();
		}
		return first;
	};

	this.last = function(v) {
		if(isObj(v)) {
			last = v;
			return this.response();
		}
		return last;
	};

	this.item = function(k, v) {
		if(v === void 0) {
			return list[k];
		}

		list[k] = v;
		return this.response();
	};

	this.list = function() {
		return list;
	};

	this.count = function(d) {
		if(d) {
			count += d;
			return this.response();
		}
		return count;
	};

	this.clear = function() {
		var orig 	= list;
		count 		= 0;
		list 		= {};
		first		= null;
		last		= null;

		return this.response(orig);
	};
};


//	##toArray
//
//	Return the list as an array, maintaining list order.
//
//	@param	{Boolean}	[reverse]	Whether to reverse the returned array order.
//
List.prototype.toArray = function(reverse) {

	var arr = [];
	var cur = reverse ? this.last() : this.first();
	var cn;
	var cp;

	while(cur) {
		cn = cur.next();
		cp = cur.prev();
		arr.push({
			id		: cur.id(),
			data	: cur.data(),
			next	: cn ? cn.id() : cn,
			prev	: cp ? cp.id() : cp
		});
		cur = reverse ? cur.prev() : cur.next();
	}

	return arr;
};

//	##sort
//
List.prototype.sort = function(func) {

	var srt	= this.toArray().sort(func);
	var x	= srt.length;

	this.clear();

	//	Note that we maintain #id
	//
	while(x--) {
		this.setFirst(srt[x].data, srt[x].id);
	}

	return this.response();
};

//	##reverse
//
List.prototype.reverse = function() {

	var l = this.last();
	var f = this.first();
	var next;

	cur = f;

	while(cur) {
		next = cur.next();
		cur.next(cur.prev());
		cur.prev(next);

		cur = next;
	}

	this.last(f);
	this.first(l);
};

//	##indexOf
//
List.prototype.indexOf = function(func) {
	var f = this.find(func);
	return f ? f.lastKnownIndex : null;
};

//	##lastIndexOf
//
List.prototype.lastIndexOf = function(func) {
	var f = this.find(func, false, false, true);
	return f ? f.lastKnownIndex : null;
};

//	##atIndex
//
//	Will return the item at nth position.
//
//	@param	{Number}	targPos		The ordinal position in the list of the item.
//
List.prototype.atIndex = function(targPos) {
	var cnt	= this.count();
	var mid = parseInt(cnt / 2);
	var hi	= idx > mid;
	var cur = hi ? this.last() : this.first();
	var idx = hi ? cnt : 0;

	while(cur) {
		if(idx === targPos) {
			return cur;
		}
		cur = 	hi ? cur.prev() : cur.next();
		idx += 	hi ? -1 : 1;
	}

	return null;
};

//	#insertAtIndex
//
List.prototype.insertAtIndex = function(idx, data, id, before) {

	var cur 	= this.atIndex(idx);
	var item;

	if(!cur) {
		item = 	this.create(data);
		return before ? this.first(item) : this.last(item);
	}

	return before ? this.insertBefore(cur, data, id) : this.insertAfter(cur, data, id);
}

//	##create
//
List.prototype.create = function(data, id) {

	try {
		var n = new (function(data, id) {

			var next 	= null;
			var prev 	= null;

			//	When a #find operation is performed we are able to determine the order index
			//	of an item (as if the linked list was a normal array).  This prop is set
			//	internally on #find's for the use of #indexOf and other ops.  It is
			//	not maintained on inserts, so it can be considered immediately stale once
			//	the execution stack in which it is set terminates. For internal use.
			//
			//	@see	#find
			//
			this.lastKnownIndex = void 0;

			id = id || createId(data);

			this.id = function() {
				return id;
			};

			//	No arguments, returns data object.
			//	One argument, returns data value at #k.
			//	Two arguments, sets data #k = #v;
			//
			this.data = function(k, v) {

				if(arguments.length === 0) {
					return data;
				}

				if(v === void 0) {
					return data[k];
				}

				data[k] = v;
			};

			this.next = function(n) {
				if(isObj(n)) {
					next = n;
				} else {
					return next;
				}
			};

			this.prev = function(p) {
				if(isObj(p)) {
					prev = p;
				} else {
					return prev;
				}
			};
		})(data, id);

		//	This id forms the index of the item object in the #list collection.
		//	#list is a lookup table (when we can find by index), and is not a sorting index.
		//
		this.item(n.id(), n);

		return n;

	} catch(e) {
		throw "Unable to create node using data > " + data;
	}
};

//	##setFirst
//
List.prototype.setFirst = function(data, id) {

	var insert 	= this.create(data, id);
	var first	= this.first();

	insert.next(first);
	insert.prev(null);

	if(first) {
		first.prev(insert);
	}

	//	When count === 0 the list is empty, which means #insert becomes both
	//	first AND last.
	//
	if(this.count() === 0) {
		this.last(insert);
	}

	this.first(insert);

	this.count(1);

	return this.response();
};

//	##setLast
//
List.prototype.setLast = function(data, id) {
	var insert 	= this.create(data, id);
	var last	= this.last();

	insert.prev(last);
	insert.next(null);

	if(last) {
		last.next(insert);
	}

	this.last(insert);

	this.count(1);

	return this.response();
};

//	##insert
//
List.prototype.insert = function(targ, data, id, dir) {
	var insert 		= this.create(data, id);
	var pivot		= this.find(targ);

	//	Error if no pivot found.
	//
	if(!pivot) {
		return this.response(false);
	}

	var pivotDir = dir === 1 ? pivot.next() : pivot.prev();

	if(dir === 1) {
		pivotDir && pivotDir.prev(insert);
		insert.next(pivotDir);
		pivot.next(insert);
		insert.prev(pivot);
	} else {
		pivotDir && pivotDir.next(insert);
		insert.prev(pivotDir);
		pivot.prev(insert);
		insert.next(pivot);
	}

	this.count(1);

	return this.response();
};

//	##insertBefore
//
List.prototype.insertBefore = function(targ, data, id) {
	return this.insert(targ, data, id, -1);
};

//	##insertAfter
//
List.prototype.insertAfter = function(targ, data, id) {
	return this.insert(targ, data, id, 1);
};

//	##move
//
//	Move one (existing) item before or after another (existing) item.
//	Returns boolean success.
//
List.prototype.move = function(mover, pivot, before) {
	mover 	= this.find(mover);
	pivot	= this.find(pivot);

	if(!mover || !pivot) {
		return this.response(false);
	}

	mover = this.remove(mover).value();

	var data 	= mover.data();
	var id		= mover.id();

	return before ? this.insertBefore(pivot, data, id) : this.insertAfter(pivot, data, id);
};

//	##remove
//
List.prototype.remove = function(func) {
	var target 		= this.find(func);

	if(!target) {
		return this.response(false);
	}

	var targetNext 	= target.next();
	var targetPrev	= target.prev();
	var list		= this.list();

	if(targetPrev) {
		targetPrev.next(targetNext);
	} else {
		this.first(targetNext);
	}

	if(targetNext) {
		targetNext.prev(targetPrev);
	} else {
		this.last(targetPrev);
	}

	delete list[target.id()];

	this.count(-1);

	return this.response(target);
};

//	##find
//
List.prototype.find = function(func, all, startIndex, reverse) {

	var i;
	var ret;
	var idx;
	var inc;
	var current;

	if(isObj(func)) {
		return func;
	}

	//	Various ways to use #find. Usual is to pass a selective function.
	//	Can also send an item #id, which is handled here.
	//
	if(typeof func !== "function") {	
		return this.item(func) || null;
	}

	current = reverse ? this.last() : this.first();

	//	List is empty
	//
	if(!current) {
		return null;
	}

	ret = [];
	idx = reverse ? this.count() -1 : 0;
	inc	= reverse ? -1 : 1;

	startIndex = startIndex || idx;

	do {
		current.lastKnownIndex = void 0;
		if((reverse ? idx <= startIndex : idx >= startIndex) && func(current.data(), idx)) {
			current.lastKnownIndex = idx;
			if(all) {
				ret.push(current);
			} else {
				return current;
			}
		}

		idx += inc;

	} while(current = reverse ? current.prev() : current.next());

	return all ? ret : null;
};

//	##findAll
//
List.prototype.findAll = function(func, startIndex) {
	return this.find(func, 1, startIndex);
};

})();



