class UX {

    static docElements = document.getElementsByTagName("*");
    static contentType = "application/json;charset=UTF-8";
    static asyncType = "application/x-www-form-urlencoded; charset=UTF-8";
    static componentsDir = "../components/";
    static cacheControl = "no-cache";
    static allowOrigin = '*';

    init = {
        name: "UX.js",
        version: "1.144",
        copyright: "(c) 2024 flaneurette",
        license: "MIT",
        instanceid: 1e5
    }

    load(list) {
        if (Object(list)) {
            let data = list.data
            let method = list.methods;
            let events = list.events;
            this.parseNodes(data);    
            Reflect.preventExtensions(data);
            if (data) {
                this.nodes('render', data);
                this.parseFunctions(data,method);
                if(Reflect.has(data, "devtools")) this.nodes('devtools', data);
            }
        } else {
            this.log(this.msg['initialize']);
            return false;
        }
    }

    nodes(method, find, value, data = null, methods = null, callback = null) {
        let docElements = this.nodeParentList();
        for (let i = 0; i < docElements.length; i++) {
            if (method == 'render') this.render(docElements[i], find, value);
            if (method == 'bindActive') this.bindActive(docElements[i], find, value);
            if (method == 'bindSelect') this.bindSelect(docElements[i], find, value);
            if (method == 'bindShow') this.bindShow(docElements[i], find, value);
            if (method == 'bindHide') this.bindHide(docElements[i], find, value);
            if (method == 'createForm') this.createForm(docElements[i], find, value);
            if (method == 'bindCurtains') this.bindCurtains(docElements[i], find, value);
            if (method == 'bindLoop') this.loop(docElements[i], find, value);
            if (method == 'bindFunctions') this.bindFunctions(docElements[i], data, find, value);
            if (method == 'bindLogic') this.bindIf(docElements[i], find, value);
            if (method == 'bindOn') this.bindOn(docElements[i], data, methods, find, value);
            if (method == 'bindAttributesNode') this.bindClass(docElements[i], find, value);
            if (method == 'bindFlex') this.bindFlex(docElements[i], find, value);
            if (method == 'bindMenu') this.bindMenu(docElements[i], find, value);
            if (method == 'bindToggle') this.bindToggle(docElements[i], find, value);
            if (method == 'bindVoid') this.bindVoid(docElements[i], find, value);
            if (method == 'bindPrevent') this.bindPrevent(docElements[i], find, value);
            if (method == 'bindAsync') this.bindAsync(docElements[i], find, value);
            if (method == 'devtools') this.bindDevtool(docElements[i], find, value);
            if (method == 'bindAnimate') this.bindAnimate(docElements[i], find, value);
            if (method == 'bindCascade') this.bindCascade(docElements[i], find, value);
            if (method == 'bindLazyLoad') this.bindLazyLoad(docElements[i], find, value);
            if (method == 'bindUri') this.bindUri(docElements[i], find, value);
            if (method == 'bindHamburger')  this.bindHamburger(docElements[i]);
            let docChildren = this.nodeChildren(docElements[i]);
            for (let j = 0; j < docChildren.length; j++) {
                if (method == 'replaceNodeValue') {
                    if (docChildren[j].nodeType === 3) {
                        const regex = new RegExp("{{\\s*" + find + "[0-9]*\\s*}}", "gmi");
                        docChildren[j].nodeValue = docChildren[j].nodeValue.replace(regex, value);
                    }
                }
            }
        }
    }
    
