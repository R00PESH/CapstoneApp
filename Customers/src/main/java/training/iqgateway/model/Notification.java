package training.iqgateway.model;



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String receiverAadhar;
    private String senderId;
    private String type;
    private String message;
    private Map<String, Object> metadata;
    private boolean isRead;
    private Date createdAt;

    public Notification() {}

    public Notification(String receiverAadhar, String senderId, String type, String message, Map<String, Object> metadata,
                        boolean isRead, Date createdAt) {
        this.receiverAadhar = receiverAadhar;
        this.senderId = senderId;
        this.type = type;
        this.message = message;
        this.metadata = metadata;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getReceiverAadhar() {
		return receiverAadhar;
	}

	public void setReceiverAadhar(String receiverAadhar) {
		this.receiverAadhar = receiverAadhar;
	}

	public String getSenderId() {
		return senderId;
	}

	public void setSenderId(String senderId) {
		this.senderId = senderId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Map<String, Object> getMetadata() {
		return metadata;
	}

	public void setMetadata(Map<String, Object> metadata) {
		this.metadata = metadata;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

    // Getters and setters omitted for brevity
    

    // ... all getters and setters ...
}

