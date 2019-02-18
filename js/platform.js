var platforms
;

function insertPlatforms(){
	//  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 1);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var hrubka = 0.2;
    // createLedge(0, 0, 0.1, hrubka);
    																		createLedge(700, 110, 0.3, hrubka);
    											createLedge(100, 180, 1.5, hrubka);
    createLedge(0, 240, 0.1, hrubka);
    			createLedge(100, 310, 0.4, hrubka);
    									createLedge(200, 380, 0.8, hrubka);
    			createLedge(100, 440, 0.2, hrubka);
	createLedge(0, 500, 0.2, hrubka); 		createLedge(750, 450, 0.2, hrubka);
    // var ledge = platforms.create(400, 400, 'ground');
    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    return platforms;
}

function createLedge(x,y, scaleX, scaleY) {
	var ledge = platforms.create(x, y, 'ground');
	ledge.scale.setTo(scaleX,scaleY);
    ledge.body.immovable = true;
}