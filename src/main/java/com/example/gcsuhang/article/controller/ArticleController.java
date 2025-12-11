package com.example.gcsuhang.article.controller;

import com.example.gcsuhang.article.service.ArticleService;
import com.example.gcsuhang.article.service.request.ArticleCreateRequest;
import com.example.gcsuhang.article.service.request.ArticleUpdateRequest;
import com.example.gcsuhang.article.service.response.ArticleResponse;
import com.example.gcsuhang.global.exception.BusinessException;
import com.example.gcsuhang.global.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;

    @GetMapping("/{articleId}")
    public ArticleResponse read(@PathVariable Long articleId) {
        return articleService.read(articleId);
    }

    @GetMapping
    public List<ArticleResponse> readAllInfiniteScroll(
            @RequestParam("boardId") Long boardId,
            @RequestParam("pageSize") Long pageSize,
            @RequestParam(value = "lastArticleId", required = false) Long lastArticleId) {
        return articleService.readAllInfiniteScroll(boardId, pageSize, lastArticleId);
    }

    @PostMapping
    public ArticleResponse create(@RequestBody ArticleCreateRequest request, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST); // Should be UNAUTHORIZED
        }
        Long userId = (Long) session.getAttribute("userId");
        // Create new request with userId
        ArticleCreateRequest newRequest = new ArticleCreateRequest(
                request.getTitle(),
                request.getContent(),
                request.getImageUrl(),
                request.getBoardId(),
                userId);
        return articleService.create(newRequest);
    }

    @PutMapping("/{articleId}")
    public ArticleResponse update(@PathVariable Long articleId, @RequestBody ArticleUpdateRequest request) {
        return articleService.update(articleId, request);
    }

    @DeleteMapping("/{articleId}")
    public void delete(@PathVariable Long articleId) {
        articleService.delete(articleId);
    }
}
