class UX {

    static docElements = document.getElementsByTagName("*");
    static contentType = "application/json;charset=UTF-8";
    static asyncType = "application/x-www-form-urlencoded; charset=UTF-8";
    static allowOrigin = '*';

    init = {
        name: "UX.js",
        version: "1.141",
        copyright: "(c) 2024 flaneurette",
        license: "MIT",
        instanceid: 1e5
    }

    load(list) {
        if (!Object(list)) {
            this.log(this.msg['initialize']);
            return false;
        } else {
            let data = list.data
            let method = list.methods;
            let events = list.events;
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
            this.nodes('render', data);
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    if (Array.isArray(value)) {
                        this.nodes('bindLoop', key, value);
                        this.nodes('createForm', key, value);
                        this.nodes('replaceNodeValue', key, value);
                        this.nodes('bindAttributesNode', key, value);
                        this.nodes('bindLogic', key, value);
                        this.nodes('bindFunctions', key, value);
                        this.nodes('bindOn', key, value, data, method);
                        this.nodes('bindActive');
                        if (key == 'cleartype' && value == true) this.nodes('clearType', data, key, value);
                        if (key == 'devtools' && value == true) this.nodes('devtools', data, key, value);
                    } else {
                        this.nodes('replaceNodeValue', key, value);
                        this.nodes('bindAttributesNode', key, value);
                        this.nodes('bindLogic', key, value);
                        this.nodes('bindFunctions', key, value);
                        this.nodes('bindOn', key, value, data, method);
                        this.nodes('bindActive');
                        if (key == 'cleartype' && value == true) this.nodes('clearType', data, key, value);
                        if (key == 'devtools' && value == true) this.nodes('devtools', data, key, value);
                    }
                }
            }
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
            if (method == 'bindFunctions') this.bindFunctions(docElements[i], find, value);
            if (method == 'bindLogic') this.bindIf(docElements[i], find, value);
            if (method == 'bindOn') this.bindOn(docElements[i], data, methods, find, value);
            if (method == 'bindAttributesNode') this.bindClass(docElements[i], find, value);
            if (method == 'clearType') this.clearType(docElements[i], find, value);
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

