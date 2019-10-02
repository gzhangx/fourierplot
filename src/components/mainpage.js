import React from 'react';
import Coords from './boxenv';
import EnergyEnv from './energyenv';

import {MainContext, DEFAULT_STATE} from "./provider";


const INC = 0.01;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems(m) {
        return [
            {x: 1, y:0},
            {x: 10, y:0},
            {x:100, y:0}
        ];
    }
    pause = () => {
        this.setState({paused: !this.state.paused});
    };
    reset = () => {
        this.setState({t: 0, curImpactCount:0 ,paused: false, calculated: null});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true, calculated: null});
    };

    processState = ()=>{
        
    };

    render() {
        return (
            <MainContext.Provider value={{state: this.state, processState: this.processState,}}>
                <div>
                    <Coords/>
                </div>
            </MainContext.Provider>
        );
    }
}

export default MainPage;