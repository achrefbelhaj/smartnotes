package com.smartnotes.dto;

// Ce que le backend renvoie après inscription ou connexion
public record AuthResponse(String token, String email) {}