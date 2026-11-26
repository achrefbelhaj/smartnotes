package com.smartnotes.entity;

import jakarta.persistence.*;

// On nomme la table "users" car "user" est un mot réservé dans certaines bases
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'email sert d'identifiant de connexion, il doit être unique
    @Column(nullable = false, unique = true)
    private String email;

    // Contiendra le mot de passe HACHÉ avec BCrypt, jamais le mot de passe en clair
    @Column(nullable = false)
    private String password;

    public User() {
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
