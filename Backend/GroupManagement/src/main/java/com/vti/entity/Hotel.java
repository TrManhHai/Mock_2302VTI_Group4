package com.vti.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "`Hotel`")
public class Hotel implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private short id;
	
	@Column(name = "`name`", length = 50, nullable = false, unique = true)
	private String name;
	
	@Column(name = "`address`", length = 50, nullable = false, unique = true)
	private String address;
	
	@Column(name = "`phone`", length = 50, nullable = false, unique = true)
	private short phone;

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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public short getPhone() {
		return phone;
	}

	public void setPhone(short phone) {
		this.phone = phone;
	}

	@Override
	public String toString() {
		return "Hotel [id=" + id + ", name=" + name + ", address=" + address + ", phone=" + phone + "]";
	}

	
	
}