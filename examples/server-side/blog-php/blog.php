<?php

$title = 'This is my Blog';

$blogs = "[
		{blogname: 'I like Bananas', blogtext: 'Bananas are healthy', link: '#'},
		{blogname: 'I love Oranges', blogtext: 'Oranges are healthy', link: '#'},
		{blogname: 'I do not like Vegetables', blogtext: 'Vegetables are healthy', link: '#'}
		]
";

?>
<!DOCTYPE html>
<html>
<head>
  <title>Blog</title>
  <style>
    .div {
      border: 1px solid #ddd;
      padding: 10px;
	  margin: 10px;
    }

  </style>
<script src="../../../src/UX.js"></script>
</head>
<body>

<div id="app">
 <h1>{{blogTitle}}</h1>
  <div>
    <div :loop="blogs">
	<div :class="myClass">
		 <h2>{{blogname}}</h2>
		 <p>{{blogtext}}</p>
		 <span>{{link}}</span>
	 </div>
    </ul>
  </div>
</div>
	<script>
	
	let app = new UX();
	
	app.load({
		data: {
			myClass: "div",
			blogTitle: <?php echo $title;?>,
			blogs: <?php echo $blogs;?>
		}
		
	});
 
	</script>
</body>
</html>
