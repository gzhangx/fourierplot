import React from 'react';
const DEFAULT_STATE = {
    paused: false,
    t: 0,
    tMax: 50,
    tInc: 0.01,
    interval: 0.0005,
    tpos: [],
    times:{},
    orig: [],
    manualPoints : [],
    showCircle: false,
    recalculate:true,
    centerAt: {x: 0, y:0},
    centerPos : 0,
    ui: {
        width: 512,
        height: 512,
        bottomSpace: 20,
    }
};
const MainContext = React.createContext(DEFAULT_STATE);

export {
    DEFAULT_STATE,
    MainContext,
}