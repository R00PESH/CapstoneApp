package training.iqgateway.dto;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

public class ProviderDTO {
	
	 private String id;
	 private String hosId;
	    private List<String> docId;
	    private String speciality;
	    private double rating;
	    private String location;
	    private long zipcode;
	    private double lat;
	    private double lon;
	    private String hospitalName;
	    private List<String> insurancePlans;
	    private String activeStatus;
	    private GeoJsonPoint geoLocation;
	    private List<ReviewDTO> reviews;
		public ProviderDTO(String id,String hosId,List<String> docId, String name, String speciality, double experience, String gender, double rating,
				String location, long zipcode, double lat, double lon, String hospitalName, List<String> insurancePlans,
				String activeStatus, List<ReviewDTO> reviews,GeoJsonPoint geoLocation) {
			super();
			this.id = id;
			this.hosId = hosId;
			this.docId=docId;
			this.speciality = speciality;
			this.rating = rating;
			this.location = location;
			this.zipcode = zipcode;
			this.lat = lat;
			this.lon = lon;
			this.hospitalName = hospitalName;
			this.insurancePlans = insurancePlans;
			this.activeStatus = activeStatus;
			this.reviews = reviews;
			this.geoLocation = geoLocation;
		}
		public ProviderDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		
		
		public String getHosId() {
			return hosId;
		}
		public void setHosId(String hosId) {
			this.hosId = hosId;
		}
		public List<String> getDocId() {
			return docId;
		}
		public void setDocId(List<String> docId) {
			this.docId = docId;
		}
		public String getSpeciality() {
			return speciality;
		}
		public void setSpeciality(String speciality) {
			this.speciality = speciality;
		}
		public double getRating() {
			return rating;
		}
		public void setRating(double rating) {
			this.rating = rating;
		}
		public String getLocation() {
			return location;
		}
		public void setLocation(String location) {
			this.location = location;
		}
		public long getZipcode() {
			return zipcode;
		}
		public void setZipcode(long zipcode) {
			this.zipcode = zipcode;
		}
		public double getLat() {
			return lat;
		}
		public void setLat(double lat) {
			this.lat = lat;
		}
		public double getLon() {
			return lon;
		}
		public void setLon(double lon) {
			this.lon = lon;
		}
		public String getHospitalName() {
			return hospitalName;
		}
		public void setHospitalName(String hospitalName) {
			this.hospitalName = hospitalName;
		}
		public List<String> getInsurancePlans() {
			return insurancePlans;
		}
		public void setInsurancePlans(List<String> insurancePlans) {
			this.insurancePlans = insurancePlans;
		}
		public String getActiveStatus() {
			return activeStatus;
		}
		public void setActiveStatus(String activeStatus) {
			this.activeStatus = activeStatus;
		}
		public List<ReviewDTO> getReviews() {
			return reviews;
		}
		public void setReviews(List<ReviewDTO> reviews) {
			this.reviews = reviews;
		}
		public GeoJsonPoint getGeoLocation() {
			return geoLocation;
		}
		public void setGeoLocation(GeoJsonPoint geoLocation) {
			this.geoLocation = geoLocation;
		}
	    
		public static class ReviewDTO {
	        private String customerName;
	        private String customerEmail;
	        private double rating;
	        private String review;
	        private Instant reviewGivenTime;
	        // getters and setters
			public ReviewDTO(String customerName, String customerEmail, double rating, String review,
					Instant reviewGivenTime) {
				super();
				this.customerName = customerName;
				this.customerEmail = customerEmail;
				this.rating = rating;
				this.review = review;
				this.reviewGivenTime = reviewGivenTime;
			}
			public ReviewDTO() {
				super();
				// TODO Auto-generated constructor stub
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
			public String getReview() {
				return review;
			}
			public void setReview(String review) {
				this.review = review;
			}
			public Instant getReviewGivenTime() {
				return reviewGivenTime;
			}
			public void setReviewGivenTime(Instant reviewGivenTime) {
				this.reviewGivenTime = reviewGivenTime;
			}
	        
	        
	    }

}
