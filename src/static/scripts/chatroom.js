import User, {createOutgoingFriendRequestElement, createIncomingFriendRequestElement, createFriendElement, createConversationElement} from "./user.js";
import Conversation, {createMessageElements} from "./conversation.js";

var currentUser;
var currentConversation;
var socket;

const main = async () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace(`${window.location.origin}/index.html`);
    }

    socket = io();
    socket.emit("send-user-id", localStorage.getItem("id"));
    
    // Get user info.
    let response = await fetch(`${window.location.origin}/users/${localStorage.getItem("id")}`);
    response = await response.json();

    currentUser = new User(
        response._id,
        response.friendList,
        response.incomingFriendRequests,
        response.outgoingFriendRequests,
        response.conversations
    );

    const greeting = document.getElementById("greeting");
    const text = document.createTextNode(`Welcome back, ${currentUser._id}`);
    greeting.prepend(text);

    // Update the view.
    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);
    drawConversationList(currentUser.conversations);
    
    // Add functionalities to buttons.
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", onLogoutButtonClick);

    const sendFriendRequestButton = document.getElementById("send-friend-request-button");
    sendFriendRequestButton.addEventListener("click", sendFriendRequest);

    const sendMessageButton = document.getElementById("send-message");
    sendMessageButton.addEventListener("click", sendMessage);

    socket.on("conversation-joined", (conversationId) => {
        currentUser.conversations.push(conversationId);
        drawConversationList(currentUser.conversations);
    });

    socket.on("friend-request-accepted", (emitterId) => {
        const index = currentUser.outgoingFriendRequests.indexOf(emitterId);
        
        if(index > -1) {
            currentUser.outgoingFriendRequests.splice(index, 1);
            drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
        }

        currentUser.friendList.push(emitterId);
        drawFriendList(currentUser.friendList);
    });

    socket.on("friend-request-cancelled", (emitterId) => {
        const index = currentUser.incomingFriendRequests.indexOf(emitterId);
        if(index > -1) {
            currentUser.incomingFriendRequests.splice(index, 1);
            drawIncomingFriendRequests(currentUser.incomingFriendRequests);
        }
    });

    socket.on("friend-request-received", (emitterId) => {
        currentUser.incomingFriendRequests.push(emitterId);
        drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    });

    socket.on("friend-request-rejected", (emitterId) => {
        const index = currentUser.outgoingFriendRequests.indexOf(emitterId);
        if(index > -1) {
            currentUser.outgoingFriendRequests.splice(index, 1);
            drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
        }
    });

    socket.on("message-received", (conversationId, message) => {
       if(currentConversation._id === conversationId) {
           currentConversation.messages.push(message);
           drawCurrentConversation(currentConversation);
       } 
    });
};

const drawOutgoingFriendRequests = (outgoingFriendRequests) => {
    console.log("Draw Outgoing Friend Requests");
    const outgoingFriendRequestsContainer = document.getElementById("outgoing-friend-requests");

    // Clear out outgoingFriendRequestsContainer
    while(outgoingFriendRequestsContainer.firstChild) {
        outgoingFriendRequestsContainer.removeChild(outgoingFriendRequestsContainer.firstChild);
    }

   for(let i = 0; i < currentUser.outgoingFriendRequests.length; i++) {
       const element = createOutgoingFriendRequestElement(currentUser.outgoingFriendRequests[i]);
       element.querySelector("button").addEventListener("click", cancelFriendRequest);
       outgoingFriendRequestsContainer.appendChild(element);
   }
};

const drawIncomingFriendRequests = (incomingFriendRequests) => {
    console.log("Drawing Incoming Friend Requests.");
    const container = document.getElementById("incoming-friend-requests");

    // Clear out container.
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(let i = 0; i < currentUser.incomingFriendRequests.length; i++) {
        const element = createIncomingFriendRequestElement(currentUser.incomingFriendRequests[i]);
        const buttonGroup = element.querySelector("div").querySelectorAll("button");
        buttonGroup[0].addEventListener("click", acceptFriendRequest);
        buttonGroup[1].addEventListener("click", rejectFriendRequest);
        container.appendChild(element);
    }
};

const drawFriendList = (friendList) => {
    console.log("Drawing Friend List.");
    const container = document.getElementById("friend-list");

    // Clear out container.
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(let i = 0; i < currentUser.friendList.length; i++) {
        const element = createFriendElement(currentUser.friendList[i]);
        container.appendChild(element);
    }
}

const drawConversationList = async (conversationIds) => {
    const conversations = [];

    for(let i = 0; i < conversationIds.length; i++) {
        const response = await fetch(`${window.location.origin}/conversations/${conversationIds[i]}`);
        const conversation = await response.json();
        conversations.push(conversation);
    }

    const conversationList = document.getElementById("conversation-list");

    while(conversationList.firstChild) {
        conversationList.removeChild(conversationList.firstChild);
    }

    for(let i = 0; i < conversations.length; i++) {
        const element = createConversationElement(conversations[i]);
        element.addEventListener("click", setCurrentConversation);

        conversationList.appendChild(element);
    }
};

