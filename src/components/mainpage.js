import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import fourier from '../util/fourier';

const INC = 0.01;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems() {
        const res = [];
        for (let i =0; i < 3.14;i+=INC) {
            res.push({
                x: Math.sin(i) * 100,
                y: i*100,
            })
        }
        return res;
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
        if (!this.state.orig) {
            this.setState({orig: this.getOrigItems()});
            this.setState({
                curSteps: fourier.fourier((this.getOrigItems())),
            })
        }
        this.setState({t: this.state.t+1});
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