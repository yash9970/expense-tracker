package expensetracker.controller;

import expensetracker.dto.IncomeDTO;
import expensetracker.model.Income;
import expensetracker.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    @Autowired
    private IncomeService incomeService;

    @GetMapping
    public List<Income> getIncomes(@RequestParam Long userId) {
        return incomeService.getIncomesByUser(userId);
    }

    @PostMapping
    public Income addIncome(@RequestBody IncomeDTO dto, @RequestParam Long userId) {
        return incomeService.addIncome(dto, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }
}