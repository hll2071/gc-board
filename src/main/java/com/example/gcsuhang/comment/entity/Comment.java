package com.example.gcsuhang.comment.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Table(name = "comment")
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Comment {
    @Id
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Long articleId;

    @Column(nullable = false)
    private Long writerId;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private Boolean deleted;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public static Comment create(Long id, String content, Long articleId, Long writerId, String path) {
        Comment comment = new Comment();
        comment.id = id;
        comment.content = content;
        comment.articleId = articleId;
        comment.writerId = writerId;
        comment.path = path;
        comment.deleted = false;
        return comment;
    }

    public void delete() {
        this.deleted = true;
    }

    public boolean isRoot() {
        return path.length() == 5; // Assuming 5 chars per depth
    }

    public String getParentPath() {
        if (isRoot())
            return "";
        return path.substring(0, path.length() - 5);
    }
}
