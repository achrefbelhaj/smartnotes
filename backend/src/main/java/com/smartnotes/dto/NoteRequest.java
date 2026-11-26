package com.smartnotes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Ce que le frontend envoie pour créer ou modifier une note
public record NoteRequest(
        @NotBlank(message = "Le titre est obligatoire")
        @Size(max = 255, message = "255 caractères maximum")
        String title,

        @Size(max = 20000, message = "20000 caractères maximum")
        String content
) {}