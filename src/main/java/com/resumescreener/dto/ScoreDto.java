package com.resumescreener.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreDto {
    private double skill;
    private double experience;
    private double education;
    private double total;
}
