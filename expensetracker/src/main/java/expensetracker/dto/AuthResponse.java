package expensetracker.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private Long userId;
    public AuthResponse(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }
}