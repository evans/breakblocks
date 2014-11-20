window.addEventListener('load', function() {
    paper.install(window);
    paper.setup('myCanvas');

    var tool = new Tool();
    var score = 0;
    tool.onMouseUp = function(event) {
    	var mole = event.getItem();
    	if(mole === null) return;

    	mole.remove();
    	score++;

    	document.getElementById('score').innerText = score;
    }

    setInterval(function() {
    	project.activeLayer.children.forEach(function(child) {
    		child.remove();
    	});

    	var circle = new Path.Circle(new Point(Math.random() * 200, Math.random() * 200), 10);

    	circle.fillColor = 'black';

    	view.draw();
    }, 2000);

	/*
    view.onFrame = function() {

        var rand = Math.random() * paper.
    }
    */
});
