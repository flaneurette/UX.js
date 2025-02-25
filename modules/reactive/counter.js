export const Counter = {

	id: 'Counter',
	
	init() {
		this.count = app.state.counter;
	},

	render() {
		return `
			<h3>Count: <span id="counter">${this.count || 0}</span></h3>
			<button data-action="increment">Increment</button>
		`;
	},

	increment() {
		let counterElement = document.querySelector('#counter');
		let count = parseInt(counterElement.textContent, 10) || 0;
		let c = count + 1;
		counterElement.textContent = c;
		// Update state
		app.setState({counter: c});
	}
}
