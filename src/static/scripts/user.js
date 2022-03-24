
export default class User {
    constructor(_id, friendList, incomingFriendRequests, outgoingFriendRequests, conversations) {
        this._id = _id;
        this.friendList = friendList;
        this.incomingFriendRequests = incomingFriendRequests;
        this.outgoingFriendRequests = outgoingFriendRequests;
        this.conversations = conversations;
    }
}


// Creates a representation of an outgoing friend request in HTML.
export const createOutgoingFriendRequestElement = (outgoingFriendRequest) => {
    const element = document.createElement("div");
    const text = document.createTextNode(outgoingFriendRequest);
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.friendId = outgoingFriendRequest;
    element.appendChild(text);
    element.appendChild(cancelButton);
    element.classList.add("box");
    return element;
};

// Creates a representation of an incoming friend request in HTML.
export const createIncomingFriendRequestElement = (incomingFriendRequest) => {
    const element = document.createElement("div");
    const text = document.createTextNode(incomingFriendRequest);

    const buttonGroup = document.createElement("div");

    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accept";
    acceptButton.friendId = incomingFriendRequest;

    const rejectButton = document.createElement("button");
    rejectButton.textContent = "Reject";
    rejectButton.friendId = incomingFriendRequest;

    buttonGroup.appendChild(acceptButton);
    buttonGroup.appendChild(rejectButton);

    element.appendChild(text);
    element.appendChild(buttonGroup);
    element.classList.add("box");

    return element;
};

export const createFriendElement = (friend) => {
    const element = document.createElement("div");
    const text = document.createTextNode(friend);

    element.appendChild(text);
    element.classList.add("box");
    return element;
};