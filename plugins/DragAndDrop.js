class DragAndDrop extends UX {

    /* 
     * Example of a simple Drag and Drop Plugin for UX.js.
     */

    constructor() {
        super();
        this.htmlId = '';
        this.html = '';
    }

    initDrag = function() {
        let elems = this.dom(null, 'classes', (this.tableClass));
        var j = 1;
        Array.from(elems).forEach((elem) => {
            if (elem) {
                let att = this.dom((this.tableId + j), 'id');
                if (att) {
                    elem.setAttribute("draggable", true);
                    this.events(elem, 'drag', this.DragStart);
                }
            }
            j++;
        });
    }

    DragStart = function(event) {
        let xy = document.elementFromPoint(this.evt('x'), this.evt('y'));
        if (!xy || !xy.parentNode) return;
        xy = xy.parentNode;
        if (this.evt('parentNode') === xy.parentNode) {
            if (xy === this.evt('nextSibling')) {
                xy = xy.nextSibling;
            }
            this.evt('parentNode').insertBefore(this.evt('target'), xy);
        }
        this.DragEnd();
    };

    DragEnd = function() {
        const elems = this.dom(null, 'classes', (this.tableClass));
        Array.from(elems).forEach((elem, index) => {
            const ordering = elem.id.replace(this.tableId, '');
            const inputElement = this.dom((`${this.inputId}${index + 1}`), 'id');
            if (inputElement) {
                inputElement.value = `${ordering}:${index}`;
            }
        });
    };

}