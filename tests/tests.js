var assert  = require('assert'),
    jsonopc = require('..').Opc;

var host    = 'localhost',
    server  = 'Matrikon.OPC.Simulation.1';

describe('Perform 10 requests to the Matrikon Simulation Server', function () {
    it('10 valid results should be received', function (done) {
        jsonopc.connect(host, server, function (err, opc) {
            var request, results;
            request = {
                test1: {
                    Int4: 'Random.Int4',
                    Int5: 'Random.Int5'
                }
            };
            results = [];
            (function get(i) {
                opc.get(request, function (data) {
                    if (data.hasOwnProperty('test1') &&
                        data.test1.hasOwnProperty('Int4') &&
                        typeof data.test1.Int4 === 'number') {
                        results.push(data);
                    }
                    if (i === 10) {
                        opc.end();
                        assert.equal(results.length, 10);
                        done();
                    } else {
                        get(i + 1);
                    }
                });
            }(1));
        });
    });
});