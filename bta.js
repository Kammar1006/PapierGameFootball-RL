function possibleMoves(arr){
    let arr2 = []
    arr.forEach((e, i) => {
        if (e == 0) arr2.push(i)
    });

    return arr2;
}

function calcScore(x, y){
    return Math.abs(ih+1 - y) + Math.abs(iw/2 - x)
}

function copy(arr){
    return JSON.parse(JSON.stringify(arr))
}

function move(board, x, y, pos){
    board[x][y][pos]=1;
    if(pos==0){
        x+=0;
        y-=1;
    }			
    if(pos==1){
        x+=1;
        y-=1;
    }
    if(pos==2){			
        x+=1;
        y-=0;
    }
    if(pos==3){		
        x+=1;
        y+=1;
    }
    if(pos==4){		
        x+=0;
        y+=1;
    }
    if(pos==5){			
        x-=1;
        y+=1;
    }
    if(pos==6){				
        x-=1;
        y+=0;
    }
    if(pos==7){		
        x-=1;
        y-=1;
    }

    pos+=4;
    if(pos>=8) pos-=8;
    console.log(board[x], pos, x, y)
    board[x][y][pos]=1;
    sum=board[x][y][0]+board[x][y][1]+board[x][y][2]+board[x][y][3]+board[x][y][4]+board[x][y][5]+board[x][y][6]+board[x][y][7];

    return [board, x, y, sum]
}

function BTA(board, x, y, deep = 3){
    let best_path = []
    let best_score = 10000
    let pm = possibleMoves(board[x][y]);
    console.log("PM: ", pm);

    pm.forEach(e => {
        console.log(x, y)
        let arr = move(copy(board), x, y, e)
        let board_copy = arr[0]
        let xc = arr[1]
        let yc = arr[2]
        let sum = arr[3]
        console.log(xc, yc)
        let score = 0
        if (sum == 8){
            score = 1000
        }
        if (sum == 1 || deep == 0) {
            score = calcScore(xc, yc)
            let path = [e]
            console.log("try 1: ", path)
            if(score < best_score){
                best_score = score
                best_path = path
            }
        }
        else{
            res = BTA(board_copy, xc, yc, deep - 1)
            let path = [e].concat(res.path)
            console.log("try 2: ", path, ", sum = ", sum)
            if(res.score < best_score){
                best_score = res.score
                best_path = path
            }
        }
    })
    return {score: best_score, path: best_path}
}