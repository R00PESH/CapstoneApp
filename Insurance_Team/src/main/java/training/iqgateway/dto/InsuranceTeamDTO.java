package training.iqgateway.dto;

import java.time.Instant;

public class InsuranceTeamDTO {
    private String insurer_Id;    // Business unique key
    private String name;
    private String email;
    private String password;
    private Instant hire_date;
    private String active_status;

    public InsuranceTeamDTO() {}

    public InsuranceTeamDTO(String insurer_Id, String name, String email, String password, Instant hire_date, String active_status) {
        this.insurer_Id = insurer_Id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.hire_date = hire_date;
        this.active_status = active_status;
    }

    // Getters and setters
    public String getInsurer_Id() {
        return insurer_Id;
    }

    public void setInsurer_Id(String insurer_Id) {
        this.insurer_Id = insurer_Id;
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

    public Instant getHire_date() {
        return hire_date;
    }

    public void setHire_date(Instant hire_date) {
        this.hire_date = hire_date;
    }

    public String getActive_status() {
        return active_status;
    }

    public void setActive_status(String active_status) {
        this.active_status = active_status;
    }
}
