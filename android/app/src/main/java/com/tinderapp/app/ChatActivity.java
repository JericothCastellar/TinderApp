package com.tinderapp.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.tinderapp.app.adapters.MessageAdapter;
import com.tinderapp.app.models.Message;
import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends AppCompatActivity {
    private RecyclerView recyclerMessages;
    private MessageAdapter adapter;
    private List<Message> messages = new ArrayList<>();
    private String currentUserId = "userA"; // Simulado
    private String otherUserId = "userB";   // Simulado

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        recyclerMessages = findViewById(R.id.recyclerMessages);
        recyclerMessages.setLayoutManager(new LinearLayoutManager(this));

        messages.add(new Message(currentUserId, otherUserId, "Hola, ¿cómo estás?", "2025-10-10T22:00:00Z"));
        messages.add(new Message(otherUserId, currentUserId, "Bien, ¿y tú?", "2025-10-10T22:01:00Z"));

        adapter = new MessageAdapter(messages, currentUserId);
        recyclerMessages.setAdapter(adapter);
    }
}
