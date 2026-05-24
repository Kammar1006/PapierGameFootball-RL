const canvas=document.querySelector("canvas");
const ctx= canvas.getContext("2d");

var iw=10; // horizontal number of tiles
var ih=14; // vertical number of tiles
var cw=canvas.width=(iw+2)*50;
var ch=canvas.height=(ih+4)*50;		

var level = 3;
var main_game = null;
var main_ui = null;

function gameEnv(){
	this.board = {
		//table which describe all posible moves form all localtion; 
		//each position for example board[4][5] contain 8 value array with indexes 0 to 7
		//each index describe one direction starting form N, NE, E.. up to NS - clockwise
		//number 0 tell that move is possible, and number 1 that is blocked
		//if direction array is sum to 8 then move is impossible from chosen position
	}

	this.x = iw/2; // current ball position
	this.y = ih/2; 
	this.queue = null; //queue for AI/Computer moves if are calculated
	this.endgame = 0; //Endgame flag if 1 game is ended
	this.gamer = 1;
	this.move = (pos) => {
		if(this.board[this.x][this.y][pos] == 1) return [false]
		this.board[this.x][this.y][pos]=1;
		let xChange = [0, 1, 1, 1, 0, -1, -1, -1]
		let yChange = [-1, -1, 0, 1, 1, 1, 0, -1]
		
		this.x += xChange[pos]
		this.y += yChange[pos]

		pos+=4;
		if(pos>=8) pos-=8;
		console.log(this.board[this.x], pos, this.x, this.y)
		this.board[this.x][this.y][pos]=1;
		sum=this.board[this.x][this.y][0]+this.board[this.x][this.y][1]+this.board[this.x][this.y][2]+this.board[this.x][this.y][3]+this.board[this.x][this.y][4]+this.board[this.x][this.y][5]+this.board[this.x][this.y][6]+this.board[this.x][this.y][7];

		return [true, this.board, this.x, this.y, sum]
	}
	this.reset = () => {
		for(i=0;i<=iw;i++){
			this.board[i]={};
			for(j=0;j<=ih;j++){
				if(i==0 && j==0) this.board[i][j]=[1,1,1,0,1,1,1,1];
				else if(i==0 && j==ih) this.board[i][j]=[1,0,1,1,1,1,1,1];
				else if(i==iw && j==0) this.board[i][j]=[1,1,1,1,1,0,1,1];
				else if(i==iw && j==ih) this.board[i][j]=[1,1,1,1,1,1,1,0];
				else if(i==0) this.board[i][j]=[1,0,0,0,1,1,1,1];
				else if(j==0) this.board[i][j]=[1,1,1,0,0,0,1,1];
				else if(i==iw) this.board[i][j]=[1,1,1,1,1,0,0,0];
				else if(j==ih) this.board[i][j]=[0,0,1,1,1,1,1,0];	
				else this.board[i][j]=[0,0,0,0,0,0,0,0];
			}
		}
		this.board[iw/2-1][-1]=[1,1,1,0,1,1,1,1];
		this.board[iw/2][-1]=[1,1,1,0,0,0,1,1];
		this.board[iw/2+1][-1]=[1,1,1,1,1,0,1,1];
		this.board[iw/2-1][0]=[1,0,0,0,0,0,1,1];
		this.board[iw/2][0]=[0,0,0,0,0,0,0,0];
		this.board[iw/2+1][0]=[1,1,1,0,0,0,0,0];	


		this.board[iw/2-1][ih+1]=[1,0,1,1,1,1,1,1];
		this.board[iw/2][ih+1]=[0,0,1,1,1,1,1,0];
		this.board[iw/2+1][ih+1]=[1,1,1,1,1,1,1,0];
		this.board[iw/2-1][ih]=[0,0,0,0,1,1,1,0];
		this.board[iw/2][ih]=[0,0,0,0,0,0,0,0];
		this.board[iw/2+1][ih]=[0,0,1,1,1,0,0,0];	
	}
}

