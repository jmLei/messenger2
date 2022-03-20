# Dependencies

- Node.js
    - mongoose package used to connect to MongoDB

# Brainstorming

## User Schema

```
User: {
    _id: String,
    friendList: [{type: String}],
    friendRequests: [{type: String}],
    conversations: [{type: String}]
}
```

## User API

- GET    ```/user```      (Retrieves all users)       
- GET    ```/user/{id}``` (Retrieves a user with a specific id)
- POST   ```/user```      (Create a user) 
    - ```{ "_id": {userId}, "friendList: [], "friendRequests": [], "conversations": [] }```
- PATCH  ```/user/{id}``` (Partially Updates user a specific userId)
    - Add to friend list:          ```{ "op": "add",    "path": "/friend-list",     "value": {userId}     }```
    - Add to friend requests:      ```{ "op": "add",    "path": "/friend-requests", "value": {userId}     }```
    - Add to conversations:        ```{ "op": "add",    "path": "/conversations",   "value": {chatroomId} }```
    - Remove from friend requests: ```{ "op": "remove", "path": "/friend-requests", "value": {userId}     }```
  
## Conversation Schema
```
Conversation: {
    _id: ObjectId,
    messages: { timestamp: Timestamp, from: {userId}, body: String}
}
```
## Conversation API

- GET   ```/conversation/{id}``` (Retrieves a conversation with a specific conversationId)
- PATCH ```/conversation/{id}``` (Partially updates a conversation with a specific conversationId)
    - Add to messages: ```{ "op": "add", "path": "/messages", "value": { "timestamp": Timestamp, "from": {userId}, "body": String }}```