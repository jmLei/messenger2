export default class Conversation {
    constructor(_id, name, messages) {
        this._id = id;
        this.name = name;
        this.messages = messages;
    }
}

export const createMessageElements = (messages) => {
    const elements = [];

    for(let i = 0; i < messages.length; i++) {
        const element = createMessageElement(messages[i]);
        elements.push(element);
    }
    return elements;
}

// Message format: { 
//    timestamp: Date, 
//    from: String,
//    body: String
// }
const createMessageElement = (message) => {
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = `${message.timestamp} ${message.from}`;
    const p = document.createElement("p");
    p.innerText = message.body;

    div.appendChild(h3);
    div.appendChild(p);

    return div;
};