package com.vti.entity;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "`Schedule`")
public class Schedule implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private short id;
	
	@Column(name = "`name`", length = 50, nullable = false, unique = true)
	private String name;
	
	@Column(name = "`time`", length = 50, nullable = false, unique = true)
	private Date time;
	
	@Column(name = "`destination`", length = 50, nullable = false, unique = true)
	private String destination;

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

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	@Override
	public String toString() {
		return "Schedule [id=" + id + ", name=" + name + ", time=" + time + ", destination=" + destination + "]";
	}

	
}