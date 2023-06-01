package com.vti.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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
	
	@Column(name = "destination", length = 50, nullable = false, unique = true)
	private String destination;

	@Column(name = "totalMember")
	private short totalMember;

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

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public short getTotalMember() {
		return totalMember;
	}

	public void setTotalMember(short totalMember) {
		this.totalMember = totalMember;
	}

	@Override
	public String toString() {
		return "Trip [id=" + id + ", name=" + name + ", destination=" + destination + ", totalMember=" + totalMember
				+ "]";
	}

	
	
}