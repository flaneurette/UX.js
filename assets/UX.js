class UX {

	static contentType = "application/json;charset=UTF-8";
	static asyncType = "application/x-www-form-urlencoded; charset=UTF-8";
	static cacheControl = "no-cache";
	static allowOrigin = '*';

	constructor() {
		this.state = {};
		this.listeners = [];
		this.thread = 0;
		this.array = [];
	}
	
	init = {
		name: "UX.js",
		version: "1.170",
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
			Reflect.preventExtensions(data);
		}
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
			bindSlide: this.bindSlide,
			bindScroll: this.bindScroll
		};
		
		documentElements.forEach(elem => {
			
			if (methodMap[method]) {
				methodMap[method].call(this, elem, find, value);
				} else {
				switch(method) { 
					case 'progress': 
					this.progress(elem, data, methods, find, value); 
					break;
					case 'bindFunctions': 
					this.bindFunctions(elem, data, find, value); 
					break;
					case 'bindLogic': 
					this.bindIf(elem, find, value); 
					break;
					case 'bindMethods': 
					this.bindMethods(elem, data, methods, find, value); 
					break;
					case 'bindHandler': 
					this.bindHandler(elem, data, methods, find, value); 
					break;
				}
			}
			
			if (method === "replaceNodeValue") {
				this.nodeChildren(elem).forEach(child => {
					if (child.nodeType === Node.TEXT_NODE) {
						child.nodeValue = child.nodeValue.replace(new RegExp(`{{\\s*${find}[0-9]*\\s*}}`, "gi"), value);
					}
				});
			}
			
		});
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
		return this.dom('', 'elements', '*')
	}

	nodeParentList() {
		return [...this.getElements()];
	}

	nodeChildren(parents) {
		return [...parents.childNodes];
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
			list.forEach(elem => {
				parentItem.appendChild(docClone);
			});
		}
	}

	bindClass(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'class');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			if (nodeAttribute.toString() === find.toString()) node.classList.toggle(value);
		}
	}

	bindId(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'id');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			if (nodeAttribute.toString() === find.toString()) node.id = value;
		}
	}

	bindCurtains(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'click');
		if (!nodeAttribute) return;
		let documentElements = this.nodeParentList();
		documentElements.forEach( elem => {
			if (this.attributeCheck(elem, 'curtain') == true) elem.hidden = true;
		});
		if (nodeAttribute !== null && this.attributeCheck(node, 'curtain') !== null) {
			node.addEventListener('click', () => {
				let documentElements = this.dom('', 'elements', '*');
				for (let i = 0; i < documentElements.length; i++) {
					if (documentElements[i].getAttribute(':curtain') !== null) {
						(documentElements[i].hidden === false) ? documentElements[i].hidden = true:documentElements[i].hidden = false;
					}
				}
			}, false);
		}
	}

	bindDarkMode(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'darkmode');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
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
		let nodeAttribute = this.getAtt(node, 'hidden');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.hidden = false;
		}
	}

	bindHide(node) {
		let nodeAttribute = this.getAtt(node, 'hidden');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute == 'true') {
			node.hidden = true;
		}
	}

	bindVoid(node) {
		let nodeAttribute = this.getAtt(node, 'void');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
		}
	}

	bindView(node) {
		let nodeAttribute = this.getAtt(node, 'view');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.addEventListener('click', () => {
				let documentElement = this.dom(nodeAttribute, 'id');
				documentElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			});
		}
	}

	bindScroll(node) {
		let nodeAttribute = this.getAtt(node, 'scroll');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
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

	bindSlide(node) {

		const nodeAttribute = this.getAtt(node, 'slide');
		if (!nodeAttribute) return;

		const [dimension, value] = nodeAttribute.split(':');
		if (!dimension || !value) return;

		node.addEventListener('wheel', (event) => {
			event.preventDefault();
			const delta = event.deltaY;
			const targetProperty = dimension === 'height' ? 'height' : 'width';
			const newValue = delta > 0 ? '0px' : value;
			node.style[targetProperty] = newValue; 
			setTimeout(() => {
				node.style.display = 'none';
			}, 500);
		});
	}
	
	bindWheel(node) {

		const nodeAttribute = this.getAtt(node, 'wheel');
		if (!nodeAttribute) return;

		const [dimension, value] = nodeAttribute.split(':');
		if (!dimension || !value) return;

		node.addEventListener('wheel', (event) => {
			event.preventDefault();
			const delta = event.deltaY;
			const targetProperty = dimension === 'height' ? 'height' : 'width';
			const newValue = delta > 0 ? '0px' : value;
			node.style[targetProperty] = newValue; 
			setTimeout(() => {
				node.style.display = 'none';
			}, 500);
		});
	}

	bindSwitch(node) {
		let nodeAttribute = this.getAtt(node, 'switch');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			let switchWhat = nodeAttribute.split(':');
			node.addEventListener(Reflect.get(switchWhat, 0), () => {
				let switchId = Reflect.get(switchWhat, 1);
				node.setAttribute('id', switchId);
			});
		}
	}

	bindActive(node) {
		let nodeAttribute = this.getAtt(node, 'active');
		if (!nodeAttribute) return;
		let active = this.dom('', 'location');
		if (nodeAttribute !== null) {
			if (nodeAttribute.indexOf(':') != -1) {
				let pieces = nodeAttribute.split(':');
				if (active.match(Reflect.get(pieces, 0))) {
					node.className = Reflect.get(pieces, 1).toString();
				}
			}
		}
	}

	bindSelect(node) {
		let nodeAttribute = this.getAtt(node, 'select');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.className = nodeAttribute.toString();
		}
	}

	bindFlex(node) {
		const nodeAttribute = this.getAtt(node, 'flex');
		if (!nodeAttribute) return;

		const [alignment = 'start', flexDirection = 'row'] = nodeAttribute.split(':');

		const justifyMap = {
			'true': 'flex-start',
			'1': 'flex-start',
			'start': 'flex-start',
			'left': 'flex-start',
			'end': 'flex-end',
			'right': 'flex-end',
			'center': 'center',
			'bottom': 'baseline',
		};

		node.style.setProperty('display', 'flex', 'important');
		node.style.setProperty('flex-direction', flexDirection, 'important');

		if (alignment === 'bottom') {
			node.style.setProperty('align-items', 'baseline', 'important');
		} else {
			node.style.setProperty('justify-content', justifyMap[alignment] || 'flex-start', 'important');
		}
	}

	bindAnimate(node) {
		const nodeAttribute = this.getAtt(node, 'animate');
		if (!nodeAttribute) return;

		const [animationName, timingFunction, duration, from, to, property] = nodeAttribute.split(':');

		if (!animationName || !timingFunction || !duration || !from || !to || !property) {
			return;
		}

		let styleId = `keyframes-${animationName}`;
		if (!document.getElementById(styleId)) {
			const keyframes = document.createElement('style');
			keyframes.id = styleId;
			keyframes.textContent = `
				@keyframes ${animationName} {
					from { ${property}: ${from}px; }
					to { ${property}: ${to}px; }
				}
			`;
			document.head.appendChild(keyframes);
		}
		
		node.style.position = 'relative';
		node.style.animation = `${animationName} ${duration} forwards`;
		node.style.animationTimingFunction = timingFunction;
	}

	bindFade(node) {
		let nodeAttribute = this.getAtt(node, 'fade');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			let options = {
				threshold: 0.8,
			};
			let callback = (entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting === true) {
						let height = node.clientHeight;
						entry.target.setAttribute("class", nodeAttribute);
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
		let nodeAttribute = this.getAtt(node, 'grow');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			let options = {
				threshold: 1.0,
			};
			let callback = (entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting === true) {
						let height = node.clientHeight;
						entry.target.setAttribute("class", nodeAttribute);
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
		
		let nodeAttribute = this.getAtt(node, 'cascade');
		if (!nodeAttribute) return;
		let [type, index, height1, height2] = nodeAttribute.split(':');
		
		index = parseInt(index, 10);
		height1 = parseInt(height1, 10);
		height2 = parseInt(height2, 10);

		if (isNaN(index) || isNaN(height1) || isNaN(height2)) {
			return;
		}

		let children = Array.from(node.children);

		children.forEach((child, i) => {
			let styles = {};
			
			if (type === 'menu') {
				if (i === index) {
					styles = {
						position: 'fixed',
						zIndex: children.length + 1,
						height: `${height1}px`,
						width: '100%'
					};
				} else {
					styles = {
						position: 'relative',
						zIndex: i + 2,
						top: `${height2}px`
					};
				}
			} else {
				if (i === index) {
					styles = {
						position: 'fixed',
						zIndex: 0,
						width: '100%'
					};
				} else {
					styles = {
						position: 'relative',
						zIndex: i + 2,
						top: `${height2}px`
					};
				}
			}
			
			Object.entries(styles).forEach(([key, value]) => {
				child.style.setProperty(key, value, 'important');
			});
		});
	}

	bindLazyLoad(node) {
		
		let nodeAttribute = this.getAtt(node, 'lazyload');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			
			let lazy = nodeAttribute.split(':');
			
			node.style.opacity = "0"; 
			node.style.transform = "translateY(-10px)";
			node.style.transition = "opacity " + Reflect.get(lazy, 0) + " " + Reflect.get(lazy, 1) + " transform "+ Reflect.get(lazy, 0) + " " +  Reflect.get(lazy, 1);
		   
			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.style.opacity = "1"; 
						entry.target.style.transform = "translateY(0)"; 
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.8 });
			if (node.id) {
				let target = this.dom('', 'query', '#' + node.id);
				observer.observe(target);
			}
		}
	}
			
	bindLazyImg(node) {
		
		const nodeAttribute = this.getAtt(node, 'lazyimg');
		if (!nodeAttribute) return;

		const [color, imageUrl] = nodeAttribute.split(':');

		if (!imageUrl) {
			return;
		}

		if (node.tagName.toLowerCase() === 'img') {
			node.src = imageUrl;
			node.setAttribute("loading", "lazy");
			node.addEventListener("load", () => {
				node.src = imageUrl;
			});
		} else {
			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						node.style.backgroundImage = `url('${imageUrl}')`;
						node.style.backgroundColor = color;
						node.style.backgroundSize = "cover";
						node.style.backgroundPosition = "center";
						observer.unobserve(node);
					}
				});
			}, { threshold: 0.8 });

			observer.observe(node);
		}
	}

	bindUri(node) {
		let nodeAttribute = this.getAtt(node, 'link');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
			node.addEventListener('click', () => {
				document.location = nodeAttribute;
			});
		}
	}

	bindFlip(node) {
		let nodeAttribute = this.getAtt(node, 'flip');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.addEventListener("mouseover", () => {
				node.style.transform = "scaleX(-1)";
			});
			node.addEventListener("mouseleave", () => {
				node.style.transform = "scaleX(1)";
			});
		}
	}

	bindHamburger(node) {
		let nodeAttribute = this.getAtt(node, 'hamburger');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute.indexOf(':') !== -1) {
			let pairs = nodeAttribute.split(':');
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
		let nodeAttribute = this.getAtt(node, 'spinner');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute.indexOf(':') !== -1) {
			if (this.dom('uxspinner', 'id') == null) {
				let pairs = nodeAttribute.split(':');
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
		let nodeAttribute = this.getAtt(node, 'css');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.style = nodeAttribute;
		}
	}

	bindToggle(node) {

		const nodeAttribute = this.getAtt(node, 'toggle');
		if (!nodeAttribute || !nodeAttribute.includes(':')) {
			return false;
		}

		let [targetId, state, toggleClass] = nodeAttribute.split(':');

		const targetElement = document.getElementById(targetId);
		if (!targetElement) {
			return false;
		}

		node.addEventListener('click', () => {
			let currentAttribute = node.getAttribute(':toggle');
			if (!currentAttribute) return;

			let [currentTargetId, currentState, currentClass] = currentAttribute.split(':');

			if (currentState === 'in') {
				node.setAttribute('toggle', `${currentTargetId}:out:${currentClass}`);
			} else {
				node.setAttribute('toggle', `${currentTargetId}:in:${currentClass}`);
			}

			if (currentClass) {
				targetElement.classList.toggle(currentClass);
			}
		});

		return true;
	}


	bindMenu(node) {
		const nodeAttribute = this.getAtt(node, 'menu');
		if (!nodeAttribute || !nodeAttribute.includes(':')) return;

		const [menuId, state] = nodeAttribute.split(':');
		const menuElement = document.getElementById(menuId);

		if (!menuElement) {
			return;
		}
		
		if (state === 'in') {
			menuElement.style.display = "none";

			node.addEventListener('mouseover', () => {
				console.log(`Showing menu: #${menuId}`);
				menuElement.style.display = "block";
			});

			node.addEventListener('mouseout', (event) => {
				if (!node.contains(event.relatedTarget) && !menuElement.contains(event.relatedTarget)) {
					console.log(`Hiding menu: #${menuId}`);
					menuElement.style.display = "none";
				}
			});
		}
	}

	bindFunctions(node, data, find, value) {

		let nodeAttribute = this.getAtt(node, 'click');
		if (!nodeAttribute) return;
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

		if (nodeAttribute !== null) {
			let counterNode = this.dom(countID, 'id');
			if (counterNode) {
				node.addEventListener('click', () => {
					var calc = Number(counterNode.innerText);
					if (nodeAttribute == 'count++') counterNode.innerText = this.isInt((calc) + countvalue);
					if (nodeAttribute == 'count--') counterNode.innerText = this.isInt((calc) - countvalue);
					if (nodeAttribute == 'multiply') counterNode.innerText = this.isInt((calc) * multiply);
					if (nodeAttribute == 'countdown') {
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
		let nodeAttribute = this.getAtt(node, 'prevent');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			documentElements[j].addEventListener('submit', event => {
				event.preventDefault();
			});
		}
	}

	bindClose(node) {

		let nodeAttribute = this.getAtt(node, ':close');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.addEventListener('onclick', () => {
				this.dom(nodeAttribute, 'id').hidden = true;
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
		if (this.thread <= 1 && operators.length >= 1) {
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
		let nodeAttribute = this.getAtt(node, 'handler');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			let handlers = nodeAttribute.split(':');
			if (methods && Object(methods)) {
				for (let key in methods) {
					let funcs = methods[key];
					let pairs = funcs.toString();
					if (this.thread <= 1) {
						node.addEventListener(Reflect.get(handlers, 0), () => {
							funcs.apply();
						});
					}
					this.thread++;
				}
			}
		}
	}

	bindMethods(node, data, methods, find, value) {
		let nodeAttribute = this.getAtt(node, 'method');
		if (!nodeAttribute) return;
		let array = [];
		if (this.attributeCheck(node, 'method') == true) {
			if (nodeAttribute !== null) {
				let methodhandler = nodeAttribute.split(":");
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
							if (lines[i].indexOf('this.array') !== -1) {
								if (nodeAttribute.indexOf('{{') == -1) {
									let clicks = 0;
									node.addEventListener('click', () => {
										let nodeAttribute = this.getAtt(node, 'method');
										let methodhandler = nodeAttribute.split(":");
										let obj = Object.assign({}, methodhandler.splice(3, methodhandler.length));
										if (Object.keys(obj).length > 1) {
											this.array.push(obj);
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
		let nodeAttribute = this.getAtt(node, 'if');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			// functions
			if (nodeAttribute.indexOf('.') != -1) {
				let pieces = nodeAttribute.split('.');
				if (pieces.length > 0) {
					if (pieces.indexOf('has')) {
						let key = this.has(Reflect.get(pieces, 1)).toString();
						node.hidden = (value.indexOf(key) != -1) ? false : true;
					}
				}
			} else if (nodeAttribute.search("/\s/")) {
				// operators
				let toEval = null,
					key = null,
					opp = '';
				let pieces = nodeAttribute.split("\s");
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
		if (!nodeAttribute) return;
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
		if (!this.array.includes(routeId)) {
			this.array.push(routeId);
		}
		node.addEventListener('click', async () => {

			let routeNode = this.dom(routeId, 'id');

			this.array.forEach(id => {
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
		this.thread = 0;
		let attribute = this.getAtt(node, 'render');
		if (!attribute) return;
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
				this.thread = 0;
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
		if (!attribute) return;
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
		let nodeAttribute = false;
		let documentElements = this.nodeParentList();
		for (let j = 0; j < documentElements.length; j++) {
			nodeAttribute = this.getAtt(documentElements[j], 'async');
			if (nodeAttribute !== null) {
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
		let nodeAttribute = this.getAtt(node, 'form');
		if (nodeAttribute !== null) {
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
		this.nodes('bindSlide');
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