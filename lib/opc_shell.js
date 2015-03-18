'use strict';


var execFile = require('child_process').execFile;


/**
 * Interface to jsonopc.exe
 *
 * @param  {object} callback  The callback function to run after the shell launches.
 * @return {null}
 */
var OpcShell = function (callback) {
    
    var self           = this;
    
    this.shell         = execFile('./bin/jsonopc.exe');
    
    this._endCallback  = callback;
    this._stdoutBuffer = '';
    
    // Event: Receive from stdout
    self.shell.stdout.on('data', function (message) {
        self.receive(message);
    });
    
    // Event: Shell exit
    self.shell.on('exit', function (code) {
        //
    });
};

/**
 * Connect to OPC server
 *
 * @param  {string} host      The host the OPC server is running on e.g. localhost, 127.0.0.1.
 * @param  {string} server    The OPC server name e.g. Matrikon.OPC.Simulation.1.
 * @param  {object} callback  The callback function to run after connecting.
 * @return {null}
 */
OpcShell.prototype.connect = function connect(host, server, callback) {

    // Set the callback for the connected message event
    this._endCallback = callback;
    
    // Send request to stdin
    this.shell.stdin.write('connect -h ' + host + ' -s ' + server + '\n');
};

/**
 * Handle shell closing
 *
 * @return {null}
 */
OpcShell.prototype.end = function end() {
    
    this.shell.stdin.write('exit\n');
};

/**
 * Get request to OPC server
 *
 * @param  {object} request   The JSON request object.
 * @param  {object} callback  The callback to run on response.
 * @return {null}
 */
OpcShell.prototype.get = function get(request, callback) {
    
        callback = (typeof callback === 'function') ? callback : null;
        request  = JSON.stringify({ get: request });    
    
        if (callback === null)
            throw new Error('No callback provided'); 
        
        // Set the callback for the stdout receive event
        this._endCallback = callback;
        
        // Send request to stdin
        this.shell.stdin.write('get -r ' + request + '\n');
};

/**
 * Handle received stdin
 * 
 * @param  {string} message  The message received from stdin.
 * @param  {bool}   silent   If the output from stdout should be ignored.
 * @return {null}
 */
OpcShell.prototype.receive = function receive(message) {
    
    // Append stdout to buffer
    this._stdoutBuffer += message;
    
    // Test if buffer has terminated
    var isEndOfInput = new RegExp('> $').test(this._stdoutBuffer);
    
    if (isEndOfInput) {
        
        // Get output
        var data = this._stdoutBuffer.trim().split(/\n/g)[0].trim();
        
        // Clear buffer
        this._stdoutBuffer = '';
        
        // Try to parse data as JSON
        try {
            data = JSON.parse(data);
        } catch (e) {
            // Do nothing
        }
        
        // Run callback with data received
        this._endCallback(data);
    }
};


module.exports = OpcShell;