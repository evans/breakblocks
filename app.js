var world;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var ball;
var listener;

function setupWorld() {
  $('myCanvas').setStyle({
    backgroundColor: '#900',
  });
/*
//Collision listener
  listener = new Box2D.Dynamics.b2ContactListener;
  listener.BeginContact = function(contact) {
      // console.log(contact.GetFixtureA().GetBody().GetUserData());
  }
  listener.EndContact = function(contact) {
    console.log(contact.GetFixtureA().GetBody().GetUserData());
    console.log(contact.GetFixtureB().GetBody().GetUserData());
  }
  world.SetContactListener(listener);
  */

  console.log('Setup world');
  world = createWorld();
  var blocks = [];

  for(var r = 0; r < 10; r++)
  {
    blocks[r] = [];
    for(var c = 0; c < 10; c++)
    {
      blocks[r][c] = createBox(world, 50 * r + 20, 40 * c + 20, 20, 10, true);
      blocks[r][c].userData = {name: 'brick', row: r, col: c};
    }
  }

  ball = createBall(world, 30, 30);
  ball.userData = {name: 'ball'};
};

function step() {
	var timeStep = 1.0/60;
	var iteration = 1;
  for(var c = ball.m_contactList; c ; c = c.GetNext())
  {
    var body1 = c.m_shape1.m_body;
    var body2 = c.m_shape2.m_body;

    if(!body1.GetUserData() || !body2.GetUserData())
      continue;
    if(body1.GetUserData().name === 'ball' && body2.GetUserData() === 'brick')
    {
      world.DestroyBody(body2);
    }
    if(body1.GetUserData().name === 'ball' && body2.GetUserData() === 'brick')
    {
      world.DestroyBody(body1);
    }
  }
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);
};

Event.observe(window, 'load', function() {
  console.log('Setup');
  paper.install(window);
  paper.setup('myCanvas');

	setupWorld();
	ctx = $('myCanvas').getContext('2d');
	var canvasElm = $('myCanvas');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);

  setInterval(step, 1.0);

  /*
  var tool = new Tool();
  var score = 0;
  tool.onMouseUp = function(event) {
    var mole = event.getItem();
    if(mole === null) return;

    mole.remove();
    score++;

    document.getElementById('score').innerText = score;
  }


  view.onFrame = function() {

  }
  */
});

