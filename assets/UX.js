class UX {

	static contentType = "application/json;charset=UTF-8";
	static asyncType = "application/x-www-form-urlencoded; charset=UTF-8";
	static cacheControl = "no-cache";
	static allowOrigin = '*';
	static thread = 0;
	static array = [];

	init = {
		name: "UX.js",
		version: "1.160",
		description: "A lightweight JavaScript framework",
		copyright: "(c) 2024 flaneurette",
		license: "GNU",
		homepage: "https://github.com/flaneurette/UX.js",
		instanceid: Date.now()
	}
	
	load(config) {
		
		if (!this.isValidObject(config)) {
			this.log(this.Message['initialize']);
			return false;
		}

		const { data, methods, events } = config;

		if (data) {
			this.initializeData(data,methods);
			this.initializeComponents(data);
			this.initializeDevTools(data);
		}
		Reflect.preventExtensions(data);
	}

	initializeData(data,methods) {
		this.parseNodes(data);
		this.parseFunctions(data, methods);
	}

	initializeComponents(data) {
		this.nodes('renderComponents', data);
		this.nodes('routeComponents', data);
	}

	initializeDevTools(data) {
		if (Reflect.has(data, "devtools")) {
			this.nodes('devtools', data);
		}
	}

	nodes(method, find, value, data = null, methods = null, callback = null) {
		const documentElements = this.nodeParentList();
		const methodMap = {
				renderComponents: this.renderComponents,
				routeComponents: this.routeComponents,
				bindSpinner: this.bindSpinner,
				bindFlip: this.bindFlip,
				bindActive: this.bindActive,
				bindSelect: this.bindSelect,
				bindShow: this.bindShow,
				bindHide: this.bindHide,
				createForm: this.createForm,
				bindCurtains: this.bindCurtains,
				bindLoop: this.loop,
				bindAttributesNode: this.bindClass,
				bindFlex: this.bindFlex,
				bindMenu: this.bindMenu,
				bindToggle: this.bindToggle,
				bindVoid: this.bindVoid,
				bindPrevent: this.bindPrevent,
				bindAsync: this.bindAsync,
				devtools: this.bindDevtool,
				bindAnimate: this.bindAnimate,
				bindCascade: this.bindCascade,
				bindLazyImg: this.bindLazyImg,
				bindLazyLoad: this.bindLazyLoad,
				bindUri: this.bindUri,
				bindHamburger: this.bindHamburger,
				bindDarkMode: this.bindDarkMode,
				bindIntoView: this.bindIntoView,
				bindFade: this.bindFade,
				bindClose: this.bindClose,
				bindView: this.bindView,
				bindSwitch: this.bindSwitch,
				bindWheel: this.bindWheel,
				bindScroll: this.bindScroll
		};
		for (let index = 0; index < documentElements.length; index++) {
			const element = documentElements[index];

			if (methodMap[method]) {
				methodMap[method].call(this, element, find, value);
				} else {
				switch(method) { 
					case 'progress': 
					this.progress(element, data, methods, find, value); 
					break;
					case 'bindFunctions': 
					this.bindFunctions(element, data, find, value); 
					break;
					case 'bindLogic': 
					this.bindIf(element, find, value); 
					break;
					case 'bindMethods': 
					this.bindMethods(element, data, methods, find, value); 
					break;
					case 'bindHandler': 
					this.bindHandler(element, data, methods, find, value); 
					break;
				}
			}
			
			if (method === "replaceNodeValue") {
				this.nodeChildren(element).forEach(child => {
					if (child.nodeType === Node.TEXT_NODE) {
						child.nodeValue = child.nodeValue.replace(new RegExp(`{{\\s*${find}[0-9]*\\s*}}`, "gi"), value);
					}
				});
			}
		}
	}

	dom(id, method, value = null) {

		const globalActions = {
			query: () => document.querySelector(value),
			queryall: () => document.querySelectorAll(value),
			elements: () => document.getElementsByTagName(value),
			create: () => document.createElement(value),
			document: () => document.all,
			location: () => window.location.href,
			innerheight: () => window.innerHeight,
			innerwidth: () => window.innerWidth
		};

		if (method in globalActions) return globalActions[method]();

		if (!id) return null;
		let element = document.getElementById(id);
		if (!element) return null;

		const actions = {
			id: () => element,
			get: () => element.value,
			set: () => (element.value = value),
			none: () => (element.style.display = "none"),
			block: () => (element.style.display = "block"),
			sethtml: () => (element.innerHTML = value),
			gethtml: () => element.innerHTML,
			innerHTML: () => document.body.innerHTML,
			display: () => (element.style.display = value),
			parent: () => element.parentNode,
			children: () => element.children
		};

		return actions[method] ? actions[method]() : null;
	}

	isValidObject(obj) {
		return typeof obj === 'object' && obj !== null;
	}
	
	isInt(value) {
		return (value === parseInt(value)) ? parseInt(value).toFixed(2) : parseFloat(value).toFixed(2);
	}
	
	getElements() {
		let documentElements = this.dom('', 'elements', '*');
		return documentElements;
	}

	nodeParentList() {
		let parentList = [];
		let documentElements = this.getElements();
		for (let i = 0; i < documentElements.length; i++) {
			parentList.push(documentElements[i]);
		}
		return parentList;
	}

	nodeChildren(parents) {
		let childList = [];
		for (let i = 0; i < parents.childNodes.length; i++) {
			childList.push(parents.childNodes[i]);
		}
		return childList;
	}

	getAtt(node, part) {
		const prefixes = ['ux:', ':'];
		for (const prefix of prefixes) {
			const attr = node.getAttribute(prefix + part);
			if (attr !== null) return attr;
		}
		return null;
	}

	attributeCheck(node, part) {
		let isAtrribute = (node.getAttribute('ux:' + part) !== null ||
			node.getAttribute(':' + part) !== null) ? true : false;
		return isAtrribute;
	}

	regEx(type) {
		if (type == 'spaces') return /\s+|\t+/gim;
		if (type == 'punctuation') return /,|'|"|\{|\}|\[|\]/gim;
	}

	cloneNodes(list, id) {
		if (id === null) {
			return false;
		} else {
			const parentItem = this.dom(id, 'parent');
			let docItem = this.dom(id, 'id');
			let docClone = docItem.cloneNode(true);
			for (let i = 0; i < list.length; i++) {
				parentItem.appendChild(docClone);
			}
		}
	}

	bindClass(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'class');
		if (nodeAtrribute !== null) {
			if (nodeAtrribute.toString() === find.toString()) node.classList.toggle(value);
		}
	}

	bindId(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'id');
		if (nodeAtrribute !== null) {
			if (nodeAtrribute.toString() === find.toString()) node.id = value;
		}
	}

	drawCurtains() {
		let documentElements = this.dom('', 'elements', '*');
		for (let i = 0; i < documentElements.length; i++) {
			if (documentElements[i].getAttribute(':curtain') !== null) {
				documentElements[i].hidden = false;
			}
		}
	}

	bindCurtains(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'click');
		let documentElements = this.nodeParentList();
		for (let i = 0; i < documentElements.length; i++) {
			if (this.attributeCheck(documentElements[i], 'curtain') == true) documentElements[i].hidden = true;
		}
		if (nodeAtrribute !== null && this.attributeCheck(node, 'curtain') !== null) {
			node.addEventListener('click', () => {
				let documentElements = this.dom('', 'elements', '*');
				for (let i = 0; i < documentElements.length; i++) {
					if (documentElements[i].getAttribute(':curtain') !== null) {
						documentElements[i].hidden = false;
					}
				}
			}, false);
		}
	}

	bindDarkMode(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'darkmode');
		if (nodeAtrribute !== null) {
			if (localStorage.getItem("dark-mode") === "enabled") {
				document.body.classList.add("dark-mode");
			}
			node.addEventListener("click", () => {
				document.body.classList.toggle("dark-mode");
				if (document.body.classList.contains("dark-mode")) {
					localStorage.setItem("dark-mode", "enabled");
				} else {
					localStorage.setItem("dark-mode", "disabled");
				}
			});
		}
	}

	has(value) {
		if (value) {
			if (value.indexOf("'") != -1) {
				let pieces = value.split('\'');
				return Reflect.get(pieces, 1);
			}
		}
	}

	bindShow(node) {
		let nodeAtrribute = this.getAtt(node, 'hidden');
		if (nodeAtrribute !== null) {
			node.hidden = false;
		}
	}

	bindHide(node) {
		let nodeAtrribute = this.getAtt(node, 'hidden');
		if (nodeAtrribute !== null && nodeAtrribute == 'true') {
			node.hidden = true;
		}
	}

	bindVoid(node) {
		let nodeAtrribute = this.getAtt(node, 'void');
		if (nodeAtrribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
		}
	}

	bindView(node) {
		let nodeAtrribute = this.getAtt(node, 'view');
		if (nodeAtrribute !== null) {
			node.addEventListener('click', () => {
				let documentElement = this.dom(nodeAtrribute, 'id');
				documentElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			});
		}
	}

	bindScroll(node) {
		let nodeAtrribute = this.getAtt(node, 'scroll');
		if (nodeAtrribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
			node.addEventListener('click', () => {
				window.scroll({
					top: 0,
					left: 0,
					behavior: 'smooth'
				});
			});
		}
	}

	bindWheel(node) {
		let nodeAttribute = this.getAtt(node, 'wheel');
		if (nodeAttribute !== null) {
			let slideWhat = nodeAttribute.split(':');
			node.addEventListener('wheel', () => {
				let delta = 0;
				delta = event.deltaY;
				if (delta >= 1) {
					if (Reflect.get(slideWhat, 0) == 'height') {
						node.style.height = 0;
					} else {
						node.style.width = 0;
					}
				} else {
					if (Reflect.get(slideWhat, 0) == 'height') {
						node.style.height = Reflect.get(slideWhat, 1);
					} else {
						node.style.width = Reflect.get(slideWhat, 1);
					}
				}
				setTimeout(() => {
					node.hidden = true;
				}, 500);
			});
		}
	}

	bindSwitch(node) {
		let nodeAttribute = this.getAtt(node, 'switch');
		if (nodeAttribute !== null) {
			let switchWhat = nodeAttribute.split(':');
			node.addEventListener(Reflect.get(switchWhat, 0), () => {
				let switchId = Reflect.get(switchWhat, 1);
				node.setAttribute('id', switchId);
			});
		}
	}

	bindActive(node) {
		let nodeAtrribute = this.getAtt(node, 'active');
		let active = this.dom('', 'location');
		if (nodeAtrribute !== null) {
			if (nodeAtrribute.indexOf(':') != -1) {
				let pieces = nodeAtrribute.split(':');
				if (active.match(Reflect.get(pieces, 0))) {
					node.className = Reflect.get(pieces, 1).toString();
				}
			}
		}
	}

	bindSelect(node) {
		let nodeAtrribute = this.getAtt(node, 'select');
		if (nodeAtrribute !== null) {
			node.className = nodeAtrribute.toString();
		}
	}

	bindFlex(node) {
		let nodeAtrribute = this.getAtt(node, 'flex');
		if (nodeAtrribute !== null) {
			if (nodeAtrribute.indexOf(':') != -1) {
				let flexbox = nodeAtrribute.split(':');
				let flex = 'display:flex;';
				let flexdir = 'flex-direction:' + Reflect.get(flexbox, 1) + ';';
				if (Reflect.get(flexbox, 0) == 'true' ||
					Reflect.get(flexbox, 0) == '1' ||
					Reflect.get(flexbox, 0) == 'start' ||
					Reflect.get(flexbox, 0) == 'left') node.setAttribute("style", flex + flexdir);
				if (Reflect.get(flexbox, 0) == 'end' ||
					Reflect.get(flexbox, 0) == 'right') node.setAttribute("style", flex + 'justify-content: flex-end;' + flexdir);
				if (Reflect.get(flexbox, 0) == 'center') node.setAttribute("style", flex + 'justify-content: center;' + flexdir);
				if (Reflect.get(flexbox, 0) == 'bottom') node.setAttribute("style", flex + 'align-items: baseline;' + flexdir);
			}
		}
	}

	bindAnimate(node) {
		let nodeAtrribute = this.getAtt(node, 'animate');
		if (nodeAtrribute !== null) {
			if (nodeAtrribute.indexOf(':') != -1) {
				let f = nodeAtrribute.split(':');
				let keyframes = this.dom('', 'create', 'style');
				keyframes.textContent = '@keyframes ' + Reflect.get(f, 0) +
					'{ from { ' + Reflect.get(f, 5).toString() +
					': var(--from);} to {' + Reflect.get(f, 5).toString() +
					':var(--to);}}';
				document.body.appendChild(keyframes);
				node.style = 'position: relative; --from:' +
					Reflect.get(f, 3) + 'px; --to:' + Reflect.get(f, 4) +
					'px; animation: ' + Reflect.get(f, 0) + ' ' +
					Reflect.get(f, 2) + ' forwards; animation-timing-function: ' +
					Reflect.get(f, 1) + ';';
			}
		}
	}

	bindFade(node) {
		let nodeAtrribute = this.getAtt(node, 'fade');
		if (nodeAtrribute !== null) {
			let options = {
				threshold: 1.0,
			};
			let callback = (entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting === true) {
						let height = node.clientHeight;
						entry.target.setAttribute("class", nodeAtrribute);
					}
				});
			};
			let observer = new IntersectionObserver(callback, options);
			if (node.id) {
				let target = this.dom('', 'query', '#' + node.id);
				observer.observe(target);
			}
		}
	}

	bindIntoView(node) {
		let nodeAtrribute = this.getAtt(node, 'grow');
		if (nodeAtrribute !== null) {
			let options = {
				threshold: 1.0,
			};
			let callback = (entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting === true) {
						let height = node.clientHeight;
						entry.target.setAttribute("class", nodeAtrribute);
					}
				});
			};
			let observer = new IntersectionObserver(callback, options);
			if (node.id) {
				let target = this.dom('', 'query', '#' + node.id);
				observer.observe(target);
			}
		}
	}

	bindCascade(node, find) {
		let nodeAtrribute = this.getAtt(node, 'cascade');
		if (nodeAtrribute !== null) {
			let a = nodeAtrribute.split(':');
			const [type, index, height1, height2] = a;
			let childs = node.children;
			for (let i = 0; i < childs.length; i++) {
				if (type == 'menu') {
					if (i == index) {
						let styles = '';
						styles += 'position:fixed!important;';
						styles += 'z-index:' + (childs.length + 1) + ';';
						styles += 'height:' + height1 + 'px!important;';
						styles += 'width:100%;';
						node.children[i].setAttribute("style", styles);
					} else {
						let styles = '';
						styles += 'position:relative!important;';
						styles += 'z-index:' + (i + 2) + ';';
						styles += 'top:' + height2 + 'px;';
						node.children[i].setAttribute("style", styles);
					}
				} else {
					if (i == index) {
						let styles = '';
						styles += 'position:fixed!important;';
						styles += 'z-index:0;';
						styles += 'width:100%;';
						node.children[i].setAttribute("style", styles);
					} else {
						let styles = '';
						styles += 'position:relative!important;';
						styles += 'z-index:' + (i + 2) + ';';
						styles += 'top:' + height2 + 'px;';
						node.children[i].setAttribute("style", styles);
					}
				}
			}
		}
	}

	bindLazyLoad(node) {
		
		let nodeAtrribute = this.getAtt(node, 'lazyload');
		if (nodeAtrribute !== null) {
			
			let lazy = nodeAtrribute.split(':');
			
			node.style.opacity = "0"; 
			node.style.transform = "translateY(-10px)";
			node.style.transition = "opacity " + Reflect.get(lazy, 0) + " " + Reflect.get(lazy, 1), "transform "+ Reflect.get(lazy, 0) + " " +  Reflect.get(lazy, 1);
		   
			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.style.opacity = "1"; 
						entry.target.style.transform = "translateY(0)"; 
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.2 });
			if (node.id) {
				let target = this.dom('', 'query', '#' + node.id);
				observer.observe(target);
			}
		}
	}
			
	bindLazyImg(node, find) {
		let nodeAtrribute = this.getAtt(node, 'lazyimg');
		if (nodeAtrribute !== null) {
			let lazy = nodeAtrribute.split(':');
			let style = '';
			style += "background-color:" + Reflect.get(lazy, 0) + ";";
			style += "background-size: cover;";
			node.setAttribute("style", style);
			node.setAttribute("loading", "lazy");
		}
	}

	bindUri(node) {
		let nodeAtrribute = this.getAtt(node, 'link');
		if (nodeAtrribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
			node.addEventListener('click', () => {
				document.location = nodeAtrribute;
			});
		}
	}

	bindFlip(node) {
		let nodeAtrribute = this.getAtt(node, 'flip');
		if (nodeAtrribute !== null) {
			node.addEventListener("mouseover", () => {
				node.style.transform = "scaleX(-1)";
			});
			node.addEventListener("mouseleave", () => {
				node.style.transform = "scaleX(1)";
			});
		}
	}

	bindHamburger(node) {
		let nodeAtrribute = this.getAtt(node, 'hamburger');
		if (nodeAtrribute !== null && nodeAtrribute.indexOf(':') !== -1) {
			let pairs = nodeAtrribute.split(':');
			let width = Reflect.get(pairs, 1);
			let height = 10;
			let spacing = Reflect.get(pairs, 2);
			if (this.dom('uxcanvas', 'id') == null) {
				let canvas = this.dom('', 'create', 'canvas');
				node.append(canvas);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', width);
				canvas.setAttribute('id', 'uxcanvas');
				var c = canvas;
				var ctx = c.getContext("2d");
				ctx.strokeStyle = Reflect.get(pairs, 0);
				if (!spacing) spacing = 0;
				ctx.lineWidth = 2;
				ctx.moveTo(width, spacing);
				ctx.lineTo(0, spacing);
				ctx.stroke();
				ctx.moveTo(width, (spacing * 2));
				ctx.lineTo(0, (spacing * 2));
				ctx.stroke();
				ctx.moveTo(width, (spacing * 3));
				ctx.lineTo(0, (spacing * 3));
				ctx.stroke();
			}
		}
	}

	bindSpinner(node) {
		let nodeAtrribute = this.getAtt(node, 'spinner');
		if (nodeAtrribute !== null && nodeAtrribute.indexOf(':') !== -1) {
			if (this.dom('uxspinner', 'id') == null) {
				let pairs = nodeAtrribute.split(':');
				let width = Reflect.get(pairs, 0);
				let color = Reflect.get(pairs, 1);
				let canvas = this.dom('', 'create', 'canvas');
				node.append(canvas);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', width);
				canvas.setAttribute('id', 'uxspinner');
				const ctx = canvas.getContext("2d");
				let angle = 0;

				function drawSpinner() {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.beginPath();
					ctx.arc(width / 2, width / 2, width / 3, angle, angle + Math.PI * 1.5);
					ctx.lineWidth = 6;
					ctx.strokeStyle = color;
					ctx.lineCap = "round";
					ctx.stroke();

					angle += 0.1;
					requestAnimationFrame(drawSpinner);
				}
				drawSpinner();
			}
			window.addEventListener("load", () => {
				setTimeout(() => this.dom('uxspinner', 'none'), 200);
			});
		}
	}

	bindCSS(node) {
		let nodeAtrribute = this.getAtt(node, 'css');
		if (nodeAtrribute !== null) {
			node.style = nodeAtrribute;
		}
	}

	bindToggle(node) {
		let nodeAtrribute = this.getAtt(node, 'toggle');
		if (nodeAtrribute !== null && nodeAtrribute.indexOf(':') !== -1) {
			let nodeAtrribute = this.getAtt(node, 'toggle');
			let pairs = nodeAtrribute.split(':');
			let nodeId = this.dom(Reflect.get(pairs, 0), 'id');
			if (nodeAtrribute !== null && UX.thread == 0) {
				node.addEventListener('click', () => {
					let nodeAtrribute = node.getAttribute(':toggle');
					let pairs = nodeAtrribute.split(':');
					if (Reflect.get(pairs, 1) == 'in') {
						node.setAttribute(':toggle', Reflect.get(pairs, 0) + ':out:' + Reflect.get(pairs, 2));
						if (Reflect.get(pairs, 2)) {
							this.dom(Reflect.get(pairs, 0), 'id').classList.toggle(Reflect.get(pairs, 2));
						}
					}
					if (Reflect.get(pairs, 1) == 'out') {
						node.setAttribute(':toggle', Reflect.get(pairs, 0) + ':in:' + Reflect.get(pairs, 2));
						if (Reflect.get(pairs, 2)) {
							this.dom(Reflect.get(pairs, 0), 'id').classList.toggle(Reflect.get(pairs, 2));
						}
					}
				});
			}
			UX.thread++;
		}
		return true;
	}

	bindMenu(node) {
		let nodeAtrribute = this.getAtt(node, 'menu');
		if (nodeAtrribute !== null && nodeAtrribute.indexOf(':') !== -1) {
			let pairs = nodeAtrribute.split(':');
			if (Reflect.get(pairs, 1) == 'in') {
				let list = this.dom(Reflect.get(pairs, 0), 'id').children;
				for (let i = 0; i < list.length; i++) {
					list[i].setAttribute(':menu', nodeAtrribute);
				}
				this.dom(Reflect.get(pairs, 0), 'id').hidden = true;
				node.addEventListener('mouseover', () => {
					this.dom(Reflect.get(pairs, 0), 'id').hidden = false;
				});
			}
			if (Reflect.get(pairs, 1) == 'out') {
				node.addEventListener('mouseout', () => {
					let nodeAtrribute = node.getAttribute(':menu');
					if (nodeAtrribute !== null && nodeAtrribute.indexOf(':') !== -1) {
						let pairs = nodeAtrribute.split(':');
						this.dom(Reflect.get(pairs, 0), 'id').hidden = true;
					}
				});
			}
		}
	}

	bindFunctions(node, data, find, value) {

		let nodeAtrribute = this.getAtt(node, 'click');
		let documentElements = this.dom('', 'elements', '*');
		let countID, count, multiply, countdown, interval, clear, countvalue = 0;

		for (const [key, value] of Object.entries(data)) {
			if (key == 'id') countID = value;
			if (key == 'count') count = value;
			if (key == 'countvalue') countvalue = value;
			if (key == 'multiply') multiply = value;
			if (key == 'countdown') countdown = value;
			if (key == 'interval') interval = value;
			if (key == 'clear') clear = value;
		}

		if (nodeAtrribute !== null) {
			let counterNode = this.dom(countID, 'id');
			if (counterNode) {
				node.addEventListener('click', () => {
					var calc = Number(counterNode.innerText);
					if (nodeAtrribute == 'count++') counterNode.innerText = this.isInt((calc) + countvalue);
					if (nodeAtrribute == 'count--') counterNode.innerText = this.isInt((calc) - countvalue);
					if (nodeAtrribute == 'multiply') counterNode.innerText = this.isInt((calc) * multiply);
					if (nodeAtrribute == 'countdown') {
						let timer = setInterval(() => {
							counterNode.innerText = this.isInt(Number(counterNode.innerText) - countvalue);
							if (Number(counterNode.innerText) <= clear) clearInterval(timer);
						}, interval);
					}
				});
			}
		}
	}

	bindMethods(node, data, methods, find, value) {
		let process = new Function(methods);
		process.apply();
	}

	bindPrevent(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'prevent');
		if (nodeAtrribute !== null) {
			documentElements[j].addEventListener('submit', event => {
				event.preventDefault();
			});
		}
	}

	bindClose(node) {

		let nodeAtrribute = this.getAtt(node, ':close');
		if (nodeAtrribute !== null) {
			node.addEventListener('onclick', () => {
				this.dom(nodeAtrribute, 'id').hidden = true;
			});
		}
	}

	onImg(node, array) {
		const spaces = this.regEx('spaces');
		const punctuation = this.regEx('punctuation');
		let findMethod = node.getAttribute(':method');
		let current = findMethod[2];
		if (current !== null) {
			for (let i = 0; i < array.length; i++) {
				if (array[i][1].indexOf('img') !== -1 || array[i][1].indexOf('image') !== -1) {
					let img = findMethod.split(':');
					let imageDOM = this.dom(Reflect.get(img, 2), 'id');
					if (node.src) {
						imageDOM.setAttribute("src", node.src);
					}
				}
			}
		}
	}

	onImgFill(node, operators) {
		if (UX.thread <= 1 && operators.length >= 1) {
			const spaces = this.regEx('spaces');
			const punctuation = this.regEx('punctuation');
			let doc = this.dom('', 'document');
			let j = 0;
			for (let i = 0; i < doc.length; i++) {
				let findMethod = doc[i].getAttribute(':method');
				if (findMethod !== null) {
					let methods = findMethod.split(':');
					if (findMethod !== null) {
						let current = Reflect.get(methods, 2);
						let thumbs = this.dom(current, 'id');
						if (current !== null) {
							doc[i].setAttribute("src", operators[j][1].toString()
								.replaceAll(spaces, '').replaceAll(punctuation, ''));
							j++;
						}
					}
				}
			}
		}
	}

	onText(node, operators) {
		const spaces = this.regEx('spaces');
		const punctuation = this.regEx('punctuation');
		let op = operators[0].split('.');
		operators[0] = operators[0].toString().replaceAll(spaces, '');
		operators[1] = operators[1].toString().replaceAll(punctuation, '');
		op[1] = op[1].toString().replaceAll(spaces, '');
		node.innerHTML = node.innerHTML.replace('{{' + op[1] + '}}', operators[1]);
		node.innerHTML = node.innerHTML.replace(op[1], operators[1]);
	}

	bindHandler(node, data, methods, find, value) {
		let nodeAtrribute = this.getAtt(node, 'handler');
		if (nodeAtrribute !== null) {
			let handlers = nodeAtrribute.split(':');
			if (methods && Object(methods)) {
				for (let key in methods) {
					let funcs = methods[key];
					let pairs = funcs.toString();
					if (UX.thread <= 1) {
						node.addEventListener(Reflect.get(handlers, 0), () => {
							funcs.apply();
						});
					}
					UX.thread++;
				}
			}
		}
	}

	bindMethods(node, data, methods, find, value) {
		let nodeAtrribute = this.getAtt(node, 'method');
		let array = [];
		if (this.attributeCheck(node, 'method') == true) {
			if (nodeAtrribute !== null) {
				let methodhandler = nodeAtrribute.split(":");
				if (methods && Object(methods)) {
					for (let key in methods) {
						let funcs = methods[key];
						let pairs = funcs.toString();
						let lines = pairs.split("\n");
						for (let i = 0; i < lines.length; i++) {
							if (lines[i].indexOf('this.') !== -1 && lines[i].indexOf('=') !== -1 && (lines[i].indexOf('img') !== -1 ||
									lines[i].indexOf('image') !== -1)) {
								// image operation
								let operators = lines[i].split('=');
								array.push(operators);
							}
							// array elements
							if (lines[i].indexOf('UX.array') !== -1) {
								if (nodeAtrribute.indexOf('{{') == -1) {
									let clicks = 0;
									node.addEventListener('click', () => {
										let nodeAtrribute = this.getAtt(node, 'method');
										let methodhandler = nodeAtrribute.split(":");
										let obj = Object.assign({}, methodhandler.splice(3, methodhandler.length));
										if (Object.keys(obj).length > 1) {
											UX.array.push(obj);
										}
									});
								}
							}
						}
					}
					UX.counter++;
					// autofill any images
					if (array.length >= 1) {
						this.onImgFill(node, array);
					}
				}
				// click event methods
				if (methodhandler[0] == 'mouseover' || methodhandler[0] == 'click') {
					node.addEventListener(methodhandler[0], () => {
						let statics = this.dom('', 'innerHTML');
						let findMethod = node.getAttribute(':method');
						if (findMethod !== null) {
							if (methods && Object(methods)) {
								for (let key in methods) {
									let funcs = methods[key];
									let pairs = funcs.toString();
									let lines = pairs.split("\n");
									for (let i = 0; i < lines.length; i++) {
										// operators
										if (lines[i].indexOf('this.') !== -1 && lines[i].indexOf('=') !== -1) {
											let operators = lines[i].split('=');
											if (operators[1].indexOf('.') !== -1) {
												// expressions 
												array.push(operators);
											} else {
												// text processing
												this.onText(node, operators);
											}
										}
									}
									// images
									this.onImg(node, array);
									// method functions
									funcs.apply();
								}
							}
						}
					});
				}
			}
		}
	}

	bindIf(node, find, value) {
		let nodeAtrribute = this.getAtt(node, 'if');
		if (nodeAtrribute !== null) {
			// functions
			if (nodeAtrribute.indexOf('.') != -1) {
				let pieces = nodeAtrribute.split('.');
				if (pieces.length > 0) {
					if (pieces.indexOf('has')) {
						let key = this.has(Reflect.get(pieces, 1)).toString();
						node.hidden = (value.indexOf(key) != -1) ? false : true;
					}
				}
			} else if (nodeAtrribute.search("/\s/")) {
				// operators
				let toEval = null,
					key = null,
					opp = '';
				let pieces = nodeAtrribute.split("\s");
				node.hidden = true;
				for (let i = 0; i < pieces.length; i++) {
					if (find == pieces[i]) {
						opp += pieces[i];
					}
				}
			} else {}
		}
		return;
	}

	loop(node, find, values) {
		let nodeAttribute = this.getAtt(node, 'loop');
		let zebra = this.getAtt(node, 'zebra');

		if (nodeAttribute !== null && nodeAttribute === find) {
			let nodeChildren = node.children[0];
			let originalHTML = nodeChildren.innerHTML;
			let loopEntries = Object.entries(values);

			for (let i = 0; i < loopEntries.length; i++) {
				let data = loopEntries[i][1];
				let updatedHTML = originalHTML;

				for (let key in data) {
					updatedHTML = updatedHTML.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
				}

				let newElement = nodeChildren.cloneNode(true);
				newElement.innerHTML = updatedHTML;
				newElement.setAttribute('id', find + i);
				node.appendChild(newElement);
			}

			node.removeChild(node.children[0]);

			let imageElements = this.dom('', 'queryall', 'img');
			if (imageElements) {
				imageElements.forEach(img => {
					let imageAttr = img.getAttribute(':image');
					if (imageAttr) img.setAttribute('src', imageAttr);
				});
			}

			if (zebra) {
				let [className, mod] = zebra.split(':');
				mod = parseInt(mod, 10) || 2;
				Array.from(node.children).forEach((child, index) => {
					if (index % mod !== 0) child.classList.toggle(className);
				});
			}
		}
	}


	routeComponents(node, data) {
		let attribute = this.getAtt(node, 'route');
		if (!attribute) return;
		let [routeId, requestUri] = attribute.split(':');
		if (!UX.array.includes(routeId)) {
			UX.array.push(routeId);
		}
		node.addEventListener('click', async () => {

			let routeNode = this.dom(routeId, 'id');

			UX.array.forEach(id => {
				let el = this.dom(id, 'id');
				if (el) el.hidden = true;
			});

			if (routeNode) {
				routeNode.hidden = false;

				try {
					let options = new Headers();
					options.append("Cache-Control", UX.cacheControl || "no-cache");

					let response = await fetch(requestUri, {
						headers: options
					});
					let content = await response.text();

					routeNode.innerHTML = content;

					this.renderHTML(routeNode, data);
					this.parseNodes(data);
				} catch (error) {
					console.error("Routing fetch failed:", error);
				}
			}
		});
	}


	renderComponents(node, data) {
		UX.thread = 0;
		let attribute = this.getAtt(node, 'render');
		let requestUri = attribute;
		if (requestUri !== null && requestUri.trim() !== '') {
			let options = {
				headers: new Headers({
					"Cache-Control": UX.cacheControl
				})
			};
			return fetch(requestUri, options)
				.then(file => file.text())
				.then(response => {
					node.setHTMLUnsafe(response);
					return this.renderHTML(node, data);
				})
				.then(() => this.parseNodes(data))
				.finally(() => {
					this.nodes('bindToggle');
				});

		} else {
			return Promise.resolve().finally(() => {
				UX.thread = 0;
			});
		}
	}

	renderHTML(node, data) {
		let content = node.innerHTML;
		for (const [key, value] of Object.entries(data)) {
			if (Array.isArray(value)) {
				value.forEach(item => {
					for (const [itemKey, itemValue] of Object.entries(item)) {
						content = content.replaceAll(`{{${itemKey}}}`, itemValue);
					}
				});
			} else {
				content = content.replaceAll(`{{${key}}}`, value);
			}
		}
		node.innerHTML = content;
	}

	fetch(obj) {
		if (!obj || typeof obj !== "object") return;

		let documentElements = this.nodeParentList();

		documentElements.forEach(parent => {
			let documentChildren = this.nodeChildren(parent);

			documentChildren.forEach(child => {
				if (child.nodeType === 3 && child.nodeValue) {
					let textContent = child.nodeValue;

					for (const [key, value] of Object.entries(obj)) {
						if (typeof value === "object") {
							for (const [key1, value1] of Object.entries(value)) {
								textContent = textContent.replaceAll(`{{${key1}}}`, value1);
							}
						}
					}
					child.nodeValue = textContent;
				}
			});
		});
	}

	progress(node) {
		let attribute = this.getAtt(node, 'progress');
		if (attribute !== null) {
			let [totalLoad, progressBarId] = attribute.split(':');
			let progressBar = this.dom('', 'query', '#' + progressBarId);

			function updateProgress() {
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
				let progress = (scrollTop / scrollHeight) * 100;
				progressBar.style.width = progress + "%";
			}
			window.addEventListener("scroll", updateProgress);
			document.addEventListener("DOMContentLoaded", function() {
				progressBar.style.width = "50%";
			});

			window.addEventListener("load", function() {
				progressBar.style.width = "100%";
				setTimeout(() => progressBar.style.display = "none", 500);
			});
		}
	}

	async (requestUri, method, callback) {
		let nodeAtrribute = false;
		let documentElements = this.nodeParentList();
		for (let j = 0; j < documentElements.length; j++) {
			nodeAtrribute = this.getAtt(documentElements[j], 'async');
			if (nodeAtrribute !== null) {
				documentElements[j].addEventListener('submit', event => {
					event.preventDefault();
					let parentList = [];
					let documentElements1 = this.dom('', 'elements', '*');
					for (let i = 0; i < documentElements1.length; i++) {
						if (documentElements1[i].getAttribute(':async') == 'true') {
							let children = documentElements1[i].children;
							let requestDocument = new XMLHttpRequest();
							let data = [];
							data.push('UXAsync=true');
							for (let i = 0; i < children.length; i++) {
								if (children[i].value != '' && children[i].name !== null && children[i].value) {
									data.push('&' + children[i].name + '=' + encodeURIComponent(children[i].value.toString()));
								}
							}
							requestDocument.open("POST", requestUri, true);
							requestDocument.withCredentials = true;
							requestDocument.setRequestHeader('Access-Control-Allow-Origin', UX.allowOrigin);
							requestDocument.setRequestHeader('Content-Type', UX.asyncType);
							requestDocument.onreadystatechange = () => {
								if (requestDocument.readyState == 4 && requestDocument.status == 200) {
									if (requestDocument.responseText) {
										callback(requestDocument.responseText);
									}
								}
							}
							requestDocument.send(data);
						}
					}
				});
			}
		}
	}

	http(requestUri, method, callback) {
		let requestDocument = new XMLHttpRequest();
		requestDocument.open("GET", requestUri, true);
		requestDocument.withCredentials = true;
		if (typeof UX !== "undefined") {
			if (UX.contentType) {
				requestDocument.setRequestHeader("Content-Type", UX.contentType);
			}
		}
		requestDocument.setRequestHeader("Content-Type", UX.contentType);
		if (method == 'callback') {
			requestDocument.onreadystatechange = () => {
				if (requestDocument.readyState == 4 && requestDocument.status == 200) {
					callback(requestDocument.responseText);
				}
			}
			requestDocument.send();
		} else if (method == 'get') {
			requestDocument.onreadystatechange = () => {
				if (requestDocument.readyState == 4 && requestDocument.status == 200) {
					return JSON.parse(requestDocument.responseText);
				}
			}
			requestDocument.send();
		} else if (method == 'render') {
			requestDocument.onreadystatechange = () => {
				if (requestDocument.readyState == 4 && requestDocument.status == 200) {
					return requestDocument.responseText;
				}
			}
			requestDocument.onerror = () => reject(new Error("Network Error"));
			requestDocument.send();
		}

	}

	createElements(node, type, elementOption) {
		let opt = this.dom('', 'create', type);
		if (elementOption.type == 'text') {
			let opt = this.dom('', 'create', 'input');
		}
		if (elementOption.name) opt.name = elementOption.name;
		if (elementOption.type && elementOption.type != 'textarea') opt.type = elementOption.type;
		if (elementOption.value) opt.value = elementOption.value;
		if (elementOption.label) opt.innerHTML = elementOption.label;
		if (elementOption.placeholder) opt.placeholder = elementOption.placeholder;
		if (elementOption.required) opt.required = elementOption.required;
		if (elementOption.checked) opt.checked = elementOption.checked;
		node.appendChild(opt);
	}

	createForm(node, find, values) {
		let nodeAtrribute = this.getAtt(node, 'form');
		if (nodeAtrribute !== null) {
			let parents = this.dom('', 'create', 'div');
			node.appendChild(parents);
			let options = this.dom('', 'create', 'form');
			for (let key in values) {
				let elementOption = values[key];
				if (elementOption.type == 'form') {
					options.name = elementOption.name;
					options.action = elementOption.action;
					options.method = elementOption.method;
					if (elementOption.enctype) options.enctype = elementOption.enctype;
				}
				if (elementOption.type != 'textarea' && elementOption.type != 'submit') {
					this.createElements(options, 'label', elementOption);
					this.createElements(options, 'input', elementOption);
				} else if (elementOption.type == 'textarea') {
					this.createElements(options, 'label', elementOption);
					this.createElements(options, 'textarea', elementOption);
				} else if (elementOption.type == 'submit') {
					let opt = this.dom('', 'create', 'input');
					opt.type = elementOption.type;
					opt.name = elementOption.name;
					opt.value = elementOption.value;
					options.appendChild(opt);
				}
			}
			parents.appendChild(options);
		}
	}

	parseFunctions(data, method) {
		for (const [key, value] of Object.entries(data)) {
			if (Array.isArray(value)) {
				this.nodes('bindLoop', key, value);
				this.nodes('createForm', key, value);
				this.nodes('replaceNodeValue', key, value);
				this.nodes('bindAttributesNode', key, value);
				this.nodes('bindLogic', key, value);
				this.nodes('bindMethods', key, value, data, method);
				this.nodes('bindHandler', key, value, data, method);
			} else {
				this.nodes('bindActive');
				this.nodes('replaceNodeValue', key, value);
				this.nodes('bindAttributesNode', key, value);
				this.nodes('bindLogic', key, value);
				this.nodes('bindMethods', key, value, data, method);
				this.nodes('bindHandler', key, value, data, method);
			}
		}
	}

	parseNodes(data) {
		this.nodes('bindHamburger');
		this.nodes('bindActive');
		this.nodes('bindToggle');
		this.nodes('bindDarkMode');
		this.nodes('bindMenu');
		this.nodes('bindVoid');
		this.nodes('bindPrevent');
		this.nodes('bindSelect');
		this.nodes('bindFlex');
		this.nodes('bindShow');
		this.nodes('bindHide');
		this.nodes('bindCurtains');
		this.nodes('bindAnimate');
		this.nodes('bindLazyImg');
		this.nodes('bindLazyLoad');
		this.nodes('bindCascade');
		this.nodes('bindUri');
		this.nodes('bindIntoView');
		this.nodes('bindFade');
		this.nodes('bindClose');
		this.nodes('bindView');
		this.nodes('bindSwitch');
		this.nodes('bindWheel');
		this.nodes('bindScroll');
		this.nodes('bindSpinner');
		this.nodes('bindFlip');
		this.nodes('progress');
		this.nodes('bindFunctions', false, false, data);
	}

	bindDevtool(node) {
		if (!node) return;

		if (node.className && node.id) {
			node.setAttribute('title', `CLASS: ${node.className}, ID: ${node.id}`);
			node.style.border = '1px dashed green';
		} else if (node.className) {
			node.setAttribute('title', `CLASS: ${node.className}`);
			node.style.border = '1px dashed black';
		} else if (node.id) {
			node.setAttribute('title', `ID: ${node.id}`);
			node.style.border = '1px dashed red';
		} else {
			node.setAttribute('title', 'No ID or CLASS');
			node.style.border = '1px dashed gray';
		}
	}

	log(message) {
		console.log(message);
	}

	Message = {
		initialize: "UX: Cannot initialize a non-object.",
		enumerate: "UX: Could not enumerate global object."
	}
}