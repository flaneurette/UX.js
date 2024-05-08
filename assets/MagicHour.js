/***
 ** Magic Hour v1.001
 * (c) 2024 flaneurette
 */

class Magic {

   msg = {
      initialize: "MH: Cannot initialize a non-object.",
      enumerate: "MH: Could not enumerate global object."
   }

   log(msg) {
      console.log(msg);
   }

   load(list) {

      if (!Object(list)) {
         this.log(this.msg['initialize']);
         return false;
      } else {

         let i = 0;
         let data = list.data
         let method = list.method;
         let events = list.events;

         if (data) {
            try {
               for (const [key, value] of Object.entries(data)) {

                  if (Array.isArray(value)) {
                     this.nodes('bindLoop', key, Object.values(value));
                  } else {
                     // Parse Nodes
                     this.nodes('replaceNodeValue', key, value);
                     this.nodes('bindAttributesNode', key, value);
                     this.nodes('bindLogic', key, value);
                     this.nodes('bindFunctions', key, value);
                     this.nodes('bindCurtains', key, value);
                     this.log(key + ':' + value);
                  }
               }
            } catch (e) {
               this.log(this.msg['enumerate']);
            }
         }
      }
   }

   getElements() {
      return document.getElementsByTagName("*");
   }

   nodeParentList() {
      let parentList = [];
      var docElements = document.getElementsByTagName("*")
      for (var i = 0; i < docElements.length; i++) {
         parentList.push(docElements[i]);
      }
      return parentList;
   }

   nodeChildren(parents) {
      let childList = [];
      for (var i = 0; i < parents.childNodes.length; i++) {
         childList.push(parents.childNodes[i]);
      }
      return childList;
   }

   clone(list, id) {
      if (id === null) {
         return false;
      } else {
         const parentItem = document.getElementById(id).parentNode;
         let docItem = document.getElementById(id);
         let docClone = docItem.cloneNode(true);

         for (let i = 0; i < list.length; i++) {
            parentItem.appendChild(docClone);
         }
      }
   }

   isVisible(id) {

      try {
         if (document.getElementById(id).style.display == "block") {
            document.getElementById(id).style.display = "none";
         } else if (document.getElementById(id).style.display == "none") {
            document.getElementById(id).style.display = "block";
         } else {}
      } catch (e) {}
   }

   bindClass(node, find, value) {
      if (node.getAttribute('magic:class') !== null) {
         let att = node.getAttribute('magic:class');
         if (att.toString() === find.toString()) {
            node.className = value;
         }
      }
      if (node.getAttribute('m:class') !== null) {
         let att = node.getAttribute('m:class');
         if (att.toString() === find.toString()) {
            node.className = value;
         }
      }
      if (node.getAttribute(':class') !== null) {
         let att = node.getAttribute(':class');
         if (att.toString() === find.toString()) {
            node.className = value;
         }
      }
   }

   bindId(node, find, value) {
      if (node.getAttribute('magic:id') !== null) {
         let att = node.getAttribute('magic:id');
         if (att.toString() === find.toString()) {
            node.id = value;
         }
      }
      if (node.getAttribute('m:id') !== null) {
         let att = node.getAttribute('m:id');
         if (att.toString() === find.toString()) {
            node.id = value;
         }
      }
      if (node.getAttribute(':id') !== null) {
         let att = node.getAttribute(':id');
         if (att.toString() === find.toString()) {
            node.id = value;
         }
      }
   }

   drawCurtains() {
      var docElements = document.getElementsByTagName("*")
      for (var i = 0; i < docElements.length; i++) {
         if (docElements[i].getAttribute('magic:curtain') !== null) {
            let curtain = docElements[i].getAttribute('magic:curtain');
            docElements[i].style = 'display:block;';
         }
      }
   }

