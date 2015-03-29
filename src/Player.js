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
        this.cursors = cursors;
        var size = 100;
        this.image = game.add.sprite((game.width-size)/2, game.height-size, "player");
        this.image.width = size;
        this.image.height = size;
        this.speed = 100;
    }


    Player.prototype.update = function()
    {
        if(this.cursors.right.isDown)
            this.image.x += this.speed*game.time.physicsElapsed;
        if(this.cursors.left.isDown)
            this.image.x -= this.speed*game.time.physicsElapsed;
        if(this.cursors.up.isDown)
            this.image.y -= this.speed*game.time.physicsElapsed;
        if(this.cursors.down.isDown)
            this.image.y += this.speed*game.time.physicsElapsed;
    };


    return Player;

});