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
        "Track",
        "Collectible"],
function(Phaser,Player,Enemy,Track,Collectible)
{
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
    var player = null;
    var cursors = null;
    var enemy = null;
    var track = null;

    function preload()
    {
        game.load.image('car', 'assets/car.png');
        game.load.image('tyre', 'assets/tyre.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('road', 'assets/road.png');
        game.load.image('straight', 'assets/straight.png');
        game.load.image('corner', 'assets/corner.png');
    }

    function create()
    {
        var worldWidth = 500000;
        var worldHeight = 500000;
        game.world.setBounds(0, 0, worldWidth, worldHeight);
        game.add.tileSprite(0, 0, worldWidth, worldHeight, 'grass');

        game.stage.backgroundColor = '#007236';
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 0;

        cursors = game.input.keyboard.createCursorKeys();

        track = new Track();
        track.generate(15);

        player = new Player(cursors);
        game.camera.follow(player.image);
    }

    function update()
    {
        player.update();
        //enemy.update();

        if(Math.abs(player.image.y - track.currentPos.y) < track.tileSize.y * 2 )
        {
            track.generate(15);
        }

        //console.log(game.camera.y);
    }

    function render()
    {
        //game.debug.cameraInfo(game.camera, 32, 32);
    }

});
