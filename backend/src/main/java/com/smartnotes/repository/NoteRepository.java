package com.smartnotes.repository;

import com.smartnotes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Toutes les notes d'un utilisateur (retrouvé par son email), les plus récentes d'abord
    List<Note> findByUserEmailOrderByUpdatedAtDesc(String email);

    // Une note SEULEMENT si elle appartient à cet utilisateur.
    // C'est cette requête qui garantit qu'on ne peut pas lire les notes des autres.
    Optional<Note> findByIdAndUserEmail(Long id, String email);
}