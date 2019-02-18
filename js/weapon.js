var weapons
;

function createWeapon(){
	var weapon
	;

	weapon = game.add.weapon(-1, 'star');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 600;
	weapon.fireRate = 400;

	return weapon;
}