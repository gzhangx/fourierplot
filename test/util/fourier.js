const fourier = require('../../src/util/fourier');

describe('util/fourier', ()=> {
    it('should do it', () => {
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
});