# Litecoin Survey App

Basic application of running a Litecoin client, communicating through JSON-RPC, and letting users interact with the node with an API. There are several GET and POST request, and the app also displays the current litecoin price provided from chain api.

## Using the appp

This implementation requires the following prerequisites:

```
Node.js® v10.15.0, Node Package Management (npm) v6.8.0
```

[Node.js®](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. The installation includes npm. For other OS, refer to their website. This is installation for Ubuntu:

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs
```

Input Litecoin Client details and then run:

```
node app.js
```

Open your browser and enter:

http://localhost:3000/
