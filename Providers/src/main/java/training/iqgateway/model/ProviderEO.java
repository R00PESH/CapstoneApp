package training.iqgateway.model;


import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "providers")
public class ProviderEO {
	
	@Id
	private String id;
	
	private String hosId;
	
	private List<String> docId;
	
	private String password;
	
	private String speciality;
		
		private double rating;
	
	private String location;
	
	private long zipcode;
	
	private double lat;
	
	private double lon;
	
	@Field("Hospital_name")
	private String hospitalName;
	
	@Field("insurance_Plans")
	private List<String> insurancePlans;
	
	@Field("active_Status")
	private String activeStatus;
	
	private GeoJsonPoint geoLocation;
	
	private List<Review> reviews;
	
	private String email;
	
	
	
	
	
	
	public ProviderEO(String id,String hosId,List<String> docId,String password, String speciality, double rating,
			String location, long zipcode, double lat, double lon, String hospitalName, List<String> insurance_Plans,
			String active_Status, GeoJsonPoint geoLocation, List<Review> reviews,String email) {
		super();
		this.id = id;
		this.hosId = hosId;
		this.docId=docId;
		this.password=password;
		this.speciality = speciality;
		this.rating = rating;
		this.location = location;
		this.zipcode = zipcode;
		this.lat = lat;
		this.lon = lon;
		this.hospitalName = hospitalName;
		this.insurancePlans = insurance_Plans;
		this.activeStatus = active_Status;
		this.geoLocation = geoLocation;
		this.reviews = reviews;
		this.email=email;
	}






	public String getPassword() {
		return password;
	}






	public void setPassword(String password) {
		this.password = password;
	}






	public ProviderEO() {
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

	public void setInsurancePlans(List<String> insurance_Plans) {
		this.insurancePlans = insurance_Plans;
	}

	public String getActiveStatus() {
		return activeStatus;
	}

	public void setActiveStatus(String active_Status) {
		this.activeStatus = active_Status;
	}

	public GeoJsonPoint getGeoLocation() {
		return geoLocation;
	}

	public void setGeoLocation(GeoJsonPoint geoLocation) {
		this.geoLocation = geoLocation;
	}


	public List<Review> getReviews() {
		return reviews;
	}



	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}
	
	



	public String getEmail() {
		return email;
	}






	public void setEmail(String email) {
		this.email = email;
	}





	public static class Review {
		
		private String customer_name;
		
		private String customer_email;
		
		private Double rating;
		
		private String review;
		
		private Instant review_given_time;

		public Review() {
			super();
			// TODO Auto-generated constructor stub
		}

		public Review(String customer_name, String customer_email, double rating, String review,
				Instant review_given_time) {
			super();
			this.customer_name = customer_name;
			this.customer_email = customer_email;
			this.rating = rating;
			this.review = review;
			this.review_given_time = review_given_time;
		}

		public String getCustomer_name() {
			return customer_name;
		}

		public void setCustomer_name(String customer_name) {
			this.customer_name = customer_name;
		}

		public String getCustomer_email() {
			return customer_email;
		}

		public void setCustomer_email(String customer_email) {
			this.customer_email = customer_email;
		}
		
		
		

		public Double getRating() {
			return rating;
		}

		public void setRating(Double rating) {
			this.rating = rating;
		}

		public String getReview() {
			return review;
		}

		public void setReview(String review) {
			this.review = review;
		}

		public Instant getReview_given_time() {
			return review_given_time;
		}

		public void setReview_given_time(Instant review_given_time) {
			this.review_given_time = review_given_time;
		}

		@Override
		public String toString() {
			return "Review [customer_name=" + customer_name + ", customer_email=" + customer_email + ", rating="
					+ rating + ", review=" + review + ", review_given_time=" + review_given_time + "]";
		}
		
		
		
	}
	
	
	

}