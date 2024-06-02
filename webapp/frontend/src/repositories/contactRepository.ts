import { objectToSearchParams } from "@/lib/utils";
import { ContactsParams, ContactsResponse } from "@/types";

const requestConfig: RequestInit = {
	headers: {
		accept: "application/json",
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*", // Add this line for CORS
	},
	credentials: "include",
};

export const getContacts = async (params: ContactsParams): Promise<ContactsResponse> => {
	const queryParams = objectToSearchParams(params);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/contacts/?${queryParams.toString()}`,
		{
			...requestConfig,
		}
	);
	const data = await response.json();

	return data;
};
