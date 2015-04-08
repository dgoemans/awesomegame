/**
 * Created by David on 29-Mar-15.
 */
requirejs.config({
    baseUrl: 'src',
    paths: {
        Phaser: '../lib/phaser'
    }
});

require(["Phaser",
        "Player",
        "Enemy",
        "Collectible"],
function(Phaser,Player,Enemy,Collectible)
{
    window.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var player = null;
    var cursors = null;
    var enemy = null;

    function preload()
    {
        game.load.image('player', 'assets/foot.png');
    }

    function create()
    {
        cursors = game.input.keyboard.createCursorKeys();
        player = new Player(cursors);
        enemy = new Enemy();
    }

    function update()
    {
        player.update();
        enemy.update();
    }

});
