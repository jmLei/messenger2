# Brainstorming

## index.html

When user submits userId form located on index.html:
- Redirect to chatroom.html

## chatroom.html
- HEAD /users/{userId} (Checks if userId exists. If it does not exist, create a new user)
- GET /users/{userId} (Retrieves a user's friend list, friend requests, and conversations)
