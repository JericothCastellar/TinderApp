package com.tinderapp.app;

public class Match {
    public String from;
    public String to;
    public long timestamp;

    public Match() {}

    public Match(String from, String to, long timestamp) {
        this.from = from;
        this.to = to;
        this.timestamp = timestamp;
    }
}
