package com.example.gcsuhang.comment.controller;

import com.example.gcsuhang.comment.service.CommentService;
import com.example.gcsuhang.comment.service.request.CommentCreateRequest;
import com.example.gcsuhang.comment.service.response.CommentResponse;
import com.example.gcsuhang.global.exception.BusinessException;
import com.example.gcsuhang.global.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public List<CommentResponse> readAll(@RequestParam("articleId") Long articleId) {
        return commentService.readAll(articleId);
    }

    @PostMapping
    public CommentResponse create(@RequestBody CommentCreateRequest request, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST); // Should be UNAUTHORIZED
        }
        Long userId = (Long) session.getAttribute("userId");

        CommentCreateRequest newRequest = new CommentCreateRequest(
                request.getContent(),
                request.getArticleId(),
                userId,
                request.getParentPath());
        return commentService.create(newRequest);
    }

    @DeleteMapping("/{commentId}")
    public void delete(@PathVariable Long commentId) {
        commentService.delete(commentId);
    }
}
