import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";

function Coords() {

    function processor(ctx, {state}) {
        const {width, height } = {width: 500, height: 500 };
        if (!state.needRedraw) {
            return;
        }
        if (!ctx)return true;
        const centerAt = state.centerAt;
        function translateY(y) {
            if (centerAt.y) {
                return height/2 - (y - centerAt.y)*state.scale;
            }
            return (height - y*state.scale );
        }

        function translateX(x) {
            if (centerAt.x) {
                return width/2 + (x - centerAt.x)*state.scale;
            }
            return x*state.scale;
        }

        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(translateX(x), translateY(y));
            ctx.lineTo(translateX(x1), translateY(y1));
            ctx.stroke();
        }

        function drawCoordLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, height - y);
            ctx.lineTo(x1, height - y1);
            ctx.stroke();
        }

        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";
        drawCoordLine(0,0, 0,height);
        drawCoordLine(0,0, width,0);
        //ctx.fillRect(0, 0, 100, 50);

        ctx.fillText(state.t.toFixed(2), 10,10);
        
        const {times, t} = state;
        if (times) {
            const keysAll = Object.keys(times);
            const curT = parseInt(t*state.TIMESMAX);
            const keys = keysAll.filter(k=>k <= curT);
            keys.reduce((acc,k)=> {
                const pos = times[k];
                //console.log(k+ " " + pos.y);
                const newPt = {
                    x: curT - k,
                    y: pos.y,
                };
                if (acc.x !== 0 && acc.y !== 0)
                    drawLine(acc.x, acc.y, newPt.x, newPt.y);
                return newPt;
            },{x:0,y:0});
        }

    }

    return (
        <MainContext.Consumer>{
            contextInfo=> {
                return <RunWorker processor={processor} contextInfo={contextInfo}/>
            }
        }</MainContext.Consumer>
    );
}

export default Coords;