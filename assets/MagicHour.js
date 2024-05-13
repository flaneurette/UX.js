class Magic {

  static staticHTML = document.body.innerHTML;
  static docElements = document.getElementsByTagName("*");
  static contentType = "application/json;charset=UTF-8";
  static allowOrigin = '*';

  init = {
    name: "Magic.js",
    version: "1.114",
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

      // place in bindOn function, send pairs through bindOn.
      if(method && Object(method)) {
        for(let key in method) {
          let funcs = method[key];
          let pairs = this.functionToArray(funcs.toString());
          if(pairs) {
            //console.log(pairs);
          }
        }
      }

      if(data) {
        for(const [key, value] of Object.entries(data)) {
          if(Array.isArray(value)) {
            this.nodes('bindLoop', key, value);
            this.nodes('createForm', key, value);
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

  bindClass(node, find, value) {
    let att = this.getAtt(node, 'class');
    if(att !== null) {
      if(att.toString() === find.toString()) {
        node.className = value;
      }
    }
  }

  bindId(node, find, value) {
    let att = this.getAtt(node, 'id');
    if(att !== null) {
      if(att.toString() === find.toString()) {
        node.id = value;
      }
    }
  }

  drawCurtains() {
    var docElements = Magic.docElements;
    for(var i = 0; i < docElements.length; i++) {
      if(docElements[i].getAttribute('magic:curtain') !== null) {
        docElements[i].hidden = false;
      } else if(docElements[i].getAttribute('m:curtain') !== null) {
        docElements[i].hidden = false;
      } else if(docElements[i].getAttribute(':curtain') !== null) {
        docElements[i].hidden = false;
      }
    }
  }

  bindCurtains(node, find, value) {
    let att = this.getAtt(node, 'click');
    var docElements = this.nodeParentList();
    for(var i = 0; i < docElements.length; i++) {
      if(node.getAttribute('magic:curtain') !== null) {
        node.hidden = true;
      } else if(node.getAttribute('m:curtain') !== null) {
        node.hidden = true;
      } else if(node.getAttribute(':curtain') !== null) {
        node.hidden = true;
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
    let att = this.getAtt(node, 'click');
    var docElements = Magic.docElements;
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
    let att = this.getAtt(node, 'click');
    if(node.getAttribute('magic:click') !== null || node.getAttribute('m:click') !== null || node.getAttribute(':click') !== null) {
      if(att !== null) {
        node.addEventListener('click', function() {
          let statics = Magic.staticHTML;
          let findMethod = statics.match(/(:click|m:click|magic:click)\s*=\s*("(.*)"|'(.*)')(\s*|\+)/);
          if(findMethod !== null) {
            let calledMethod = findMethod[3];
            if(calledMethod !== null) {
              // PARSE THE FUNCTION VALUES HERE
              console.log(findMethod[0])
              let processClick = new Function(calledMethod);
              processClick.apply();
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
            if(value.indexOf(key) != -1) {
              node.hidden = false;
            } else {
              node.hidden = true;
            }
          }
        }
      } else if(att.search("/\s/")) {
        // operators
        let toEval = null,
          key = null,
          opp = '';
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
    if(att != null) {
      let c = node.children[0];
      let h = c.innerHTML;
      let object = Object.entries(values);
      let len = object.length;
      for(let i = 0; i < len; i++) {
        let k = Object.keys(object[i][1]);
        let v = Object.values(object[i][1]);
        c.innerHTML = h.replace("magic123", ""); // DOM bug
        for(let j = 0; j < v.length; j++) {
          if(c.innerHTML) {
            c.innerHTML = c.innerHTML.replace("{{" + k[j] + "}}", v[j]);
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
      if(method == 'createForm') this.createForm(docElements[i], find, value);
      if(method == 'bindCurtains') this.bindCurtains(docElements[i], find, value);
      if(method == 'bindLoop') this.loop(docElements[i], find, value);
      if(method == 'bindFunctions') this.bindFunctions(docElements[i], find, value);
      if(method == 'bindLogic') this.bindIf(docElements[i], find, value); 
      if(method == 'bindOn') this.bindOn(docElements[i], find, value);
      if(method == 'bindAttributesNode') this.bindClass(docElements[i], find, value);
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
            const regex = new RegExp("{{\\s*" + find + "[0-9]*\\s*}}", "gmi");
            docChildren[j].nodeValue = docChildren[j].nodeValue.replace(regex, value);
          }
        }
      }
    }
  }

  functionToArray(x) {
    let arr = [];
    let z = x.split(/{/gm)
    for(let i = 0; i < z.length; i++) {
      if(z[i].match(':')) {
        let parsed = z[i].replaceAll('}', '').replace(/\s/g, '')
        let finals = parsed.split(',')
        for(let j = 0; j < finals.length; j++) {
          arr.push(finals[j].replace(':', ','))
        }
        return arr;
      }
    }
  }
  
  duplicatearray(a, b) {
    a.length = 0;
    a.push.apply(a, b);
    return a;
  }

  parseJSON(uri) {
    this.fetchJSON(uri, function(response) {
      let obj = JSON.parse(response);
      return obj;
    });
  }
  
  http(method, uri, callback=false) {

    let req = new XMLHttpRequest();
    req.open("GET", uri, true);
    req.withCredentials = true;
    req.setRequestHeader('Access-Control-Allow-Origin', Magic.allowOrigin);
    req.setRequestHeader("Content-Type", Magic.contentType);
    if(callback) {
    req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
        callback(req.responseText);
      }
    }
    req.send(null);  
    } else {
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
      let parents = document.getElementById(att);
      let options = document.createElement('form');
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
        if(arr.type == 'checkbox' || arr.type == 'hidden' || arr.type == 'text' || arr.type == 'file') {
          this.createElements(options, 'label', arr);
          this.createElements(options, 'input', arr);
        }

        if(arr.type == 'textarea') {
          this.createElements(options, 'label', arr);
          this.createElements(options, 'textarea', arr);
        }
        if(arr.type == 'submit') {
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

  msg = {
    initialize: "MH: Cannot initialize a non-object.",
    enumerate: "MH: Could not enumerate global object."
  }
}
