import React from 'react';
import Coords from './boxenv';

import {MainContext, DEFAULT_STATE} from "./provider";
import fourier, {calculate4t} from '../util/fourier';
import DownloadLink from "react-download-link";
import Dropzone from 'react-dropzone'
const INC = 0.01;
class MainPage extends React.Component {
    state = DEFAULT_STATE;
    getOrigItems() {
        return [];
        const res = [];
        for (let i =0; i < 3.14*2;i+=1) {
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
    showCircle = ()=>{
        this.setState({showCircle: !this.state.showCircle});
    };
    clear = () => {
        this.setState({t: 0, times:{}, tpos:[], orig: [], tsteps: []});
    };
    reset = () => {
        this.setState({t: 0, times:{}, tpos:[], tsteps: []});
    };

    backForward = (inc) => {
        this.setState({t: this.state.t - inc, paused: true, calculated: null});
    };

    tIncChanged= e=>{
        this.setState({tInc: parseFloat(e.target.value) || 0.01});
    };

    tMaxChanged = e=>{
        this.setState({tMax: parseInt(e.target.value) || 10, times:{}, tpos:[], recalculate:true});
    };

    resetMag = (fsind,v)=>{
        this.state.fsteps[fsind].mag = v;
        this.setState({fsteps: this.state.fsteps,times:{}, tpos:[]});
    };

    resetAng = (fsind,v)=>{
        this.state.fsteps[fsind].ang = v;
        this.setState({fsteps: this.state.fsteps,times:{}, tpos:[]});
    };

    centerPosChanged = e=>{
        this.setState({centerPos: parseInt(e.target.value)});
    };

    handleMouseDown = () => { //added code here
        this.setState({mouseDown: true});
    };

    handleMouseMove = event=> {
        if (!this.state.mouseDown) return;
        const curPt = {
            x:event.offsetX,
            y: 500-event.offsetY
        };
        if (this.state.manualPoints.length) {
            let prev = this.state.manualPoints[this.state.manualPoints.length - 1];
            const pts = [];
            const inc = (a,b)=>{
                if (a>b) return a-1;
                if (a<b) return a+1;
                return a;
            };
            while( true) {
                prev = {
                    x: inc(prev.x, curPt.x),
                    y: inc(prev.y, curPt.y),
                };
                pts.push(prev);
                if (prev.x === curPt.x && prev.y === curPt.y) break;
                //if (i > 15) break;
            }
            const toAdd = pts.filter(p=> {
                return !this.state.manualPoints.find(existing=>{
                    return existing.x === p.x && existing.y === p.y;
                })
            });
            toAdd.forEach(p=>this.state.manualPoints.push(p))
        }else
            this.state.manualPoints.push(curPt);

        this.state.orig.push(curPt);
        const fsteps = fourier.fourier(this.state.orig, {interval: this.state.interval, loops: this.state.tMax});
        this.setState({
            fsteps,
        });
    };
    handleMouseUp = event=> {
        this.setState({mouseDown: false});
    };

    processState = ()=>{
        if (this.state.paused) return;
        let t = this.state.t;
        if (this.state.orig.length === 0) return;
        if (this.state.recalculate) {
            this.setState({recalculate:false});
            //this.setState({orig: this.getOrigItems()});
            const fsteps = fourier.fourier(this.state.orig, {interval: this.state.interval, loops: this.state.tMax});
            this.setState({
                fsteps,
            })
        }
        const tsteps = [];
        const curPos = fourier.calculate4t(this.state.fsteps, t, (acc,n)=>{
            tsteps.push({orig: acc, to: n});
        });
        const centerAt = {x:0, y:0};
        if (this.state.centerPos) {
            const c = tsteps[this.state.centerPos];
            if (c) {
                centerAt.x = c.orig.x;
                centerAt.y = c.orig.y;
            }
        }
        this.setState({centerAt});
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

    onDrop = (acceptedFiles, rejectedFiles) => {
        const self = this;
        const reader = new FileReader()   ;
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event) => {
        // Do whatever you want with the file contents     
            self.setState({orig: JSON.parse(event.target.result.toString())});
        };
        acceptedFiles.forEach(file => reader.readAsText(file))
    };
    render() {
        return (
            <MainContext.Provider value={{state: this.state, processState: this.processState,}}>
                <div onMouseDown={
                    e => {
                        let nativeEvent = e.nativeEvent;
                        this.handleMouseDown(nativeEvent);
                    }}
                     onMouseMove={
                         e => {
                             let nativeEvent = e.nativeEvent;
                             this.handleMouseMove(nativeEvent);
                         }}
                     onMouseUp={
                         e => {
                             let nativeEvent = e.nativeEvent;
                             this.handleMouseUp(nativeEvent);
                         }}>
                    <Coords/>
                </div>
                <div>
                    <button onClick={this.clear}>Clear</button>
                    <button onClick={this.reset}>Reset</button>
                    <button onClick={this.pause}>Pause</button>
                    <button onClick={this.showCircle}>Show Circle</button>
                    <input type='text' value={this.state.tInc} onChange={this.tIncChanged} />
                    <input type='text' value={this.state.tMax} onChange={this.tMaxChanged} />
                    <input type='text' value={this.state.centerPos} onChange={this.centerPosChanged} />
                    <DownloadLink
	                        filename="points.txt"
	                        exportFile={() => JSON.stringify(this.state.orig)}
                        >
		                    Save to disk
                        </DownloadLink>
                        <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles,rejectedFiles)}>
  {({getRootProps, getInputProps}) => (
    <section>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  )}
</Dropzone>
                        
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