    dom(id, method, value = null) {
        if (id !== null) {
            switch (method) {
                case 'id':
                    return document.getElementById(id);
                    break;
                case 'get':
                    return document.getElementById(id).value;
                    break;
                case 'set':
                    document.getElementById(id).value = value;
                    break;
                case 'none':
                    document.getElementById(id).style.display = 'none';
                    break;
                case 'block':
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'sethtml':
                    document.getElementById(id).innerHTML = value;
                    break;
                case 'gethtml':
                    return document.getElementById(id).innerHTML;
                    break;
                case 'display':
                    document.getElementById(id).style.display = value;
                    break;
                case 'parent':
                    return document.getElementById(id).parentNode;
                    break;
                case 'children':
                    return document.getElementById(id).children;
                    break;
            }
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
                return pieces[1];
            }
        }
    }

    clearType(node, find, value) {
        let span = /(::s)\s([a-zA-Z][0-9]\s)/gm
        let div = /(::d)\s([a-zA-Z][0-9]\s)/gm
        node.innerHTML = node.innerHTML.replaceAll('::d', "<div>");
        node.innerHTML = node.innerHTML.replaceAll('d::', "</div>");
        node.innerHTML = node.innerHTML.replaceAll('::s', "<span>");
        node.innerHTML = node.innerHTML.replaceAll('s::', "</span>");
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
                if (active.match(pieces[0])) {
                    node.className = pieces[1].toString();
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
                let flexdir = 'flex-direction:' + flexbox[1] + ';';
                if (flexbox[0] == 'true' || flexbox[0] == '1' || flexbox[0] == 'start' || flexbox[0] == 'left') node.setAttribute("style", flex + flexdir);
                if (flexbox[0] == 'end' || flexbox[0] == 'right') node.setAttribute("style", flex + 'justify-content: flex-end;' + flexdir);
                if (flexbox[0] == 'center') node.setAttribute("style", flex + 'justify-content: center;' + flexdir);
                if (flexbox[0] == 'bottom') node.setAttribute("style", flex + 'align-items: baseline;' + flexdir);
            }
        }
    }

    bindAnimate(node) {
        let att = this.getAtt(node, 'animate');
        if (att !== null) {
            if (att.indexOf(':') != -1) {
                let a = att.split(':');
                let keyframes = document.createElement("style");
                keyframes.textContent = '@keyframes ' + a[0] + ' { from { ' + a[5].toString() + ': var(--from);} to {' + a[5].toString() + ':var(--to);}}';
                document.body.appendChild(keyframes);
                node.style = 'position: relative; --from:' + a[3] + 'px; --to:' + a[4] + 'px; animation: ' + a[0] + ' ' + a[2] + ' forwards; animation-timing-function: ' + a[1] + ';';
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
            let a = att.split(':');
            node.setAttribute("loading","lazy");
            let style = '';
            style += "background-color:" + a[1] + ";";
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

    bindToggle(node) {
        let att = this.getAtt(node, 'toggle');
        if (att !== null && att.indexOf(':') !== -1) {
            let pairs = att.split(':');
            document.getElementById(pairs[0]).hidden = true;
            node.addEventListener('click', function() {
                let docElements1 = document.getElementsByTagName("*");
                for (let i = 0; i < docElements1.length; i++) {
                    let att = docElements1[i].getAttribute(':toggle');
                    if (att !== null) {
                        let pairs1 = att.split(':');
                        if (pairs1[1] == 'in') {
                            node.setAttribute(':toggle', pairs1[0] + ':close');
                            document.getElementById(pairs1[0]).style.display = 'block';
                        }
                        if (pairs1[1] == 'close') {
                            node.setAttribute(':toggle', pairs1[0] + ':in');
                            document.getElementById(pairs1[0]).style.display = 'none';
                        }
                    }

                }
                if (pairs[2]) document.getElementById(pairs[0]).classList.toggle(pieces[2].toString());
            });

        }
    }

    bindMenu(node) {
        let att = this.getAtt(node, 'menu');
        if (att !== null && att.indexOf(':') !== -1) {
            let pairs = att.split(':');
            if (pairs[1] == 'in') {
                let list = document.getElementById(pairs[0]).children;
                for (let i = 0; i < list.length; i++) {
                    list[i].setAttribute(':menu', att);
                }
                document.getElementById(pairs[0]).hidden = true;
                node.addEventListener('mouseover', function() {
                    document.getElementById(pairs[0]).hidden = false;
                });
            }
            if (pairs[1] == 'out') {
                node.addEventListener('mouseout', function() {
                    let att = node.getAttribute(':menu');
                    if (att !== null && att.indexOf(':') !== -1) {
                        let pairs = att.split(':');
                        document.getElementById(pairs[0]).hidden = true;
                    }
                });
            }
        }
    }

    bindFunctions(node, find, value) {
        let att = this.getAtt(node, 'click');
        let docElements = UX.docElements;
        if (att !== null) {
            if (find == 'count') {
                node.addEventListener('click', function() {
                    for (let i = 0; i < docElements.length; i++) {
                        if (docElements[i].getAttribute(':id') !== null) {
                            let attribute = docElements[i].getAttribute(':id');
                            if (att = 'count++') {
                                docElements[i].innerText = (Number(docElements[i].innerText) + 1);
                            }
                        }
                    }
                });
            }
        }
    }

    bindMethods(node, data, methods, find, value) {
        let process = new Function(methods);
        process.apply();
    }

    bindOn(node, data, methods, find, value) {
        let att = this.getAtt(node, 'click');
        if (this.getAttCheck(node, 'click') == true) {
            if (att !== null) {
                node.addEventListener('click', function() {
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
                        let key = this.has(pieces[1]).toString();
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

    bindPrevent(node, find, value) {
        let att = this.getAtt(node, 'prevent');
        if (att !== null) {
            docElements[j].addEventListener('submit', event => {
                event.preventDefault();
            });
        }
    }
    
    reparse(nodes, data) {
        let nodalTree = null;
            for (const [key, value] of Object.entries(data)) {
            nodalTree = nodes.replaceAll('{{'+ key +'}}', value);
        }
        return nodalTree;
    }
    
    render(node, data) {
        let docElements = this.nodeParentList();             
        let att = this.getAtt(node, 'render');
        let uri = '../components/' + att;
            if (att !== null) {
                 fetch(uri)
                 .then(file => file.text())
                 .then(response => node.innerHTML = response)
                 .then(function(){     
                    for (const [key, value] of Object.entries(data)) {    
                        node.innerHTML = node.innerHTML.replace('{{'+ key +'}}', value);
                    }
                 });
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
                            req.onreadystatechange = function() {
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
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    callback(req.responseText);
                }
            }
            req.send();
        } else if (method == 'get') {
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    return JSON.parse(req.responseText);
                }
            }
            req.send();
        } else if(method == 'render') {
            req.onreadystatechange = function() {
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
