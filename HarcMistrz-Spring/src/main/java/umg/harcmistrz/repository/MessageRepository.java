package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllBySenderIdOrRecipientIdOrderByTimestampDesc(Long senderId, Long recipientId);

    List<Message> findAllBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampAsc(
            Long senderId, Long recipientId, Long senderId2, Long recipientId2
    );

    List<Message> findAllBySenderIdAndRecipientIdOrderByTimestampAsc(Long senderId, Long recipientId);
}
