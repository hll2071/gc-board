package com.example.gcsuhang.article.service.response;

import com.example.gcsuhang.article.entity.Article;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ArticleResponse {
    private final Long id;
    private final String title;
    private final String content;
    private final String imageUrl;
    private final Long boardId;
    private final Long writerId;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private ArticleResponse(Long id, String title, String content, String imageUrl, Long boardId, Long writerId,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.boardId = boardId;
        this.writerId = writerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ArticleResponse from(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getContent(),
                article.getImageUrl(),
                article.getBoardId(),
                article.getWriterId(),
                article.getCreatedAt(),
                article.getUpdatedAt());
    }
}
