export const Counter = {

	id: 'Counter',
	
	init() {
		this.count = app.state;
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
		let count = parseInt(counterElement.textContent, 10) || 0;
		let counter = count + 1;
		counterElement.textContent = counter;
		// Update state
		app.state = counter;
    }
}
