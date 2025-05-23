class UX {

	static contentType = "application/json;charset=UTF-8";
	static cacheControl = "default";
	static allowOrigin = '*';

	constructor() {
		this.thread = 0;
		this.counter = 0;
		this.index = 0;
		this.listeners = [];
		this.array = [];
		this.touches = {};
		this.modules = {};
		this.routes = {};
		this.functions = {};
		this.data = {};
		this.methods = {};
		this.vdom = {};
		this.state = {};
		this.swipe = {};
		this.shadow = {};
		this.initState({});
		this.compileNodes();
	}
	
	init = {
		name: "UX.js",
		version: "2.0",
		description: "UX.JS | JavaScript framework",
		copyright: "(c) 2024 flaneurette",
		license: "GNU",
		homepage: "https://github.com/flaneurette/UX.js",
		instanceid: Date.now()
	};
	
	/**
	* Loads the configuration object upon mounting.
	* @param {config} object
	* @return none
	*/

	load(config) {
		if (!this.isValidObject(config)) {
			this.log(this.Message['init']);
			return false;
		}
		const { data, methods, events } = config;
		if (data) {
			this.initData(data,methods);
			this.initComponents(data);
			this.initDevTools(data);
			Object.freeze(data)
		}
		return;
	}

	/**
	* Initializes parse functions.
	* @param {data,methods} objects
	* @return none
	*/
	
	initData(data,methods) {
		this.data = data;
		this.methods = methods;
		this.parseFunctions(data, methods);
		this.nodes('bindFunctions',false,false,data);
	return;
	}

	/**
	* Initializes components and rendering/routing them.
	* @param {data} object
	* @return none
	*/
	
	initComponents(data) {
		this.nodes('renderComponents', data);
		this.nodes('routeComponents', data);
	return;
	}

	/**
	* Initializes the developer-tool.
	* @param {data} object
	* @return none
	*/
	
	initDevTools(data) {
		if (Reflect.has(data, "devtools")) {
			this.nodes('devtools', data);
		}
	return;
	}

	/**
	* Initializes and applies methods
	* @param {method,find,value,data,methods,callback} 
	* @return none
	*/
	
	nodes(method, find, value, data = null, methods = null, callback = null) {
		
		const documentElements = this.nodeParentList();
		
		const methodMap = {
			renderComponents: this.renderComponents,
			routeComponents: this.routeComponents,
			bindSpinner: this.bindSpinner,
			bindFlip: this.bindFlip,
			bindReactive: this.bindReactive,
			bindReactiveDataActions: this.bindReactiveDataActions,
			bindActive: this.bindActive,
			bindSelect: this.bindSelect,
			bindShow: this.bindShow,
			bindHide: this.bindHide,
			createForm: this.createForm,
			bindCurtains: this.bindCurtains,
			bindLoop: this.loop,
			bindAttributesNode: this.bindClass,
			bindFlex: this.bindFlex,
			bindToggle: this.bindToggle,
			bindVoid: this.bindVoid,
			bindPrevent: this.bindPrevent,
			bindAsync: this.bindAsync,
			devtools: this.bindDevtool,
			bindAnimate: this.bindAnimate,
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
			bindScroll: this.bindScroll,
			bindTouches: this.bindTouches,
			bindSwipe: this.bindSwipe,
			bindObserver: this.bindObserver,
			bindTemplate: this.bindTemplate,
			bindRun: this.bindRun,
			bindOn: this.bindOn,
		};
		
		documentElements.forEach(elem => {
			if (methodMap[method]) {
			methodMap[method].call(this, elem, find, value);
			} else {
			const methodHandlers = {
				'progress': () => this.progress(elem, data, methods, find, value),
				'bindFunctions': () => this.bindFunctions(elem, data, find, value),
				'bindLogic': () => this.bindIf(elem, find, value),
				'bindMethods': () => this.bindMethods(elem, data, methods, find, value),
				'bindInput': () => this.bindInput(elem, data, methods, find, value),
				'bindHandler': () => this.bindHandler(elem, data, methods, find, value),
				'interpolation': () => this.interpolation(elem, find, value)
			};

			if (methodHandlers[method]) {
				methodHandlers[method]();
			}
			}
		});
		
		return;
	}

	/**
	* Parses HTML nodes
	* @param {data, exclude} - object, array of items not to parse.
	* @return none
	*/
	
	compileNodes(data, exclude = [], include=false) {
		
		let bindings = [];
		
		if (!Array.isArray(exclude)) exclude = [];
		
		if (Array.isArray(include)) {
			bindings = include;
		} else {
			bindings = [
				'bindHamburger', 'bindActive', 'bindToggle', 'bindDarkMode', 'bindVoid', 
				'bindPrevent', 'bindSelect', 'bindFlex', 'bindShow', 'bindHide', 
				'bindCurtains', 'bindAnimate', 'bindLazyImg', 'bindLazyLoad', 'bindUri', 
				'bindIntoView', 'bindFade', 'bindClose', 'bindView', 'bindSwitch', 
				'bindWheel', 'bindSlide', 'bindScroll', 'bindSpinner', 'bindFlip', 
				'bindTouches', 'bindSwipe', 'progress', 'bindReactive', 'bindReactiveDataActions',
				'bindObserver','bindTemplate', 'bindRun', 'bindOn'
			];
		}

		if (exclude.includes('bindReactive') || exclude.includes('bindReactiveDataActions')) {
			//bindings = bindings.filter(b => !['bindReactive', 'bindReactiveDataActions'].includes(b));
		}

		bindings.forEach(binding => {
			this.nodes(binding);
		});
		
		return;
	}

	/**
	* Parses functions and methods
	* @param {data, method}
	* @return none
	*/
	
	parseFunctions(data, method) {
		
		if(!data) return;
		
		Object.entries(data).forEach(([key, value]) => {
			
			const bindings = [
				'interpolation',
				'bindAttributesNode',
				'bindLogic',
				'bindMethods',
				'bindInput',
				'bindHandler'
			];

			if (Array.isArray(value)) {
				['bindLoop', 'createForm', ...bindings].forEach(fun => 
					this.nodes(fun, key, value, data, method)
				);
			} else {
				['bindActive', ...bindings].forEach(fun => 
					this.nodes(fun, key, value, data, method)
				);
			}
		});
	}

	
	/**
	* Handle global node events
	* @param {method} 
	* @return mixed
	*/
	
	evt(method) {
		
		if(!method) return;
		
		const eventTypes = {
			x: ()=> event.clientX,
			y: ()=> event.clientY,
			deltaY: ()=> event.deltaY,
			deltaX: ()=> event.deltaX,
			target: () => event.target,
			parentNode: () => event.target.parentNode,
			nextSibling: () => event.target.nextSibling,
		};
		
		if(method in eventTypes) return eventTypes[method]();
		return;
	}

	/**
	* Creates dynamic eventlisteners
	* @return none
	*/
	
	events(node, type, handler, event, bypass = false) {
		
		if (!node || !type) return;
		if (!node.id) node.id = node === window ? 'window' : crypto.randomUUID();

		const key = `${node.id}-${type}`;
		if(!this.listeners.includes(key)) {
			if(node.id && bypass == false) {
				this.listeners.push(key);
			}
			const eventListener = function(event) {
				if (typeof handler === 'function') {
					handler.call(this, event);
				} else {
				}
			};
			node.addEventListener(type, eventListener.bind(this));
		}
		return;
	}

	eventsWindow(node, type, handler, event, bypass = false) {
		if (!node || !type) return;
			const eventListener = function(event) {
				if (typeof handler === 'function') {
					handler.call(this, event);
				} else {
				}
			};
			node.addEventListener(type, eventListener.bind(this));
		return;
	}
	
	eventsSwipe(node, type, handler, event) {
		
		if (!node || !type) return;

		const key = `${node.id}-${type}`;
		
		if(!this.listeners.includes(key)) {
			const eventListener = function(event) {
				handler.call(this, event);
			};
			node.addEventListener(type, eventListener.bind(this));
			this.listeners.push(key);
		}
		return;
	}	
	
	/**
	* Queries the virtual DOM, getting and setting of information
	* @param {id, method,value} 
	* @return mixed var
	*/
	
	dom(id, method, value) {
		
		const globalActions = {
			query: () => document.querySelector(value),
			queryall: () => document.querySelectorAll(value),
			elements: () => document.getElementsByTagName(value),
			classes: () => document.getElementsByClassName(value),
			create: () => document.createElement(value),
			document: () => document.all,
			location: () => window.location.href,
			innerheight: () => window.innerHeight,
			innerwidth: () => window.innerWidth,
		};

		if (method in globalActions) return globalActions[method]();

		const elem = id ? document.getElementById(id) : null;
		if (!elem) return null; 

		const actions = {
			id: () => elem,
			get: () => elem.value,
			set: () => { elem.value = value; },
			none: () => { elem.style.display = 'none'; },
			block: () => { elem.style.display = 'block'; },
			sethtml: () => { elem.innerHTML = value; },
			gethtml: () => elem.innerHTML,
			innerHTML: () => document.body.innerHTML,
			display: () => { elem.style.display = value; },
			parent: () => elem.parentNode,
			children: () => elem.children,
		};

		return actions[method] ? actions[method]() : null;
	}
	
	/**
	* Compares if an object is valid, or not
	* @param {obj} 
	* @return mixed boolean
	*/
	
	isValidObject(obj) {
		return typeof obj === 'object' && obj !== null;
	}

	/**
	* Compares if a function is valid, or not
	* @param {fun} 
	* @return mixed boolean
	*/
	
	isValidFunction(fun) {
		return typeof fun === 'function' && fun !== null;
	}
	
	/**
	* Compares if a number is integer, or not
	* @param {value} 
	* @return int
	*/
	
	isInt(value) {
		const num = Number(value);
		return Number.isInteger(num) ? num.toFixed(2) : parseFloat(num).toFixed(2);
	}
	
	/**
	* Retrieves all parent elements from the virtual DOM
	* @return htmlcollection
	*/
	
	getElements() {
		return this.dom(null, 'elements', '*')
	}

	/**
	* A spread that retrieves all parent elements from the virtual DOM 
	* @return htmlcollection
	*/
	
	nodeParentList() {
		return [...this.getElements()];
	}

	/**
	* A spread that retrieves all child elements from the virtual DOM 
	* @return htmlcollection
	*/
	
	nodeChildren(parents) {
		return [...parents.childNodes];
	}
	
	/**
	* Getting a UX.js attribute
	* @param {node,part} 
	* @return node or null
	*/
	
	getAtt(node, part) {
		const prefixes = ['ux:', ':'];
		for (const prefix of prefixes) {
			const attr = node.getAttribute(prefix + part);
			if (attr !== null) return attr;
		}
		return null;
	}

	/**
	* Checks a UX.js attribute
	* @param {node,part} 
	* @return mixed boolean
	*/
	
	attributeCheck(node, part) {
		let isAtrribute = (node.getAttribute('ux:' + part) !== null ||
			node.getAttribute(':' + part) !== null) ? true : false;
		return isAtrribute;
	}
				
	/**
	* A method with regular expressions
	* @param {type} - type of regular expression
	* @return regular expression
	*/
	
	regEx(type, find) {
		if (type == 'spaces') return /\s+|\t+/gim;
		if (type == 'punctuation') return /,|'|"|\{|\}|\[|\]/gim;
		if (type == 'bindings') return `{{\\s*${find}[0-9]*\\s*}}`
		return;
	}

	/**
	* Checks if a string contains a certain value
	* @param {value}
	* @return none
	*/
	
	has(value) {
		if (!value) return;

		let matches = value.match(/'([^']+)'/g);
		if (!matches) return; 

		return matches.map(m => m.replace(/'/g, ''));
	}

	/**
	* Clones a node
	* @param {list,id} - list is a node, and id is a node.id
	* @return none
	*/
	
	cloneNodes(list, id) {
		if (!id || !list) return;
			const parentItem = this.dom(id, 'parent');
			let docItem = this.dom(id, 'id');
			let docClone = docItem.cloneNode(true);
			list.forEach(elem => {
				parentItem.appendChild(docClone);
			});
		return;
	}
	
	/**
	* Create shadowroot
	* @param {node} - the node to bind a shadowroot to
	* @return shadowroot
	*/
	
	bindShadow(node) {
		const shadow = node.attachShadow({ mode: "open" });	
		return shadow;
	}

	/**
	* Bind a webcomponent template
	* @param {node} - the shadow node to bind a template to
	* @return none
	*/
	
	bindTemplate(node) {
		
		let nodeAttribute = this.getAtt(node, 'shadow');
		if (!nodeAttribute) return;

		const templateElement = this.dom(nodeAttribute, 'id');
		if (!templateElement) return;

		const template = templateElement.content.cloneNode(true);
		const root = this.bindShadow(node);
		root.appendChild(template);
		return;
	}

	
	/**
	* Reactive bindings
	* @param {node} - the node to bind a reactive state to
	* @return none
	*/
	
	bindReactive(node) {
		let nodeAttribute = this.getAtt(node, 'reactive');
		if (!nodeAttribute) return;
		
		const [reactive, method, id] = nodeAttribute.split(':');
		
		const reactiveMap = {
			route: this.reactiveRoute,
		};
		
		if (reactiveMap[reactive]) {
			reactiveMap[reactive].call(this, node, nodeAttribute);
		}
		return;
	}

	/**
	* Reactive handlers for module routing
	* @param {node}
	* @return none
	*/
	
	reactiveRoute(node,nodeAttribute) {
		if(!node || !nodeAttribute) return;
		if(node.hasAttribute('href')) { 
			this.events(node, 'click', (event) => this.reactiveHandler(node, nodeAttribute, event), event)
		}
		return;
	}
	
	reactiveHandler(node, nodeAttribute, event) {
		event.preventDefault();
		if (!node || !nodeAttribute) return;
		this.reactiveBind(nodeAttribute);
		return;
	}
	
	getState(ofWhat) {
		try {
			const storedState = sessionStorage.getItem("state");
			if (!storedState) return this.state?.[ofWhat];
			const state = JSON.parse(storedState);
			return state?.[ofWhat] ?? this.state?.[ofWhat]; 
		} catch (error) {
			console.error("UX Error: Failed to parse sessionStorage.state:", error);
			return this.state?.[ofWhat];
		}
	}
	
	initState(config, session) {
		const { data, methods, events } = config;
		if(session === true) {
			let savedState = sessionStorage.state ? JSON.parse(sessionStorage.state) : data;
			this.state = { ...data, ...savedState };
			} else {
			this.state = { ...data, ...data };
		}
		
		this.initData(this.state, methods);
	}
	
	releaseState() {
		sessionStorage.state = '';	
		this.state = {};
	}

	setState(newState, id, session) {
		this.state = { ...this.state, ...newState };
		if(session === true) {
			sessionStorage.state = JSON.stringify(this.state);
		}
		this.reactiveUpdateVDOM(id);
	}
	
	setFun(fun) {
		if(fun) fun();
	}
	
	reactiveUpdateVDOM(id) {
		
		if(!this.modules) return false;
		
		this.modules.forEach(module => {
			
			if(module['id'] == id) {
				if (module['init']) {
					module['init']();
				}
				if(module['render']) { 
					const elem = this.dom('root','id');
					elem.innerHTML = module['render']();
				}
				if(module['template']) { 
					const modal = this.dom('root','id');
					modal.innerHTML = module['template']();
				}
			}
			
		});	
		this.bindReactiveDataActions();
	}

	loadModule(module) {
		
		const mod = module;
		
		if (!mod) return;
		if(!this.modules) return false;

		this.modules.forEach(module => {
			
			if(module['id'] == mod) {
				const elem = this.dom('root','id');
				if (!elem) {
					console.error(`UX Error: Element with id root not found.`);
					return;
				}
				if (module['init']) {
					module['init']();
				}
				if(module['render']) { 
					elem.innerHTML = module['render']();
					this.bindReactiveActions(module['render']);
				}
				if(module['template']) { 
					elem.innerHTML = module['template']();
					this.bindReactiveActions(module['render']);
				}
				if (module['effect']) {
					module['effect']();
				}
			}
		});
		this.bindReactiveDataActions();
		// Reparse VDOM for UX.js attribute handlers.
		this.compileNodes(this.data,['bindReactive', 'bindReactiveDataActions']);
		this.parseFunctions(this.data, this.methods);
		return;
	}

	loadFunction(container,fun) {
		
		if (!fun) return;
		if(!container) return;
		if(!this.functions) return false;
		
		let loadinto = this.dom(container,'id');
		
		this.functions.forEach(module => {
			if (fun !== undefined) {
				const elem = this.dom('root', 'id');
				if (!elem) {
					console.error(`UX Error: Element with id root not found.`);
					return;
				}
				
				const f = this.functions.find(fn => fn.name === fun);
				
				if (f) {
					loadinto.innerHTML = f();
				} 
			}
		});

		this.bindReactiveDataActions();
		// Reparse VDOM for UX.js attribute handlers.
		this.compileNodes(this.data,['bindReactive', 'bindReactiveDataActions']);
		this.parseFunctions(this.data, this.methods);
		return;
	}
	
	reactiveBind(uri) {
		
		const [reactive, data] = uri.split(':');
		
		if (!data) return;
		if(!this.modules) return false;
		this.modules.forEach(module => {
			
			if(module['id'] == data) {
				const elem = this.dom('root','id');
				if (!elem) {
					console.error(`UX Error: Element with id root not found.`);
					return;
				}
				if (module['init']) {
					module['init']();
				}
				if(module['render']) { 
					elem.innerHTML = module['render']();
					this.bindReactiveActions(module['render']);
				}
				if(module['template']) { 
					elem.innerHTML = module['template']();
					this.bindReactiveActions(module['render']);
				}
				if (module['effect']) {
					module['effect']();
				}
			}
		});
		this.bindReactiveDataActions();
		// Reparse VDOM for UX.js attribute handlers.
		this.compileNodes(this.data,['bindReactive', 'bindReactiveDataActions']);
		this.parseFunctions(this.data, this.methods);
		return;
	}

	/**
	* Reactive data actions binds a listener to buttons and binds an action to it.
	* @param {node}
	* @return none
	*/
	
	bindReactiveDataActions(node) {
		const buttons = this.dom(node, 'queryall', "[data-action]");
		if (!buttons) return;
		buttons.forEach((button) => {
			const action = button.getAttribute("data-action");
			if (!action || !this.functions) return;
			const fun = this.functions.find(f => f && f.name === action);
			if (fun && typeof fun === "function") {
				this.events(button, 'click', fun.bind(this), event)
				
			}
		});
		return;
	}
	
	/**
	* Reactive code parser. (TODO)
	* @param {function} - function to parse.
	* @return none
	*/
	
	reactiveParser(method) {	
		method
		.toString()
		.split("\n")
		.filter(line => line.includes('this.'))
		.forEach(line => {
			if (line.includes('=')) {
			} else if (line.includes('++') || line.includes('+=') ) {
			} else if (line.includes('--') || line.includes('-=')) {
				let c = line.split('\s');
			}
		});
		return;
	}

	/**
	* Reactive code parser. (TODO)
	* @param {data} - functions to parse.
	* @return none
	*/
	
	bindReactiveActions(data) {
		return;
	}
	
	/**
	* Applies new functions and executes them
	* @param {node}
	* @return none
	*/
	
	bindMethods(node, data, methods) {
		let process = new Function(methods);
		process.apply();
		return;
	}
	
	/**
	* Interpolation of strings
	* @param {elem, find, value}
	* @return none
	*/
	
	interpolation(elem, find, value) {
		this.nodeChildren(elem).forEach(child => {
		if (child.nodeType === elem.TEXT_NODE) {
			child.nodeValue = child.nodeValue.replace(new RegExp(this.regEx('bindings',find), "gi"), value);
			}
		});
	}
	
	/**
	* Binds a class to a node and toggles it.
	* @param {node, find, value}
	* @return none
	*/
	
	bindClass(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'class');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			if (nodeAttribute.toString() === find.toString()) node.classList.toggle(value);
		}
		return;
	}

	/**
	* Binds a node.id to a node and sets a value
	* @param {node, find, value}
	* @return none
	*/
	
	bindId(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'id');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			if (nodeAttribute.toString() === find.toString()) node.id = value;
		}
		return;
	}

	/**
	* Binds an eventlistener to each object with an attribute of :curtain, and either hides or shows an object.
	* @param {node, find, value}
	* @return none
	*/
	
	bindCurtains(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'click');
		if (!nodeAttribute) return;
		let documentElements = this.nodeParentList();
		documentElements.forEach( elem => {
			if (this.attributeCheck(elem, 'curtain') == true) elem.hidden = true;
		});
		if (nodeAttribute !== null && this.attributeCheck(node, 'curtain') !== null) {
			const handleCurtain = (event) => {
				let documentElements = this.dom(null, 'elements', '*');
				Array.from(documentElements).forEach(elem => {
					if (elem.getAttribute(':curtain') !== null) {
						(elem.hidden === false) ? elem.hidden = true:elem.hidden = false;
					}
				});
			};
			this.events(node,'click', handleCurtain);
		}
		return;
	}

	/**
	* Binds an eventlistener to each object with an attribute of :darkmode, and toggles a mode.
	* @param {node, find, value}
	* @return none
	*/
	
	bindDarkMode(node, find, value) {
		let nodeAttribute = this.getAtt(node, 'darkmode');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			if (localStorage.getItem("dark-mode") === "enabled") {
				document.body.classList.add("dark-mode");
			}
			const handleMode = () => {
				document.body.classList.toggle("dark-mode");
				if (document.body.classList.contains("dark-mode")) {
					localStorage.setItem("dark-mode", "enabled");
				} else {
					localStorage.setItem("dark-mode", "disabled");
				}
			};
			this.events(node,'click', handleMode);
		}
		return;
	}

	/**
	* Makes a node visible
	* @param {node} - the node to show
	* @return none
	*/
	
	bindShow(node) {
		let nodeAttribute = this.getAtt(node, 'hidden');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.hidden = false;
		}
		return;
	}

	/**
	* Makes a node invisible
	* @param {node} - the node to hide
	* @return none
	*/
	
	bindHide(node) {
		let nodeAttribute = this.getAtt(node, 'hidden');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute == 'true') {
			node.hidden = true;
		}
		return;
	}

	/**
	* Set a void attribute
	* @param {node} - the node to void
	* @return none
	*/
	
	bindVoid(node) {
		let nodeAttribute = this.getAtt(node, 'void');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
		}
		return;
	}

	/**
	* Adds an eventlistener to a node and scrolls it into view.
	* @param {node} - the node to view
	* @return none
	*/
	
	bindView(node) {
		let nodeAttribute = this.getAtt(node, 'view');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			const handleView = (event) => {
				let documentElement = this.dom(nodeAttribute, 'id');
				documentElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			};
			this.events(node,'click', handleView);
		}
		return;
	}

	/**
	* Sets an eventlistener to scroll the DOM up.
	* @param {node} - the node to scroll
	* @return none
	*/
	
	bindScroll(node) {
		let nodeAttribute = this.getAtt(node, 'scroll');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
			const handleScroll = (event) => {
				window.scroll({
					top: 0,
					left: 0,
					behavior: 'smooth'
				});
			};
			this.events(node,'click', handleScroll);
		}
		return;
	}

	/**
	* Handle touch events by binding eventlisteners to a node
	* @param {node} 
	* @return none
	*/
	
	bindTouches(node) {
		
		let nodeAttribute = this.getAtt(node, 'touch');
		if (!nodeAttribute) return;

		const [method,callback] = nodeAttribute.split(':');
		
		this.touches = { startX: 0, startY: 0, endX: 0, endY: 0 };

		const touchStart = (nodeAttribute,event) => {
			this.touches.startX = event.touches[0].clientX;
			this.touches.startY = event.touches[0].clientY;
		};

		const touchEnd = (nodeAttribute,event) => {
			
			const threshold = 50;
			
			this.touches.endX = event.changedTouches[0].clientX;
			this.touches.endY = event.changedTouches[0].clientY;
			let deltaX = this.touches.startX - this.touches.endX;
			let deltaY = this.touches.startY - this.touches.endY;
		
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > threshold) {
					this.handleSwipe(node,'left');
				} else if (deltaX < - threshold) {
					this.handleSwipe(node,'right');
				}
			} else {
				if (deltaY > threshold) {
					this.handleSwipe(node,'up');
				} else if (deltaY < - threshold) {
					this.handleSwipe(node,'down');
				}
			}
			if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
				this.handleSwipe(node,'tap');
			}
		};

		this.events(node, 'touchstart', (event) => touchStart(nodeAttribute, event));
		this.events(node, 'touchend', (event) => touchEnd(nodeAttribute, event));

		return;
	}

	handleSwipe(node, direction) {
		this.swipe(node, direction);
		return;
	}
	
	/**
	* Sets an eventlistener and creates a sliding div.
	* @param {node} - the node to slide
	* @return none
	*/
	
	bindSlide(node) {

		const nodeAttribute = this.getAtt(node, 'slide');
		if (!nodeAttribute) return;
		
		const [dimension, value] = nodeAttribute.split(':');
		if (!dimension || !value) return;
		
		let delta = 0;
		let ticking = false;
		
		const handleScroll = (event) => {
			if (!ticking) {
			window.requestAnimationFrame(() => {
					let deltaY = window.scrollY;
					const targetProperty = dimension === 'height' ? 'height' : 'width';
					const newValue = deltaY > 0 ? '0px' : value;
					node.style[targetProperty] = newValue; 
					setTimeout(() => {
						node.style.display = 'none';
					}, 500);
				ticking = false;
			});
			}
		ticking = true;
		};
			
		const handleWheel = (event) => {
			event.preventDefault();
			const deltaY = this.evt('deltaY');
			const targetProperty = dimension === 'height' ? 'height' : 'width';
			const newValue = deltaY > 0 ? '0px' : value;
			node.style[targetProperty] = newValue; 
			setTimeout(() => {
				node.style.display = 'none';
			}, 500);
		};
		
		this.events(document,'scroll', handleScroll);
		this.events(node,'wheel', handleWheel);
			
		return;
	}

	/**
	* Creates a swiping effect.
	* @param {node} - the node to attach a listener to
	* @return none
	*/
	
	bindSwipe(node) {
		
		let slideView = false;
		let slideId = false;
		this.currentTranslate = 0;
		
		const nodeAttribute = this.getAtt(node, 'swipe');
		if (!nodeAttribute) return;

		if(nodeAttribute.includes(':')) {
			slideView = nodeAttribute.split(':')[1];
			slideId = nodeAttribute.split(':')[0];
		}
		
		if(slideView !== false) { 

			const handleView = (event) => {
				
				const deltaX = window.scrollX;
				const deltaY = window.scrollY;
				this.index = slideView.match(/\d+/)[0]-1;
				this.currentTranslate = -this.index * 100;
				let documentElement = this.dom(slideView, 'id');
				
				this.currentTranslate = -this.index * 100;
				this.dom(slideId,'id').style.transform = `translateX(${this.currentTranslate}%)`;
			};
			
			this.eventsSwipe(node,'click', handleView);
		
		} else {
			
			this.swiper = this.dom(nodeAttribute, 'id');
			if (!this.swiper || !this.swiper.children.length) return;

			this.swipes = this.swiper.children;
			this.totalswipes = this.swipes.length;

			const updatePosition = () => {
				this.currentTranslate = -this.index * 100;
				this.swiper.style.transform = `translateX(${this.currentTranslate}%)`;
			};

			const handleSwipe = (direction) => {
				if (direction === 'next' && this.index < this.totalswipes - 1) {
					this.index++;
				} else if (direction === 'prev' && this.index > 0) {
					this.index--;
				}
				updatePosition();
			};

			const handleScroll = (event) => {
				event.preventDefault();
				if (event.deltaY > 0) handleSwipe('next');
				if (event.deltaY < 0) handleSwipe('prev');
			};

			const touchStart = (event) => {
				this.startX = event.touches[0].clientX;
				this.startY = event.touches[0].clientY;
			};

			const touchEnd = (event) => {
				const deltaX = this.startX - event.changedTouches[0].clientX;
				const deltaY = this.startY - event.changedTouches[0].clientY;

				if (Math.abs(deltaX) > Math.abs(deltaY)) { 
					if(deltaX > 50) handleSwipe('next');
					else if(deltaX < -50) handleSwipe('prev');
				} else { 
					if(deltaY > 50) handleSwipe('next');
					else if(deltaY < -50) handleSwipe('prev');
				}
			};

			this.eventsSwipe(node, 'touchstart', touchStart);
			this.eventsSwipe(node, 'touchend', touchEnd);
			this.eventsSwipe(node, 'wheel', handleScroll, { passive: false });
		}
		return;
	}

	/**
	* Binds an eventlistener to the mousewheel
	* @param {node} - the node to 'wheel'
	* @return none
	*/
	
	bindWheel(node) {

		const nodeAttribute = this.getAtt(node, 'wheel');
		if (!nodeAttribute) return;

		const [dimension, value] = nodeAttribute.split(':');
		if (!dimension || !value) return;

		let delta = 0;
		let ticking = false;
		
		const handleScroll = (event) => {
			if (!ticking) {
			window.requestAnimationFrame(() => {
					let deltaY = window.scrollY;
					const targetProperty = dimension === 'height' ? 'height' : 'width';
					const newValue = deltaY > 0 ? '0px' : value;
					node.style[targetProperty] = newValue; 
					setTimeout(() => {
						node.style.display = 'none';
					}, 500);
				ticking = false;
			});
			}
		ticking = true;
		};
		
		const handleWheelY = (event) => {
			event.preventDefault();
			const delta = event.deltaY;
			const targetProperty = dimension === 'height' ? 'height' : 'width';
			const newValue = delta > 0 ? '0px' : value;
			node.style[targetProperty] = newValue; 
			setTimeout(() => {
				node.style.display = 'none';
			}, 500);
		};
		
		this.events(document,'scroll', handleScroll);
		this.events(node,'wheel', handleWheelY);
		
		return;
	}

	/**
	* Binds an eventlistener to a node to switch an id
	* @param {node} - the node to switch
	* @return none
	*/
	
	bindSwitch(node) {
		let nodeAttribute = this.getAtt(node, 'switch');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			let switchWhat = nodeAttribute.split(':');
			const handleSwitch = () => {
				let switchId = Reflect.get(switchWhat, 1);
				node.setAttribute('id', switchId);
			};
			this.events(node,Reflect.get(switchWhat, 0), handleSwitch);
		}
		return;
	}

	/**
	* Switches a className on active links
	* @param {node} - the node to switch classes
	* @return none
	*/
	
	bindActive(node) {
		let nodeAttribute = this.getAtt(node, 'active');
		if (!nodeAttribute) return;
		let active = this.dom(null, 'location');
		if (nodeAttribute !== null) {
			if (nodeAttribute.indexOf(':') != -1) {
				let pieces = nodeAttribute.split(':');
				if (active.match(Reflect.get(pieces, 0))) {
					node.className = Reflect.get(pieces, 1).toString();
				}
			}
		}
		return;
	}

	/**
	* Selects a className
	* @param {node} - the node to switch
	* @return none
	*/
	
	bindSelect(node) {
		let nodeAttribute = this.getAtt(node, 'select');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.className = nodeAttribute.toString();
		}
		return;
	}

	/**
	* Creates a flexbox dynamically
	* @param {node} - the node to 'flex'
	* @return none
	*/
	
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
		return;
	}

	/**
	* Binds an animation to a node
	* @param {node} - the node to animate
	* @return none
	*/
	
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
		return;
	}
	
	/**
	* Binds an observer
	* @param {node} - the node to observe
	* @return none
	*/
	
	bindObserver(node, params=false) {
		
		let nodeAttribute = this.getAtt(node, 'observe');
		if (!nodeAttribute) return;

		const [id, root, margin, threshold, callbackName] = nodeAttribute.split(':');
		const targetElement = this.dom(id,'id');

		let parsedThreshold = threshold ? JSON.parse(threshold) : 0;
		
		const options = {
			root: root ? document.querySelector(root) : null,
			rootMargin: margin || '0px',
			threshold: parsedThreshold
		};

		const callback = this[callbackName] || window[callbackName];

		const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						if(callbackName) { 
							callback(entry);
						}
					}
				});
		}, options);

		observer.observe(targetElement);
		
	}

	/**
	* Fades a node into view.
	* @param {node} - the node to 'fade'
	* @return none
	*/
	
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
				let target = this.dom(null, 'query', '#' + node.id);
				observer.observe(target);
			}
		}
		return;
	}

	/**
	* Binds a node and 'grows' it into view
	* @param {node} - the node to grow
	* @return none
	*/
	
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
				let target = this.dom(null, 'query', '#' + node.id);
				observer.observe(target);
			}
		}
		return;
	}

	/**
	* Applies lazyloading to virtual DOM nodes.
	* @param {node} - the node to 'lazyload'
	* @return none
	*/
	
	bindLazyLoad(node) {
		
		let nodeAttribute = this.getAtt(node, 'lazyload');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			
			let lazy = nodeAttribute.split(':');
			
			node.style.opacity = "0"; 
			node.style.transform = "translateY(-10px)";
			node.style.transition = "opacity " + Reflect.get(lazy, 0) + " " + Reflect.get(lazy, 1) + " transform "+ Reflect.get(lazy, 0) + " " +	Reflect.get(lazy, 1);
			 
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
				let target = this.dom(null, 'query', '#' + node.id);
				observer.observe(target);
			}
		}
		return;
	}

	/**
	* Applies lazyloading to virtual DOM node images.
	* @param {node} - the node image to 'lazyload'
	* @return none
	*/
	
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
			const handleLoad = () => {
				node.src = imageUrl;
			};
			this.events(node,'click', handleLoad);
			
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
		return;
	}

	/**
	* Creates a dynamic link
	* @param {node} - the node to 'link'
	* @return none
	*/
	
	bindUri(node) {
		
		let nodeAttribute = this.getAtt(node, 'link');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.setAttribute('href', 'javascript:void(0);');
			const handleUri = () => {
				document.location = nodeAttribute;
			};
			this.events(node,'click', handleUri);
		}
		return;
	}

	/**
	* Applies a flip effects on a virtual DOM node
	* @param {node} - the node to 'flip'
	* @return none
	*/
	
	bindFlip(node) {
		
		if (!node || node._flipBound) return;

		let nodeAttribute = this.getAtt(node, 'flip');
		if (!nodeAttribute) return;

		const handleMouseOver = () => {
			node.style.transform = "scaleX(-1)";
		};

		const handleMouseLeave = () => {
			node.style.transform = "scaleX(1)";
		};
		
		this.events(node,'mouseover', handleMouseOver);
		this.events(node,'mouseleave', handleMouseLeave);

		node._flipBound = true;
	}


	/**
	* Creates a hamburger menu with canvas
	* @param {node} - the node to apply it to.
	* @return none
	*/
	
	bindHamburger(node) {
		
		let nodeAttribute = this.getAtt(node, 'hamburger');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute.indexOf(':') !== -1) {
			let pairs = nodeAttribute.split(':');
			let width = Reflect.get(pairs, 1);
			let height = 10;
			let spacing = Reflect.get(pairs, 2);
			if (this.dom('uxcanvas', 'id') == null) {
				let canvas = this.dom(null, 'create', 'canvas');
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
		return;
	}

	/**
	* Creates a 'spinner' loading icon through canvas
	* @param {node} - the node to 'spin'
	* @return none
	*/
	
	bindSpinner(node,id) {
		let nodeAttribute = false;
		if(id != 'spinner') {
			nodeAttribute = this.getAtt(node, 'spinner');
			} else {
			let nodeSpin = document.getElementById(id);
			nodeAttribute = this.getAtt(nodeSpin, 'spinner');
		}

		if (!nodeAttribute) return;
		if (nodeAttribute !== null && nodeAttribute.indexOf(':') !== -1) {
			
			if (this.dom('uxspinner', 'id') == null) {
				let pairs = nodeAttribute.split(':');
				let width = Reflect.get(pairs, 0);
				let color = Reflect.get(pairs, 1);
				let canvas = this.dom(null, 'create', 'canvas');
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
			
			const handleSpinner = () => {
				setTimeout(() => this.dom('uxspinner', 'none'), 200);
			};
			
			this.events(window,'load', handleSpinner);
		}
		return;
	}

	/**
	* Binds CSS
	* @param {node} - the node to style.
	* @return none
	*/
	
	bindCSS(node) {
		
		let nodeAttribute = this.getAtt(node, 'css');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			node.style = nodeAttribute;
		}
		return;
	}

	/**
	* Toggles a node by adding an eventlistener.
	* @param {node} - the node to toggle
	* @return none
	*/
	
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

		const handleToggle = () => {
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
		};
		
		this.events(node,'click',handleToggle);

		return;
	}

	/**
	* Binds method functions and adds an eventlistener
	* @param {node} - the node to attach to
	* @return none
	*/
	
	bindFunctions(node, data, find, value) {

		let nodeAttribute = this.getAtt(node, 'click');
		if (!nodeAttribute) return;
		let documentElements = this.dom(null, 'elements', '*');
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
				const handleFunctions = () => {
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
				};
				this.events(node,'click',handleFunctions);
			}
		}
		return;
	}

	/**
	* Adds an eventlistener that prevents default behaviour
	* @param {node} - the node to attach to
	* @return none
	*/
	
	bindPrevent(node, find, value) {
		
		let nodeAttribute = this.getAtt(node, 'prevent');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			const handleFunctions = (event) => {
				event.preventDefault();
			};
			this.events(node,'submit',handleFunctions);
		}
		return;
	}

	/**
	* Adds an eventlistener that hides a node
	* @param {node} - the node to attach to
	* @return none
	*/
	
	bindClose(node) {
		
		let nodeAttribute = this.getAtt(node, ':close');
		if (!nodeAttribute) return;
		if (nodeAttribute !== null) {
			const handleClose = () => {
				this.dom(nodeAttribute, 'id').hidden = true;
			};
			this.events(node,'click',handleClose);
		}
		return;
	}

	/**
	* Adds an image to a node
	* @param {node,array} - the node to attach to, array of images.
	* @return none
	*/
	
	onImg(node, array) {
		
		if (!node || !array?.length) return;

		let findMethod = node.getAttribute(':method');
		if (!findMethod) return;
		
		let [, , imageId] = findMethod.split(':');
		if (!imageId) return;
		
		let imageDOM = this.dom(imageId, 'id');
		if (!imageDOM || !node.src) return;

		array.forEach(([_, value]) => {
			if (typeof value === 'string' && (value.includes('img') || value.includes('image'))) {
				imageDOM.setAttribute("src", node.src);
			}
		});
		
		return;
	}

	/**
	* Searches for operants to attach a dynamic image through UX methods.
	* @param {node,operators} - the node to attach to, operators.
	* @return none
	*/
	
	onImgFill(node, operators) {

		if (this.thread <= 1 && operators.length >= 1) {
			let spaces = this.regEx('spaces');
			let punctuation = this.regEx('punctuation');
			let doc = this.dom(null, 'document');
			let j = 0;
			for (let i = 0; i < doc.length; i++) {
				let findMethod = doc[i].getAttribute(':method');
				if (findMethod) {
					let methods = findMethod.split(':');
					let current = methods[2];
					if (current) {
						let thumbs = this.dom(current, 'id');
						if (thumbs) {
							let newSrc = operators[j] && operators[j][1] ? operators[j][1].toString().replaceAll(/\s+|\t+/gim, '').replaceAll(/,|'|"|\{|\}|\[|\]/gim, '') : ''; 
							doc[i].setAttribute("src", newSrc);
							j++;
						}
					}
				}
			}
		}
		return;
	}

	/**
	* Searches for operants to replace text through UX methods.
	* @param {node,operators} - the node to attach to, operators.
	* @return none
	*/
	
	onText(node, operators) {
		
		if (!node || !operators || operators.length < 2) return;

		const spaces = this.regEx('spaces');
		const punctuation = this.regEx('punctuation');

		let key = operators[0]?.toString().replaceAll(spaces, '').split('.');
		let value = operators[1]?.toString().replaceAll(punctuation, '');

		if (!key || key.length < 2) return;

		let placeholder = `{{${key[1]}}}`;

		node.innerHTML = node.innerHTML.replaceAll(placeholder, value).replaceAll(key[1], value);
		return;
	}

	/**
	* Attaches a custom eventlistener to a node
	* @param {node} 
	* @return none
	*/
	
	bindHandler(node, data, methods, find, value) {
		
		let nodeAttribute = this.getAtt(node, 'handler');
		if (!nodeAttribute) return;

		let handlers = nodeAttribute.split(':');
		let eventType = handlers[0];

		if (!eventType || !methods || typeof methods !== 'object') return;

		for (let key in methods) {
			let func = methods[key];

			if (typeof func !== 'function') continue;

			if (this.thread <= 1) {
				node.addEventListener(eventType, func.bind(this));
			}
			this.thread++;
		}
		return;
	}

	/**
	* Binds UX inputs, and adds eventlisteners
	* @param {node} 
	* @return none
	*/
	
	bindInput(node, data, methods, find, value) { 
		
		let nodeAttribute = this.getAtt(node, 'input');
		if (!nodeAttribute || !this.attributeCheck(node, 'input')) return;
		
		let methodParts = nodeAttribute.split(":");
		
		if(!methodParts[0]) return;

			for (let fun in methods) {
				let method = methods[fun];
				if (typeof method == "function") {
					this.events(node,methodParts[0],method); 
					break;
				}
			}

		return;
	}	
	
	/**
	* Binds UX methods, image fills, and adds eventlisteners
	* @param {node} 
	* @return none
	*/
	
	bindMethods(node, data, methods, find, value) {
		
		let nodeAttribute = this.getAtt(node, 'method');
		if (!nodeAttribute || !this.attributeCheck(node, 'method')) return;

		let methodParts = nodeAttribute.split(":");
		let imageAssignments = [];

		if (methods && typeof methods === "object") {
			this.processMethods(node, methods, imageAssignments);
		}

		if (imageAssignments.length > 0) {
			this.onImgFill(node, imageAssignments);
		}

		if (["mouseover", "click"].includes(methodParts[0])) {
			this.addEventListeners(node, methods);
		}
		return;
	}

	/**
	* Processes UX methods.
	* @param {node, methods, imageAssignments}
	* @return none
	*/
	
	processMethods(node, methods, imageAssignments) {
		
		for (let key in methods) {
			let method = methods[key];

			if (typeof method !== "function") continue;

			let methodLines = method.toString().split("\n");

			methodLines.forEach(line => {
				if (this.isImageAssignment(line)) {
					imageAssignments.push(line.split("="));
				}

				if (line.includes('.array')) {
					this.handleArrayClick(node);
				}
			});
		}
		this.counter++;
		return;
	}

	/**
	* Processes UX methods image assignments
	* @param {line}
	* @return none
	*/
	
	isImageAssignment(line) {
		return line.includes('this.') && line.includes('=') && (line.includes('img') || line.includes('image'));
	}
	
	/**
	* Processes UX methods arrays
	* @param {node}
	* @return none
	*/
	
	handleArrayClick(node) {
		
		if (this.getAtt(node, 'method').includes('{{')) return;

		const handleArray = () => {
			let methodParts = this.getAtt(node, 'method').split(":");
			let obj = Object.assign({}, methodParts.slice(3));

			if (Object.keys(obj).length > 1) {
				this.array.push(obj);
			}
		};
		
		this.events(node,'click', handleArray);
		
	return;
	}

	/**
	* Processes UX methods by addings eventlisteners.
	* @param {node, methods}
	* @return none
	*/
	
	addEventListeners(node, methods) {
		
		let eventType = this.getAtt(node, 'method').split(":")[0];

		const handleEvt = (event) => {
			let findMethod = node.getAttribute(':method');
			if (!findMethod || !methods || typeof methods !== "object") return;

			let imageAssignments = [];

			for (let key in methods) {
				let method = methods[key];

				if (typeof method !== "function") continue;

				let methodLines = method.toString().split("\n");

				methodLines.forEach(line => {
					if (this.isImageAssignment(line)) {
						imageAssignments.push(line.split("="));
					} else if (line.includes('this.') && line.includes('=')) {
						this.onText(node, line.split("="));
					}
				});

				this.onImg(node, imageAssignments);
				method(); 
			}
		};
		
		this.events(node,eventType,handleEvt,event);
		
	return;
	}

	/**
	* Binding dynamic IF statements
	* @param {node}
	* @return none
	*/
	
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
				let toEval = null, key = null, opp = '';
				let pieces = nodeAttribute.split("\s");
				node.hidden = true;
				pieces.forEach(piece => {
					if (find == piece) {
						opp += piece;
					}
				});
			} 
		}
		return;
	}

	/**
	* Loops over the virtual DOM, adds elements and replaces text - value pairs
	* @param {node}
	* @return none
	*/
	
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

			let imageElements = this.dom(null, 'queryall', 'img');
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
		return;
	}

	/**
	* Routes components from the /components/ folder.
	* @param {node, data}
	* @return none
	*/
	
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
					this.compileNodes(data);
				} catch (error) {
					console.error("UX Error: Routing fetch failed:", error);
				}
			}
		});
		return;
	}

	/**
	* Renders components from the /components/ folder
	* @param {node, data}
	* @return none
	*/
	
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
				.then(() => this.compileNodes(data))
				.finally(() => {
					this.nodes('bindToggle');
				});

		} else {
			return Promise.resolve().finally(() => {
				this.thread = 0;
			});
		}
		return;
	}

	/**
	* Renders HTML from a routed/rendered component
	* @param {node, data}
	* @return none
	*/
	
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
		return;
	}

	/**
	* Fetches and replaces text - value pairs.
	* @param {obj}
	* @return none
	*/
	
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
		return;
	}

	/**
	* Adds a progressmeter to the virtual DOM
	* @param {node}
	* @return none
	*/
	
	progress(node) {
		
		let attribute = this.getAtt(node, 'progress');
		if (!attribute) return;
		if (attribute !== null) {
			let [totalLoad, progressBarId] = attribute.split(':');
			let progressBar = this.dom(null, 'query', '#' + progressBarId);

			function updateProgress() {
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
				let progress = (scrollTop / scrollHeight) * 100;
				progressBar.style.width = progress + "%";
			}
				
			const updateLoaded = () => {
				progressBar.style.width = "50%";
			};

			const handleLoadProgress = () => {
				progressBar.style.width = "100%";
				setTimeout(() => progressBar.style.display = "none", 500);
			};
			
			this.events(window,'scroll', updateProgress);
			this.events(document,'DOMContentLoaded', updateLoaded);
			this.events(window,'load', handleLoadProgress);
		}
		return;
	}
 
 	/**
	* On handler. Bind and runs an eventhandler (such as oninput)
	* @param {node}
	* @return none
	*/
	
	bindOn(node) {
		let attribute = this.getAtt(node, 'on');
		if (!attribute) return;
		let [method, func] = attribute.split(':'); 
		const elements = this.dom(null, 'elements', '*');
			for (const ele of elements) {
				if (ele.getAttribute(':on') && !ele.hasEventListener) {
                const [method, func] = attribute.split(':');
					if (method && func) {
						if (typeof window[func] === 'function') {
							this.eventsWindow(ele,method,(event) => {
								event.preventDefault();
								window[func](event);
							},true);
						}
					}
				}
			}
	}

	/**
	* Run handler. Bind and runs an eventhandler (such as oninput)
	* @param {node}
	* @return none
	*/
	
	bindRun(node) {
		
		let attribute = this.getAtt(node, 'run');
		if (!attribute) return;
			if (attribute !== null) {
				let [method, fun] = attribute.split(':');
				node.addEventListener(method, async event => {
					event.preventDefault();
					const elements = this.dom(null, 'elements', '*');
					for (const ele of elements) {
						if (ele.getAttribute(':run')) {
							let [methods, func, id] = attribute.split(':');
								const fun = this.functions.find(f => f && f.name === func);
								if (fun && typeof fun === "function") {
									fun(id);
									} else {
									func(id);
								}
						}
					}
				});
			}
		return;
	}
	
	/**
	* Async form handler.
	* @param {requestUri,method,callback}
	* @return none
	*/
	
	async (requestUri, method, callback, jit=false) {
		
		const documentElements = this.nodeParentList();
		
		for (const element of documentElements) {

		if (this.getAtt(element, 'async') !== null) {
			
			element.addEventListener('submit', async event => {
			
			event.preventDefault();
			
			const forms = this.dom(null, 'elements', '*');
			
			// jit is a just in time callback that can be called before the fetch request runs.
			if(jit) jit();
			
			for (const form of forms) {
				if (form.getAttribute(':async') === 'true') {
				const formData = new FormData();
				formData.append('UXAsync', 'true');

				Array.from(form.elements).forEach(input => {
					if (input.name && input.value) formData.append(input.name, input.value);
					if (input.type === 'file') {
						Array.from(input.files).forEach(file => {
							formData.append(input.name, file);
						});
					}
				});

				try {
					const response = await fetch(requestUri, {
					method: 'POST',
					headers: {
						'Access-Control-Allow-Origin': UX.allowOrigin,
					},
					body: formData,
					credentials: 'include',
					});

					if (response.ok) {
					const responseText = await response.text();
					callback(responseText);
					} else {
					console.error('UX Error: Request failed with status:', response.status);
					}
				} catch (error) {
					console.error('UX Error: Error in async request:', error);
				}
				}
			}
			});
		}
		}
		return;
	}

	/**
	* A method for fetching URI's asynchronously
	* @param {requestUri,method,callback}
	* @return none
	*/

	async http(requestUri, method, callback) {
		
		const headers = new Headers();
		if (typeof UX !== "undefined" && UX.contentType) {
		headers.append("Content-Type", UX.contentType);
		}

		try {
		const response = await fetch(requestUri, {
			method: 'GET',
			headers: headers,
			credentials: 'include',
		});

		if (!response.ok) {
			throw new Error(`UX Error: Request failed with status: ${response.status}`);
		}

		const responseText = await response.text();

		if (method === 'callback') {
			callback(responseText);
		} else if (method === 'get') {
			return JSON.parse(responseText);
		} else if (method === 'render') {
			return responseText;
		}

		} catch (error) {
		console.error('UX Error: Network Error:', error);
		throw error;
		}
		return;
	}

	/**
	* Creates a HTML element
	* @param {node,type,elementOption}
	* @return none
	*/
	
	createElements(node, type, elementOption) {
		
		let opt = this.dom(null, 'create', type);
		if (elementOption.type == 'text') {
			let opt = this.dom(null, 'create', 'input');
		}
		if (elementOption.name) opt.name = elementOption.name;
		if (elementOption.type && elementOption.type != 'textarea') opt.type = elementOption.type;
		if (elementOption.value) opt.value = elementOption.value;
		if (elementOption.label) opt.innerHTML = elementOption.label;
		if (elementOption.placeholder) opt.placeholder = elementOption.placeholder;
		if (elementOption.required) opt.required = elementOption.required;
		if (elementOption.checked) opt.checked = elementOption.checked;
		node.appendChild(opt);
		return;
	}

	/**
	* Creates a HTML form dynamically
	* @param {node}
	* @return none
	*/
	
	createForm(node, find, values) {
		
		let nodeAttribute = this.getAtt(node, 'form');
		if (nodeAttribute !== null) {
			let parents = this.dom(null, 'create', 'div');
			node.appendChild(parents);
			let options = this.dom(null, 'create', 'form');
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
					let opt = this.dom(null, 'create', 'input');
					opt.type = elementOption.type;
					opt.name = elementOption.name;
					opt.value = elementOption.value;
					options.appendChild(opt);
				}
			}
			parents.appendChild(options);
		}
		return;
	}

	/**
	* Binds a developer tool to the virtual DOM
	* @param {node}
	* @return none
	*/
	
	bindDevtool(node) {
		
		if (!node) return;

		if (node.className && node.id) {
			node.setAttribute('title', `CLASS: ${node.className}, ID: ${node.id}`);
			node.style.border = '1px solid green';
		} else if (node.className) {
			node.setAttribute('title', `CLASS: ${node.className}`);
			node.style.border = '1px solid black';
		} else if (node.id) {
			node.setAttribute('title', `ID: ${node.id}`);
			node.style.border = '1px solid red';
		} else {
			node.setAttribute('title', 'No ID or CLASS');
			node.style.border = '1px solid gray';
		}
		return;
	}

	log(message) {
		console.log(message);
		return;
	}

	Message = {
		init: "UX Error: Cannot init a non-object.",
		enumerate: "UX Error: Could not enumerate global object."
	}
}