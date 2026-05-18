const canvas=document.querySelector("canvas");
const ctx= canvas.getContext("2d");

var iw=10; // horizontal number of tiles
var ih=14; // vertical number of tiles
var cw=canvas.width=(iw+2)*50;
var ch=canvas.height=(ih+4)*50;		

var gamer; // 1 if your turn and -1 if opp turn
var level = 3;

var x=iw/2; // current ball position
var y=ih/2; 

var points={};  //table which describe all posible moves form all localtion; 
				//each position for example points[4][5] contain 8 value array with indexes 0 to 7
				//each index describe one direction starting form N, NE, E.. up to NS - clockwise
				//number 0 tell that move is possible, and number 1 that is blocked
				//if direction array is sum to 8 then move is impossible from chosen position 

var endgame = 0; //Endgame flag if 1 game is ended
var queue = null; //queue for AI/Computer moves if are calculated

var max_deep = 3

var Table = {
	color:"white",
	draw_yourself: function(){
		ctx.fillStyle=this.color;
		ctx.fillRect(cw/(iw+2),2*ch/(ih+4),cw*iw/(iw+2),ch*ih/(ih+4));
		ctx.fillRect(iw/2*cw/(iw+2),ch/(ih+4),cw/(iw+2)*2,ch/(ih+4));
		ctx.fillRect(iw/2*cw/(iw+2),ch/(ih+4)*(ih+1),cw/(iw+2)*2,2*ch/(ih+4));
	}
}

var Table_line = {
	color:"gray",
	draw_yourself: function(){
		ctx.fillStyle=this.color;
		for(i=0;i<=iw;i++){
			points[i]={};
			for(j=0;j<=ih;j++){
				if(i==0 && j==0) points[i][j]=[1,1,1,0,1,1,1,1];
				else if(i==0 && j==ih) points[i][j]=[1,0,1,1,1,1,1,1];
				else if(i==iw && j==0) points[i][j]=[1,1,1,1,1,0,1,1];
				else if(i==iw && j==ih) points[i][j]=[1,1,1,1,1,1,1,0];
				else if(i==0) points[i][j]=[1,0,0,0,1,1,1,1];
				else if(j==0) points[i][j]=[1,1,1,0,0,0,1,1];
				else if(i==iw) points[i][j]=[1,1,1,1,1,0,0,0];
				else if(j==ih) points[i][j]=[0,0,1,1,1,1,1,0];	
				else points[i][j]=[0,0,0,0,0,0,0,0];
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
		points[iw/2-1][-1]=[1,1,1,0,1,1,1,1];
		points[iw/2][-1]=[1,1,1,0,0,0,1,1];
		points[iw/2+1][-1]=[1,1,1,1,1,0,1,1];
		points[iw/2-1][0]=[1,0,0,0,0,0,1,1];
		points[iw/2][0]=[0,0,0,0,0,0,0,0];
		points[iw/2+1][0]=[1,1,1,0,0,0,0,0];	


		points[iw/2-1][ih+1]=[1,0,1,1,1,1,1,1];
		points[iw/2][ih+1]=[0,0,1,1,1,1,1,0];
		points[iw/2+1][ih+1]=[1,1,1,1,1,1,1,0];
		points[iw/2-1][ih]=[0,0,0,0,1,1,1,0];
		points[iw/2][ih]=[0,0,0,0,0,0,0,0];
		points[iw/2+1][ih]=[0,0,1,1,1,0,0,0];				
	}
}

var ball = {
	move: function(color, pos){
		if((points[x][y][pos]==0 || pos==8) && endgame==0){
			//console.log(x,y,points[x][y], pos);
			if(pos!=8) points[x][y][pos]=1;
			if(pos!=8 && color=="red") ball.move("red", 8);
			if(pos==0){
				ctx.fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)-2,(y+2)*ch/(ih+4)-i,5,-4);
				x+=0;
				y-=1;
			}
			if(pos==8){
				ctx.fillStyle=color;
				ctx.fillRect(cw/(iw+2)*(x+1)-2,(y+2)*ch/(ih+4)-2,5,5);
				x+=0;
				y-=0;
			}					
			if(pos==1){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)+i,(y+2)*ch/(ih+4)-i,4,-4);
				points[x][y][pos]=1;
				x+=1;
				y-=1;
			}
			if(pos==2){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)+i,(y+2)*ch/(ih+4)-2,+4,5);				
				x+=1;
				y-=0;
			}
			if(pos==3){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)+i,(y+2)*ch/(ih+4)+i,4,4);				
				x+=1;
				y+=1;
			}
			if(pos==4){
				ctx.fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)-2,(y+2)*ch/(ih+4)+i,5,4);				
				x+=0;
				y+=1;
			}
			if(pos==5){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)-i,(y+2)*ch/(ih+4)+i,-4,4);				
				x-=1;
				y+=1;
			}
			if(pos==6){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)-i,(y+2)*ch/(ih+4)-2,-4,5);				
				x-=1;
				y+=0;
			}
			if(pos==7){
				fillStyle=color;
				for(i=0;i<cw/(iw+2)*1-4;i++) ctx.fillRect(cw/(iw+2)*(x+1)-i,(y+2)*ch/(ih+4)-i,-4,-4);			
				x-=1;
				y-=1;
			}
			av=pos;
			
			if(pos != 8){
				if(y==-1){
					End_Game(-1);
					return;
				} 
				if(y==ih+1){
					End_Game(1);
					return;
				}
			}
			
			if(av!=8){
				pos+=4;
				if(pos>=8) pos-=8;
				points[x][y][pos]=1;
				console.log(x,y,points[x][y]);
				suma=points[x][y][0]+points[x][y][1]+points[x][y][2]+points[x][y][3]+points[x][y][4]+points[x][y][5]+points[x][y][6]+points[x][y][7];
				if(suma>1 && suma<8) Turn("YT");
				else if(suma==8) End_Game(gamer);
				else Turn("YOT");
			}
		}
		else if(points[x][y][pos]==1 && pos!=8) ball.move("black", 8);
	}
}

