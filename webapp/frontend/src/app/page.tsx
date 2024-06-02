"use client";

import React from "react";
import CustomPagination from "@/components/CustomPagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { se } from "date-fns/locale";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/repositories/contactRepository";
import { set } from "date-fns";

const generateData = () => {
	return Array.from({ length: 5 }, (_, i) => ({
		email: "email" + i + "@example.com",
		firstname: "firstname" + i,
		lastname: "lastname" + i,
		customerDate: new Date().toLocaleDateString(),
		leadDate: new Date().toLocaleDateString(),
	}));
};

export default function Home() {
	const [date, setDate] = React.useState<{ from?: string; to?: string } | undefined>(undefined);
	const [year, setYear] = React.useState(new Date().getFullYear());
	const [page, setPage] = React.useState(1);

	const handleSetDate = (range: any) => {
		setDate(range);
	};

	const handleApply = () => {};

	const { data, error, isLoading } = useQuery({
		queryKey: ["contacts", { page, date }],
		queryFn: () =>
			getContacts({
				page,
				filter: {
					from: date?.from,
					to: date?.to,
				},
			}),
		initialData: {
			data: [],
			total: 0,
			meta: {
				current_page: 1,
				last_page: 1,
			},
		},
	});

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Card className="w-full p-0">
				<CardHeader className="flex flex-row items-center justify-between py-[20px] px-[24px]">
					<span className="font-semibold text-xl">Data</span>
					<div className="flex flex-row gap-[10px] !mt-0 pt-0">
						<DatePickerWithRange
							year={year}
							date={date}
							handleSetDate={handleSetDate}
							handleApply={handleApply}
							handleYear={setYear}
						/>
						<a
							className={cn(
								buttonVariants({
									variant: "default",
								})
							)}
							href={process.env.NEXT_PUBLIC_BASE_API_URL + "/oauth/redirect"}
						>
							Connect
						</a>
					</div>
				</CardHeader>
				<CardContent className="px-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Email</TableHead>
								<TableHead>First Name</TableHead>
								<TableHead>Last Name</TableHead>
								<TableHead>Customer Date</TableHead>
								<TableHead>Lead Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((row, i) => {
								return (
									<TableRow key={i}>
										<TableCell>{row.email}</TableCell>
										<TableCell>{row.firstname}</TableCell>
										<TableCell>{row.lastname}</TableCell>
										<TableCell>{row.customer_date}</TableCell>
										<TableCell>{row.lead_date}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className="py-[12px] px-[24px]">
					<CustomPagination
						total={data?.total || 0}
						perPage={10}
						currentPage={data?.meta.current_page || 1}
						paginationLimit={6}
						onPageChange={setPage}
						nextPage={data?.meta.next_page}
					/>
				</CardFooter>
			</Card>
		</main>
	);
}
