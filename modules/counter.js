export const Counter = {
	
	id: 'Counter',
	
    init() {
		this.count = 0;
    },

    render() {
	return `
		<div>
			<h2>Count: <span id="counter">${this.count}</span></h2>
			<button data-action="increment">Increment</button>
		</div>
	`;
    },

    increment() {
		let counterElement = document.querySelector('#counter');
		let count = parseInt(counterElement.innerHTML, 10) || 0;
		counterElement.innerHTML = count + 1;
    }
}
