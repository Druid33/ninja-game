function createSocketConnection() {
	var login,
		socket = io()
	;

	socket.on('newPlayer', function(msg){
  		if (createPlayer(msg.x ,msg.y, msg.playerCustomData)) {
  			myPlayerId = msg.playerCustomData.id;
  			login = document.getElementById("login");
  			login.hidden = true;
  		}

  	});

	socket.on('move', onMoveEvent);
	socket.on('disconnectPlayer', onDisconnectPlayer);
	socket.on('rebornPlayer', onRebornPlayer);

	return socket;
}

onMoveEvent = function onMoveEvent(msg){
	var affectedPlayer = null
	;

	if (playersMap[msg.player.customData.id]) {
		affectedPlayer = playersMap[msg.player.customData.id];
	} else {
		affectedPlayer = createPlayer(msg.player.x ,msg.player.y, msg.player.customData);
	}

	if (affectedPlayer && !affectedPlayer.customData.killed) {
		movePlayer(affectedPlayer, msg);
	}
};

onDisconnectPlayer = function onDisconnectPlayer(playerId) {
	removePlayer(playerId);
};

onRebornPlayer = function onRebornPlayer(data){
	if (playersMap[data.id]) {
		rebornPlayer(playersMap[data.id], data);
	}
};