function canvasUI(x, y){
	this.x = x
	this.y = y
	this.draw_table = () => {
		ctx.fillStyle = "white";
		ctx.fillRect(cw/(iw+2),2*ch/(ih+4),cw*iw/(iw+2),ch*ih/(ih+4));
		ctx.fillRect(iw/2*cw/(iw+2),ch/(ih+4),cw/(iw+2)*2,ch/(ih+4));
		ctx.fillRect(iw/2*cw/(iw+2),ch/(ih+4)*(ih+1),cw/(iw+2)*2,2*ch/(ih+4));
	}
	this.draw_line = () => {
		ctx.fillStyle = "gray";
		for(i=0;i<=iw;i++){
			for(j=0;j<=ih;j++){
				if(i!=iw && j!=ih || (j==ih && (i==iw/2 || i==iw/2-1))){
					ctx.fillRect(cw/(iw+2)*(i+1),(j+2)*ch/(ih+4),cw/(iw+2),1);
					ctx.fillRect(cw/(iw+2)*(i+1),(j+2)*ch/(ih+4),1,ch/(ih+4));
					ctx.fillRect(cw/(iw+2)*(i+1),(j+3)*ch/(ih+4)-1,cw/(iw+2),1);
					ctx.fillRect(cw/(iw+2)*(i+2)-1,(j+2)*ch/(ih+4),1,ch/(ih+4));
				}
			}
		}
		
		j=-1;
		for(i=iw/2-1;i<=iw/2;i++){
			ctx.fillRect(cw/(iw+2)*(i+1),(j+2)*ch/(ih+4),cw/(iw+2),1);
			ctx.fillRect(cw/(iw+2)*(i+1),(j+2)*ch/(ih+4),1,ch/(ih+4));
			ctx.fillRect(cw/(iw+2)*(i+1),(j+3)*ch/(ih+4)-1,cw/(iw+2),1);
			ctx.fillRect(cw/(iw+2)*(i+2)-1,(j+2)*ch/(ih+4),1,ch/(ih+4));				
		}			
	}
	this.moveUI = (color, pos) => {
		if(main_game.endgame==0){
			if(pos!=8 && color=="red") this.moveUI("red", 8);
			if(pos==8){
				ctx.fillStyle=color;
				ctx.fillRect(cw/(iw+2)*(this.x+1)-2,(this.y+2)*ch/(ih+4)-2,5,5);
				return;
			}	
			if(pos==0){
				ctx.fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)-2,(this.y+2)*ch/(ih+4)-i,5,-4);
			}				
			if(pos==1){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)+i,(this.y+2)*ch/(ih+4)-i,4,-4);
			}
			if(pos==2){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)+i,(this.y+2)*ch/(ih+4)-2,+4,5);
			}
			if(pos==3){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)+i,(this.y+2)*ch/(ih+4)+i,4,4);
			}
			if(pos==4){
				ctx.fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)-2,(this.y+2)*ch/(ih+4)+i,5,4);
			}
			if(pos==5){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)-i,(this.y+2)*ch/(ih+4)+i,-4,4);
			}
			if(pos==6){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)-i,(this.y+2)*ch/(ih+4)-2,-4,5);
			}
			if(pos==7){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(this.x+1)-i,(this.y+2)*ch/(ih+4)-i,-4,-4);
			}
			this.x = main_game.x;
			this.y = main_game.y;
		}
		else this.moveUI("black", 8);
	}
}

function range(a, c, b){
	return Math.max(a, Math.min(c, b))
}

function fixLevel(){
	level = range(1, parseInt(document.getElementById("level").value), 3);
}

function changeTurn(sum){
	if (sum == 1){
		Turn("YOT");
	}
	else if (sum == 8 ){
		End_Game(main_game.gamer)
	}
	else{
		Turn("YT")
	}
}

function Your_Turn(){
	let y = main_game.y;
	document.getElementById("stan").innerHTML="YOUR TURN";
	main_ui.moveUI("black",8);
	main_game.gamer=1;
	if(y==-1) End_Game(-1);
	if(y==ih+1) End_Game(1);
}

