var world;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var ball;
var listener;
var paddle;
var paddle_constraints;
var paddle_mov;
var paddle_speed = 50.0;
var offset = 150.0;

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
      blocks[r][c] = createBox(world, 50 * r + 25, 20 * c + 20, 10, 5, true);
      blocks[r][c].m_userData = {name: 'brick', row: r, col: c};
    }
  }
  /*
  blocks[0] = [];
  blocks[0][0] = createBox(world, 50 + 10, 40 + 20, 20, 10, true);
  blocks[0][0].m_userData = {name: 'brick', row: 0, col: 0};
  */

  ball = createBall(world, 250, 200);
  ball.m_userData = {name: 'ball'};
  ball.SetLinearVelocity(new b2Vec2 (0, 100));
  //ball.ApplyForce(new b2Vec2 (0, -10), ball.GetCenterPosition());
  //ball.ApplyImpulse(new b2Vec2 (0, -10), ball.GetCenterPosition());

  paddle = createPaddle(world, 250, 300, 50, 5);
  paddle.SetLinearVelocity(new b2Vec2 (1000, 0));
  paddle_constraint = createPaddleConstraints(world, 250, 300, paddle, world.GetGroundBody());
  //paddle_mov = createPaddleMov(world, paddle);
};

function step() {
  //console.log("paddle is static:" + paddle.IsStatic());
  //console.log(paddle.GetCenterPosition());
  //console.log(paddle_constraint.GetJointSpeed());
	var timeStep = 1.0/60;
	var iteration = 1;
  for(var c = ball.GetContactList(); c !== null ; c = c.next)
  {
    //console.log ("first :"+c.contact.GetShape1().GetBody().GetUserData());
    //console.log ("second:"+c.contact.GetShape2().GetBody().GetUserData());
    var body1 = c.contact.GetShape1().GetBody();
    var body2 = c.contact.GetShape2().GetBody();

    if(body1.GetUserData() === null || body2.GetUserData() === null)
      continue;
    //console.log ("first name:"+c.contact.GetShape1().GetBody().GetUserData().name);
    //console.log ("secondname:"+c.contact.GetShape2().GetBody().GetUserData().name);
    if(body1.GetUserData().name == 'ball' && body2.GetUserData().name == 'brick')
    {
      console.log ("destroy");
      world.DestroyBody(body2);
    }
    if(body1.GetUserData().name == 'brick' && body2.GetUserData().name == 'ball')
    {
      console.log ("destroy");
      world.DestroyBody(body1);
    }
    if(body1.GetUserData().name == 'ground')
    {
      world.DestroyBody(body2);
      ball = createBall(world, paddle.GetCenterPosition().x, 230);
      ball.m_userData = {name: 'ball'};

      ball.SetLinearVelocity(new b2Vec2 (0, 100));
      console.log ("lose");
    }
    else if(body2.GetUserData().name == 'ground')
    {
      world.DestroyBody(body1);
      console.log ("lose");
    }
  }
  if(paddle.GetLinearVelocity().x != paddle_speed)
    paddle.SetLinearVelocity(new b2Vec2 (paddle_speed, 0));
  //paddle.ApplyForce(new b2Vec2(paddle_speed, 0), paddle.GetCenterPosition());
  //console.log("motor " +paddle_constraint.m_enableMotor + " speed " + paddle_constraint.m_motorSpeed + "joint :" + paddle_constraint.GetJointSpeed());
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

$(document).observe('keydown', function (e) {
  switch (e.keyCode) {
    case 37: //left arrow
      e.stop(); // prevent the default action, like horizontal scroll

      /* Jerky movement
      if(paddle.GetCenterPosition())
      {
        paddle.SetCenterPosition(paddle.GetCenterPosition().Add(
          new b2Vec2(-offset,0)),0);
      }
      */

      //paddle.ApplyImpulse(new b2Vec2(0,-offset), paddle.GetCenterPosition());
      paddle_speed = -offset;
      //paddle.SetLinearVelocity(new b2Vec2 (-offset, 0));

      //paddle_constraint.m_linearImpluse = -offset;
      //paddle.SetLinearVelocity(new b2Vec2(0,-offset));
      break;
    case 39: //right arrow
      e.stop();
      //paddle_mov.SetTarget(paddle.GetWorldPoint().Add(new b2Vec2(offset,0)))
      paddle_speed = offset;
      //paddle.SetLinearVelocity(new b2Vec2 (offset, 0));

      /*
      console.log(paddle.GetCenterPosition());

      if(paddle.GetCenterPosition())
      {
        paddle.SetCenterPosition(paddle.GetCenterPosition().Add(
          new b2Vec2(offset,0)),0);
      }
      */
      //paddle.ApplyImpulse(new b2Vec2(0,offset), paddle.GetCenterPosition());
      //paddle.SetLinearVelocity(new b2Vec2(0,offset));
      break;
    case 38: //up arrow
      e.stop();
      break;
    case 40: //down arrow
      e.stop();
      break;
  }
});

$(document).observe('keyup', function (e) {
  switch (e.keyCode) {
    case 37: //left arrow
      e.stop(); // prevent the default action, like horizontal scroll

      setTimeout(function () {
        //paddle_speed = 0;
        //paddle.SetLinearVelocity(new b2Vec2 (0.01, 0));
      }, 1000);
      break;
    case 39: //right arrow
      e.stop();

      setTimeout(function () {
        //paddle_speed = 0;
        //paddle.SetLinearVelocity(new b2Vec2 (0.01, 0));
      }, 1000);
      break;
    case 38: //up arrow
      e.stop();
      break;
    case 40: //down arrow
      e.stop();
      break;
  }
});
