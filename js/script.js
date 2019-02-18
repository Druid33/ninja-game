var game,
	cursors,
	stars,
	score = 0,
	scoreText,
	bullets
;

window.onload = function(){
	var login,
		loginInput
	;

	socket = createSocketConnection();

	game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload: preload,
		create: create,
		update: update
	 });

	loginBtn = document.getElementById("loginBtn");
	loginInput = document.getElementById("loginInput");
	loginInput.addEventListener('keyup', function(e){
		 if (e.keyCode == 13) {
			socket.emit('newPlayer', {'name': loginInput.value});
			cursors = game.input.keyboard.createCursorKeys();
			fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		}
	});

	loginBtn.addEventListener('click', function(){
		socket.emit('newPlayer', {'name': loginInput.value});
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	});

	loginInput.focus();
};



function preload() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}


function create() {

	game.stage.disableVisibilityChange = true;

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    // vygeneruje sa mapa
    insertPlatforms();

    // vytvori sa skupina pre hracov
    players = game.add.group();
    players.enableBody = true;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;


    // vytvori sa skupina pre zbrane

    // poslat na BE daj vsetkych hracov

    // poslat na BE zaregistruj noveho hraca


    // myPlayer = createPlayer(32, game.world.height - 150, 'idPlayer1');

    // //  Finally some stars to collect
    // stars = game.add.group();

    // //  We will enable physics for any star that is created in this group
    // stars.enableBody = true;

    // //  Here we'll create 12 of them evenly spaced apart
    // for (var i = 0; i < 12; i++)
    // {
    //     createStar(i * 70, 0, 'start');
    // }

    // //  The score
    // scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
}


function createStar(x,y){
    //  Create a star inside of the 'stars' group
    var star = stars.create(x,y, 'star');

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
}





function update() {
	var myPlayer = getMyPlayer();

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(players, platforms);

    // kolizie nabojov vsetkych zbrani
    for (var property in playersMap) {
	    if (playersMap.hasOwnProperty(property)) {
	        var player = playersMap[property];

			game.physics.arcade.collide(player.weapon.bullets, platforms, function(bullet){
				bullet.kill();
			});

			game.physics.arcade.collide(player.weapon.bullets, players, function(bullet, shootedPlayer){
				if (player != shootedPlayer) {
					bullet.kill();
					shotPlayer(shootedPlayer);
				}

			});
	    }
	}

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    // game.physics.arcade.overlap(players, stars, collectStar, null, this);


    // socket.emit('move', 'pohyb');
    if (myPlayer) {
    	var data = {
	    	player: {
	    		x: myPlayer.position.x,
	    		y: myPlayer.position.y,
	    		customData: myPlayer.customData
	    	},
	    	left: cursors.left.isDown,
	    	right: cursors.right.isDown,
	    	up: cursors.up.isDown,
	    	down: cursors.down.isDown,
	    	fire: fireButton.isDown,
	    };

    	socket.emit('move', data);
    }

    preRenderPlayerNames();

}

// function collectStar (player, star) {

//     // Removes the star from the screen
//     star.kill();

//     //  Add and update the score
//     score += 10;
//     scoreText.text = 'Score: ' + score;

//     // create new start
//     createStar(game.world.width - 50 - (Math.random()*game.world.width - 50),0);

// }









