## MathElo

### What works

Currently, it only allows creating local users, retrieving questions, and submitting answers, but no verification as of yet. I've done nothing to make it look pretty. There are some design decisions that need to be made prior to going further. See the _Architecture_ section below.

### What needs to be done

- [ ] - Creating a messaging protocol for the game
- [ ] - Develop a full-featured UI for game play
- [ ] - Decide on a question format which allows for extensibility

### Setup

The project, at the moment, is composed of the following containers:

- **client**: Frontend using SvelteKit
- **server**: Runs the WebSocket server for the game
- **pocketbase**: Database and authentication server
- **rabbitmq**: Messaging service for question resolution

To build or rebuild everything, you can use:

```bash
docker compose build
```

To run, you'll use:

```bash
docker compose up
```

Not all the containers will work at this point, and there will be errors, but the Pocketbase web UI will still load at [http://localhost:8090/\_/](http://localhost:8090/_/). There you'll create a username and password for the admin account.

Next, you'll want to add the current schema. In the **backend/pocketbase** folder, you'll find a **pb_schema.json** file which can be loaded from the web UI via the _Import Collections_ tab.

After that, you'll create two different .env files, the first of which is at the root of the **client** folder:

```
## Database
PUBLIC_DATABASE_URL=http://pocketbase:8090

## Authentication
PUBLIC_REDIRECT_URL=http://localhost:5173/account/oauth/

## Game server
PUBLIC_GAME_SERVER_URL=http://server:3000
```

The second is in **backend/server/**:

```
PUBLIC_DATABASE_URL=http://pocketbase:8090
PRIVATE_DATABASE_USERNAME=
PRIVATE_DATABASE_PASSWORD=

## RabbitMQ
RABBITMQ_QUEUE=questions
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

Here you'll want to add the username and password you created in Pocketbase, or you can alternatively create a dummy user from the web UI from _Setting_ then _Admin_.

At this point, you should be able to use **docker compose up** and then go to [http://localhost:5173](http://localhost:5173). Social auth will not work, but you can create a local account via register or go directly to **/games**.

### Architecture

The flow for the game is as follows:

1. User connects to the WebSocket server.
2. User requests a question.
3. The server gets a random question.
4. A pending answer is added to the database.
5. It adds a delayed message to the message queue.
6. It returns the question to the user.
7. The user can submit a response.
8. The response is checked against the actual answer to see if it's exceeded the time limit.
9. Result is returned to the user.

Steps 5 and 8 are tied, as the queue will trigger a function which updates the pending answer if the user has yet to answer or takes no action if they already have.

### Issues to resolve

- **Selecting random records is expensive**

If we have millions of questions, selecting random questions based on multiple criteria will get expensive if we have a large number of requests. To fix this, we should create a cache that holds all or most of them in memory, sorted by ELO. How this would work with question types and such is difficult to determine, but some map-like structure could be used and then refreshed every so often.

- **Updating ELO score of a question may get expensive**

Immediately updating the ELO of a question may not be necessary, and we should implement a system where it's done as a low-priority background process. Storing completed questions in a Redis queue that can be pulled from later could be a solution.
