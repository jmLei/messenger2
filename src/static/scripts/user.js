
export default class User {
    constructor(_id, friendList, incomingFriendRequests, outgoingFriendRequests, conversations) {
        this._id = _id;
        this.friendList = friendList;
        this.incomingFriendRequests = incomingFriendRequests;
        this.outgoingFriendRequests = outgoingFriendRequests;
        this.conversations = conversations;
    }
}


// Creates a representation of an incoming friend request in HTML.
export const createOutgoingFriendRequestElement = (outgoingFriendRequest) => {
    const element = document.createElement("div");
    const text = document.createTextNode(outgoingFriendRequest);
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.friendId = outgoingFriendRequest;
    element.appendChild(text);
    element.appendChild(cancelButton);
    element.classList.add("outgoing-friend-request");
    return element;
};