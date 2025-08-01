package training.iqgateway.dto;

import java.time.Instant;
import java.util.List;

public class DoctorDTO {
	
	private String id;
    private String docId;
    private String hosId;
    private String name;
    private String licenseNumber;
    private String qualification;
    private String specialization;
    private double yearsOfExp;
    private String availabilityStatus;
    private Instant joiningDate;
    private List<ReviewDTO> reviews;
    private Double rating;
    
    
    
    public String getId() {
		return id;
	}



	public void setId(String id) {
		this.id = id;
	}



	public String getDocId() {
		return docId;
	}



	public void setDocId(String docId) {
		this.docId = docId;
	}



	public String getHosId() {
		return hosId;
	}



	public void setHosId(String hosId) {
		this.hosId = hosId;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getLicenseNumber() {
		return licenseNumber;
	}



	public void setLicenseNumber(String licenseNumber) {
		this.licenseNumber = licenseNumber;
	}



	public String getQualification() {
		return qualification;
	}



	public void setQualification(String qualification) {
		this.qualification = qualification;
	}



	public String getSpecialization() {
		return specialization;
	}



	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}



	public double getyearsOfExp() {
		return yearsOfExp;
	}



	public void setyearsOfExp(double yearsOfExp) {
		this.yearsOfExp = yearsOfExp;
	}



	public String getAvailabilityStatus() {
		return availabilityStatus;
	}



	public void setAvailabilityStatus(String availabilityStatus) {
		this.availabilityStatus = availabilityStatus;
	}



	public Instant getJoiningDate() {
		return joiningDate;
	}



	public void setJoiningDate(Instant joiningDate) {
		this.joiningDate = joiningDate;
	}



	public List<ReviewDTO> getReviews() {
		return reviews;
	}



	public void setReviews(List<ReviewDTO> reviews) {
		this.reviews = reviews;
	}



	public Double getRating() {
		return rating;
	}



	public void setRating(Double rating) {
		this.rating = rating;
	}



	public DoctorDTO(String id, String docId, String hosId, String name, String licenseNumber, String qualification,
			String specialization, double yearsOfExp, String availabilityStatus, Instant joiningDate,
			List<ReviewDTO> reviews, Double rating) {
		super();
		this.id = id;
		this.docId = docId;
		this.hosId = hosId;
		this.name = name;
		this.licenseNumber = licenseNumber;
		this.qualification = qualification;
		this.specialization = specialization;
		this.yearsOfExp = yearsOfExp;
		this.availabilityStatus = availabilityStatus;
		this.joiningDate = joiningDate;
		this.reviews = reviews;
		this.rating = rating;
	}



	public DoctorDTO() {
		super();
		// TODO Auto-generated constructor stub
	}



	public static class ReviewDTO {
        private int reviewId;
        private String customerName;
        private String customerEmail;
        private double rating;
        private String comment;
        private Instant date;
        // Getters and setters
		public ReviewDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
		public ReviewDTO(int reviewId, String customerName, String customerEmail, double rating, String comment,
				Instant date) {
			super();
			this.reviewId = reviewId;
			this.customerName = customerName;
			this.customerEmail = customerEmail;
			this.rating = rating;
			this.comment = comment;
			this.date = date;
		}
		public int getReviewId() {
			return reviewId;
		}
		public void setReviewId(int reviewId) {
			this.reviewId = reviewId;
		}
		public String getCustomerName() {
			return customerName;
		}
		public void setCustomerName(String customerName) {
			this.customerName = customerName;
		}
		public String getCustomerEmail() {
			return customerEmail;
		}
		public void setCustomerEmail(String customerEmail) {
			this.customerEmail = customerEmail;
		}
		public double getRating() {
			return rating;
		}
		public void setRating(double rating) {
			this.rating = rating;
		}
		public String getComment() {
			return comment;
		}
		public void setComment(String comment) {
			this.comment = comment;
		}
		public Instant getDate() {
			return date;
		}
		public void setDate(Instant date) {
			this.date = date;
		}
        
        
    }

}
