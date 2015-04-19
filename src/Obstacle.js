define(["Phaser"],
    function(Phaser)
    {
        var Obstacle = function (x, y)
        {
            this.imageKey = "crate";
            this.health = 1;
            var size = 64;
            this.image = game.add.sprite(x, y, this.imageKey);
            this.image.width = size;
            this.image.height = size;
            game.physics.p2.enable(this.image);

            this.image.body.mass = 100;
            this.image.body.damping = 0.8;
            this.image.body.angularDamping = 0.8;

        };

        Obstacle.prototype.constructor = Obstacle;

        Obstacle.prototype.update = function ()
        {
        };

        Obstacle.prototype.die = function()
        {
            this.kill();
        };

        return Obstacle;
    });


