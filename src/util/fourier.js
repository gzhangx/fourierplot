function getEit(t) {
    return {
        x: Math.cos(t),
        y: Math.sin(t),
    }
}

function emul(a, b) {
    return {
        x: (a.x* b.x) - (a.y*b.y),
        y: (a.x * b.y) + (a.y*b.x),
    }
}
function fourier1(data, {interval=0.01, steps=[],}) {
    const who = parseInt((steps.length+1)/2);
    const max = 1/interval;
    function doInterval(who) {
        function getData(i) {
            return data[parseInt(i*data.length/max)];
        }
        const conv = {
            x: 0,
            y: 0,
        };
        for (let i = 0, t=0; i < max; i++, t+=interval) {
            const d = emul(getData(i),getEit(who*2*Math.PI*t));
            conv.x += d.x*interval;
            conv.y += d.y*interval;
        }
        const avg = {
            x: conv.x ,
            y: conv.y ,
        };
        const mag = Math.sqrt(avg.x*avg.x+ (avg.y*avg.y));
        const ang = Math.atan2(avg.y, avg.x);
        return {
            mag,
            ang,
        };
    }

    if (who === 0) {
        steps.push(doInterval(who));
    }else {
        steps.push(doInterval(who));
        steps.push(doInterval(-who));
    }
    return steps;
}

function fourier(data, opt = {}) {
    let steps = opt.steps;
    const loops = opt.loops || 10;
    if (!steps) {
        steps = opt.steps = [];
    }
    for (let i = steps.length; i < loops; i++) {
        steps = fourier1(data, Object.assign({}, opt, steps));
    }
    return steps;
}


exports.fourier = fourier;