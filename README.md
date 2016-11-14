# puppymail-server

The server side proxy component for the GetPocket API to avoid issues with CORS. 

All the real heavy lifting is done by the wonderful [express-http-proxy](https://github.com/villadora/express-http-proxy) with a little bit of custom even handling to inject custom firebase tokens on the way through.

You can see the code in action at http://blogs.bytecode.com.au/projects/puppymail/