   curtains(node, find, value) {

      let att = null;

      if (node.getAttribute('magic:onclick') !== null) {
         att = node.getAttribute('magic:onclick');
      }
      if (node.getAttribute('m:onclick') !== null) {
         att = node.getAttribute('m:onclick');
      }
      if (node.getAttribute(':onclick') !== null) {
         att = node.getAttribute(':onclick');
      }

      var docElements = this.nodeParentList();
      for (var i = 0; i < docElements.length; i++) {
         if (node.getAttribute('magic:curtain') !== null) {
            let curtain = node.getAttribute('magic:curtain');
            node.style = 'display:none;';
         }
         if (node.getAttribute('m:curtain') !== null) {
            let curtain = node.getAttribute('m:curtain');
            node.style = 'display:none;';
         }
         if (node.getAttribute(':curtain') !== null) {
            let curtain = node.getAttribute(':curtain');
            node.style = 'display:none;';
         }
      }

      if (node.getAttribute('magic:onclick') !== null || node.getAttribute('m:onclick') !== null || node.getAttribute('magic:onclick') !== null) {
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

   bindFunctions(node, find, value) {

      let att = null;
      var docElements = document.getElementsByTagName("*");

      if (node.getAttribute('magic:onclick') !== null) {
         att = node.getAttribute('magic:onclick');
      }
      if (node.getAttribute('m:onclick') !== null) {
         att = node.getAttribute('m:onclick');
      }
      if (node.getAttribute(':onclick') !== null) {
         att = node.getAttribute(':onclick');
      }

      if (node.getAttribute('magic:onclick') !== null || node.getAttribute('m:onclick') !== null || node.getAttribute('magic:onclick') !== null) {

         if (find == 'count') {
            node.addEventListener('click', function () {
               for (var i = 0; i < docElements.length; i++) {
                  if (docElements[i].getAttribute(':id') !== null) {
                     let attribute = docElements[i].getAttribute(':id');
                     docElements[i].innerText = (Number(docElements[i].innerText) + 1);
                  }
               }

            });
         }
      }

   }

   bindIf(node, find, value) {

      let att = null;

      if (node.getAttribute('magic:if') !== null) {
         att = node.getAttribute('magic:if');
      }
      if (node.getAttribute('m:if') !== null) {
         att = node.getAttribute('m:if');
      }
      if (node.getAttribute(':if') !== null) {
         att = node.getAttribute(':if');
      }

      if (node.getAttribute('magic:if') !== null || node.getAttribute('m:if') !== null || node.getAttribute(':if') !== null) {

         if (att !== null) {
            // functions
            if (att.indexOf('.') != -1) {
               let pieces = att.split('.');
               if (pieces.length > 0) {
                  if (pieces.indexOf('has')) {
                     let key = this.has(pieces[1]).toString();
                     if (value.indexOf(key) != -1) {
                        node.style = 'display: block';
                     } else {
                        node.style = 'display: none;';
                     }
                  }
               }

            } else if (att.search("/\s/")) {
               // operators
               let toEval = null,
                  key = null,
                  opp = '';
               let pieces = att.split("\s");
               console.log(pieces);
               node.style = 'display: none;';

               for (let i = 0; i < pieces.length; i++) {
                  if (find == pieces[i]) {
                     opp += pieces[i];
                  }
               }

            } else {}
         }
      }
      return;
   }

   loop(node, find, values) {

      let att = null;

      if (node.getAttribute('magic:loop') !== null) {
         att = node.getAttribute('magic:loop');
      }
      if (node.getAttribute('m:loop') !== null) {
         att = node.getAttribute('m:loop');
      }
      if (node.getAttribute(':loop') !== null) {
         att = node.getAttribute(':loop');
      }

      if (att != null) {

         if (find == node.getAttribute('magic:loop') || find == node.getAttribute('m:loop') || find == node.getAttribute(':loop')) {

            let child = node.children[0];
            let html = child.innerHTML;
            let object = Object.entries(values);
            let len = object.length;

            for (let i = 0; i < len; i++) {

               let k = Object.keys(object[i][1]);
               let v = Object.values(object[i][1]);

               if (child.innerHTML) {

                  if (k.length == 1) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]);
                  } else if (k.length == 2) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]);
                  } else if (k.length == 3) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]);
                  } else if (k.length == 4) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]);
                  } else if (k.length == 5) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]);
                  } else if (k.length == 6) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]).replace("{{" + k[5] + "}}", v[5]);
                  } else if (k.length == 7) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]).replace("{{" + k[5] + "}}", v[5]).replace("{{" + k[6] + "}}", v[6]);
                  } else if (k.length == 8) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]).replace("{{" + k[5] + "}}", v[5]).replace("{{" + k[6] + "}}", v[6]).replace("{{" + k[7] + "}}", v[7]);
                  } else if (k.length == 9) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]).replace("{{" + k[5] + "}}", v[5]).replace("{{" + k[6] + "}}", v[6]).replace("{{" + k[7] + "}}", v[7]).replace("{{" + k[8] + "}}", v[8]);
                  } else if (k.length == 10) {
                     child.innerHTML = html.replace("{{" + k[0] + "}}", v[0]).replace("{{" + k[1] + "}}", v[1]).replace("{{" + k[2] + "}}", v[2]).replace("{{" + k[3] + "}}", v[3]).replace("{{" + k[4] + "}}", v[4]).replace("{{" + k[5] + "}}", v[5]).replace("{{" + k[6] + "}}", v[6]).replace("{{" + k[7] + "}}", v[7]).replace("{{" + k[8] + "}}", v[8]).replace("{{" + k[9] + "}}", v[9]);
                  } else {}

                  node.append(child);
                  child = child.cloneNode(true);
               }
            }
         }
      }
   }

   nodes(method, find, value) {

      // Parentnodes.
      var docElements = this.nodeParentList();
      for (var i = 0; i < docElements.length; i++) {


         if (method == 'bindCurtains') {
            this.curtains(docElements[i], find, value)
         }

         if (method == 'bindLoop') {
            this.loop(docElements[i], find, value)
         }
         if (method == 'bindFunctions') {
            this.bindFunctions(docElements[i], find, value)
         }
         if (method == 'bindLogic') {
            this.bindIf(docElements[i], find, value)
         }

         if (method == 'bindAttributesNode') {
            this.bindClass(docElements[i], find, value)
            // this.bindId(docElements[i], find, value)
         }

         if (method == 'findAttributesNode') {
            if (docElements[i].hasAttribute("magic:for")) {
               this.log(true);
            }
         }

         // Childnodes.
         var docChildren = this.nodeChildren(docElements[i]);
         for (var j = 0; j < docChildren.length; j++) {

            if (method == 'replaceNodeValue') {
               if (docChildren[j].nodeType === 3) {
                  const regex = new RegExp("{{\\s*" + find + "[0-9]*\\s*}}", "gmi");
                  docChildren[j].nodeValue = docChildren[j].nodeValue.replace(regex, value);
               }
            }

         }
      }
   }
   parseJSON(uri) {
      this.fetchJSON(uri, function (response) {
         var obj = JSON.parse(response);
         return obj;
      });
   }

   fetchJSON(uri, callback) {

      var req = new XMLHttpRequest();

      req.open("GET", uri, true);
      req.withCredentials = true;

      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      req.onreadystatechange = function () {
         if (req.readyState == 4 && req.status == 200) {
            callback(req.responseText);
         }
      }
      req.send(null);
   }

   fetchHTML(method, uri, data = []) {

      var req = new XMLHttpRequest();
      var res = '';

      if (method == 'POST') {
         if (data != null) {
            var requestMethod = 'POST';
         }
      } else {
         var requestMethod = 'GET';
      }

      req.open(requestMethod, uri, true);
      req.withCredentials = true;
      req.setRequestHeader('Access-Control-Allow-Origin', '*');

      if (requestMethod == 'POST') {

         req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
         req.send(data);

         req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
               return req.responseText;
            }
         }

      } else {
         req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         req.send(null);
      }
   }
}
