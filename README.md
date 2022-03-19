# Dependencies

Node.js
- mongoose package used to connect to interact with MongoDB

# User Schema

User: {
    _id: String,
    friendList: [{type: String}],
    friendRequests: [{type: String}],
    conversations: [{type: String}]
}

# User API

- GET    /user      (Retrieves all users)       
- GET    /user/{id} (Retrieves a user with id = {id})
- POST   /user      (Create a user) 
    - { "_id": {userId}, "friendList: [], "friendRequests": [], "conversations": [] }
- PATCH  /user/{id} (Partially Updates user with id = {id})
    - Add to friend list:          { "op": "add",    "path": "/friend-list",     "value": {userId}     }
    - Add to friend requests:      { "op": "add",    "path": "/friend-requests", "value": {userId}     }
    - Add to conversations:        { "op": "add",    "path": "/conversations",   "value": {chatroomId} }
    - Remove from friend requests: { "op": "remove", "path": "/friend-requests", "value": {userId}     }
  
