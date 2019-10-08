import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";
import {calculate4t} from '../util/fourier';

function Coords() {

    function processor(ctx, {state}) {
        const {width, height } = {width: 500, height: 500 };
        const centerAt = state.centerAt;
        function translateY(y) {
            if (centerAt.y) {
                return height/2 - (y - centerAt.y)
            }
            return (height - y );
        }
        function translateX(x) {
            if (centerAt.x) {
                return width/2 + (x - centerAt.x)
            }
            return x;
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
            state.tsteps.map((s, ind)=>{
                drawLine(s.orig.x, s.orig.y, s.to.x, s.to.y);
                if (state.showCircle) {
                    if (ind) {
                        ctx.beginPath();
                        //ctx.globalAlpha = 0.3;
                        ctx.strokeStyle = 'rgba(0,100,100,0.3)';
                        ctx.arc(translateX(s.orig.x), translateY(s.orig.y), s.to.mag, 0, 2 * Math.PI);
                        ctx.stroke();
                        //ctx.globalAlpha = 1;
                    }
                }
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