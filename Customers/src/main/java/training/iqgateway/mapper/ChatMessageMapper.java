package training.iqgateway.mapper;




import org.springframework.stereotype.Component;

import training.iqgateway.dto.ChatMessageDto;
import training.iqgateway.model.ChatMessage;

@Component
public class ChatMessageMapper {
    public ChatMessageDto toDto(ChatMessage entity) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setFrom(entity.getFrom());
        dto.setTo(entity.getTo());
        dto.setContent(entity.getContent());
        dto.setTimestamp(entity.getTimestamp());
        return dto;
    }

    public ChatMessage toEntity(ChatMessageDto dto) {
        ChatMessage entity = new ChatMessage();
        entity.setFrom(dto.getFrom());
        entity.setTo(dto.getTo());
        entity.setContent(dto.getContent());
        entity.setTimestamp(dto.getTimestamp());
        return entity;
    }
}

