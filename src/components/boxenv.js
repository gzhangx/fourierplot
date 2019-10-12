import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {calculate4t} from '../util/fourier';

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
            state.tsteps.reduce((acc, s)=>{
                const {ind} = acc;
                let clrCnt = acc.clrCnt;
                drawLine(s.orig.x, s.orig.y, s.to.x, s.to.y);
                if (state.showCircle) {
                    if (ind && ind >= state.centerPos) {
                        ctx.beginPath();
                        //ctx.globalAlpha = 0.3;
                        const alpha = 0.9/clrCnt; //ind > state.centerPos ? 0.5:0.1;
                        const g= (ind*20 + 100)%255;
                        ctx.strokeStyle = `rgba(0,${g},${g}, ${alpha})`;
                        ctx.arc(translateX(s.orig.x), translateY(s.orig.y), s.to.mag*state.scale, 0, 2 * Math.PI);
                        ctx.stroke();
                        clrCnt++;
                        //ctx.globalAlpha = 1;
                    }
                }
                return {
                    clrCnt,
                    ind : ind + 1,
                }
            }, {
                clrCnt: 1,
                ind: 0,
            });
        }

        if (state.tpos) {
            state.tpos.forEach(s=>{
                ctx.beginPath();
                ctx.arc(translateX(s.x), translateY(s.y), 2, 0, 2*Math.PI);
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