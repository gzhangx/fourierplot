const c = require('./src/util/fourier');


const res = [];
for (let i =0; i < 3.14;i+=0.01) {
    res.push({
        x: Math.sin(i) * 100,
        y: i*100,
    })
}
const opt = { steps:[], loops: 5};

const steps = c.fourier(res, opt);

console.log(steps.map(o=>{
    return {
        ang : o.ang*180/Math.PI,
        mag: o.mag,
    }
}));