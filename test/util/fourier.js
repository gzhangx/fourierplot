const sinon = require('sinon');
const fourier = require('../../src/util/fourier');

describe('util/fourier', ()=> {
    it('should do fourier', () => {
        fourier.fourier([{
            x: 10,
            y: 10,
        }], {loops: 3}).should.deep.equal([
            {
                "ang": 0.7853981633974483,
                "mag": 14.142135623730951
            },
            {
                "ang": 1.1391662424352011,
                "mag": 1.1167196933024797e-14
            },
            {
                "ang": 0.4316300843596955,
                "mag": 1.1167196933024797e-14
            },
            {
                "ang": 0.7445002650122695,
                "mag": 9.830718893054773e-15
            },
            {
                "ang": 0.826296061782627,
                "mag": 9.830718893054773e-15
            }
        ]);
    });

    it('should do fourier with steps', () => {
        fourier.fourier([{
            x: 10,
            y: 10,
        }], {loops: 3, steps:[{x:1}, {x:1}]}).should.deep.equal([
            {
                "x": 1
            },
            {
                "x": 1
            },
            {
                "ang": 1.1391662424352011,
                "mag": 1.1167196933024797e-14
            },
            {
                "ang": 0.4316300843596955,
                "mag": 1.1167196933024797e-14
            }
        ]);
    });

    it('should do fourier default 10', () => {
        fourier.fourier([{
            x: 10,
            y: 10,
        }]).length.should.equal(19);
    });

    it('should calculate4t', ()=>{
        const steps = fourier.fourier([{
            x: 10,
            y: 10,
        }], {loops: 3});
        const stub = sinon.stub();
        fourier.calculate4t(steps, 0, stub);
        stub.getCalls().length.should.equal(5);
        const c1args = stub.getCall(0).args;
        c1args[0].should.deep.equal({
            "ang": 0.7853981633974483,
            "mag": 14.142135623730951,
            "x": 0,
            "y": 0,
        });
        c1args[1].should.deep.equal({
            "ang": 0.7853981633974483,
            "mag": 14.142135623730951,
            "x": 10.000000000000002,
            "y": 10,
        });
    })
});