function range(a, c, b){
	return Math.max(a, Math.min(c, b))
}

function fixLevel(){
	level = range(1, parseInt(document.getElementById("level").value), 3);
}

function Your_Turn(){
	document.getElementById("stan").innerHTML="YOUR TURN";
	ball.move("black",8);
	gamer=1;
	if(y==-1) End_Game(-1);
	if(y==ih+1) End_Game(1);
}

function Your_Opponent_Turn(){
	document.getElementById("stan").innerHTML="YOUR OPPONENT";
	ball.move("blue",8);
	gamer=-1;
	if(y==ih+1) End_Game(-gamer);
	
	//SI_start();
	if(queue !== null){
		ball.move("blue", queue[0])
		if (queue.length > 1){
			queue = queue.splice(1)
		}
		else{
			queue = null;
		}
	}
	else{
		mvs = AI()
		console.log("MVS: ", mvs)
		ball.move("blue", mvs[0])
		if (mvs.length > 1){
			queue = mvs.splice(1)
		}
	}
	
}

function AI(){
	if (level == 1){
		if(points[x][y][4]==0 && x!=1 && x!=(iw-1)) return [4];
		else if(points[x][y][5]==0 && x==1 && y < ih) return [5];			
		else if(points[x][y][3]==0 && x==(iw-1) && y < ih) return [3];			
		else if(points[x][y][5]==0 && x>=1/2*iw) return [5];
		else if(points[x][y][3]==0 && x<=1/2*iw) return [3];
		else if(points[x][y][5]==0) return [5];
		else if(points[x][y][3]==0) return [3];
		else if(points[x][y][6]==0 && x>=1/2*iw) return [6];
		else if(points[x][y][2]==0 && x<=1/2*iw) return [2];
		else if(points[x][y][6]==0) return [6];
		else if(points[x][y][2]==0) return [2];
		else if(points[x][y][7]==0 && x>=1/2*iw) return [7];
		else if(points[x][y][1]==0 && x<=1/2*iw) return [1];
		else if(points[x][y][7]==0) return [7];
		else if(points[x][y][1]==0) return [1];
		else if(points[x][y][0]==0) return [0];
	}
	else if (level == 2 || level == 3){
		res = BTA(points, x, y, (2 ? level == 2 : 5))
		mv = []
		res.path.forEach(element => {
			mv.push(element)
		});
		return mv;
	}
}

