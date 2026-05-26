var max_deep = 3

function possibleMoves(arr){
    let arr2 = []
    arr.forEach((e, i) => {
        if (e == 0) arr2.push(i)
    });

    return arr2;
}

function calcScore(x, y, c = -1){ // for other player c = ih+1
    if(x >= 4 && x <= 6 && y == c) return 1000;
    let dist_y = Math.abs(ih-c - y);
    let dist_x = (dist_y > ih/2) ? Math.min(Math.abs(iw/4 - x), Math.abs(3*iw/4 - x)) : Math.abs(iw/2 - x);
    return Math.floor(5*dist_y + 3*dist_x);
}

function copy(arr){
    return JSON.parse(JSON.stringify(arr))
}

function BTA(board, x, y, deep = max_deep){
    console.log("BTA:::", board, x, y, deep)
    let best_path = []
    let best_score = 10000
    let pm = possibleMoves(board[x][y]);
    console.log("PM: ", pm);

    pm.forEach(e => {
        env = new gameEnv(copy(board), x, y)

        let arr = env.move(e)
        console.log(arr)
        let board_copy = arr[1]
        let xc = arr[2]
        let yc = arr[3]
        let sum = arr[4]
        console.log(xc, yc)
        let score = 0
        let rnd = Math.floor(Math.random()*100)+1
        if (sum == 8){
            score = 1000
        }
        else{
            score = calcScore(xc, yc)
        }
        if (sum == 1 || deep == 0 || score >= 1000) {
            
            let path = [e]
            console.log("try 1: ", path)
            if(score < best_score || (score == best_score && rnd <= 30)){
                best_score = score
                best_path = path
            }
        }
        else{
            res = BTA(board_copy, xc, yc, deep - 1)
            let path = [e].concat(res.path)
            console.log("try 2: ", path, ", sum = ", sum)
            if(res.score < best_score || (res.score == best_score && rnd <= 30)){
                best_score = res.score
                best_path = path
            }
        }
    })
    return {score: best_score, path: best_path}
}