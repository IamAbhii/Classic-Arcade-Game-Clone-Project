const level = document.querySelector('.level');
const life = document.querySelector('.life');
const img = document.querySelector('.image');

let heartFlag = false;
let heartSpawnFlag = false;
let heartPosition = [ // choosing random potition for hear spawn amongs this co-ordinates
	[100, 60],
	[300, 145],
	[500, 60]
];
let levelCount = 1;

/**
 * Class : Enemy
 * input : Enemy x axis , and Enemy Y axis and speed of enemy
 * Description : This class creates enemy with their initial position and give them initial speed
 */
var Enemy = function (x, y, speed) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.sprite = 'images/enemy-bug.png';
	this.stone = 'images/Rock.png';
};
/**
 * Function : getDistance
 * Input : Player(x2,y2) and enemy(x1,y1) co-ordinates ()
 * Description : this fucntion use the methametical law of pythagorean theoram to
 * 							 measure the distance between enemy and player
 */
const getDistance = (x1, x2, y1, y2) => {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
/**
 * Class prototype : Update
 * input : dt
 * Description: This fucntion keeps upadating speed of enemy after levle increase,
 * 							This fucntion also limts the movement border of enemy.
 * 							This fucntion also checks the collison between player and enemy, and player and rock.
 * 							and respawn the player and restarts the game
 */
Enemy.prototype.update = function (dt) {

	this.x += this.speed * levelCount * dt;

	if (this.x > 700) {
		this.x = -75;
	}
	// colecting hearts and removing it from the canvas and adding it to the life bar.
	if (player.x === heart.x && player.y === heart.y && heartSpawnFlag) {
		delete heart.heart;
		heartFlag = true;
		Player.lifeCount++;

		let image = new Image();
		image.src = "images/Heart.png";
		image.alt = 'character img';
		image.classList.add('images', 'img');
		img.appendChild(image);

		heartSpawnFlag = false;

	}
	//checking collisons between player, enemy and rocks
	if (getDistance(this.x, player.x, this.y, player.y) < 75 && this.y === player.y && Player.lifeCount >= 1 ||
		(player.x === 100 && player.y === 230 && levelCount > 1) ||
		(player.x === 400 && player.y === 230 && levelCount > 2) ||
		(player.x === 600 && player.y === 145 && levelCount > 3)) {

		player.respawn();

		heart = new Heart(heartPosition[Math.floor(Math.random() * heartPosition.length)][0], heartPosition[Math.floor(Math.random() * heartPosition.length)][1]);
		heart.heart = 'images/Heart.png';
		heartSpawnFlag = true;
		heartFlag = false;

		life.innerHTML = `Total life available`
		// restarts if lifecount is zero
		if (Player.lifeCount < 1) {
			swal({
				title: "Game over!",
				text: "No more lifes remaining",
				icon: "error",
				button: "Start again!",
			});
			player.hardRestart();
		}
	}

}
/**
 * Class prototype : render
 * input: none
 * Description : This prototype renders the enemy, rock image to the canvas.
 */
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if (levelCount === 2) {
		ctx.drawImage(Resources.get(this.stone), 100, 230);
	} else if (levelCount === 3) {
		ctx.drawImage(Resources.get(this.stone), 100, 230);
		ctx.drawImage(Resources.get(this.stone), 400, 230);
	} else if (levelCount === 4) {
		ctx.drawImage(Resources.get(this.stone), 100, 230);
		ctx.drawImage(Resources.get(this.stone), 400, 230);
		ctx.drawImage(Resources.get(this.stone), 600, 145);
	}
};
/**
 * Function : randomSpeedGen
 * input : minSpeed , maxSpeed
 * Description : Generates the random number betwenn min and max speed.
 *
 */
const randomSpeedGen = (minSpeed, maxSpeed) => Math.random() * (maxSpeed - minSpeed) + minSpeed;

let enemy1 = new Enemy(-75, 60, randomSpeedGen(100, 200)); // enemy created
let enemy2 = new Enemy(-75, 145, randomSpeedGen(100, 200));
let enemy3 = new Enemy(-75, 230, randomSpeedGen(100, 200));
/**
 * Class : Heart
 * input : x and y axis for hear spawn
 * Description : This class generats the hear object for display on canvas and renders them with
 * 							 its prototype render.
 */
class Heart {
	constructor(x, y) {

		this.x = x;
		this.y = y;
		this.heart = 'images/Heart.png';
	}

	render() {
		ctx.drawImage(Resources.get(this.heart), this.x, this.y);
	}
}
/**
 * Class : Player
 * input : x and y axis for player
 * Description : this clas generates the player and with help of the Upadate the
 * 							 player win. Also it handles the input from keys with hekp of handleInput prototype
 * 							 It renders the player image and do hardrestart and respawn to player oobject
 */

class Player {

	static lifeCount = 3;

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.sprite = 'images/char-boy.png';

	}

	handleInput(key) {
		if (key === 'left' && this.x >= 4) {
			this.x -= 100;
		}
		if (key === 'right' && this.x < 600) {
			this.x += 100;
		}
		if (key === 'up' && this.y > -20) {
			this.y -= 85;
		}
		if (key === 'down' && this.y < 400) {
			this.y += 85;
		}
	}

	update() {
		if (this.y === -25) {
			console.log('this is win')

			swal({
				title: "Good job!",
				text: "You won this level",
				icon: "success",
				button: "Play next!",
			});

			this.x = 200;
			this.y = 400;



			levelCount++;
			level.innerHTML = `Level - ${levelCount}`;
		}
		if (levelCount > 4) {
			swal({
				title: "Congratulations",
				text: "You won the game",
				icon: "success",
				button: "Enjoy!",
			});
			levelCount = 1
			for (let i = 0; i < Player.lifeCount; i++) {
				img.removeChild(img.firstElementChild);
			}
			player.hardRestart();
		}
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

	}

	respawn() {

		swal({
			title: "Try again!",
			text: "bugs are deadly",
			icon: "error",
			button: "Play again!",
		});
		this.x = 200;
		this.y = 400;

		if (Player.lifeCount < 1) {
			levelCount = 1;
		}

		Player.lifeCount--;
		if (Player.lifeCount < 3) {
			img.removeChild(img.firstElementChild);
		}
	}

	hardRestart() {
		this.x = 200;
		this.y = 400;

		Player.lifeCount = 3;
		levelCount = 1;
		level.innerHTML = `Level - ${levelCount}`

		delete heart.heart;
		heartFlag = false
		heartSpawnFlag = false;

		for (let i = 0; i < 3; i++) {
			let image = new Image()
			image.src = "images/Heart.png";
			image.alt = 'character img';
			image.classList.add('images', 'img');
			img.appendChild(image);
		}
	}
}

//creating heart object initially.
let heart = new Heart(heartPosition[Math.floor(Math.random() * heartPosition.length)][0], heartPosition[Math.floor(Math.random() * heartPosition.length)][1]);
//creating player object
let player = new Player(200, 400);

let allEnemies = [];
//pusing all enemy in one array
allEnemies.push(enemy1, enemy2, enemy3);
//event listener
document.addEventListener('keyup', function (e) {
	console.log('hi')
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
//=============================================================================================