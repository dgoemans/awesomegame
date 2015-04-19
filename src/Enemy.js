define(["Phaser"],
function(Phaser)
{
    var Enemy = function ()
    {
        this.imageKey = "player";
        this.health = 1;
        var size = 100;
        this.image = game.add.sprite((game.width-size)/2, game.height-size, this.imageKey);
        this.image.width = size;
        this.image.height = size;
        this.speed = 100;

        game.physics.p2.enable(this.image);
    };

    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function ()
    {
        //this.image.x += this.speed*game.time.physicsElapsed;
    };

    Enemy.prototype.die = function()
    {
        this.kill();
    };

    return Enemy;
});


