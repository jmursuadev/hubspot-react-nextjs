export type Contact = {
	id: number;
	email: string;
	firstname: string;
	lastname: string;
	customer_date: string;
	lead_date: string;
	created_date: string;
};

export type Contacts = Contact[];

export type ContactsResponse = {
	data: Contacts;
	total: number;
	meta: {
		current_page: number;
		next_page?: number;
		prev_page?: number;
		last_page: number;
	};
};

export type ContactsParams = {
	page: number;
	filter: {
		from?: null | Date;
		to?: null | Date;
	};
};
