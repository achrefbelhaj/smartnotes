package com.smartnotes.controller;

import com.smartnotes.dto.NoteRequest;
import com.smartnotes.dto.NoteResponse;
import com.smartnotes.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // "Authentication" est rempli par notre JwtAuthFilter :
    // authentication.getName() renvoie l'email de l'utilisateur connecté (lu dans le token).
    // On ne prend JAMAIS l'identité depuis la requête, seulement depuis le token.

    @GetMapping
    public List<NoteResponse> list(Authentication authentication) {
        return noteService.findAll(authentication.getName());
    }

    @GetMapping("/{id}")
    public NoteResponse get(@PathVariable Long id, Authentication authentication) {
        return noteService.findOne(id, authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponse create(@Valid @RequestBody NoteRequest request, Authentication authentication) {
        return noteService.create(request, authentication.getName());
    }

    @PutMapping("/{id}")
    public NoteResponse update(@PathVariable Long id,
                               @Valid @RequestBody NoteRequest request,
                               Authentication authentication) {
        return noteService.update(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        noteService.delete(id, authentication.getName());
    }
}