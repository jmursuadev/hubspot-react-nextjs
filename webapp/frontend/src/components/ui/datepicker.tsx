"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { addDays, format, isValid, parse, set } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

export type DatepickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
	date?: DateRange;
	year?: number;
	handleSetDate: (range: DateRange | undefined, selectedDay: Date) => void;
	handleApply: () => void;
	handleYear: (year: number) => void;
};

export function DatePickerWithRange({
	className,
	date,
	year,
	handleSetDate,
	handleApply,
	handleYear,
}: DatepickerWithRangeProps) {
	const [startDate, setStartDate] = React.useState<string>(
		isValid(date) ? format(date?.from as Date, "LLL dd, y") : ""
	);
	const [endDate, setEndDate] = React.useState<string>(
		isValid(date) ? format(date?.to as Date, "LLL dd, y") : ""
	);
	const [originalDate, setOriginalDate] = React.useState<DateRange | undefined>(date);
	const month = React.useMemo(() => {
		const _date = new Date(date?.from ?? new Date());

		if (year) {
			return set(_date, { year });
		}

		return _date;
	}, [year, date?.from]);

	const handleSetDateRange = (
		range: any,
		selectedDay: any,
		modifier: any,
		e: React.MouseEvent<Element, MouseEvent>
	) => {
		handleSetDate(range, selectedDay);
		setStartDate(range?.from ? format(range.from, "LLL dd, y") : "");
		setEndDate(range?.to ? format(range.to, "LLL dd, y") : "");
	};

	const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);

		const parsedDate = parse(e.target.value, "LLL dd, y", new Date());

		if (isValid(parsedDate)) {
			handleSetDate({ to: date?.to, from: parsedDate }, parsedDate);
		} else {
			handleSetDate({ to: date?.to, from: undefined }, parsedDate);
		}
	};

	const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEndDate(e.target.value);

		const parsedDate = parse(e.target.value, "LLL dd, y", new Date());

		if (isValid(parsedDate)) {
			handleSetDate({ from: date?.from, to: parsedDate }, parsedDate);
		} else {
			handleSetDate({ from: date?.from, to: undefined }, parsedDate);
		}
	};

	const handleCancel = () => {
		handleSetDate(originalDate, new Date());
		setStartDate(originalDate?.from ? format(originalDate.from, "LLL dd, y") : "");
		setEndDate(originalDate?.to ? format(originalDate.to, "LLL dd, y") : "");
	};

	const _handleApply = () => {
		setOriginalDate(date);
		handleApply();
	};

	const _handleYear = (year: number) => {
		handleYear(year);
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							"border-[#C2C5CE]",
							"border-[1px]",
							"rounded-[4px]",
							"shadow-[0_1px_0_0_rgba(226,227,230,0.5)]",
							"justify-between"
						)}
					>
						{date?.from ? <CalendarIcon className="mr-2 h-4 w-4" /> : null}
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<>
								<span>Customer Date</span>
								<ChevronDownIcon />
							</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 flex flex-row" align="end">
					<ScrollArea className="h-[400px] w-[160px]  ">
						<div className="p-2">
							<ul className="p-0 m-0">
								{
									//create list from 1930 to current year descending
									Array.from(
										{ length: new Date().getFullYear() - 1930 + 1 },
										(_, i) => new Date().getFullYear() - i
									).map((_year) => (
										<li
											onClick={() => _handleYear(_year)}
											key={_year}
											className={cn(
												"rounded-[6px] py-[10px] px-[16px] text-sm hover:bg-[#8390D6] cursor-pointer text-[#344054] hover:text-white",
												year === _year ? "bg-[#8390D6] text-white" : ""
											)}
										>
											{_year}
										</li>
									))
								}
							</ul>
						</div>
					</ScrollArea>
					<div>
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={date?.from}
							selected={date}
							onSelect={handleSetDateRange}
							numberOfMonths={2}
							month={month}
						/>
						<div className="flex items-center flex-row justify-between p-3 border-[#EAECF0] border-[1px]">
							<div className="flex gap-[12px] items-center">
								<Input
									type="text"
									value={startDate}
									onChange={handleStartDate}
									placeholder="LLL dd, y"
								/>
								<span className="text-base text-[#667085]">-</span>
								<Input
									type="text"
									value={endDate}
									onChange={handleEndDate}
									placeholder="LLL dd, y"
								/>
							</div>
							<div className="flex gap-[12px]">
								<PopoverClose
									onClick={handleCancel}
									className={cn(
										"font-semibold",
										buttonVariants({
											variant: "outline",
										})
									)}
								>
									Cancel
								</PopoverClose>
								<PopoverClose
									onClick={_handleApply}
									className={cn(
										"font-semibold",
										buttonVariants({
											variant: "default",
										})
									)}
								>
									Apply
								</PopoverClose>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