function Your_Opponent_Turn(){
	let y = main_game.y;
	document.getElementById("stan").innerHTML="YOUR OPPONENT";
	main_ui.moveUI("blue",8);
	main_game.gamer=-1;
	if(y==ih+1) End_Game(-gamer);
	
	//SI_start();
	if(main_game.queue !== null){
		let arr = main_game.move(queue[0])
		if(arr[0]) main_ui.moveUI("blue", queue[0]);
		else{
			console.log("Error!!!! Wrong move!")
			return;
		}
		changeTurn(arr[4]);

		if (main_game.queue.length > 1){
			main_game.queue = main_game.queue.splice(1)
		}
		else{
			main_game.queue = null;
		}
	}
	else{
		mvs = AI()
		console.log("MVS: ", mvs)
		if (mvs.length == 0) {
			console.log("MVS LEN ERR!")
			return;
		}
		let arr = main_game.move(mvs[0])
		main_ui.moveUI("blue", mvs[0])
		changeTurn(arr[4]);
		if (mvs.length > 1){
			main_game.queue = mvs.splice(1)
		}
	}
	
}

function AI(){
	let board = main_game.board;
	let x = main_game.x;
	let y= main_game.y;
	if (level == 1){
		if(board[x][y][4]==0 && x!=1 && x!=(iw-1)) return [4];
		else if(board[x][y][5]==0 && x==1 && y < ih) return [5];			
		else if(board[x][y][3]==0 && x==(iw-1) && y < ih) return [3];			
		else if(board[x][y][5]==0 && x>=1/2*iw) return [5];
		else if(board[x][y][3]==0 && x<=1/2*iw) return [3];
		else if(board[x][y][5]==0) return [5];
		else if(board[x][y][3]==0) return [3];
		else if(board[x][y][6]==0 && x>=1/2*iw) return [6];
		else if(board[x][y][2]==0 && x<=1/2*iw) return [2];
		else if(board[x][y][6]==0) return [6];
		else if(board[x][y][2]==0) return [2];
		else if(board[x][y][7]==0 && x>=1/2*iw) return [7];
		else if(board[x][y][1]==0 && x<=1/2*iw) return [1];
		else if(board[x][y][7]==0) return [7];
		else if(board[x][y][1]==0) return [1];
		else if(board[x][y][0]==0) return [0];
	}
	else if (level == 2 || level == 3){
		res = BTA(copy(board), x, y, (2 ? level == 2 : 5))
		mv = []
		res.path.forEach(element => {
			mv.push(element)
		});
		return mv;
	}
	else if(level == 4){
		// RL
	}
}

function Turn(abc){
	if((main_game.gamer==1 && abc=="YT") || (main_game.gamer==-1 && abc=="YOT")) Your_Turn();
	else if((main_game.gamer==1 && abc=="YOT") || (main_game.gamer==-1 && abc=="YT")) Your_Opponent_Turn();
}

function KeyClick(e){
	if(main_game.gamer != 1)
		return;
	let moveCodes = [87, 69, 68, 67, 88, 90, 65, 81]; // W, E, D, C, X, Z, A, Q
	let pos = moveCodes.indexOf(e)
	let arr = main_game.move(pos)
	console.log("H: ", arr)
	if (arr[0] == true) {
		main_ui.moveUI("red", pos)
	}
	changeTurn(arr[4]);
}

function Start(){
	let x = iw/2;
	let y = ih/2;
	main_game = new gameEnv();
	main_game.reset()

	main_ui = new canvasUI(x, y);

	main_ui.draw_table();
	main_ui.draw_line();

	
	
	a=Math.floor(Math.random()*1000+1);

	if(a%2==0) Your_Turn();
	else Your_Opponent_Turn();
}

function End_Game(gmr){
	console.log("ENDGAME: ", gmr)
	//main_game.move(8);
	main_game.endgame = 1;
	if(gmr==-1) document.getElementById("stan").innerHTML="YOU WIN";
	if(gmr==1) document.getElementById("stan").innerHTML="COMPUTER WINS";
}

function StartNewGame(){
	iw=parseInt(document.getElementById("wdh").value);
	ih=parseInt(document.getElementById("hgh").value);
	main_game.endgame=0;
	cw=canvas.width=(iw+2)*50;
	ch=canvas.height=(ih+4)*50;		
	Start();
}

window.addEventListener("keydown", function(e){console.log(e.keyCode); KeyClick(e.keyCode)});
Start();