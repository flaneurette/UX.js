export const Form = {

	id: 'Form',
	
	init() {
		// Get states.
		this.agreed = app.state.agreed;
		this.food 	= app.state.foods;
	},

	render() {
		return `
		<h1>Form</h1>
		<form>
			<fieldset>
				<legend>Do you agree to our terms?</legend>
				<input type="radio" name="agreed" id="yes" value="Yes" 
				${this.agreed === 'Yes' ? 'checked' : ''} 
				onChange="reactiveChecked(event.target.value);" />
				<label for="yes">Yes</label>
				<br />
				<input type="radio" name="agreed" id="no" value="No" 
				${this.agreed === 'No' ? 'checked' : ''} 
				onChange="reactiveChecked(event.target.value);" />
				<label for="no">No</label>
			</fieldset>
		</form>
		<p>
			<strong>Agreed to:</strong>
			<span id="agreed">${this.agreed}</span>
		</p>
		<form>
		<fieldset>
			<legend>Select items:</legend>
				<input type="checkbox" name="foods" id="apples" value="Apples" 
				${this.food.includes('Apples') ? 'checked' : ''} 
				onChange="reactiveFoods(event.target.value,event.target.checked);" />
				<label for="apples">Apples</label>
				<input type="checkbox" name="foods" id="oranges" value="Oranges" 
				${this.food.includes('Oranges') ? 'checked' : ''} 
				onChange="reactiveFoods(event.target.value,event.target.checked);" />
				<label for="oranges">Oranges</label>
		</fieldset>
		</form>
		<p>
			<strong>Foods:</strong>
			<span id="foods">${app.state.foods}</span>
		</p>
		`;
	},
}

// Functions must be global, so bind to window.
window.reactiveChecked = function (value) {
	let counterElement = document.querySelector('#agreed');
	counterElement.textContent = value;
	// Update state
	app.state.agreed = value;
}

window.reactiveFoods = function (value,checked) {
	if (!app.state.foods.includes(value)) {
		app.state.foods.push(value);
	}
	let allFood = checked ? [...new Set(app.state.foods)] : app.state.foods.filter(item => item !== value);
	// Update state
	app.state.foods = allFood;
	let counterElement = document.querySelector('#foods');
	counterElement.textContent = app.state.foods;
}