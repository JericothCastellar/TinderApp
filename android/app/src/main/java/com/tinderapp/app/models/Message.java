package com.tinderapp.app.models;

public class Message {
    public String senderUid;
    public String receiverUid;
    public String text;
    public String timestamp;

    public Message() {}

    public Message(String senderUid, String receiverUid, String text, String timestamp) {
        this.senderUid = senderUid;
        this.receiverUid = receiverUid;
        this.text = text;
        this.timestamp = timestamp;
    }
}
