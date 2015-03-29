/**
 * Created by David on 29-Mar-15.
 */
requirejs.config({
    baseUrl: 'src',
    paths: {
        Phaser: '../lib/phaser-arcade-physics.min'
    }
});

require(["Phaser"], function(Phaser){
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload()
    {

    }

    function create()
    {

    }

    function update()
    {

    }
});
