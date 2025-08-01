package training.iqgateway.model;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "doctors")
public class DoctorEO {
	
	@Id
	private String id;
	
	@Field("doc_Id")
	private String docId;
	
	@Field("hos_Id")
	private String hosId;
	
	private String name;
	
	@Field("license_number")
	private String licenseNumber;
	
	private String qualification;
	
	private String specialization;
	
	@Field("years_of_practice")
	private double yearsOfExp;
	
	@Field("availability_status")
	private String availabilityStatus;
	
	@Field("joining_date")
	private Instant joiningDate;
	
	private List<Review> reviews;
	
	private double rating;

	public DoctorEO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DoctorEO(String id, String docId, String hosId, String name, String licenseNumber, String qualification,
			String specialization, double yearsOfExp, String availabilityStatus, Instant joiningDate,List<Review> reviews, double rating) {
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
	}

	public List<Review> getReviews() {
		return reviews;
	}

	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

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

	public double getYearsOfExp() {
		return yearsOfExp;
	}

	public void setYearsOfExp(double yearsOfExp) {
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
	
	
	public static class Review {
		
		@Field("review_id")
		private Integer reviewid;
		
		@Field("customer_name")
		private String customername;
		
		@Field("customer_email")
		private String customeremail;
		
		private double rating;
		
		private String comment;
		
		private Instant date;

		public Review() {
			super();
			// TODO Auto-generated constructor stub
		}

		public Review(Integer review_id, String customername, String customeremail, double rating, String comment,
				Instant date) {
			super();
			this.reviewid = review_id;
			this.customername = customername;
			this.customeremail = customeremail;
			this.rating = rating;
			this.comment = comment;
			this.date = date;
		}

		public Integer getReviewid() {
			return reviewid;
		}

		public void setReviewid(Integer reviewid) {
			this.reviewid = reviewid;
		}

		public String getCustomername() {
			return customername;
		}

		public void setCustomername(String customername) {
			this.customername = customername;
		}

		public String getCustomeremail() {
			return customeremail;
		}

		public void setCustomeremail(String customeremail) {
			this.customeremail = customeremail;
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
