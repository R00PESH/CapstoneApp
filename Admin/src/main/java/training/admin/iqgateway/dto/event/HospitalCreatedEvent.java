package training.admin.iqgateway.dto.event;

import java.io.Serializable;



import java.io.Serializable;
import java.util.List;

public class HospitalCreatedEvent implements Serializable {
    private String hosId;
    private String hospitalName;
    private List<String> insurancePlans;
    private String location;
    private long zipcode;
    private double lat;
    private double lon;

    public HospitalCreatedEvent() {}

    public HospitalCreatedEvent(String hosId, String hospitalName, List<String> insurancePlans,
                               String location, long zipcode, double lat, double lon) {
        this.hosId = hosId;
        this.hospitalName = hospitalName;
        this.insurancePlans = insurancePlans;
        this.location = location;
        this.zipcode = zipcode;
        this.lat = lat;
        this.lon = lon;
    }

    // Getters and setters omitted for brevity
    public String getHosId() { return hosId; }
    public void setHosId(String hosId) { this.hosId = hosId; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public List<String> getInsurancePlans() { return insurancePlans; }
    public void setInsurancePlans(List<String> insurancePlans) { this.insurancePlans = insurancePlans; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public long getZipcode() { return zipcode; }
    public void setZipcode(long l) { this.zipcode = l; }
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public double getLon() { return lon; }
    public void setLon(double lon) { this.lon = lon; }
}