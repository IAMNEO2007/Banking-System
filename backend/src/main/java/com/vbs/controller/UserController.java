package com.vbs.controller;

import com.vbs.model.Transaction;
import com.vbs.model.User;
import com.vbs.repository.TransactionRepository;
import com.vbs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/{userId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable @NonNull Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("balance", userOpt.get().getBalance());
            return ResponseEntity.ok(response);
        } else {
            // Return dummy balance if user doesn't exist yet but was requested by frontend dummy login
            Map<String, Object> response = new HashMap<>();
            response.put("balance", 12450.45);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable @NonNull Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable @NonNull Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            // Return dummy profile if user doesn't exist yet but was requested by frontend
            Map<String, Object> response = new HashMap<>();
            response.put("name", "Vikas Sharma");
            response.put("email", "vikas.sharma@example.com");
            response.put("phone", "+91 9876543210");
            response.put("address", "123, Palm Grove, Hiranandani Estate, Thane West");
            response.put("accountType", "Savings Account");
            response.put("accountNumber", "XXXX-XXXX-1234");
            response.put("balance", 12450.45);
            return ResponseEntity.ok(response);
        }
    }
}
