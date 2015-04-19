define(["Phaser"],
    function(Phaser)
    {
        var Track = function ()
        {
            this.batch = game.add.spriteBatch();

            this.tileSize = { x: 800, y: 800 };

            this.startPos = {x: game.world.width/2, y: game.world.height/2};
            this.currentPos = {x: this.startPos.x, y: this.startPos.y};

            this.tiles = [];
        };

        Track.TYPES = ['straight', 'corner'];

        Track.prototype.constructor = Track;

        Track.prototype.createPart = function(type, rotation)
        {
            rotation = rotation === undefined ? Math.floor(Math.random()*4) : rotation;
            type = type === undefined ? Math.floor(Math.random()*2) : type;

            var image = game.add.image(this.currentPos.x, this.currentPos.y, Track.TYPES[type], null, this.batch);
            image.anchor.setTo(0.5);
            image.rotation = -rotation * Math.PI/2;

            var object = { image: image, out: 0 };

            if(type === 0)
            {
                if(rotation === 0)
                {
                    this.currentPos.y -= this.tileSize.y;
                    object.out = 2;
                }
                else if(rotation === 1)
                {
                    this.currentPos.x += this.tileSize.x;
                    object.out = 1;
                }
                else if(rotation === 2)
                {
                    console.log("invalid rotation");
                    this.currentPos.y += this.tileSize.y;
                    object.out = 0;
                }
                else if(rotation === 3)
                {
                    this.currentPos.x -= this.tileSize.x;
                    object.out = 3;
                }
            }
            else if(type === 1)
            {
                if(rotation === 0)
                {
                    this.currentPos.x += this.tileSize.x;
                    object.out = 1;
                }
                else if(rotation === 1)
                {
                    this.currentPos.y -= this.tileSize.y;
                    object.out = 2;
                }
                else if(rotation === 2)
                {
                    this.currentPos.y -= this.tileSize.y;
                    object.out = 2;
                }
                else if(rotation === 3)
                {
                    this.currentPos.x -= this.tileSize.x;
                    object.out = 3;
                }
            }

            this.tiles.push(object);

            return image;
        };

        Track.prototype.createNextRandom = function ()
        {
            var type = 0;
            var rotation = 0;

            if(this.tiles.length)
            {
                var last = this.tiles[this.tiles.length - 1];
                type = Math.floor(Math.random()*2);
                var from = last.out;

                if(type === 0)
                {
                    if(from === 1)
                    {
                        rotation = 1;
                    }
                    else if(from === 2)
                    {
                        rotation = 0;
                    }
                    else if(from === 3)
                    {
                        rotation = 3;
                    }
                }
                else if(type === 1)
                {
                    if(from === 1)
                    {
                        rotation = 2;
                    }
                    else if(from === 2)
                    {
                        if(Math.random()>0.5)
                            rotation = 0;
                        else
                            rotation = 3;
                    }
                    else if(from === 3)
                    {
                        rotation = 1;
                    }
                }

            }

            this.createPart(type, rotation);

        };


        Track.prototype.generate = function (amount)
        {
            amount = amount || 20;
            console.log("Generating " + amount + " track chunks");


            for(var i=0; i<amount; i++)
            {
                this.createNextRandom();
            }

        };

        return Track;
    });


