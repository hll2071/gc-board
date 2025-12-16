package com.example.gcsuhang.comment.service.response;

import com.example.gcsuhang.comment.entity.Comment;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    @JsonSerialize(using = ToStringSerializer.class)
    private final Long id;
    private final String content;
    private final Long articleId;
    private final Long writerId;
    private final String path;
    private final Boolean deleted;
    private final LocalDateTime createdAt;

    private CommentResponse(Long id, String content, Long articleId, Long writerId, String path, Boolean deleted,
            LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.articleId = articleId;
        this.writerId = writerId;
        this.path = path;
        this.deleted = deleted;
        this.createdAt = createdAt;
    }

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getArticleId(),
                comment.getWriterId(),
                comment.getPath(),
                comment.getDeleted(),
                comment.getCreatedAt());
    }
}