// function SI_start(){
// 	points_SI=points;
// 	tab_points[0]=points_SI;
// 	copy_x=x;
// 	copy_y=y;
// 	SI_reapet();
// }
// function Si_up(xxx){
// 	if(xxx==0){
// 		copy_x+=0;
// 		copy_y-=1;
// 	}
// 	else if(xxx==1){
// 		copy_x+=1;
// 		copy_y-=1;
// 	}
// 	else if(xxx==2){
// 		copy_x+=1;
// 		copy_y-=0;
// 	}
// 	else if(xxx==3){
// 		copy_x+=1;
// 		copy_y+=1;
// 	}
// 	else if(xxx==4){
// 		copy_x+=0;
// 		copy_y+=1;
// 	}
// 	else if(xxx==5){
// 		copy_x-=1;
// 		copy_y+=1;
// 	}
// 	else if(xxx==6){
// 		copy_x-=1;
// 		copy_y-=0;
// 	}
// 	else if(xxx==7){
// 		copy_x-=1;
// 		copy_y-=1;
// 	}
// 	if(xxx>=0 && xxx<=7){
// 		actual[actual.length]=xxx;
// 		actual[0]++;
// 		suma=points_SI[copy_x][copy_y][0]+points_SI[copy_x][copy_y][1]+points_SI[copy_x][copy_y][2]+points_SI[copy_x][copy_y][3]+points_SI[copy_x][copy_y][4]+points_SI[copy_x][copy_y][5]+points_SI[copy_x][copy_y][6]+points_SI[copy_x][copy_y][7];
// 		if(suma>1 && suma!=8) SI_reapet();
// 		console.log(copy_x, copy_y);
// 	}
// }
// function SI_reapet(){
// 	if(tab_points[actual[0]][copy_x][copy_y][4]==0){
// 		Si_up(4);
// 		actual[0]--;
// 	};		
// 	if(tab_points[actual[0]][copy_x][copy_y][5]==0) Si_up(5);
// 	if(tab_points[actual[0]][copy_x][copy_y][3]==0) Si_up(3);
// 	if(tab_points[actual[0]][copy_x][copy_y][2]==0) Si_up(2);
// 	if(tab_points[actual[0]][copy_x][copy_y][6]==0) Si_up(6);
// 	if(tab_points[actual[0]][copy_x][copy_y][1]==0) Si_up(1);
// 	if(tab_points[actual[0]][copy_x][copy_y][7]==0) Si_up(7);
// 	if(tab_points[actual[0]][copy_x][copy_y][0]==0) Si_up(0);
// }

function Turn(abc){
	if((gamer==1 && abc=="YT") || (gamer==-1 && abc=="YOT")) Your_Turn();
	else if((gamer==1 && abc=="YOT") || (gamer==-1 && abc=="YT")) Your_Opponent_Turn();
}

function KeyClick(e){
	if(gamer != 1)
		return;
	let moveCodes = [87, 69, 68, 67, 88, 90, 65, 81]; // W, E, D, C, X, Z, A, Q
	ball.move("red", moveCodes.indexOf(e));
}

function Start(){
	Table.draw_yourself();
	Table_line.draw_yourself();
	x=iw/2;
	y=ih/2;
	a=Math.floor(Math.random()*1000+1);
	if(a%2==0) Your_Turn();
	else Your_Opponent_Turn();
}

function End_Game(gmr){
	ball.move("black", 8);
	endgame=1;
	if(gmr==-1) document.getElementById("stan").innerHTML="YOU WIN";
	if(gmr==1) document.getElementById("stan").innerHTML="COMPUTER WINS";
}

function StartNewGame(){
	iw=parseInt(document.getElementById("wdh").value);
	ih=parseInt(document.getElementById("hgh").value);
	endgame=0;
	cw=canvas.width=(iw+2)*50;
	ch=canvas.height=(ih+4)*50;		
	Start();
}		
window.addEventListener("keydown", function(e){console.log(e.keyCode); KeyClick(e.keyCode)});
Start();