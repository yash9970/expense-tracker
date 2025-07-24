package expensetracker.controller;

import expensetracker.dto.ExpenseDTO;
import expensetracker.model.Expense;
import expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getExpenses(@RequestParam Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    @PostMapping
    public Expense addExpense(@RequestBody ExpenseDTO dto, @RequestParam Long userId) {
        return expenseService.addExpense(dto, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}