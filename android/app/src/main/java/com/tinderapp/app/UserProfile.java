package com.tinderapp.app;

import java.util.List;

public class UserProfile {
    public String uid;
    public String name;
    public String lastName;
    public String birthDate;
    public String country;
    public String city;
    public String gender;
    public boolean showGenderProfile;
    public List<Passion> passions;
    public List<String> photos;

    public UserProfile() {}
}
