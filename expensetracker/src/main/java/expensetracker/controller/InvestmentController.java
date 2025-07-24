package expensetracker.controller;

import expensetracker.dto.InvestmentDTO;
import expensetracker.model.Investment;
import expensetracker.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {
    @Autowired
    private InvestmentService investmentService;

    @GetMapping
    public List<Investment> getInvestments(@RequestParam Long userId) {
        return investmentService.getInvestmentsByUser(userId);
    }

    @PostMapping
    public Investment addInvestment(@RequestBody InvestmentDTO dto, @RequestParam Long userId) {
        return investmentService.addInvestment(dto, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
    }
}