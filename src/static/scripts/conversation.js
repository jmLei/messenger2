export default class Conversation {
    constructor(_id, name, participants, messages) {
        this._id = _id;
        this.name = name;
        this.participants = participants;
        this.messages = messages;
    }
}

export const createMessageElements = (messages) => {
    const div = document.createElement("div");

    for(let i = 0; i < messages.length; i++) {
        const element = createMessageElement(messages[i]);
        div.appendChild(element);
    }
    return div;
}

// Message format: { 
//    timestamp: Date, 
//    from: String,
//    body: String
// }
const createMessageElement = (message) => {
    const div = document.createElement("div");
    const name = document.createElement("p");
    const time = document.createElement("p");
    const body = document.createElement("p");

    div.classList.add("message");
    name.innerText = message.from;
    time.innerText = message.timestamp
    body.innerText = message.body;

    div.appendChild(name);
    div.appendChild(time);
    div.appendChild(body);

    return div;
};