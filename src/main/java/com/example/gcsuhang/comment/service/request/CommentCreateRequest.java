package com.example.gcsuhang.comment.service.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentCreateRequest {
    private String content;
    private Long articleId;
    private Long writerId;
    private String parentPath; // Optional, for reply

    public CommentCreateRequest(String content, Long articleId, Long writerId, String parentPath) {
        this.content = content;
        this.articleId = articleId;
        this.writerId = writerId;
        this.parentPath = parentPath;
    }
}
