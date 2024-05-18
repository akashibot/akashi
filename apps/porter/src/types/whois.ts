export interface Whois {
	status: boolean;
	domain_name: string;
	query_time: string;
	whois_server: string;
	domain_registered: string;
	create_date: string;
	update_date: string;
	expiry_date: string;
	domain_registrar: DomainRegistrar;
	registrant_contact: RegistrantContact;
	administrative_contact: AdministrativeContact;
	technical_contact: TechnicalContact;
	name_servers: string[];
	domain_status: string[];
	whois_raw_domain: string;
	registry_data: RegistryData;
}

export interface DomainRegistrar {
	iana_id: string;
	registrar_name: string;
	whois_server: string;
	website_url: string;
	email_address: string;
	phone_number: string;
}

export interface RegistrantContact {
	name: string;
	company: string;
	street: string;
	city: string;
	state: string;
	zip_code: string;
	country_name: string;
	country_code: string;
	email_address: string;
	phone: string;
}

export interface AdministrativeContact {
	name: string;
	company: string;
	street: string;
	city: string;
	state: string;
	zip_code: string;
	country_name: string;
	country_code: string;
	email_address: string;
	phone: string;
}

export interface TechnicalContact {
	name: string;
	company: string;
	street: string;
	city: string;
	state: string;
	zip_code: string;
	country_name: string;
	country_code: string;
	email_address: string;
	phone: string;
}

export interface RegistryData {
	domain_name: string;
	query_time: string;
	whois_server: string;
	domain_registered: string;
	domain_registrar: DomainRegistrar2;
	name_servers: string[];
	domain_status: string[];
	whois_raw_registery: string;
}

export interface DomainRegistrar2 {
	iana_id: string;
	registrar_name: string;
	whois_server: string;
	website_url: string;
	email_address: string;
	phone_number: string;
}
