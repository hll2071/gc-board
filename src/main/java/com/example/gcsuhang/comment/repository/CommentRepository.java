package com.example.gcsuhang.comment.repository;

import com.example.gcsuhang.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(value = """
            SELECT path FROM comment
            WHERE article_id = :articleId
            AND path LIKE :pathPrefix%
            ORDER BY path DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<String> findDescendantsTopPath(@Param("articleId") Long articleId, @Param("pathPrefix") String pathPrefix);

    Optional<Comment> findByPath(String path);

    List<Comment> findAllByArticleIdOrderByPathAsc(Long articleId);
}
