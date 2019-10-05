import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {calculate4t} from '../util/fourier';

function Coords() {

    function processor(ctx, {state}) {
        const {width, height, bottomSpace} = {width: 500, height: 500, bottomSpace: 10};
        function translateY(y) {
            return (height - y );
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
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
        if(state.orig) {
            state.orig.reduce((acc, cur)=>{
                if (cur.px === null) {
                    return acc;
                }else {
                    drawLine(acc.x, acc.y, cur.x, cur.y);
                    return cur;
                }
            }, { px: null, py: null});
        }
        if (state.tsteps) {
            state.tsteps.forEach(s=>{
                drawLine(s.orig.x, s.orig.y, s.to.x, s.to.y);
            });
        }

        if (state.tpos) {
            state.tpos.forEach(s=>{
                ctx.beginPath();
                ctx.arc(s.x, translateY(s.y), 2, 0, 2*Math.PI);
                ctx.fill();
            });
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