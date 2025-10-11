package com.tinderapp.app;

import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import java.util.ArrayList;
import java.util.List;

public class MatchingActivity extends AppCompatActivity {

    private FirebaseFirestore db;
    private FirebaseAuth auth;
    private List<UserProfile> profiles = new ArrayList<>();
    private int currentIndex = 0;

    private ImageView photoView;
    private TextView nameView;
    private Button likeButton, nextButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_matching);

        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        photoView = findViewById(R.id.photoView);
        nameView = findViewById(R.id.nameView);
        likeButton = findViewById(R.id.likeButton);
        nextButton = findViewById(R.id.nextButton);

        loadProfiles();

        likeButton.setOnClickListener(v -> {
            saveMatch(profiles.get(currentIndex).uid);
        });

        nextButton.setOnClickListener(v -> {
            if (currentIndex < profiles.size() - 1) {
                currentIndex++;
                showProfile();
            }
        });
    }

    private void loadProfiles() {
        String myId = auth.getCurrentUser().getUid();
        db.collection("users").get().addOnSuccessListener(result -> {
            for (QueryDocumentSnapshot doc : result) {
                UserProfile profile = doc.toObject(UserProfile.class);
                if (!profile.uid.equals(myId)) {
                    profiles.add(profile);
                }
            }
            showProfile();
        });
    }

    private void showProfile() {
        UserProfile profile = profiles.get(currentIndex);
        nameView.setText(profile.name);
        Glide.with(this).load(profile.photos.get(0)).into(photoView);
    }

    private void saveMatch(String toUid) {
        String fromUid = auth.getCurrentUser().getUid();
        db.collection("matches").document(fromUid + "_" + toUid)
            .set(new Match(fromUid, toUid, System.currentTimeMillis()));
    }
}
