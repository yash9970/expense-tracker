package expensetracker.controller;

import expensetracker.dto.AuthRequest;
import expensetracker.dto.AuthResponse;
import expensetracker.security.JwtService;
import expensetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        userService.register(req.getUsername(), req.getPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        String token = userService.login(req.getUsername(), req.getPassword());
        Long userId = userService.getUserId(req.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, userId));
    }
}