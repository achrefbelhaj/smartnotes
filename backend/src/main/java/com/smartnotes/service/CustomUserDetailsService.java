package com.smartnotes.service;

import com.smartnotes.entity.User;
import com.smartnotes.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

// Dit à Spring Security comment retrouver un utilisateur dans NOTRE base de données
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        // On convertit notre User en UserDetails (le format que Spring Security comprend).
        // Pas de rôles dans ce projet : liste d'autorités vide.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), List.of());
    }
}