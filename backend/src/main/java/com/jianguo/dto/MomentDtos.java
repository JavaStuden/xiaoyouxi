package com.jianguo.dto;

import lombok.Data;
import java.util.List;

public class MomentDtos {

    @Data
    public static class CreateMomentRequest {
        private String content;
        private List<String> mediaUrls;
        private String locationName;
    }

    @Data
    public static class AddCommentRequest {
        private Long momentId;
        private String content;
    }
}
