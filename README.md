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
```
GET   /users          (Retrieves all users)       
GET   /users/{userId} (Retrieves a user with a specific id)

HEAD  /users/{userId} (Checks if userId exists. Returns 200 if exists. Otherwise, returns 404.)

POST  /users          (Create a user) 
POST body format: 
- { "_id": {userId}, "friendList: [], "friendRequests": [], "conversations": [] }

PATCH /users/{userId} (Partially Updates user a specific userId)
PATCH body format:
- Add to friend list:          { "op": "add",    "path": "/friend-list",     "value": {userId}     }
- Add to friend requests:      { "op": "add",    "path": "/friend-requests", "value": {userId}     }
- Add to conversations:        { "op": "add",    "path": "/conversations",   "value": {chatroomId} }
- Remove from friend requests: { "op": "remove", "path": "/friend-requests", "value": {userId}     }
```
  
## Conversation Schema
```
Conversation: {
    _id: ObjectId,
    name: String,
    messages: { timestamp: Timestamp, from: {userId}, body: String}
}
```
## Conversation API
```
GET /conversations/{id} (Retrieves a conversation with a specific conversationId)

PATCH /conversations/{id} (Partially updates a conversation with a specific conversationId)
PATCH body format:
- Add to messages: { "op": "add", "path": "/messages", "value": { "timestamp": Timestamp, "from": {userId}, "body": String }}

POST /conversations
POST body format: { "name": String, "messages": [] }
```