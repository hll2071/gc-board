package com.example.gcsuhang.article.service.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ArticleUpdateRequest {
    private String title;
    private String content;
    private String imageUrl;

    public ArticleUpdateRequest(String title, String content, String imageUrl) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
