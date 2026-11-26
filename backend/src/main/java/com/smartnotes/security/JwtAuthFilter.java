package com.smartnotes.security;

import com.smartnotes.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Ce filtre s'exécute AVANT chaque requête.
// Son rôle : lire le token dans l'en-tête "Authorization: Bearer xxxxx",
// le vérifier, puis dire à Spring Security "cet utilisateur est connecté".
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 1. Y a-t-il un en-tête "Bearer ..." ?
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // on enlève "Bearer "

            // 2. Le token est-il valide, et personne n'est-il déjà authentifié ?
            if (jwtUtil.isValid(token)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 3. On retrouve l'utilisateur grâce à l'email contenu dans le token
                String email = jwtUtil.extractEmail(token);
                try {
                    UserDetails user = userDetailsService.loadUserByUsername(email);

                    // 4. On déclare l'utilisateur comme connecté pour cette requête
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } catch (Exception e) {
                    // Utilisateur supprimé entre-temps : on ne connecte personne (réponse 401)
                }
            }
        }

        // On passe la requête au filtre suivant
        chain.doFilter(request, response);
    }
}