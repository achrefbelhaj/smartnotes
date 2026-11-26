package com.smartnotes.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// Un JWT est une chaîne signée qui contient l'identité de l'utilisateur (ici son email).
// Seul le serveur connaît la clé secrète : personne ne peut fabriquer ni modifier un token.
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    // Le secret et la durée viennent d'application.properties (donc des variables d'environnement)
    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // Crée un token contenant l'email, la date de création et la date d'expiration
    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key) // signature avec la clé secrète
                .compact();
    }

    // Relit l'email stocké dans le token
    public String extractEmail(String token) {
        return parse(token).getSubject();
    }

    // Un token est valide si sa signature est correcte ET s'il n'a pas expiré
    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Vérifie la signature et l'expiration, lance une exception sinon
    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}