var players = null,
	myPlayerId,
	playersMap = {},
	nameStyle = { font: "10px Arial", fill: "#ffffff", align: "center"},
	jumpVelocity = 250
;

function createPlayer(x, y, playerCustomData) {
	// The player and its settings
    // var player = game.add.sprite(32, game.world.height - 150, id);
    var player, text
    ;

    if (!players) {
    	return null;
    }

    player = players.create(x,y,'dude');
    player.customData = playerCustomData;
    player.customData.killed = false;

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    // apply optional config
    if (player.customData.tint) {
    	player.tint = player.customData.tint;
    }

    // apply optional config
    if (player.customData.name) {
    	text = game.add.text(0, 0, player.customData.name, nameStyle);
    	// text.anchor.set(0.5);
    	text.x = player.x;
    	text.y = player.y - 5;
    	player.text = text;
    }

    var weapon = createWeapon();
    player.weapon = weapon;
    weapon.trackSprite(player, 14, 35);

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('jumpLeft', [6], 10, true);
	player.animations.add('jumpRight', [1], 10, true);

	player.frame = 0;
	player.weapon.fireAngle = Phaser.ANGLE_LEFT;

    playersMap[player.customData.id] = player;

    return player;
}

function movePlayer(player, moveData){

	// player.position.x = moveData.player.x;
    // player.position.y = moveData.player.y;

	if (player.body.touching.down) {
		if (moveData.left) {
			moveLeft(player);
		} else if (moveData.right) {
			moveRight(player);
		} else {
			stop(player);
		}

		if (moveData.up) {
			jump(player);
		}
	}

	if (moveData.fire) {
		player.weapon.fire();
		console.log('fire');
	}
}

function getMyPlayer() {
	if (playersMap[myPlayerId]) {
		return playersMap[myPlayerId];
	} else {
		return null;
	}
}

// remove player after disconnected etc
function removePlayer(playerId) {
	if (playersMap[playerId]) {
		playersMap[playerId].text.kill();
		playersMap[playerId].kill();
		console.log('player killed');
	}
}

// kill player after shot
function shotPlayer(player) {
	// player.body.rotation = 90;
	player.customData.killed = true;
	player.visible = false;
	player.text.visible = false;
	player.body.velocity.x = 0;
	if (player === getMyPlayer()) {
		window.setTimeout(sendReborn, 3000, player);
	}
}

function sendReborn(player) {
	var data = {
		'id': player.customData.id,
		'x' : Math.floor(Math.random() * 500),
		'y' : Math.floor(Math.random() * 500)
	};

	socket.emit('reborn', data);
}

function rebornPlayer(player, data) {
	player.customData.killed = false;
	player.position.x = data.x;
	player.position.y = data.y;
	player.visible = true;
	player.text.visible = true;
}

function moveLeft(player) {
	player.body.velocity.x = -150;
	// player.body.moveLeft(150);
	player.animations.play('left');
	player.weapon.fireAngle = Phaser.ANGLE_LEFT;
}

function moveRight(player) {
	player.body.velocity.x = 150;
	// player.body.moveRight(150);
	player.animations.play('right');
	player.weapon.fireAngle = Phaser.ANGLE_RIGHT;
}

function stopMove(player) {
	player.body.velocity.x = 0;
	player.animations.stop();
	// player.frame = 4;
}

function jump(player) {
	player.body.velocity.y = -jumpVelocity;
}

function jumpUp(player) {
	player.body.velocity.y = -jumpVelocity;
	player.body.velocity.x = 0;
	player.animations.stop();
	// player.frame = 4;
}

function jumpRight(player) {
	player.body.velocity.y = -jumpVelocity;
	player.body.velocity.x = 150;
	player.frame = 6;
    // player.animations.play('jumpRight');
}

function jumpLeft(player) {
	player.body.velocity.y = -jumpVelocity;
	player.body.velocity.x = -150;
    player.animations.play('jumpLeft');
    player.frame = 1;
}

function stop(player) {
	player.body.velocity.x = 0;
	player.animations.stop();
	// player.frame = 4;
}

function preRenderPlayerNames() {
	for (var property in playersMap) {
	    if (playersMap.hasOwnProperty(property)) {
	        var player = playersMap[property];

	        player.text.x = player.x;
	        player.text.y = player.y - 5;
	    }
	}
}
