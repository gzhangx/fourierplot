import {RunWorker} from "./graphworker";
import React from "react";

import {MainContext} from "./provider";

function Coords() {

    function processor(ctx, {state}) {
        const {width, height, bottomSpace} = {width: 500, height: 500, bottomSpace: 10};
        function translateY(y) {
            return height - y - bottomSpace;
        }
        function drawLine(x,y,x1,y1) {
            ctx.beginPath();
            ctx.moveTo(x, translateY(y));
            ctx.lineTo(x1, translateY(y1));
            ctx.stroke();
        }


        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";
        drawLine(0,0, 0,height);
        drawLine(0,0, width,0);
        //ctx.fillRect(0, 0, 100, 50);

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
        if (state.steps) {
            const t = state.t;
            state.steps.reduce((acc, cur) => {
                const nx = acc.x+ Math.cos(cur.ang + t)*cur.mag;
                const ny = acc.y+ Math.sin(cur.ang + t)*cur.mag;
                drawLine(acc.x, acc.y, nx, ny);
                return {x:nx, y:ny};
            }, {x: 0, y: 0});
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