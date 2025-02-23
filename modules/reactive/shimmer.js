export const Shimmer = {
	
	id: 'Shimmer',

	// init() is always called by UX.js, if it exists.
	init() {
		this.count = app.state.counter;
	},
	
	// render() is always called by UX.js, if it exists.
	render: () => `
		<h3>UX Shimmer</h3>
		<div id="shimmering">
			<div class="shimmer skeleton"></div>
			<div class="shimmer skeleton"></div>
			<div class="shimmer skeleton"></div>
		</div>
	`,

	// effect() is always called by UX.js, if it exists.
	effect() {
		const shimmer = () => {

			const container = app.dom('shimmering','id');

			function render(data) {
			if(data) { 
				data = JSON.parse(data);
				container.innerHTML = "";
					data.forEach(blog => {
						const element = document.createElement("div");
						element.textContent = blog.blogname;
						container.appendChild(element);
					});
				}
			}
			
			function init() {
				setTimeout(() => {
				let data = app.http('server-side/blog-xhr/data.php', 'callback', render);
				}, 2000); // Pseudo loading a large file.
			}

			init();
		};
		shimmer();
	},
	
	// myfunction is never called by UX.js, it must be added to the app.functions array first and properly binded to a data-action, for example, a button. See counter.js for an example.
	myfunction() {
		return null;
	}	
};

