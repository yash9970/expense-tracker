package expensetracker.service;

import expensetracker.model.Investment;
import expensetracker.model.User;
import expensetracker.dto.InvestmentDTO;
import expensetracker.repository.InvestmentRepository;
import expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Investment> getInvestmentsByUser(Long userId) {
        return investmentRepository.findByUserId(userId);
    }

    public Investment addInvestment(InvestmentDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Investment investment = new Investment();
        investment.setName(dto.getName());
        investment.setAmount(dto.getAmount());
        investment.setType(dto.getType());
        investment.setDate(dto.getDate());
        investment.setUser(user);
        // Optionally update user balance
        user.setBalance(user.getBalance() - dto.getAmount());
        userRepository.save(user);
        return investmentRepository.save(investment);
    }

    public void deleteInvestment(Long investmentId) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));
        // Optionally update user balance
        User user = investment.getUser();
        user.setBalance(user.getBalance() + investment.getAmount());
        userRepository.save(user);
        investmentRepository.deleteById(investmentId);
    }

    public double getTotalInvestments(Long userId) {
        return investmentRepository.findByUserId(userId)
                .stream()
                .mapToDouble(Investment::getAmount)
                .sum();
    }
}