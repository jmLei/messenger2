# Brainstorming

## index.html

When user submits userId form located on index.html:
- Redirect to chatroom.html

## chatroom.html
```
When user enters page:

1. HEAD /users/{userId}                 
Check if userId exists. If userId exists, go to step 3. Else, go to step 2.

2. POST /users                          
Create a new user with the userId.

3. GET  /users/{userId}                 
Retrieves a user's friend list, friend requests, and conversationIds.

4. GET  /conversations/{conversationId}?field=name 
For each conversationId, retrieve all of the conversation names.
```


