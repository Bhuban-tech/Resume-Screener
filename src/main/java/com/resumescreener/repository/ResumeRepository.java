package com.resumescreener.repository;

import com.resumescreener.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByJobDescriptionIdOrderByScoreDesc(Long jobDescriptionId);

    @Query("SELECT r FROM Resume r WHERE r.jobDescription.id = :jobId ORDER BY r.score DESC")
    List<Resume> findTopCandidatesByJobId(Long jobId);

    List<Resume> findByScreeningSessionIdOrderByScoreDesc(Long screeningSessionId);
}
