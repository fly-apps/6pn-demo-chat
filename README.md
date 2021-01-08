# 6pn-demo-chat

## Rationale

This is the code for a very simple chat example which uses bare websockets in Node and a Browser to connect to it. 

Instead of immediatly broadcasting the message to all users, the server sends the message on to a NATS server, using 6PN private networking, which broadcasts the message to all interested parties.

## Preparation

As this example relies on a NATS server (or cluster) to be available, it should be deployed alongside the `nats-cluster-example`, within the same Fly organization.

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
fly deploy --buildargs NATSAPP=myclusterapp
```





