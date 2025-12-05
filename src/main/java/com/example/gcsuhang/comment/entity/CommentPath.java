package com.example.gcsuhang.comment.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentPath {
    private static final String CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int DEPTH_CHUNK_SIZE = 5;
    private static final int MAX_DEPTH = 5;

    private final String path;

    public static CommentPath create(String path) {
        if (isInvalidPath(path)) {
            throw new IllegalArgumentException("Invalid path");
        }
        return new CommentPath(path);
    }

    private static boolean isInvalidPath(String path) {
        return path.length() % DEPTH_CHUNK_SIZE != 0 || path.length() > MAX_DEPTH * DEPTH_CHUNK_SIZE;
    }

    public String createChildCommentPath(String descendantsTopPath) {
        if (descendantsTopPath == null) {
            return path + "00000";
        }
        String childrenTopPath = descendantsTopPath.substring(path.length(), path.length() + DEPTH_CHUNK_SIZE);
        return path + increase(childrenTopPath);
    }

    private String increase(String path) {
        String lastChar = path.substring(path.length() - 1);
        if (CHARSET.indexOf(lastChar) == CHARSET.length() - 1) {
            return increase(path.substring(0, path.length() - 1)) + CHARSET.charAt(0);
        }
        return path.substring(0, path.length() - 1) + CHARSET.charAt(CHARSET.indexOf(lastChar) + 1);
    }
}
