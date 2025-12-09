package com.example.gcsuhang.article.service;

import com.example.gcsuhang.article.entity.Article;
import com.example.gcsuhang.article.repository.ArticleRepository;
import com.example.gcsuhang.article.service.request.ArticleCreateRequest;
import com.example.gcsuhang.article.service.request.ArticleUpdateRequest;
import com.example.gcsuhang.article.service.response.ArticleResponse;
import com.example.gcsuhang.common.snowflake.Snowflake;
import com.example.gcsuhang.global.exception.BusinessException;
import com.example.gcsuhang.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final Snowflake snowflake = new Snowflake();
    private final ArticleRepository articleRepository;

    @Transactional
    public ArticleResponse create(ArticleCreateRequest request) {
        Article article = articleRepository.save(
                Article.create(
                        snowflake.nextId(),
                        request.getTitle(),
                        request.getContent(),
                        request.getImageUrl(),
                        request.getBoardId(),
                        request.getWriterId()));
        return ArticleResponse.from(article);
    }

    @Transactional
    public ArticleResponse update(Long articleId, ArticleUpdateRequest request) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));
        article.update(request.getTitle(), request.getContent(), request.getImageUrl());
        return ArticleResponse.from(article);
    }

    public ArticleResponse read(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));
        return ArticleResponse.from(article);
    }

    public List<ArticleResponse> readAllInfiniteScroll(Long boardId, Long pageSize, Long lastArticleId) {
        List<Article> articles = lastArticleId == null ? articleRepository.findAllInfiniteScroll(boardId, pageSize)
                : articleRepository.findAllInfiniteScroll(boardId, pageSize, lastArticleId);
        return articles.stream()
                .map(ArticleResponse::from)
                .toList();
    }

    @Transactional
    public void delete(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));
        articleRepository.delete(article);
    }
}
