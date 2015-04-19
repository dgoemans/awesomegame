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

        this.wheels = {};
        this.cursors = cursors;
        this.size = {x:50,y:80};
        this.speed = 1000;

        this.turnSpeed = 0.05;
        this.turnDamp = 0.9;
        this.turnMax = Math.PI/6;

        this.wheelSize = {x:10, y:20};
        this.frontOffset = { x: 23, y: 20};
        this.rearOffset = { x: 23, y: 27 };

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

        this.emitter = game.add.emitter(this.image.x, this.image.y, 200);
        this.emitter.makeParticles('smoke');

        this.group.add(this.emitter);

        this.group.bringToTop(this.image);

        var damp = 0.9;
        var aDamp = 0.9;

        this.image.body.mass = 1;
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

        this.emitter.setRotation(0, Math.PI);
        this.emitter.setAlpha(1, 0, 700, Phaser.Easing.Quadratic.Out);
        this.emitter.setScale(0.2, 2, 0.2, 2, 700, Phaser.Easing.Quadratic.Out);
        this.emitter.start(false, 700, 10);
    }

    // Define the constructor for inheritence
    Player.prototype.constructor = Player;

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

        if(this.cursors.left.isDown)
        {
            this.wheelAngle -= this.turnSpeed;
        }

        this.wheelAngle = Phaser.Math.clamp(this.wheelAngle, -this.turnMax, this.turnMax);

        this.wheels.tl.body.rotation = this.wheelAngle + this.image.body.rotation;
        this.wheels.tr.body.rotation = this.wheelAngle + this.image.body.rotation;

        this.wheelAngle *= this.turnDamp;



        if(this.cursors.up.isDown)
        {
            this.wheels.tl.body.moveForward(this.speed);
            this.wheels.tr.body.moveForward(this.speed);
        }
        if(this.cursors.down.isDown)
        {
            this.wheels.tl.body.moveBackward(this.speed);
            this.wheels.tr.body.moveBackward(this.speed);
        }

        var xDist = this.wheels.br.x - this.wheels.bl.x;

        var exhaustPosX = this.wheels.bl.x + xDist * 0.75;

        this.emitter.x = exhaustPosX;
        this.emitter.y = (this.wheels.br.y + this.wheels.bl.y)/2;
    };


    return Player;

});