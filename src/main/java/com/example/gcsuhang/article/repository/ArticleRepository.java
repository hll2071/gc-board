package com.example.gcsuhang.article.repository;

import com.example.gcsuhang.article.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query(value = """
            SELECT * FROM article
            WHERE board_id = :boardId
            ORDER BY id DESC
            LIMIT :pageSize
            """, nativeQuery = true)
    List<Article> findAllInfiniteScroll(@Param("boardId") Long boardId, @Param("pageSize") Long pageSize);

    @Query(value = """
            SELECT * FROM article
            WHERE board_id = :boardId AND id < :lastArticleId
            ORDER BY id DESC
            LIMIT :pageSize
            """, nativeQuery = true)
    List<Article> findAllInfiniteScroll(@Param("boardId") Long boardId, @Param("pageSize") Long pageSize,
            @Param("lastArticleId") Long lastArticleId);
}
