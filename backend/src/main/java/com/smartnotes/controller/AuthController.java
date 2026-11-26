package com.smartnotes.controller;

import com.smartnotes.dto.AuthResponse;
import com.smartnotes.dto.LoginRequest;
import com.smartnotes.dto.RegisterRequest;
import com.smartnotes.entity.User;
import com.smartnotes.repository.UserRepository;
import com.smartnotes.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/auth/register : crée le compte et renvoie directement un token
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cet email est déjà utilisé"));
        }

        // On enregistre le mot de passe HACHÉ, jamais en clair
        User user = new User(email, passwordEncoder.encode(request.password()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, email));
    }

    // POST /api/auth/login : vérifie email + mot de passe, puis renvoie un token
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        try {
            // Spring Security compare le mot de passe avec le haché BCrypt de la base
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou mot de passe incorrect"));
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(new AuthResponse(token, email));
    }
}