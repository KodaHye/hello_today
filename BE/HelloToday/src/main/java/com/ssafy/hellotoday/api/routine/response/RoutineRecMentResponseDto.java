package com.ssafy.hellotoday.api.routine.response;

import com.ssafy.hellotoday.db.entity.routine.RecommendMent;
import com.ssafy.hellotoday.db.entity.routine.RoutineBigCat;
import lombok.Getter;

@Getter
public class RoutineRecMentResponseDto {
    private Integer routineBigCatId;
    private String content;

    public RoutineRecMentResponseDto(RecommendMent recommendMent) {
        this.routineBigCatId = recommendMent.getRoutineBigCat().getRoutineBigCatId();
        this.content = recommendMent.getContent();
    }
}
