package expensetracker.service;

import expensetracker.model.Income;
import expensetracker.model.User;
import expensetracker.dto.IncomeDTO;
import expensetracker.repository.IncomeRepository;
import expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Income> getIncomesByUser(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    public Income addIncome(IncomeDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Income income = new Income();
        income.setTitle(dto.getTitle());
        income.setAmount(dto.getAmount());
        income.setCategory(dto.getCategory());
        income.setDate(dto.getDate());
        income.setUser(user);
        // Optionally update user balance
        user.setBalance(user.getBalance() + dto.getAmount());
        userRepository.save(user);
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        // Optionally update user balance
        User user = income.getUser();
        user.setBalance(user.getBalance() - income.getAmount());
        userRepository.save(user);
        incomeRepository.deleteById(incomeId);
    }

    public double getTotalIncome(Long userId) {
        return incomeRepository.findByUserId(userId)
                .stream()
                .mapToDouble(Income::getAmount)
                .sum();
    }
}