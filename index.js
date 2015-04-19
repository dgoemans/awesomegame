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
    var gameElt = document.getElementById('game');
    game = new Phaser.Game(gameElt.clientWidth, gameElt.clientHeight, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });
    var player = null;
    var cursors = null;
    var enemy = null;
    var track = null;

    var leftDown = false;
    var rightDown = false;

    function preload()
    {
        game.load.image('car', 'assets/car.png');
        game.load.image('tyre', 'assets/tyre.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('road', 'assets/road.png');
        game.load.image('straight', 'assets/straight.png');
        game.load.image('corner', 'assets/corner.png');
        game.load.image('crate', 'assets/crate.png');
        game.load.image('smoke', 'assets/smoke.png');
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

        var controls = document.getElementById('mobile-controls');
        if(isMobileOrTablet())
        {
            player.autoDrive = true;

            var left = document.getElementById('left');
            left.addEventListener('touchstart', function(e){leftDown = true;e.preventDefault();});
            left.addEventListener('touchend', function(e){leftDown = false;e.preventDefault();});
            var right = document.getElementById('right');
            right.addEventListener('touchstart', function(e){rightDown = true;e.preventDefault();});
            right.addEventListener('touchend', function(e){rightDown = false;e.preventDefault();});

        }
        else
        {
            controls.style.display = "none";
        }
    }

    function update()
    {
        if(leftDown)
            player.turnLeft();
        if(rightDown)
            player.turnRight();

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

    function isMobileOrTablet() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

});
