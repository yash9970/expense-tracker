package expensetracker.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private String title;
    private Double amount;
    private String category;
    private LocalDate date;
}
