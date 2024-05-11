class Magic {

	static staticHTML = document.body.innerHTML;
	static docElements = document.getElementsByTagName("*");
	static contentType ="application/json;charset=UTF-8";
	static allowOrigin = '*';
	
	init = { 
		name: "Magic.js",
		version:"1.000011",
		copyright: "(c) 2024 flaneurette",
		license: "MIT",
		instanceid: 1e5
	}
	
	log(msg) {
		console.log(msg);
	}

	load(list) {
		if(!Object(list)) {
			this.log(this.msg['initialize']);
			return false;
		} else {
			let i = 0;
			let data = list.data
			let method = list.methods;
			let events = list.events;
			if(data) {
				for(const [key, value] of Object.entries(data)) {
					if(Array.isArray(value)) {
					this.nodes('bindLoop', key, value);
					this.nodes('bindForms', key, value);
					this.nodes('bindOn', key, value);
					} else {
					// Parse nodes
					this.nodes('replaceNodeValue', key, value);
					this.nodes('bindAttributesNode', key, value);
					this.nodes('bindLogic', key, value);
					this.nodes('bindFunctions', key, value);
					this.nodes('bindCurtains', key, value);
					this.nodes('bindOn', key, value);
					}
				}
			}
		}
	}
	
	getElements() {
		var docElements = document.getElementsByTagName("*")
		return docElements;
	}

	nodeParentList() {
		let parentList = [];
		var docElements = this.getElements();
		for(var i = 0; i < docElements.length; i++) {
			parentList.push(docElements[i]);
		}
		return parentList;
	}

	nodeChildren(parents) {
		let childList = [];
		for(var i = 0; i < parents.childNodes.length; i++) {
			childList.push(parents.childNodes[i]);
		}
		return childList;
	}

	getAtt(node,part) {
		let att = null;
		if(node.getAttribute('magic:' + part) !== null) {
			return node.getAttribute('magic:' + part);
			} else if(node.getAttribute('m:' + part) !== null) {
			return node.getAttribute('m:' +part);
			} else if(node.getAttribute(':' + part) !== null) {
			return node.getAttribute(':' +part);
			} else {
			return att;
		}
	}
	
	clone(list, id) {
		if(id === null) {
			return false;
		} else {
			const parentItem = document.getElementById(id).parentNode;
			let docItem = document.getElementById(id);
			let docClone = docItem.cloneNode(true);

			for(let i = 0; i < list.length; i++) {
				parentItem.appendChild(docClone);
			}
		}
	}

	isVisible(id) {
		try {
			if(document.getElementById(id).style.display == "block") {
				document.getElementById(id).style.display = "none";
			} else if(document.getElementById(id).style.display == "none") {
				document.getElementById(id).style.display = "block";
			} else {}
		} catch (e) {}
	}
	
	bindClass(node, find, value) {
		if(node.getAttribute('magic:class') !== null) {
			let att = node.getAttribute('magic:class');
			if(att.toString() === find.toString()) {
				node.className = value;
			}
		}
		if(node.getAttribute('m:class') !== null) {
			let att = node.getAttribute('m:class');
			if(att.toString() === find.toString()) {
				node.className = value;
			}
		}
		if(node.getAttribute(':class') !== null) {
			let att = node.getAttribute(':class');
			if(att.toString() === find.toString()) {
				node.className = value;
			}
		}
	}

	bindId(node, find, value) {
		if(node.getAttribute('magic:id') !== null) {
			let att = node.getAttribute('magic:id');
			if(att.toString() === find.toString()) {
				node.id = value;
			}
		}
		if(node.getAttribute('m:id') !== null) {
			let att = node.getAttribute('m:id');
			if(att.toString() === find.toString()) {
				node.id = value;
			}
		}
		if(node.getAttribute(':id') !== null) {
			let att = node.getAttribute(':id');
			if(att.toString() === find.toString()) {
				node.id = value;
			}
		}
	}

	drawCurtains() {
		var docElements = document.getElementsByTagName("*");
		for(var i = 0; i < docElements.length; i++) {
			if(docElements[i].getAttribute('magic:curtain') !== null) {
				let curtain = docElements[i].getAttribute('magic:curtain');
				docElements[i].style = 'display:block;';
			}
		}
	}

	bindCurtains(node, find, value) {
		let att = this.getAtt(node,'click');
		var docElements = this.nodeParentList();
		for(var i = 0; i < docElements.length; i++) {
			if(node.getAttribute('magic:curtain') !== null) {
				let curtain = node.getAttribute('magic:curtain');
				node.style = 'display:none;';
			}
			if(node.getAttribute('m:curtain') !== null) {
				let curtain = node.getAttribute('m:curtain');
				node.style = 'display:none;';
			}
			if(node.getAttribute(':curtain') !== null) {
				let curtain = node.getAttribute(':curtain');
				node.style = 'display:none;';
			}
		}
		if(node.getAttribute('magic:onclick') !== null || node.getAttribute('m:onclick') !== null || node.getAttribute(':onclick') !== null) {
			node.addEventListener('click', this.drawCurtains, false);
		}
	}

	has(value) {
		if(value) {
			if(value.indexOf("'") != -1) {
				let pieces = value.split('\'');
				return pieces[1];
			}
		}
	}
	
	bindFunctions(node, find, value) {
		let att = this.getAtt(node,'click');
		var docElements = document.getElementsByTagName("*");
		if(att !== null) {
			if(find == 'count') {
				node.addEventListener('click', function() {
					for(var i = 0; i < docElements.length; i++) {
						if(docElements[i].getAttribute(':id') !== null) {
							let attribute = docElements[i].getAttribute(':id');
							docElements[i].innerText = (Number(docElements[i].innerText) + 1);
						}
					}
				});
			}
		}
	}
	
	bindOn(node, find, value) { 
		let att = this.getAtt(node,'click');
		if(node.getAttribute('magic:click') !== null || node.getAttribute('m:click') !== null || node.getAttribute(':click') !== null) {
			if(att !== null) {				
				node.addEventListener('click', function() {
				    let statics = Magic.staticHTML;
					let findMethod = statics.match(/(:click|m:click|magic:click)\s*=\s*("(.*)"|'(.*)')(\s*|\+)/);
					if(findMethod !== null) {
						let calledMethod = findMethod[3];
						if(calledMethod !== null) {
							// PARSE THE FUNCTION VALUES HERE
							let processClick = new Function(calledMethod);
							processClick.apply();
						}
					}
					
				});
			}
		}
	}
	
	bindIf(node, find, value) {
		let att = this.getAtt(node,'if');
			if(att !== null) {
				// functions
				if(att.indexOf('.') != -1) {
					let pieces = att.split('.');
					if(pieces.length > 0) {
						if(pieces.indexOf('has')) {
							let key = this.has(pieces[1]).toString();
							if(value.indexOf(key) != -1) {
								node.style = 'display: block';
							} else {
								node.style = 'display: none;';
							}
						}
					}
				} else if(att.search("/\s/")) {
					// operators
					let toEval = null,
						key = null,
						opp = '';
					let pieces = att.split("\s");
					node.style = 'display: none;';
					for(let i = 0; i < pieces.length; i++) {
						if(find == pieces[i]) {
							opp += pieces[i];
						}
					}
				} else {}
			}
		return;
	}
	
	bindForms(node, find, values) {
		let att = this.getAtt(node,'form');
		if(att !== null) {
			let parents = document.getElementById(att);
			let options = document.createElement('form');
			let j=0;
			for(let key in values) {
				let arr = values[key];
				if(arr.type == 'form') {
					options.name = arr.name;
					options.action = arr.action;
					options.method = arr.method;
					if(arr.enctype) { 
					options.enctype = arr.enctype
					}
				} 
				if(arr.type == 'text') {
					let opt = document.createElement('input');
					let label = document.createElement('label');
					label.innerHTML = arr.label;
					opt.type = arr.type;
					opt.name = arr.name;
					opt.value = arr.value;
					if(arr.placeholder) {
						opt.placeholder = arr.placeholder;
					}
					if(arr.required) {
						opt.required = arr.required;
					}
					options.appendChild(label);
					options.appendChild(opt);
				}
				if(arr.type == 'checkbox') {
					let opt = document.createElement('input');
					let label = document.createElement('label');
					label.innerHTML = arr.label;
					opt.type = arr.type;
					opt.name = arr.name;
					opt.checked = arr.checked;
					if(arr.required) {
						opt.required = arr.required;
					}
					if(arr.id) {
						opt.id = arr.id;
					}
					if(arr.className) {
						opt.className = arr.className;
					}
					options.appendChild(label);
					options.appendChild(opt);
				}
				if(arr.type == 'hidden') {
					let opt = document.createElement('input');
					opt.type = arr.type;
					opt.name = arr.name;
					opt.value = arr.value;
					options.appendChild(opt);
				}
				if(arr.type == 'textarea') {
					let opt = document.createElement('textarea');
					let label = document.createElement('label');
					label.innerHTML = arr.label;
					opt.name = arr.name;
					opt.value = arr.value;
					if(arr.placeholder) {
						opt.placeholder = arr.placeholder;
					}
					if(arr.required) {
						opt.required = arr.required;
					}
					if(arr.id) {
						opt.id = arr.id;
					}
					if(arr.className) {
						opt.className = arr.className;
					}
					options.appendChild(label);
					options.appendChild(opt);
				}		
				if(arr.type == 'submit') {
					let opt = document.createElement('input');
					opt.type = arr.type;
					opt.name = arr.name;
					opt.value = arr.value;
					options.appendChild(opt);
				}							
				j++;
			}	
			parents.appendChild(options);
		}
	}

	loop(node, find, values) {
		let att = this.getAtt(node,'loop');
		if(att != null) {
				let c = node.children[0];
				let h = c.innerHTML;
				let object = Object.entries(values);
				let len = object.length;
				for(let i = 0; i < len; i++) {
					let k = Object.keys(object[i][1]);
					let v = Object.values(object[i][1]);
					c.innerHTML = h.replace("magic1234567890",""); // DOM bug
					for(let j=0; j< v.length;j++) {
						if(c.innerHTML) {
							c.innerHTML = c.innerHTML.replace("{{"+k[j]+"}}",v[j]);
						}
					}
					node.append(c);
					c = c.cloneNode(true);	
				}
		}
	}
	
	nodes(method, find, value) {
		// Parent nodes.
		var docElements = this.nodeParentList();
		for(var i = 0; i < docElements.length; i++) {
			if(method == 'bindForms') {
				this.bindForms(docElements[i], find, value);
			}
			if(method == 'bindCurtains') {
				this.bindCurtains(docElements[i], find, value)
			}
			if(method == 'bindLoop') {
				this.loop(docElements[i], find, value)
			}
			if(method == 'bindFunctions') {
				this.bindFunctions(docElements[i], find, value)
			}
			if(method == 'bindLogic') {
				this.bindIf(docElements[i], find, value)
			}
			if(method == 'bindOn') {
				this.bindOn(docElements[i], find, value)
			}		
			if(method == 'bindAttributesNode') {
				this.bindClass(docElements[i], find, value)
				// this.bindId(docElements[i], find, value)
			}
			if(method == 'findAttributesNode') {
				if(docElements[i].hasAttribute("magic:for")) {
					this.log(true);
				}
			}
			// Childnodes.
			var docChildren = this.nodeChildren(docElements[i]);
			for(var j = 0; j < docChildren.length; j++) {
				if(method == 'replaceNodeValue') {
					if(docChildren[j].nodeType === 3) {
						const regex = new RegExp("{{\\s*" + find+"[0-9]*\\s*}}", "gmi");
						docChildren[j].nodeValue = docChildren[j].nodeValue.replace(regex, value);
					}
				}

			}
		}
	}	

	duplicatearray(a,b) {
		a.length = 0;
		a.push.apply(a, b);
		return a;
	}
	
	parseJSON(uri) {
	 this.fetchJSON(uri,function(response) {
		let obj =  JSON.parse(response);
		return obj;
	 });
	}

	getData(uri) {
		let req = new XMLHttpRequest();
		req.open("GET", uri, true);
		req.withCredentials = true;
		req.setRequestHeader('Access-Control-Allow-Origin', Magic.allowOrigin);
		req.setRequestHeader("Content-Type", Magic.contentType);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				return JSON.parse(req.responseText);
			}
		}
		req.send();
	}
	
	fetchJSON(uri,callback) {
		let req = new XMLHttpRequest();
		req.open("GET", uri, true);
		req.withCredentials = true;
		req.setRequestHeader('Access-Control-Allow-Origin', Magic.allowOrigin);
		req.setRequestHeader("Content-Type", Magic.contentType);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				callback(req.responseText);
			}
		}
		req.send(null);
	}
	
	msg = {
		initialize: "MH: Cannot initialize a non-object.",
		enumerate: "MH: Could not enumerate global object."
	}
}
