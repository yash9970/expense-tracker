package expensetracker.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class InvestmentDTO {
    private String name;
    private Double amount;
    private String type;
    private LocalDate date;
}