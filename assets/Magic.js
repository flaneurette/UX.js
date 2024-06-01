class Magic {

  static docElements = document.getElementsByTagName("*");
  static contentType = "application/json;charset=UTF-8";
  static allowOrigin = '*';

  init = {
    name: "Magic.js",
    version: "1.127",
    copyright: "(c) 2024 flaneurette",
    license: "MIT",
    instanceid: 1e5
  }

  load(list) {
    if(!Object(list)) {
      this.log(this.msg['initialize']);
      return false;
    } else {
      let data = list.data
      let method = list.methods;
      let events = list.events;
      if(data) { 
        for(const [key, value] of Object.entries(data)) {
          if(Array.isArray(value)) {
            this.nodes('bindLoop', key, value);
            this.nodes('createForm', key, value);
            this.nodes('bindOn', data, method, key, value);
            if(key == 'cleartype' && value == true) this.nodes('clearType', data, key, value);
	    this.nodes('bindParser', data, key, value);
            this.nodes('bindFlex', key, value, data, method);
            if(key == 'active' && value == true) this.nodes('bindActive', key, value);
          } else {
            // Parse nodes
            this.nodes('replaceNodeValue', key, value);
            this.nodes('bindAttributesNode', key, value);
            this.nodes('bindLogic', key, value);
            this.nodes('bindFunctions', key, value);
            this.nodes('bindCurtains', key, value);
            this.nodes('bindOn', key, value, data, method);
            this.nodes('bindFlex', key, value, data, method);
            if(key == 'active' && value == true) this.nodes('bindActive', key, value);
            if(key == 'cleartype' && value == true) this.nodes('clearType', data, key, value);
          }
        }
      }
    }
  }
  
  nodes(method, find, value, data=null, methods=null) {
    var docElements = this.nodeParentList();
    for(var i = 0; i < docElements.length; i++) {
      if(method == 'createForm') this.createForm(docElements[i], find, value);
      if(method == 'bindCurtains') this.bindCurtains(docElements[i], find, value);
      if(method == 'bindLoop') this.loop(docElements[i], find, value);
      if(method == 'bindFunctions') this.bindFunctions(docElements[i], find, value);
      if(method == 'bindLogic') this.bindIf(docElements[i], find, value); 
      if(method == 'bindOn') this.bindOn(docElements[i], data, methods, find, value);
      if(method == 'bindAttributesNode') this.bindClass(docElements[i], find, value);
      if(method == 'clearType') this.clearType(docElements[i], find, value);
      if(method == 'bindFlex') this.bindFlex(docElements[i], find, value);
      if(method == 'bindActive') this.bindActive(docElements[i], find, value);
      var docChildren = this.nodeChildren(docElements[i]);
      for(var j = 0; j < docChildren.length; j++) {
        if(method == 'replaceNodeValue') {
          if(docChildren[j].nodeType === 3) {
            const regex = new RegExp("{{\\s*" + find + "[0-9]*\\s*}}", "gmi");
            docChildren[j].nodeValue = docChildren[j].nodeValue.replace(regex, value);
          }
        }
      }
    }
  }

  getElements() {
    var docElements = Magic.docElements;
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

  getAtt(node, part) {
    let att = null;
    if(node.getAttribute('magic:' + part) !== null) {
      return node.getAttribute('magic:' + part);
    } else if(node.getAttribute('m:' + part) !== null) {
      return node.getAttribute('m:' + part);
    } else if(node.getAttribute(':' + part) !== null) {
      return node.getAttribute(':' + part);
    } else {
      return att;
    }
  }
  
  getAttCheck(node, part) {
    let check = (node.getAttribute('magic:'+part) !== null 
    || node.getAttribute('m:'+part) !== null 
    || node.getAttribute(':'+part) !== null) ? true : false;
    return check;
  }

  dom(id,method,value=null) {
    if(id !== null) {		
    switch(method) {
        case 'id': return document.getElementById(id); break;
        case 'get': return document.getElementById(id).value; break;
        case 'set': document.getElementById(id).value = value; break;
        case 'none': document.getElementById(id).hidden = true; break;
        case 'block': document.getElementById(id).hidden = false; break;
        case 'sethtml': document.getElementById(id).innerHTML = value; break;
        case 'gethtml': return document.getElementById(id).innerHTML; break;
        case 'display': document.getElementById(id).style.display = value; break;
        case 'parent': return document.getElementById(id).parentNode; break;
        case 'children': return document.getElementById(id).children; break;
	   }
     }
  }
  
  cloneNodes(list, id) {
    if(id === null) {
      return false;
    } else {
      const parentItem = this.dom(id,'parent');
      let docItem = this.dom(id,'id');
      let docClone = docItem.cloneNode(true);
      for(let i = 0; i < list.length; i++) {
        parentItem.appendChild(docClone);
      }
    }
  }

  bindClass(node, find, value) {
    let att = this.getAtt(node, 'class');
    if(att !== null) {
      if(att.toString() === find.toString()) node.className = value;
    }
  }

  bindId(node, find, value) {
    let att = this.getAtt(node, 'id');
    if(att !== null) {
      if(att.toString() === find.toString()) node.id = value;
    }
  }

  drawCurtains() {
    var docElements = Magic.docElements;
    for(var i = 0; i < docElements.length; i++) {
      if(docElements[i].getAttribute('magic:curtain') !== null 
        || docElements[i].getAttribute('m:curtain') !== null 
        || docElements[i].getAttribute(':curtain') !== null) {
        docElements[i].hidden = false;
      } 
    }
  }

  bindCurtains(node, find, value) {
    let att = this.getAtt(node, 'click');
    var docElements = this.nodeParentList();
    for(var i = 0; i < docElements.length; i++) {
      if(this.getAttCheck(docElements[i], 'curtain') == true) docElements[i].hidden = true;
    }
    if(this.getAttCheck(node, 'curtain') == false) {
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

  clearType(node, find, value) {
	let span = /(::s)\s([a-zA-Z][0-9]\s)/gm
	let div = /(::d)\s([a-zA-Z][0-9]\s)/gm
	node.innerHTML = node.innerHTML.replaceAll('::d',"<div>");
	node.innerHTML = node.innerHTML.replaceAll('d::',"</div>");
	node.innerHTML = node.innerHTML.replaceAll('::s',"<span>");
	node.innerHTML = node.innerHTML.replaceAll('s::',"</span>");
  }
  
  bindActive(node, find, value) {
      let att = this.getAtt(node, 'active');
      let active = window.location.href;
	  if(att !== null) {
	  if(att.indexOf(':') != -1 ) { 
          let pieces = att.split(':');
		if(active.match(pieces[0])) {
                   node.className = pieces[1].toString();
	      }
	  }
      }
  }
  
  bindFlex(node, find, value) {
    let att = this.getAtt(node, 'flex');
    if(att !== null) {
    if(att.indexOf(':') != -1 ) { 
    let flexbox = att.split(':');
    let flex = 'display:flex;';
    let flexdir = 'flex-direction:' + flexbox[1] + ';';
      if(flexbox[0] == 'true' || flexbox[0] == '1' || flexbox[0] == 'start' || flexbox[0] == 'left') node.setAttribute("style",flex + flexdir);
      if(flexbox[0] == 'end' || flexbox[0] == 'right') node.setAttribute("style", flex + 'justify-content: flex-end;' + flexdir);
      if(flexbox[0] == 'center') node.setAttribute("style",flex + 'justify-content: center;'+ flexdir);
      if(flexbox[0] == 'bottom') node.setAttribute("style",flex + 'align-items: baseline;'+ flexdir);
    }
   }
  }
  
  bindFunctions(node, find, value) {
    let att = this.getAtt(node, 'click');
    var docElements = Magic.docElements;
    if(att !== null) {
      if(find == 'count') {
        node.addEventListener('click', function() {
          for(var i = 0; i < docElements.length; i++) {
            if(docElements[i].getAttribute(':id') !== null) {
              let attribute = docElements[i].getAttribute(':id');
              if(att = 'count++') {
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
    if(this.getAttCheck(node, 'click') == true) {
      if(att !== null) {
        node.addEventListener('click', function() {
          let statics = document.body.innerHTML;
          let findMethod = node.getAttribute(':click');
          if(findMethod !== null) {
	        if(methods && Object(methods)) {
                 for(let key in methods) {
                 let funcs = methods[key];
                 let pairs = funcs.toString();
                 let fp = pairs.split("\n");
                   for(let i=0;i<fp.length;i++) {
                   // operators
                    if(fp[i].indexOf('this.') !== -1 && fp[i].indexOf('=') !== -1) {
                      let ps = fp[i].split('=');
                      if(ps[1].indexOf('.') !== -1) { 
                      // expressions
                      } else {
                        // text processing
                        ps[0] = ps[0].toString().replace(/^\s+|\t+/gm,'');
                        ps[1] = ps[1].toString().replace(/,|'|"|/gm,'');
                        let op = ps[0].split('.');
                        const regex = new RegExp("{{\\s*" + op[1] + "[0-9]*\\s*}}", "gmi");
                        node.innerHTML = node.innerHTML.replace(regex,ps[1]);         
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
    if(att !== null) {
      // functions
      if(att.indexOf('.') != -1) {
        let pieces = att.split('.');
        if(pieces.length > 0) {
          if(pieces.indexOf('has')) {
            let key = this.has(pieces[1]).toString();
            node.hidden = (value.indexOf(key) != -1) ? false : true;
          }
        }
      } else if(att.search("/\s/")) {
        // operators
        let toEval = null, key = null, opp = '';
        let pieces = att.split("\s");
        node.hidden = true;
        for(let i = 0; i < pieces.length; i++) {
          if(find == pieces[i]) {
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
    if(att !== null && att == find) {
      let c = node.children[0];
      let h = c.innerHTML;
      let object = Object.entries(values);
      let len = object.length;
      for(let i = 0; i < len; i++) {
        let k = Object.keys(object[i][1]);
        let v = Object.values(object[i][1]);
        c.innerHTML = h.replace("magichour1234", ""); // DOM bug
        for(let j = 0; j < v.length; j++) {
          if(c.innerHTML) {
            c.innerHTML = c.innerHTML.replace("{{" + k[j] + "}}", v[j]);
            if(c.innerHTML.indexOf("{{" + k[j] + "}}") != -1) {
               c.innerHTML = c.innerHTML.replace("{{" + k[j] + "}}", v[j]);
			}
          }
            c.setAttribute('id',find+i);
        }
        node.append(c);
        c = c.cloneNode(true);
        if(zebra !== null && node.children[i]) {
            let mod = 2;
            let className = zebra;
            if(zebra.indexOf(':') != -1) { 
               let parts = zebra.split(':');
               className = parts[0];
               mod = parts[1];
            }
            if(i % mod !== 0) node.children[i].className = className;
        }
      }
    }
  }

  http(uri, method, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", uri, true);
    req.withCredentials = true;
    req.setRequestHeader('Access-Control-Allow-Origin', Magic.allowOrigin);
    req.setRequestHeader("Content-Type", Magic.contentType);
    if(method == 'callback') {
    req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
        callback(req.responseText);
      }
    }
    req.send();  
    } else if(method == 'get') {
    req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
        return JSON.parse(req.responseText);
      }
    }
    req.send();
    }
  }

  createElements(node, type, arr) {
    let opt = document.createElement(type);
    if(arr.type == 'text') {
      let opt = document.createElement('input');
    }
    if(arr.name) opt.name = arr.name;
    if(arr.type && arr.type != 'textarea') opt.type = arr.type;
    if(arr.value) opt.value = arr.value;
    if(arr.label) opt.innerHTML = arr.label;
    if(arr.placeholder) opt.placeholder = arr.placeholder;
    if(arr.required) opt.required = arr.required;
    if(arr.checked) opt.checked = arr.checked;
    node.appendChild(opt);
  }

  createForm(node, find, values) {
    let att = this.getAtt(node, 'form');
    if(att !== null) {
      let parents = document.createElement('div');
	  node.appendChild(parents);
      let options = document.createElement('form');
      for(let key in values) {
        let arr = values[key];
        if(arr.type == 'form') {
          options.name = arr.name;
          options.action = arr.action;
          options.method = arr.method;
          if(arr.enctype) options.enctype = arr.enctype;
        }
        if(arr.type != 'textarea' && arr.type != 'submit') {
          this.createElements(options, 'label', arr);
          this.createElements(options, 'input', arr);
        } else if(arr.type == 'textarea') {
          this.createElements(options, 'label', arr);
          this.createElements(options, 'textarea', arr);
        } else if(arr.type == 'submit') {
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
  
  log(msg) {
    console.log(msg);
  }
  
  msg = {
    initialize: "Magic: Cannot initialize a non-object.",
    enumerate: "Magic: Could not enumerate global object."
  }
}
