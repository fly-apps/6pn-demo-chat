# 6pn-demo-chat

A chat server which uses Fly 6PN networking to connect to a NATS cluster enabling global chat.

<!---- cut here --->

## Rationale

This is the code for a very simple chat example that uses bare websockets in Node and a Browser to connect to it. 

Instead of immediately broadcasting the message to all users, the server sends the message on to a NATS server, using 6PN private networking, which broadcasts the message to all interested parties.

## Preparation

As this example relies on a NATS server (or cluster) to be available, it should be deployed alongside the `nats-cluster`, within the same Fly organization.

Make a note of the app-name used to deploy the NATS cluster.

Select a name for your chat app.

## Initializing

Create an app on Fly with your chosen chat app name, using `fly init`:

```cmd
fly init YOURAPPNAME --import example-fly.toml
```

## Deploying

To deploy this app, we have one detail we have to pass it, the name fo the NATS cluster. The Dockerfile we use takes a build argument (NATSAPP) and turns it into an environment variable for the app to pick up when it runs. So if your NATS cluster app is called `myclusterapp` then running:

```cmd
fly deploy --build-arg NATSAPP=myclusterapp
```

Note: You can make that setting permanent by adding

```toml
[build.args]
   NATSAPP="myclusterapp"
```

to the fly.toml file.

Once deployed, open up the web page - `fly open` will get you there quickly - enter a chat handle and begin chatting.

## Notes

The more interesting parts of this app happen out of sight of the users. It's worth following the path of the NATSAPP build argument to find out more. 

* NATSAPP's value is passed as a build argument to the Dockerfile at deployment time. 
* Inside the Dockerfile, the build argument is converted into an Environment variable, `NATSAPPHOST` which is retained with the image's configuration. 
* When the `server.js` app starts up, it picks up the `NATSAPPHOST` variable:

```
let natsapphost=process.env.NATSAPPHOST
```

* It then uses that value to connect to the NATS cluster:

```
const nc = NATS.connect(natsapphost+".internal");
```

The combination of an app name and `.internal` in 6PN networking resolves to the IPV6 addresses of the first instance of all instances if that app currently running. So, if we set NATSAPP to `myclusterapp` then scaling and adding nodes to `myclusterapp` would automatically be reflected in `myclusterapp.internal`. 6PN has a number of `.internal` addresses an app can query which you can read about in the [6PN documentation](https://fly.io/docs/reference/services/#internal-addresses).

Once the chat server has connected to the NATS cluster, it subscribes to a topic `msg` and any message written to `msg` will be broadcast to all web socket clients that are connected. If any of those web socket clients sends a message to the chat server, then it will publish that message to the `msg` topic on the NATs cluster. It doesn't even try to echo it locally, relying on the NATS cluster to publish to subscribers.

The NATS cluster can be scaled up and down according to demand. Chat servers will always be able to locate an available node thanks to Fly 6PN networking advertising homogenous services through DNS and `.internal` addresses. You can then deploy the NATS cluster and/or the chat server to any region and know that both will have predictable names; the NATS cluster through Fly's 6PN networking, and the chat server through Fly's AnyCast Edge network. 






