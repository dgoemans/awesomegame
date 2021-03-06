define(["Phaser", "Obstacle"],
    function(Phaser, Obstacle)
    {
        var Track = function ()
        {
            this.batch = game.add.spriteBatch();

            this.crateSpawnChance = 0.2;

            this.tileSize = { x: 400, y: 400 };

            this.startPos = {x: game.world.width/2, y: game.world.height/2};
            this.currentPos = {x: this.startPos.x, y: this.startPos.y};

            this.tiles = [];
        };

        Track.TYPES = { STRAIGHT: 0, BEND: 1 };

        Track.IMAGES = ['straight', 'corner'];

        Track.prototype.constructor = Track;

        Track.prototype.createPart = function(type, rotation)
        {
            var image = game.add.image(this.currentPos.x, this.currentPos.y, Track.IMAGES[type], null, this.batch);
            image.anchor.setTo(0.5);
            image.rotation = -rotation * Math.PI/2;
            image.width = this.tileSize.x;
            image.height = this.tileSize.y;

            var object = { image: image, out: 0, obstacles: [] };

            if(type === Track.TYPES.STRAIGHT)
            {
                object.out = (rotation + 2)%4;

                if(rotation === 0)
                {
                    this.currentPos.y -= this.tileSize.y;
                }
                else if(rotation === 1)
                {
                    this.currentPos.x -= this.tileSize.x;
                }
                else if(rotation === 3)
                {
                    this.currentPos.x += this.tileSize.x;
                }
                else if(rotation === 2)
                {
                    console.error("invalid rotation");
                }
            }
            else if(type === Track.TYPES.BEND)
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

            if(Math.random() < this.crateSpawnChance)
            {
                // Spawn somewhere on the tile
                var x = image.x + Math.random()*image.width;
                var y = image.y + Math.random()*image.height;
                var obstacle = new Obstacle(x,y);
                object.obstacles.push(obstacle);
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

                if(type === Track.TYPES.STRAIGHT)
                {
                    if(from === 2)
                    {
                        rotation = 0;
                    }
                    else
                        rotation = (from + 2)%4;
                }
                else if(type === Track.TYPES.BEND)
                {
                    if(from === 2)
                    {
                        if(Math.random()>0.5)
                            rotation = 0;
                        else
                            rotation = 3;
                    }
                    else if(from === 1)
                    {
                        rotation = 2;
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


