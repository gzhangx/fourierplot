import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import fourier, {calculate4t} from '../util/fourier';

const INC = 0.01;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems() {
        const res = [];
        for (let i =0; i < 3.14*2;i+=INC) {
            res.push({
                x: Math.sin(i) * 50 + 100,
                y: i*50 + 100,
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
        let t = this.state.t;
        if (!this.state.orig) {
            this.setState({orig: this.getOrigItems()});
            const fsteps = fourier.fourier(this.getOrigItems(), {loops: this.state.tMax});
            this.setState({
                fsteps,
            })
        }
        const tsteps = [];
        const curPos = fourier.calculate4t(this.state.fsteps, t, (acc,n)=>{
            tsteps.push({orig: acc, to: n});
        });
        let tpos = this.state.tpos;
        if (!this.state.times[t]) tpos.push(curPos);
        this.setState({
            tsteps,
            curPos,
            tpos,
        });
        t = t +this.state.tInc;
        if (t > this.state.tMax) t = 0;
        this.setState({t});
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