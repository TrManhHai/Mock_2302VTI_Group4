package com.vti.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;


@Entity
@Table(name = "`Trip`")
public class Trip implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private short id;

	@Column(name = "`name`", length = 50, nullable = false, unique = true)
	private String name;
	
	@Column(name = "`schedule`", length = 50, nullable = false, unique = true)
	private String schedule;
	
	
	@Column(name = "`pointDeparture`", length = 50, nullable = false, unique = true)
	private String pointDeparture;
	
	@Column(name = "`destination`", length = 50, nullable = false, unique = true)
	private String destination;
	
	@Column(name = "`hotel`", length = 50, nullable = false, unique = true)
	private String hotel;
	
	@Column(name = "totalMember")
	private short totalMember;
	
	
	@Column(name = "`startDate`")
	@Temporal(TemporalType.TIMESTAMP)
	@CreationTimestamp
	private Date startDate;
	
	@Column(name = "`endDate`")
	@Temporal(TemporalType.TIMESTAMP)
	@CreationTimestamp
	private Date endDate;
	

	@Column(name = "`describe`", length = 50, nullable = false, unique = true)
	private String describe;


	public short getId() {
		return id;
	}


	public void setId(short id) {
		this.id = id;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getSchedule() {
		return schedule;
	}


	public void setSchedule(String schedule) {
		this.schedule = schedule;
	}


	public String getPointDeparture() {
		return pointDeparture;
	}


	public void setPointDeparture(String pointDeparture) {
		this.pointDeparture = pointDeparture;
	}


	public String getDestination() {
		return destination;
	}


	public void setDestination(String destination) {
		this.destination = destination;
	}


	public String getHotel() {
		return hotel;
	}


	public void setHotel(String hotel) {
		this.hotel = hotel;
	}


	public short getTotalMember() {
		return totalMember;
	}


	public void setTotalMember(short totalMember) {
		this.totalMember = totalMember;
	}


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public String getDescribe() {
		return describe;
	}


	public void setDescribe(String describe) {
		this.describe = describe;
	}


	@Override
	public String toString() {
		return "Trip [id=" + id + ", name=" + name + ", schedule=" + schedule + ", pointDeparture=" + pointDeparture
				+ ", destination=" + destination + ", hotel=" + hotel + ", totalMember=" + totalMember + ", startDate="
				+ startDate + ", endDate=" + endDate + ", describe=" + describe + "]";
	}

	
	
}
