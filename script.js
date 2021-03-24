		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		let width = canvas.width;
		let height = canvas.height;

	// deviding the canvas by cells 10x10	

		let blockSize = 10;
		let widthInBlocks = width / blockSize;
		let heightInBlocks = height / blockSize;
		let score = 0;

		let drawBorder = function() {
			ctx.fillStyle = "Grey";
			ctx.fillRect(0, 0, width, blockSize);
			ctx.fillRect(0, height - blockSize, width, blockSize);
			ctx.fillRect(0, 0, blockSize, height);
			ctx.fillRect(width - blockSize, 0, blockSize, height);
		};

		let drawScore = function() {
			ctx.textBaseline = "top";
			ctx.font = "20px Courier";
			ctx.fillStyle = "Black";
			ctx.textAlign = "left";
			ctx.fillText("Score: " + score, blockSize, blockSize);
		};

		let gameOver = function() {
			playing = false;
			ctx.font = "60px Courier";
			ctx.fillStyle = "Black";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("Gave over", width / 2, height / 2);
		};

		// drawBorder();
		// drawScore();
		// gameOver();

		let Block = function(col, row) {
			this.col = col;
			this.row = row;
		}

		
		Block.prototype.drawSquare = function(color){
			let x = this.col*blockSize;
			let y = this.row*blockSize;
			ctx.fillStyle = color;
			ctx.fillRect(x, y, blockSize, blockSize);
		};

		Block.prototype.drawCircle = function(color) {
			let centerX = this.col * blockSize + blockSize/2;
			let centerY = this.row * blockSize + blockSize/2;
			ctx.fillStyle = color;
			circle(centerX, centerY, blockSize/2, true);
		};
		//check wether two blocks interroses, if yes function return true

		Block.prototype.equal = function(otherBlock) {
			return this.col === otherBlock.col && this.row === otherBlock.row;
		};


		let circle = function(x, y, radius, fillCircle) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2, false);
			if (fillCircle) {
				ctx.fill();
			} else {
				ctx.stroke();
			}
		};
		/// constructor for snake making

		let Snake = function(){
			this.segment = [
			new Block(7, 5), //head
			new Block(6, 5), //body
			new Block(5, 5)  //tail
			];
			this.direction = "right";
			this.nextDirection = "right";
		};

		

		Snake.prototype.draw = function(){
			let headColor = "Green";
			let bodyColorOdd = "Blue";
			let bodyColorEven = "Yellow";
			for (let i=0; i< this.segment.length; i ++) {
				if (i == 0) {
					this.segment[i].drawSquare(headColor);
				} else if (i % 2  == 1) {
					this.segment[i].drawSquare(bodyColorOdd);
				} else {
					this.segment[i].drawSquare(bodyColorEven);
				}
				
			}
		};

		Snake.prototype.checkCollision = function(head) {
			let leftCollision = (head.col === 0);
			let topCollision = (head.row === 0);
			let rightCollision = (head.col === widthInBlocks - 1);
			let bottomCollision = (head.row === heightInBlocks -1); 

			let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

			let selfCollision = false;

			for (let i = 0; i < this.segment.length; i++) {
				if (head.equal(this.segment[i])) {
				selfCollision = true;
				}
			}
		return wallCollision || selfCollision;

		}; 

		Snake.prototype.move = function(){
			let head = this.segment[0];
			let newHead;

			this.direction = this.nextDirection;

			if (this.direction === "right") {
				newHead = new Block(head.col + 1, head.row);
			} else if (this.direction === "down") {
				newHead = new Block(head.col, head.row + 1);
			} else if (this.direction === "left") {
				newHead = new Block(head.col - 1, head.row);
			} else if (this.direction === "up") {
				newHead = new Block(head.col, head.row - 1);
			}

			if (this.checkCollision(newHead)) {
				gameOver();
				return;
			};
			// adding newHead in the begining of segment's block
			
			this.segment.unshift(newHead); 

		
			if (newHead.equal(apple.position)){
				score++;
				animationTime-=10;
				apple.move(this.segment);
			} else {
				this.segment.pop();
			}

		};



		let directions = {
			37: "left",
			38: "up",
			39: "right",
			40: "down"
		};

		Snake.prototype.setDirection = function(newDirection) {
			if (this.direction === "up" && newDirection === "down") {
				return;
			} else if (this.direction === "right" && newDirection === "left") {
				return;
			} else if (this.direction === "down" && newDirection === "up") {
				return;
			} else if (this.direction === "left" && newDirection === "right") {
				return;
			}
			this.nextDirection = newDirection;
		};

		let Apple = function() {
			this.position = new Block(10,10);
		};

		Apple.prototype.draw = function(){
			this.position.drawCircle("limeGreen");
		};

		Apple.prototype.move = function(occupiedBlocks) {
			let randomCol = Math.floor(Math.random()*(widthInBlocks -2) +1);
			let randomRow = Math.floor(Math.random()*(heightInBlocks -2) +1);
			this.position = new Block(randomCol, randomRow);
		
		// Проверяем не передвинули лы мы яблоко в ячейку занятую сейчас телом змейки
			let index = occupiedBlocks.length - 1;
			while ( index >= 0 ) {
				if (this.position.equal(occupiedBlocks[index])) {
				this.move(occupiedBlocks); // Вызываем метод move повторно
				return;
				}
			index--;
			};
		};	

		// let checkApplePlace = function(apple, snake) {
			
		// 	for (let i = 0; i < snake.segment.length; i++) {
		// 		console.log("snake: " + snake.segment[i]);
		// 		console.log("apple: " + apple.position);
				
		// 		while (apple.position.equal(snake.segment[i]) == false) {
		// 			apple.move();
		// 		};
		// 	};	
		// };



		let apple = new Apple();
		let snake = new Snake();
		// apple.move();
		// apple.draw();


		$("body").keydown(function(event){
			let newDirection = directions[event.keyCode];
			if (newDirection !== undefined) {
				snake.setDirection(newDirection);
			}
		});

		
		
// intervalId нуже для функции gameOver
		// let IntervalId = setInterval(function(){
		// 	ctx.clearRect(0, 0, width, height);
		// 	drawScore();
		// 	snake.move();
		// 	snake.draw();
		// 	apple.draw();
		// 	drawBorder();
		// }, 100);

		
		let animationTime = 100;
		let playing = true;

		let gameLoop = function(){
			
			ctx.clearRect(0, 0, width, height);
			drawScore();
			snake.move();
			snake.draw();
			apple.draw();
			drawBorder();
			console.log(animationTime);
			if (playing) {
				setTimeout(gameLoop, animationTime);
			};
		};

		gameLoop();

