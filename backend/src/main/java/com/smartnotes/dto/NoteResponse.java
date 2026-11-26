package com.smartnotes.dto;

import com.smartnotes.entity.Note;

import java.time.LocalDateTime;

// Ce que le backend renvoie : la note, SANS l'utilisateur ni son mot de passe
public record NoteResponse(
        Long id,
        String title,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    // Convertit une entité Note en NoteResponse
    public static NoteResponse from(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt());
    }
}