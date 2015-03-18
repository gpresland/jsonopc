'use strict';


var OpcShell = require('./opc_shell');


function Opc() {
    //
}

/**
 * Connect to JSON OPC
 *
 * @param  {string} host      The host the OPC server is running on e.g. localhost, 127.0.0.1.
 * @param  {string} server    The OPC server name e.g. Matrikon.OPC.Simulation.1.
 * @param  {object} callback  The callback after connecting.
 * @return {null}
 */
Opc.connect = function connect(host, server, callback) {
    
    callback = (typeof callback === 'function') ? callback : null;
    
    if (callback === null)
        throw new Error('No callback provided');
    
    var opcShell = new OpcShell(function () {
        
        opcShell.connect(host, server, function () {

            try {
                callback(null, opcShell);
            } catch (err) {
                throw err;
            }
        });    
    });
    
};


module.exports = Opc;