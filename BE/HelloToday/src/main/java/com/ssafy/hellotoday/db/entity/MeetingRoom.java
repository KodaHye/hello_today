package com.ssafy.hellotoday.db.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class MeetingRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer meetingRoomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String sessionId;

    private String name;

    private int memberLimit = 6;

    private byte activeFlag = 1;

    private int joinCnt = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private MeetingRoomQuestion question;

    @Builder
    public MeetingRoom(String sessionId, Member member, String name, int memberLimit) {
        this.sessionId = sessionId;
        this.member = member;
        this.name = name;
        this.memberLimit = memberLimit;
    }

    public void updateQuestion(MeetingRoomQuestion question) {
        this.question = question;
    }
}
