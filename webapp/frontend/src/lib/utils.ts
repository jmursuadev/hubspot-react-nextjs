import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const objectToSearchParams = (params: Record<string, any>): URLSearchParams => {
	const searchParams = new URLSearchParams();

	const appendValue = (key: string, value: any) => {
		console.log("TYPE", typeof value, key, value);
		if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
			console.log("APPEND", key, value);
			searchParams.append(key, value.toString());
		} else if (Array.isArray(value)) {
			value.forEach((item: any) => {
				appendValue(`${key}[]`, item); // Handle array items
			});
		} else if (typeof value === "object" && value !== null && value instanceof Date) {
			searchParams.append(key, value.toISOString());
		} else if (typeof value === "object" && value !== null) {
			// Recursively handle nested objects
			Object.keys(value).forEach((subKey) => {
				console.log("SUB", subKey, value[subKey]);
				appendValue(`${key}[${subKey}]`, value[subKey]);
			});
		}
		// Ignore other types like undefined, null, etc.
	};

	Object.keys(params).forEach((key) => {
		const value = params[key];
		appendValue(key, value);
	});
	console.log(searchParams);
	return searchParams;
};
