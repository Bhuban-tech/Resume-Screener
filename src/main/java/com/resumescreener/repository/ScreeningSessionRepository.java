package com.resumescreener.repository;

import com.resumescreener.entity.ScreeningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreeningSessionRepository extends JpaRepository<ScreeningSession, Long> {
    List<ScreeningSession> findAllByOrderByCreatedAtDesc();
}
