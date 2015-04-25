/**
 * Created by David on 29-Mar-15.
 */

define([
    "Phaser"
    ],
function(Phaser)
{
    function Player(cursors)
    {
        this.group = game.add.group();

        this.wheelAngle = 0;
        this.autoDrive = false;

        this.wheels = {};
        this.cursors = cursors;
        this.size = {x:30,y:55};

        this.maxSpeed = 700;
        this.speed = 0;
        this.acceleration = 500;
        this.deceleration = 800;

        this.turnSpeed = 0.06;
        this.turnDamp = 0.8;
        this.turnMax = Math.PI/6;

        this.wheelSize = {x:5, y:10};
        this.frontOffset = { x: 10, y: 14 };
        this.rearOffset = { x: 11, y: 15 };

        this.image = game.add.sprite(game.world.centerX-this.size.x/2, game.world.centerY-this.size.y/2, "car", null, this.group);
        this.image.width = this.size.x;
        this.image.height = this.size.y;

        this.wheels.tl = game.add.sprite(this.image.x - this.frontOffset.x, this.image.y - this.frontOffset.y, "tyre", null, this.group);
        this.wheels.tl.width = this.wheelSize.x;
        this.wheels.tl.height = this.wheelSize.y;

        this.wheels.tr = game.add.sprite(this.image.x + this.frontOffset.x, this.image.y - this.frontOffset.y, "tyre", null, this.group);
        this.wheels.tr.width = this.wheelSize.x;
        this.wheels.tr.height = this.wheelSize.y;


        this.wheels.bl = game.add.sprite(this.image.x - this.rearOffset.x, this.image.y + this.rearOffset.y, "tyre", null, this.group);
        this.wheels.bl.width = this.wheelSize.x;
        this.wheels.bl.height = this.wheelSize.y;


        this.wheels.br = game.add.sprite(this.image.x + this.rearOffset.x, this.image.y + this.rearOffset.y, "tyre", null, this.group);
        this.wheels.br.width = this.wheelSize.x;
        this.wheels.br.height = this.wheelSize.y;

        game.physics.p2.enable([this.image, this.wheels.tl, this.wheels.tr, this.wheels.bl, this.wheels.br]);

        this.exhausts = [];

        for(var i=0; i<2; i++)
        {
            var emitter = game.add.emitter(this.image.x, this.image.y, 200);
            emitter.makeParticles('smoke');

            emitter.setRotation(0, Math.PI);
            emitter.setAlpha(1, 0, 700, Phaser.Easing.Quadratic.Out);
            emitter.setScale(0.15, 1, 0.15, 1, 700, Phaser.Easing.Quadratic.Out);
            emitter.start(false, 700, 10);

            // Only for draw ordering
            this.group.add(emitter);

            this.exhausts.push(emitter);
        }

        this.group.bringToTop(this.image);

        var damp = 0.6;
        var aDamp = 0.3;

        this.image.body.mass = 4;
        this.image.body.damping = damp;
        this.image.body.angularDamping = aDamp;

        for(var key in this.wheels)
        {
            var wheel = this.wheels[key];
            wheel.body.clearCollision(true, true);
            var xDist = wheel.x - this.image.x;
            var yDist = wheel.y - this.image.y;

            wheel.body.mass = 1;
            wheel.body.damping = damp;
            wheel.body.angularDamping = aDamp;


            game.physics.p2.createLockConstraint(this.image, wheel, [-xDist, -yDist]);
        }
    }

    // Define the constructor for inheritence
    Player.prototype.constructor = Player;

    Player.prototype.turnLeft = function()
    {
        this.wheelAngle -= this.turnSpeed;
    }

    Player.prototype.turnRight = function()
    {
        this.wheelAngle += this.turnSpeed;
    }

    Player.prototype.update = function()
    {
        var theta = Phaser.Math.degToRad(-this.wheels.tl.angle - 90);
        var forward = {x: -Math.cos(theta), y: Math.sin(theta)};

        for(var key in this.wheels)
        {
            var wheel = this.wheels[key];

            var velLength = Math.sqrt(wheel.body.velocity.x*wheel.body.velocity.x + wheel.body.velocity.y*wheel.body.velocity.y);
            if(velLength === 0)
                continue;

            // Project the velocity onto the forward vector
            var dotAb = wheel.body.velocity.x*forward.x + wheel.body.velocity.y*forward.y;
            var dotBb = forward.x*forward.x + forward.y*forward.y;
            var forwardProj = dotAb/dotBb;

            wheel.body.velocity.x = forward.x * forwardProj;
            wheel.body.velocity.y = forward.y * forwardProj;
        }

        if(this.cursors.right.isDown)
        {
            this.wheelAngle += this.turnSpeed;
        }
        else if(this.cursors.left.isDown)
        {
            this.wheelAngle -= this.turnSpeed;
        }
        else
        {
            this.wheelAngle *= this.turnDamp;
        }

        this.wheelAngle = Phaser.Math.clamp(this.wheelAngle, -this.turnMax, this.turnMax);

        this.wheels.tl.body.rotation = this.wheelAngle + this.image.body.rotation;
        this.wheels.tr.body.rotation = this.wheelAngle + this.image.body.rotation;

        if(this.cursors.up.isDown || this.autoDrive)
        {
            if(this.speed < 0)
                this.speed = 0;

            this.speed += this.acceleration*game.time.physicsElapsed;

        }
        else if(this.cursors.down.isDown)
        {
            if(this.speed > 0)
                this.speed = 0;

            this.speed -= this.acceleration*game.time.physicsElapsed;
        }
        else if(this.speed !== 0)
        {
            var direction = Math.sign(this.speed);
            this.speed -= this.deceleration*game.time.physicsElapsed*direction;
            // We've gone over
            if(direction !== Math.sign(this.speed))
                this.speed = 0;
        }

        this.speed = Phaser.Math.clamp(this.speed, -this.maxSpeed, this.maxSpeed);

        this.wheels.tl.body.moveForward(this.speed);
        this.wheels.tr.body.moveForward(this.speed);



        for(var i=0; i<this.exhausts.length; i++)
        {
            var xDist = this.wheels.br.x - this.wheels.bl.x;
            var yDist = this.wheels.br.y - this.wheels.bl.y;

            var exhaustPosX = this.wheels.bl.x + xDist * (0.25 + 0.5*i);
            var exhaustPosY = this.wheels.bl.y + yDist * (0.25 + 0.5*i);

            this.exhausts[i].x = exhaustPosX;
            this.exhausts[i].y = exhaustPosY;

            this.exhausts[i].frequency = (1 - Math.abs(this.speed/this.maxSpeed)) * 150;
        }
    };


    return Player;

});