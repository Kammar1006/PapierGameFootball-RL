class QAgent {
    constructor(){
        this.q = {};
        this.alpha = 0.1;
        this.gamma = 0.95;
        this.epsilon = 1.0;
        this.epsilonDecay = 0.999;
        this.epsilonMin = 0.05;
    }

    getStateKey(state){
        return `${state.x},${state.y}`;
    }

    getQ(stateKey, action){
        if(!this.q[stateKey]){
            this.q[stateKey] = Array(8).fill(0);
        }
        return this.q[stateKey][action];
    }

    chooseAction(env){
        let actions = env.getLegalMoves();
        if(actions.length === 0){
            return null;
        }

        if(Math.random() < this.epsilon){
            return actions[
                Math.floor(Math.random()*actions.length)
            ];
        }

        let stateKey = this.getStateKey(
            env.getState()
        );

        let bestAction = actions[0];
        let bestValue = -Infinity;

        for(let action of actions){

            let q = this.getQ(stateKey, action);

            if(q > bestValue){
                bestValue = q;
                bestAction = action;
            }
        }

        return bestAction;
    }

    update(state, action, reward, nextState){

        let s = this.getStateKey(state);
        let ns = this.getStateKey(nextState);

        if(!this.q[s]){
            this.q[s] = Array(8).fill(0);
        }

        if(!this.q[ns]){
            this.q[ns] = Array(8).fill(0);
        }

        let maxNext = Math.max(...this.q[ns]);

        this.q[s][action] += this.alpha *
        (
            reward +
            this.gamma * maxNext -
            this.q[s][action]
        );
    }

    decayEpsilon(){
        this.epsilon = Math.max(
            this.epsilonMin,
            this.epsilon * this.epsilonDecay
        );
    }
}

let agentA = new QAgent();
let agentB = new StupidAI();//new QAgent();

for(let episode=0; episode<1000; episode++){

    let env = new gameEnv();
    env.reset();
    let done = false;

    while(!done){
        let state = env.getState();
        let action =
            (env.gamer === 1)
            ? agentA.chooseAction(env)
            : agentB.chooseAction(env);

        let result = env.step(
            action,
            env.gamer === 1 ? -1 : ih+1
        );

        if(env.gamer === 1){
            agentA.update(
                state,
                action,
                result.reward,
                result.state
            );
        }
        else{
            agentB.update(
                state,
                action,
                result.reward,
                result.state
            );
        }

        done = result.done;
        if(result.sum == 1)
            env.gamer *= -1;
    }

    agentA.decayEpsilon();
    //agentB.decayEpsilon();
}