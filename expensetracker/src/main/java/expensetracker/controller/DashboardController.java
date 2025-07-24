package expensetracker.controller;

import expensetracker.service.ExpenseService;
import expensetracker.service.InvestmentService;
import expensetracker.service.IncomeService;
import expensetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired private ExpenseService expenseService;
    @Autowired private InvestmentService investmentService;
    @Autowired private IncomeService incomeService;
    @Autowired private UserService userService;

    @GetMapping
    public Map<String, Object> getDashboard(@RequestParam Long userId) {
        double totalExpenses = expenseService.getTotalExpenses(userId);
        double totalInvestments = investmentService.getTotalInvestments(userId);
        double totalIncome = incomeService.getTotalIncome(userId);
        double balance = totalIncome - totalExpenses - totalInvestments;
        Map<String, Object> map = new HashMap<>();
        map.put("totalExpenses", totalExpenses);
        map.put("totalInvestments", totalInvestments);
        map.put("totalIncome", totalIncome);
        map.put("availableBalance", balance);
        return map;
    }
}