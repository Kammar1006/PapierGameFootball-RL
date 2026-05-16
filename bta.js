function possibleMoves(arr){
    let arr2 = []
    arr.forEach(element, i => {
        if (element == 0) arr2.push(i)
    });
}

function calcScore(x, y){
    return Math.max((ih - y), Math.abs(iw/2 - x))
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
    board[x][y][pos]=1;
    sum=board[x][y][0]+board[x][y][1]+board[x][y][2]+board[x][y][3]+board[x][y][4]+board[x][y][5]+board[x][y][6]+board[x][y][7];

    return [board, x, y, sum]
}

function BTA(board, x, y, deep = 3){
    let best_path = []
    let best_score = 10000
    possibleMoves(board[x][y]).forEach(e => {
        [board_copy, xc, yc, sum] = move(copy(board), x, y)
        let score = 0
        if (sum == 8){
            continue
        }
        if (deep == 0) {
            score = calcScore(xc, yc)
        }
        else{
            res = BTA(board_copy, xc, yc, deep-1)
            if(res.score < best_score){
                best_score = res.score
                best_path = res.path
            }
        }
    })
    return {score: best_score, path: best_path}
}