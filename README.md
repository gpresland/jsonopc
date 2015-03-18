# jsonopc

A sample library that implements a simple interface using JSON between NodeJS and PLCs using OPC.

## Prerequisites

1. <a href="https://code.google.com/p/iview-scada/downloads/detail?name=OPC%20.NET%20API%202.00%20Redistributables%202.00.100.zip&can=2&q=">OPC .NET API 2.00 Redistributables.msi</a>.
2. <a href="http://www.matrikonopc.com/">MatrikonOPC Server</a>

## Usage

```js
var jsonopc = require('jsonopc').Opc;

var host   = 'localhost',
    server = 'Matrikon.OPC.Simulation.1';

jsonopc.connect(host, server, function (err, opc) {
    
    // Create tag value request
    var request = {
        plc1: {
            Int4: 'Random.Int4'
        },
        plc2: {
            Int5: 'Random.Int5'
        }
    };
    
    // Retrieve tag values
    opc.get(request, function (data) {
        
        console.dir(data);
        
        // Close connection to OPC server
        opc.end();
    });
});
```

## Notes

Although possible, this library does not currently support setting PLC tag values, only retrieving.