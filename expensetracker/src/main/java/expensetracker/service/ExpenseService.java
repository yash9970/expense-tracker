package expensetracker.service;

import expensetracker.model.Expense;
import expensetracker.model.User;
import expensetracker.dto.ExpenseDTO;
import expensetracker.repository.ExpenseRepository;
import expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Expense addExpense(ExpenseDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Expense expense = new Expense();
        expense.setTitle(dto.getTitle());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setDate(dto.getDate());
        expense.setUser(user);
        // Optionally update user balance
        user.setBalance(user.getBalance() - dto.getAmount());
        userRepository.save(user);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        // Optionally update user balance
        User user = expense.getUser();
        user.setBalance(user.getBalance() + expense.getAmount());
        userRepository.save(user);
        expenseRepository.deleteById(expenseId);
    }

    public double getTotalExpenses(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }
}