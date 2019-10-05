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
        this.setState({t: 0, times:{}, tpos:[]});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true, calculated: null});
    };

    tIncChanged= (e)=>{
        this.setState({tInc: parseFloat(e.target.value) || 0.01});
    };

    resetMag = (fsind,v)=>{
        this.state.fsteps[fsind].mag = v;
        this.setState({fsteps: this.state.fsteps,times:{}, tpos:[]});
    };

    resetAng = (fsind,v)=>{
        this.state.fsteps[fsind].ang = v;
        this.setState({fsteps: this.state.fsteps,times:{}, tpos:[]});
    };

    processState = ()=>{
        if (this.state.paused) return;
        let t = this.state.t;
        if (!this.state.orig) {
            this.setState({orig: this.getOrigItems()});
            const fsteps = fourier.fourier(this.getOrigItems(), {interval: this.state.interval, loops: this.state.tMax});
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
                <div>
                    <button onClick={this.reset}>Reset</button>
                    <button onClick={this.pause}>Pause</button>
                    <input type='text' value={this.state.tInc} onChange={this.tIncChanged} />
                </div>
                <div>
                    {
                        this.state.fsteps && this.state.fsteps.map((fs, fsind)=>{
                            return <div>
                                <input type='text' value={fs.mag} onChange={
                                    e=>this.resetMag(fsind, parseFloat(e.target.value))
                                } />
                                <input type='text' value={fs.ang} onChange={
                                    e=>this.resetAng(fsind, parseFloat(e.target.value))
                                } />
                            </div>;
                        })
                    }
                </div>
            </MainContext.Provider>
        );
    }
}

export default MainPage;