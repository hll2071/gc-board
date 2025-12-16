package com.example.gcsuhang.comment.service;

import com.example.gcsuhang.comment.entity.Comment;
import com.example.gcsuhang.comment.entity.CommentPath;
import com.example.gcsuhang.comment.repository.CommentRepository;
import com.example.gcsuhang.comment.service.request.CommentCreateRequest;
import com.example.gcsuhang.comment.service.response.CommentResponse;
import com.example.gcsuhang.common.snowflake.Snowflake;
import com.example.gcsuhang.global.exception.BusinessException;
import com.example.gcsuhang.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final Snowflake snowflake = new Snowflake();
    private final CommentRepository commentRepository;

    @Transactional
    public CommentResponse create(CommentCreateRequest request) {
        CommentPath parentCommentPath = CommentPath
                .create(request.getParentPath() == null ? "" : request.getParentPath());

        // Validate parent if exists
        if (!parentCommentPath.getPath().isEmpty()) {
            commentRepository.findByPath(parentCommentPath.getPath())
                    .filter(Predicate.not(Comment::getDeleted))
                    .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        }

        String descendantsTopPath = commentRepository.findDescendantsTopPath(
                request.getArticleId(), parentCommentPath.getPath()).orElse(null);

        // Fix: If the top path found is the parent itself (no children exist), treat it
        // as null
        if (descendantsTopPath != null && descendantsTopPath.equals(parentCommentPath.getPath())) {
            descendantsTopPath = null;
        }

        String newPath = parentCommentPath.createChildCommentPath(descendantsTopPath);

        Comment comment = commentRepository.save(
                Comment.create(
                        snowflake.nextId(),
                        request.getContent(),
                        request.getArticleId(),
                        request.getWriterId(),
                        newPath));

        return CommentResponse.from(comment);
    }

    public List<CommentResponse> readAll(Long articleId) {
        return commentRepository.findAllByArticleIdOrderByPathAsc(articleId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public void delete(Long commentId) {
        commentRepository.findById(commentId)
                .filter(Predicate.not(Comment::getDeleted))
                .ifPresent(comment -> {
                    if (hasChildren(comment)) {
                        comment.delete(); // Soft delete
                    } else {
                        deleteRecursive(comment); // Hard delete + recursive check
                    }
                });
    }

    private boolean hasChildren(Comment comment) {
        return commentRepository.findDescendantsTopPath(
                comment.getArticleId(),
                comment.getPath()).isPresent();
    }

    private void deleteRecursive(Comment comment) {
        commentRepository.delete(comment);
        if (!comment.isRoot()) {
            commentRepository.findByPath(comment.getParentPath())
                    .filter(Comment::getDeleted)
                    .filter(Predicate.not(this::hasChildren))
                    .ifPresent(this::deleteRecursive);
        }
    }
}
