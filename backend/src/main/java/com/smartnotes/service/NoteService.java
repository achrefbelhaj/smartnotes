package com.smartnotes.service;

import com.smartnotes.dto.NoteRequest;
import com.smartnotes.dto.NoteResponse;
import com.smartnotes.entity.Note;
import com.smartnotes.entity.User;
import com.smartnotes.repository.NoteRepository;
import com.smartnotes.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Toute la logique des notes. Chaque méthode reçoit l'email de l'utilisateur connecté
// et ne travaille QUE sur ses notes.
@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<NoteResponse> findAll(String email) {
        return noteRepository.findByUserEmailOrderByUpdatedAtDesc(email)
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    public NoteResponse findOne(Long id, String email) {
        return NoteResponse.from(findOwnedNote(id, email));
    }

    public NoteResponse create(NoteRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Note note = new Note();
        note.setTitle(request.title().trim());
        note.setContent(request.content());
        note.setUser(user); // la note appartient à l'utilisateur connecté
        return NoteResponse.from(noteRepository.save(note));
    }

    public NoteResponse update(Long id, NoteRequest request, String email) {
        Note note = findOwnedNote(id, email); // 404 si la note n'est pas à lui
        note.setTitle(request.title().trim());
        note.setContent(request.content());
        return NoteResponse.from(noteRepository.save(note));
    }

    public void delete(Long id, String email) {
        Note note = findOwnedNote(id, email); // 404 si la note n'est pas à lui
        noteRepository.delete(note);
    }

    // Retrouve une note seulement si elle appartient à l'utilisateur.
    // Si elle n'existe pas OU appartient à quelqu'un d'autre : même réponse 404,
    // pour ne pas révéler qu'une note d'un autre utilisateur existe.
    // Publique : l'étape 5 (résumé Gemini) la réutilisera.
    public Note findOwnedNote(Long id, String email) {
        return noteRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note introuvable"));
    }
}