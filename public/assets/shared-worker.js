var connections = [];
var ws = new WebSocket('ws://localhost:8083');

ws.onopen = function() {
    console.log("WebSocket connection established!");
};

ws.onmessage = function(event) {
    connections.forEach(function(port) {
        port.postMessage(event.data);
    });
};

ws.onerror = function(error) {
    console.error("WebSocket error: " + error);
};

ws.onclose = function() {
    console.log("WebSocket connection closed");
};

self.onconnect = function(event) {
    var port = event.ports[0];
    connections.push(port);

    port.onmessage = function(event) {
        ws.send(event.data);
    };

    port.start();
};