package training.iqgateway.entity;


import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "customers")
public class CustomerEO {
	
	@Id
	private String id;
	
	private String name;
	
	private String email;
	
	private String password;
	
	@Field("date_of_birth")
	private Instant dateOfBirth;
	
	private String gender;
	
	@Field("adhar_num")
	private String adharNumber;
	
	@Field("contact_num")
	private String contactNumber;
	
	private String address;
	
	private long zipcode;
	
	private double lat;
	
	private double lon;
	
	@Field("Nominee")
	private String nominee;
	
	@Field("nominee_adhar_numb")
	private String nomineeAdharNumber;
	
	@Field("insurance_Plans")
	private List<String> insurancePlans;
	
	private String status;
	
	
	private GeoJsonPoint geoLocation;
	
	
	private String otp;
	
	private Instant otpExpiry;
	
	

	public CustomerEO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CustomerEO(String id, String name, String email, String password, Instant dateOfBirth, String gender,
			String adharNumber, String contactNumber, String address, long zipcode, double lat, double lon,
			String nominee, String nomineeAdharNumber, List<String> insurancePlans, String status,
			GeoJsonPoint geoLocation,String otp, Instant otpExpiry) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.adharNumber = adharNumber;
		this.contactNumber = contactNumber;
		this.address = address;
		this.zipcode = zipcode;
		this.lat = lat;
		this.lon = lon;
		this.nominee = nominee;
		this.nomineeAdharNumber = nomineeAdharNumber;
		this.insurancePlans = insurancePlans;
		this.status = status;
		this.geoLocation = geoLocation;
		this.otp = otp;
		this.otpExpiry = otpExpiry;
	}
	
	
	

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public Instant getOtpExpiry() {
		return otpExpiry;
	}

	public void setOtpExpiry(Instant otpExpiry) {
		this.otpExpiry = otpExpiry;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Instant getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Instant dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAdharNumber() {
		return adharNumber;
	}

	public void setAdharNumber(String adharNumber) {
		this.adharNumber = adharNumber;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public String getNominee() {
		return nominee;
	}

	public void setNominee(String nominee) {
		this.nominee = nominee;
	}

	public String getNomineeAdharNumber() {
		return nomineeAdharNumber;
	}

	public void setNomineeAdharNumber(String nomineeAdharNumber) {
		this.nomineeAdharNumber = nomineeAdharNumber;
	}

	public List<String> getInsurancePlans() {
		return insurancePlans;
	}

	public void setInsurancePlans(List<String> insurancePlans) {
		this.insurancePlans = insurancePlans;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}


	public GeoJsonPoint getGeoLocation() {
		return geoLocation;
	}

	public void setGeoLocation(GeoJsonPoint geoLocation) {
		this.geoLocation = geoLocation;
	}

	@Override
	public String toString() {
		return "CustomerEO [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password
				+ ", dateOfBirth=" + dateOfBirth + ", gender=" + gender + ", adharNumber=" + adharNumber
				+ ", contactNumber=" + contactNumber + ", address=" + address + ", zipcode=" + zipcode + ", lat=" + lat
				+ ", lon=" + lon + ", nominee=" + nominee + ", nomineeAdharNumber=" + nomineeAdharNumber
				+ ", insurancePlans=" + insurancePlans + ", status=" + status + ""
				+ ", geoLocation=" + geoLocation + "]";
	}
	
	

}
