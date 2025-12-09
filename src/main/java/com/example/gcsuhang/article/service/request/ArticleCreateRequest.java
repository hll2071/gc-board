package com.example.gcsuhang.article.service.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ArticleCreateRequest {
    private String title;
    private String content;
    private String imageUrl;
    private Long boardId;
    private Long writerId;

    public ArticleCreateRequest(String title, String content, String imageUrl, Long boardId, Long writerId) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.boardId = boardId;
        this.writerId = writerId;
    }
}