const drawCurrentConversation = (currentConversation) => {
    console.log(currentConversation);
    const container = document.getElementById("current-conversation");


    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const messages = createMessageElements(currentConversation.messages);
    container.appendChild(messages);
    
}

const acceptFriendRequest = (event) => {

    const friendId = event.target.friendId;

    fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: currentUser._id
        })
    });

    fetch(`${window.location.origin}/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: friendId
        })
    });

    fetch(`${window.location.origin}/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/friend-list",
            value: friendId
        })
    });

    fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/friend-list",
            value: currentUser._id
        })
    });

    createConversation(currentUser._id, friendId);

    const index = currentUser.incomingFriendRequests.indexOf(friendId);
    currentUser.incomingFriendRequests.splice(index, 1);
    currentUser.friendList.push(friendId);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);

    socket.emit("accept-friend-request", [currentUser._id, friendId]);
};

const rejectFriendRequest = (event) => {
    console.log(`${event.target.friendId} reject button clicked.`);

    const friendId = event.target.friendId;

    fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: currentUser._id
        })
    });

    fetch(`${window.location.origin}/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: friendId
        })
    });

    const index = currentUser.incomingFriendRequests.indexOf(friendId);
    currentUser.incomingFriendRequests.splice(index, 1);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);

    socket.emit("reject-friend-request", [currentUser._id, friendId]);
};

const cancelFriendRequest = (event) => {
    const friendId = event.target.friendId;
    
    fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: localStorage.getItem("id")
        })
    });

    fetch(`${window.location.origin}/users/${localStorage.getItem("id")}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: friendId
        })
    });

    const index = currentUser.outgoingFriendRequests.indexOf(friendId);
    currentUser.outgoingFriendRequests.splice(index, 1);
    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);

    socket.emit("cancel-friend-request", [currentUser._id, friendId]);
}

const onLogoutButtonClick = (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    window.location.replace(`${window.location.origin}/index.html`);
};

const sendFriendRequest = async (event) => {
    event.preventDefault();
    
    const friendId = document.getElementById("friend-id").value;

    await fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/incoming-friend-requests",
            value: localStorage.getItem("id")
        })
    });

    // Update server about adding to outgoing friend requests list
    await fetch(`${window.location.origin}/users/${localStorage.getItem("id")}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/outgoing-friend-requests",
            value: friendId
        })
    });

    // Update client about adding to outgoing friend requests list
    currentUser.outgoingFriendRequests.push(friendId);
    drawOutgoingFriendRequests();

    // Update friend's client
    console.log("Socket.emit(send-friend-request)");
    socket.emit("send-friend-request", [localStorage.getItem("id"), friendId]);
};

const createConversation = async (id, friendId) => {

    let conversation = await fetch(`${window.location.origin}/conversations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `${id} & ${friendId}`,
            participants: [ id, friendId ],
            messages: []
        })
    });

    conversation = await conversation.json();
    const conversationId = conversation._id;

    await fetch(`${window.location.origin}/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/conversations",
            value: conversationId
        })
    });

    await fetch(`${window.location.origin}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/conversations",
            value: conversationId
        })
    });

    currentUser.conversations.push(conversationId);
    drawConversationList(currentUser.conversations);

    socket.emit("join-conversation", friendId, conversationId);
}

const setCurrentConversation = async (event) => {
    console.log("Set Current Conversation");
    const conversationId = event.target.conversation._id;
    const response = await fetch(`${window.location.origin}/conversations/${conversationId}`);
    const conversation = await response.json();

    currentConversation = new Conversation(
        conversation._id,
        conversation.name,
        conversation.participants,
        conversation.messages
    );
    
    document.getElementById("conversation-name").innerText = conversation.name;
    drawCurrentConversation(currentConversation);
}

const sendMessage = (event) => {

    if(currentConversation === undefined) {
        console.log("Cannot send message. No conversation selected.");
        document.getElementById("message-field").value = "";
        return;
    }

    const message = document.getElementById("message-field").value;
    
    const body = {
        timestamp: new Date(),
        from: currentUser._id,
        body: message
    };

    // Send message to database.
    fetch(`${window.location.origin}/conversations/${currentConversation._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/messages",
            value: JSON.stringify(body)
        })
    });

    // Update client.
    currentConversation.messages.push(body);

    // Update friend's client.
    socket.emit("send-message", currentConversation._id, currentConversation.participants, body);

    // Re-draw current conversation.
    drawCurrentConversation(currentConversation);
    document.getElementById("message-field").value = "";
}

main();