    parseFunctions(data,method) {
        for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            this.nodes('bindLoop', key, value);
            this.nodes('createForm', key, value);
            this.nodes('replaceNodeValue', key, value);
            this.nodes('bindAttributesNode', key, value);
            this.nodes('bindLogic', key, value);
            this.nodes('bindOn', key, value, data, method);
            this.nodes('bindActive');
            } else {
            this.nodes('replaceNodeValue', key, value);
            this.nodes('bindAttributesNode', key, value);
            this.nodes('bindLogic', key, value);
            this.nodes('bindOn', key, value, data, method);
            this.nodes('bindActive');
        }
      }
    }
    
    parseNodes(data) {
        this.nodes('bindActive');            
        this.nodes('bindToggle');
        this.nodes('bindMenu');
        this.nodes('bindVoid');
        this.nodes('bindPrevent');
        this.nodes('bindSelect');
        this.nodes('bindFlex');
        this.nodes('bindShow');
        this.nodes('bindHide');
        this.nodes('bindCurtains');
        this.nodes('bindAnimate');
        this.nodes('bindLazyLoad');
        this.nodes('bindCascade');
        this.nodes('bindUri');
        this.nodes('bindHamburger');
        this.nodes('bindFunctions', false, false, data);        
    }
    
    getElements() {
        let docElements = UX.docElements;
        return docElements;
    }

    nodeParentList() {
        let parentList = [];
        let docElements = this.getElements();
        for (let i = 0; i < docElements.length; i++) {
            parentList.push(docElements[i]);
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
        let att = null;
        if (node.getAttribute('ux:' + part) !== null) {
            return node.getAttribute('ux:' + part);
        } else if (node.getAttribute(':' + part) !== null) {
            return node.getAttribute(':' + part);
        } else {
            return att;
        }
    }

    getAttCheck(node, part) {
        let check = (node.getAttribute('ux:' + part) !== null ||
        node.getAttribute(':' + part) !== null) ? true : false;
        return check;
    }

    isInt(value) {
        return (value === parseInt(value)) ? parseInt(value).toFixed(2) : parseFloat(value).toFixed(2);
    }
    
    dom(id, method, value = null) {
        if (id !== null) {
            if(method == 'id') return document.getElementById(id);
            if(method == 'get') return document.getElementById(id).value;
            if(method == 'set') document.getElementById(id).value = value;    
            if(method == 'none') document.getElementById(id).style.display = 'none';  
            if(method == 'block') document.getElementById(id).style.display = 'block';  
            if(method == 'sethtml') document.getElementById(id).innerHTML = value; 
            if(method == 'gethtml') return document.getElementById(id).innerHTML; 
            if(method == 'display') document.getElementById(id).style.display = value;  
            if(method == 'parent') return document.getElementById(id).parentNode;  
            if(method == 'children') return document.getElementById(id).children; 
        }
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
        let att = this.getAtt(node, 'class');
        if (att !== null) {
            if (att.toString() === find.toString()) node.classList.toggle(value);
        }
    }

    bindId(node, find, value) {
        let att = this.getAtt(node, 'id');
        if (att !== null) {
            if (att.toString() === find.toString()) node.id = value;
        }
    }

    drawCurtains() {
        let docElements = UX.docElements;
        for (let i = 0; i < docElements.length; i++) {
            if (docElements[i].getAttribute(':curtain') !== null) {
                docElements[i].hidden = false;
            }
        }
    }

    bindCurtains(node, find, value) {
        let att = this.getAtt(node, 'click');
        let docElements = this.nodeParentList();
        for (let i = 0; i < docElements.length; i++) {
            if (this.getAttCheck(docElements[i], 'curtain') == true) docElements[i].hidden = true;
        }
        if (att !== null && this.getAttCheck(node, 'curtain') !== null) {
            node.addEventListener('click', this.drawCurtains, false);
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
        let att = this.getAtt(node, 'hidden');
        if (att !== null) {
            node.hidden = false;
        }
    }

    bindHide(node) {
        let att = this.getAtt(node, 'hidden');
        if (att !== null && att == 'true') {
            node.hidden = true;
        }
    }

    bindVoid(node) {
        let att = this.getAtt(node, 'void');
        if (att !== null) {
            node.setAttribute('href', 'javascript:void(0);');
        }
    }

    bindScroll(node) {
        let att = this.getAtt(node, 'scroll');
        if (att !== null) {
            node.setAttribute('href', 'javascript:void(0);');
            node.addEventListener('click', function eventHandler() {
                window.scrollTo = scrollTo(0, window.innerHeight);
            });
        }
    }

    bindActive(node) {
        let att = this.getAtt(node, 'active');
        let active = window.location.href;
        if (att !== null) {
            if (att.indexOf(':') != -1) {
                let pieces = att.split(':');
                if (active.match(Reflect.get(pieces, 0))) {
                    node.className = Reflect.get(pieces, 1).toString();
                }
            }
        }
    }

    bindSelect(node) {
        let att = this.getAtt(node, 'select');
        if (att !== null) {
            node.className = att.toString();
        }
    }

    bindFlex(node) {
        let att = this.getAtt(node, 'flex');
        if (att !== null) {
            if (att.indexOf(':') != -1) {
                let flexbox = att.split(':');
                let flex = 'display:flex;';
                let flexdir = 'flex-direction:' + Reflect.get(flexbox, 1) + ';';
                if(Reflect.get(flexbox, 0) == 'true' 
                || Reflect.get(flexbox, 0) == '1' 
                || Reflect.get(flexbox, 0) == 'start' 
                || Reflect.get(flexbox, 0) == 'left') node.setAttribute("style", flex + flexdir);
                if(Reflect.get(flexbox, 0) == 'end' 
                || Reflect.get(flexbox, 0) == 'right') node.setAttribute("style", flex + 'justify-content: flex-end;' + flexdir);
                if(Reflect.get(flexbox, 0) == 'center') node.setAttribute("style", flex + 'justify-content: center;' + flexdir);
                if(Reflect.get(flexbox, 0) == 'bottom') node.setAttribute("style", flex + 'align-items: baseline;' + flexdir);
            }
        }
    }

    bindAnimate(node) {
        let att = this.getAtt(node, 'animate');
        if (att !== null) {
            if (att.indexOf(':') != -1) {
                let f = att.split(':');
                let keyframes = document.createElement("style");
                keyframes.textContent = '@keyframes ' + Reflect.get(f, 0) 
                + '{ from { ' + Reflect.get(f, 5).toString() 
                + ': var(--from);} to {' + Reflect.get(f, 5).toString() 
                + ':var(--to);}}';
                document.body.appendChild(keyframes);
                node.style = 'position: relative; --from:' 
                + Reflect.get(f, 3) + 'px; --to:' + Reflect.get(f, 4) 
                + 'px; animation: ' + Reflect.get(f, 0) + ' ' 
                + Reflect.get(f, 2) + ' forwards; animation-timing-function: ' 
                + Reflect.get(f, 1) + ';';
            }
        }
    }

    bindCascade(node, find) {
        let att = this.getAtt(node, 'cascade');
        if (att !== null) {
            let a = att.split(':');
            const [type,index,height1,height2] = a;
            let childs = node.children;
            for (let i = 0; i < childs.length; i++) {
                if (type == 'menu') {
                    if (i == index) {
                        let styles = '';
                        styles += 'position:fixed!important;';
                        styles += 'z-index:' + (childs.length + 1) + ';';
                        styles += 'height:' + height1 + 'px!important;';
                        styles += 'width:100%;';
                        node.children[i].setAttribute("style",styles);
                    } else {
                        let styles = '';
                        styles += 'position:relative!important;';
                        styles += 'z-index:' + (i + 2) + ';';
                        styles += 'top:' + height2 + 'px;';
                        node.children[i].setAttribute("style",styles);
                    }
                } else {
                    if (i == index) {
                        let styles = '';
                        styles += 'position:fixed!important;';
                        styles += 'z-index:0;';
                        styles += 'width:100%;';
                        node.children[i].setAttribute("style",styles);
                    } else {
                        let styles = '';
                        styles += 'position:relative!important;';
                        styles += 'z-index:' + (i + 2) + ';';
                        styles += 'top:' + height2 + 'px;';
                        node.children[i].setAttribute("style",styles);
                    }
                }
            }
        }
    }

    bindLazyLoad(node, find) {
        let att = this.getAtt(node, 'lazy');
        if (att !== null) {
            let lazy = att.split(':');
            node.setAttribute("loading","lazy");
            let style = '';
            style += "background-color:" + Reflect.get(lazy, 1) + ";";
            style += "background-size: cover;";
            node.setAttribute("style",style);
        }
    }

    bindUri(node) {
        let att = this.getAtt(node, 'link');
        if (att !== null) {
            node.setAttribute('href', 'javascript:void(0);');
            node.addEventListener('click', function eventHandler() {
                document.location = att;
            });
        }
    }
    
    bindHamburger(node) {
        let att = this.getAtt(node, 'hamburger');
        if (att !== null && att.indexOf(':') !== -1) {
            let pairs = att.split(':');
            let width = Reflect.get(pairs, 1);
			let height = 10;
			let spacing = Reflect.get(pairs, 2);
			    let canvas = document.createElement('canvas');
				node.append(canvas);
				canvas.setAttribute('width',width);
				canvas.setAttribute('height',width);
                var c = canvas;
                var ctx = c.getContext("2d");
                ctx.strokeStyle = Reflect.get(pairs, 0);
				if(!spacing) spacing = 0;
                ctx.moveTo(width,spacing);
                ctx.lineTo(0,spacing);
                ctx.stroke();
                ctx.moveTo(width,(spacing * 2));
                ctx.lineTo(0,(spacing * 2));
                ctx.stroke();
                ctx.moveTo(width,(spacing * 3));
                ctx.lineTo(0,(spacing * 3));
                ctx.stroke(); 
                ctx.moveTo(width,(spacing * 3));
                ctx.lineTo(0,(spacing * 3));
                ctx.stroke();  				
        }
    }

    bindToggle(node) {
        let att = this.getAtt(node, 'toggle');
        if (att !== null && att.indexOf(':') !== -1) {
            let pairs = att.split(':');
            node.addEventListener('click', () => {
                let docElements1 = document.getElementsByTagName("*");
                for (let i = 0; i < docElements1.length; i++) {
                    let att = docElements1[i].getAttribute(':toggle');
                    if (att !== null) {
                        let pairs1 = att.split(':');
                        if (Reflect.get(pairs, 1) == 'in') {
                            node.setAttribute(':toggle', Reflect.get(pairs, 0) + ':close');
                            if(Reflect.get(pairs, 2)) document.getElementById(Reflect.get(pairs, 0)).classList.toggle(Reflect.get(pairs, 2));
                            document.getElementById(Reflect.get(pairs, 0)).style.display = 'block';
                        }
                        if (Reflect.get(pairs, 1) == 'close') {
                            node.setAttribute(':toggle', Reflect.get(pairs, 0) + ':in');
                            document.getElementById(Reflect.get(pairs, 0)).style.display = 'none';
                        }
                    }

                }
            });

        }
    }

    bindMenu(node) {
        let att = this.getAtt(node, 'menu');
        if (att !== null && att.indexOf(':') !== -1) {
            let pairs = att.split(':');
            if (Reflect.get(pairs, 1) == 'in') {
                let list = document.getElementById(Reflect.get(pairs, 0)).children;
                for (let i = 0; i < list.length; i++) {
                    list[i].setAttribute(':menu', att);
                }
                document.getElementById(Reflect.get(pairs, 0)).hidden = true;
                node.addEventListener('mouseover', () => {
                    document.getElementById(Reflect.get(pairs, 0)).hidden = false;
                });
            }
            if (Reflect.get(pairs, 1) == 'out') {
                node.addEventListener('mouseout', () =>  {
                    let att = node.getAttribute(':menu');
                    if (att !== null && att.indexOf(':') !== -1) {
                        let pairs = att.split(':');
                        document.getElementById(Reflect.get(pairs, 0)).hidden = true;
                    }
                });
            }
        }
    }
        
    bindFunctions(node, data, find, value) {
        
        let att = this.getAtt(node, 'click');
        let docElements = UX.docElements;
        let countID, count, multiply, countdown, interval, clear, countvalue = 0; 
        
        for(const [key, value] of Object.entries(data)) { 
            if(key == 'id') countID = value; 
            if(key == 'count') count = value;  
            if(key == 'countvalue') countvalue = value;
            if(key == 'multiply') multiply = value; 
            if(key == 'countdown') countdown = value; 
            if(key == 'interval') interval = value; 
            if(key == 'clear') clear = value; 
        }
        
        if (att !== null) { 
            let counterNode = document.getElementById(countID);
            node.addEventListener('click', () => {
                var calc = Number(counterNode.innerText);
                if (att == 'count++') counterNode.innerText = this.isInt((calc) + countvalue);
                if (att == 'count--') counterNode.innerText = this.isInt((calc) - countvalue);
                if (att == 'multiply') counterNode.innerText = this.isInt((calc) * multiply);
                if (att == 'countdown') { 
                let timer = setInterval(() =>{
                    counterNode.innerText = this.isInt(Number(counterNode.innerText) - countvalue); 
                    if(Number(counterNode.innerText)<=clear) clearInterval(timer); 
                    }, interval);
                }
            });
           
        }
    }

    bindMethods(node, data, methods, find, value) {
        let process = new Function(methods);
        process.apply();
    }

    bindPrevent(node, find, value) {
        let att = this.getAtt(node, 'prevent');
        if (att !== null) {
            docElements[j].addEventListener('submit', event => {
                event.preventDefault();
            });
        }
    }
    
    bindOn(node, data, methods, find, value) {
        let att = this.getAtt(node, 'click');
        if (this.getAttCheck(node, 'click') == true) {
            if (att !== null) {
                node.addEventListener('click', () => {
                    let statics = document.body.innerHTML;
                    let findMethod = node.getAttribute(':click');
                    if (findMethod !== null) {
                        if (methods && Object(methods)) {
                            for (let key in methods) {
                                let funcs = methods[key];
                                let pairs = funcs.toString();
                                let fp = pairs.split("\n");
                                for (let i = 0; i < fp.length; i++) {
                                    // operators
                                    if (fp[i].indexOf('this.') !== -1 && fp[i].indexOf('=') !== -1) {
                                        let ps = fp[i].split('=');
                                        if (ps[1].indexOf('.') !== -1) {
                                            // expressions
                                        } else {
                                            // text processing
                                            ps[0] = ps[0].toString().replace(/^\s+|\t+/gm, '');
                                            ps[1] = ps[1].toString().replace(/,|'|"|/gm, '');
                                            let op = ps[0].split('.');
                                            const regex = new RegExp("{{\\s*" + op[1] + "[0-9]*\\s*}}", "gmi");
                                            node.innerHTML = node.innerHTML.replace(regex, ps[1]);
                                        }
                                    }
                                }
                                // method functions
                                funcs.apply();
                            }
                        }
                    }
                });
            }
        }
    }

    bindIf(node, find, value) {
        let att = this.getAtt(node, 'if');
        if (att !== null) {
            // functions
            if (att.indexOf('.') != -1) {
                let pieces = att.split('.');
                if (pieces.length > 0) {
                    if (pieces.indexOf('has')) {
                        let key = this.has(Reflect.get(pieces, 1)).toString();
                        node.hidden = (value.indexOf(key) != -1) ? false : true;
                    }
                }
            } else if (att.search("/\s/")) {
                // operators
                let toEval = null,
                    key = null,
                    opp = '';
                let pieces = att.split("\s");
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
        let att = this.getAtt(node, 'loop');
        let attclick = this.getAtt(node, 'click');
        let zebra = this.getAtt(node, 'zebra');
        if (att !== null && att == find) {
            let c = node.children[0];
            let h = c.innerHTML;
            let object = Object.entries(values);
            let len = object.length;
            for (let i = 0; i < len; i++) {
                let k = Object.keys(object[i][1]);
                let v = Object.values(object[i][1]);
                c.innerHTML = h.replace("UX1234", ""); // DOM bug
                for (let j = 0; j < v.length; j++) {
                    if (c.innerHTML) {
                        c.innerHTML = c.innerHTML.replace("{{" + k[j] + "}}", v[j]);
                        if (c.innerHTML.indexOf("{{" + k[j] + "}}") != -1) {
                            c.innerHTML = c.innerHTML.replace("{{" + k[j] + "}}", v[j]);
                        }
                    }
                    c.setAttribute('id', find + i);
                }
                node.append(c);
                c = c.cloneNode(true);
                if (zebra !== null && node.children[i]) {
                    let mod = 2;
                    let className = zebra;
                    if (zebra.indexOf(':') != -1) {
                        let parts = zebra.split(':');
                        className = parts[0];
                        mod = parts[1];
                    }
                    if (i % mod !== 0) node.children[i].classList.toggle(className);
                }
            }
        }
    }
    
    render(node, data) {       
        let attribute = this.getAtt(node, 'render');
        let uri = UX.componentsDir + attribute;
            if (attribute !== null) {
                const options = new Headers();
                options.append("Cache-Control", UX.cacheControl);
                let promise = fetch(uri, options)
                 .then(file => file.text())
                 .then(response => node.setHTMLUnsafe(response))
                 .then(() => this.renderHTML(node,data))
                 .then(() => this.parseNodes(data));
        }
    }
        
    renderHTML(node,data) { 
        for (const [key, value] of Object.entries(data)) { 
        if(Array.isArray(value)) {
            let j =0;
            for (const [keys, values] of Object.entries(value)) { 
                let array = Object.entries(value[j]);
                node.innerHTML = node.innerHTML.replace('{{'+ array[0][0] +'}}', array[0][1]);
            j++;
            }
         } else {         
         node.innerHTML = node.innerHTML.replace('{{'+ key +'}}', value);
        }
      }
    }
    
    fetch(obj) {
        if (Object(obj)) {
            let docElements = this.nodeParentList();
              for (let i = 0; i < docElements.length; i++) {
                let docChildren = this.nodeChildren(docElements[i]);
                  for (let j = 0; j < docChildren.length; j++) {
                    for (const [key, value] of Object.entries(obj)) {
                      if (Object(value)) {
                        for (const [key1, value1] of Object.entries(value)) {
                         if (docChildren[j].nodeType === 3) {
                           docChildren[j].nodeValue = docChildren[j].nodeValue.replace("{{"+key1+"}}", value1);
                  }
                }
              }
            }
          }
        }    
      }
    }
    
    async (uri, method, callback) {
        let att = false;
        let docElements = this.nodeParentList();
        for (let j = 0; j < docElements.length; j++) {
            att = this.getAtt(docElements[j], 'async');
            if (att !== null) {
                docElements[j].addEventListener('submit', event => {
                    event.preventDefault();
                    let parentList = [];
                    let docElements1 = document.getElementsByTagName("*");
                    for (let i = 0; i < docElements1.length; i++) {
                        if (docElements1[i].getAttribute(':async') == 'true') {
                            let children = docElements1[i].children;
                            let req = new XMLHttpRequest();
                            let data = [];
                            data.push('UXAsync=true');
                            for (let i = 0; i < children.length; i++) {
                                if (children[i].value != '') {
                                    data.push('&' + children[i].name + '=' + encodeURIComponent(children[i].value.toString()));
                                }
                            }
                            req.open("POST", uri, true);
                            req.withCredentials = true;
                            req.setRequestHeader('Access-Control-Allow-Origin', UX.allowOrigin);
                            req.setRequestHeader('Content-Type', UX.asyncType);
                            req.onreadystatechange = () =>  {
                                if (req.readyState == 4 && req.status == 200) {
                                    if (req.responseText) {
                                        callback(req.responseText);
                                    }
                                }
                            }
                            req.send(data);
                        }
                    }
                });
            }
        }
    }

    http(uri, method, callback) {
        let req = new XMLHttpRequest();
        req.open("GET", uri, true);
        req.withCredentials = true;
        req.setRequestHeader('Access-Control-Allow-Origin', UX.allowOrigin);
        req.setRequestHeader("Content-Type", UX.contentType);
        if (method == 'callback') {
            req.onreadystatechange = () =>  {
                if (req.readyState == 4 && req.status == 200) {
                    callback(req.responseText);
                }
            }
            req.send();
        } else if (method == 'get') {
            req.onreadystatechange = () =>  {
                if (req.readyState == 4 && req.status == 200) {
                    return JSON.parse(req.responseText);
                }
            }
            req.send();
        } else if(method == 'render') {
            req.onreadystatechange = () =>  {
                if (req.readyState == 4 && req.status == 200) {
                    return req.responseText;
                }
            }
            req.send();    
        }
        
    }    

    createElements(node, type, arr) {
        let opt = document.createElement(type);
        if (arr.type == 'text') {
            let opt = document.createElement('input');
        }
        if (arr.name) opt.name = arr.name;
        if (arr.type && arr.type != 'textarea') opt.type = arr.type;
        if (arr.value) opt.value = arr.value;
        if (arr.label) opt.innerHTML = arr.label;
        if (arr.placeholder) opt.placeholder = arr.placeholder;
        if (arr.required) opt.required = arr.required;
        if (arr.checked) opt.checked = arr.checked;
        node.appendChild(opt);
    }

    createForm(node, find, values) {
        let att = this.getAtt(node, 'form');
        if (att !== null) {
            let parents = document.createElement('div');
            node.appendChild(parents);
            let options = document.createElement('form');
            for (let key in values) {
                let arr = values[key];
                if (arr.type == 'form') {
                    options.name = arr.name;
                    options.action = arr.action;
                    options.method = arr.method;
                    if (arr.enctype) options.enctype = arr.enctype;
                }
                if (arr.type != 'textarea' && arr.type != 'submit') {
                    this.createElements(options, 'label', arr);
                    this.createElements(options, 'input', arr);
                } else if (arr.type == 'textarea') {
                    this.createElements(options, 'label', arr);
                    this.createElements(options, 'textarea', arr);
                } else if (arr.type == 'submit') {
                    let opt = document.createElement('input');
                    opt.type = arr.type;
                    opt.name = arr.name;
                    opt.value = arr.value;
                    options.appendChild(opt);
                }
            }
            parents.appendChild(options);
        }
    }
    
    bindDevtool(node) {
        if (node.className !== '' && node.id !== '') {
            node.setAttribute('title', 'CLASS: ' + node.className + ', ID: ' + node.id);
            node.style = 'border: 1px dashed green;';
            } else if (node.className !== '') {
            node.setAttribute('title', 'CLASS: ' + node.className);
            node.style = 'border: 1px dashed black;';
            } else if (node.id !== '') {
            node.setAttribute('title', 'ID: ' + node.id);
            node.style = 'border: 1px dashed red;';
        }
    }
    
    log(msg) {
        console.log(msg);
    }

    msg = {
        initialize: "ux: Cannot initialize a non-object.",
        enumerate: "ux: Could not enumerate global object."
    }
}
    