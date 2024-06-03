import * as React from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./ui/pagination";
import { cn } from "@/lib/utils";
import { max } from "date-fns";

type CustomPaginationProps = {
	currentPage: number;
	onPageChange: (page: number) => void;
	total: number;
	perPage: number;
	paginationLimit: number;
	nextPage?: number;
} & React.ComponentProps<typeof Pagination>;

export default function CustomPagination({
	className,
	onPageChange,
	...props
}: CustomPaginationProps) {
	const totalPages = React.useMemo(
		() => Math.ceil(props.total / props.perPage),
		[props.total, props.perPage]
	);

	const isNextPageAvailable = React.useMemo(() => {
		return props.nextPage && props.nextPage <= totalPages;
	}, [props.nextPage, totalPages]);

	const isPrevPageAvailable = React.useMemo(() => {
		return props.currentPage > 1;
	}, [props.currentPage]);

	const generatePaginationNumber = (): number[] => {
		const { currentPage, paginationLimit } = props;

		if (!totalPages) {
			return [];
		}

		let minLeft = Math.max(currentPage - 1, 2);
		let maxLeft = Math.max(
			Math.min(currentPage + 1, totalPages),
			totalPages >= paginationLimit ? 3 : 0
		);
		let right = Math.max(
			Math.min(totalPages - 2, Math.max(totalPages, maxLeft + 1)),
			maxLeft + 1
		);
		let midRange = paginationLimit - 1;

		let leftCount = maxLeft - minLeft + 2;
		let rightCount = totalPages - right + 1;
		let remainingPaginationCount = paginationLimit - (leftCount + rightCount);

		if (remainingPaginationCount > 0 && midRange < minLeft) {
			minLeft = minLeft - remainingPaginationCount;
		}

		if (remainingPaginationCount < 0) {
			right = right + 1;
		}

		// create array from minLeft to maxLeft
		const leftRange = Array.from({ length: maxLeft - minLeft + 1 }, (_, i) => i + minLeft);
		const rightRange = Array.from({ length: totalPages - right + 1 }, (_, i) => i + right);
		console.log({
			leftRange,
			rightRange,
			minLeft,
			maxLeft,
			right,
			leftCount,
			rightCount,
			remainingPaginationCount,
			currentPage,
			totalPages,
		});
		return [1].concat(leftRange, rightRange);
	};

	const generatePagination = () => {
		return generatePaginationNumber().map((pageNumber, index, items) => {
			let element = [];

			element.push(
				generatePaginationItem(true, { pageNumber, currentPage: props.currentPage })
			);

			if (pageNumber !== totalPages && pageNumber + 1 !== items[index + 1]) {
				element.push(
					generatePaginationItem(false, { pageNumber, currentPage: props.currentPage })
				);
			}

			return element.map((el) => el);
		});
	};

	const generatePaginationItem = (
		isPaginationLink: boolean,
		{ pageNumber, currentPage }: { pageNumber: number; currentPage: number }
	): JSX.Element => {
		if (isPaginationLink) {
			return (
				<PaginationItem
					key={pageNumber}
					className={pageNumber === currentPage ? "bg-[#F9FAFB] rounded-[8px]" : ""}
				>
					<PaginationLink
						href="#"
						isActive={pageNumber === currentPage}
						onClick={() => onPageChange(pageNumber)}
					>
						{pageNumber}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return (
			<PaginationItem key={pageNumber + "-ellipsis"} className="align-bottom">
				...
			</PaginationItem>
		);
	};

	return (
		<Pagination>
			<PaginationContent className="flex justify-between flex-row w-full">
				<PaginationItem className="flex-grow" key={`prev`}>
					<PaginationPrevious
						href="#"
						onClick={() => onPageChange(props.currentPage - 1 || 1)}
						tabIndex={isPrevPageAvailable ? 0 : -1}
						aria-disabled={!isPrevPageAvailable}
						className={cn({
							"cursor-not-allowed": !isPrevPageAvailable,
							"opacity-50": !isPrevPageAvailable,
						})}
					/>
				</PaginationItem>
				{generatePagination()}
				<PaginationItem className="flex-grow text-right" key={`next`}>
					<PaginationNext
						href="#"
						tabIndex={isNextPageAvailable ? 0 : -1}
						aria-disabled={!isNextPageAvailable}
						className={cn({
							"cursor-not-allowed": !isNextPageAvailable,
							"opacity-50": !isNextPageAvailable,
						})}
						onClick={() => onPageChange(props.nextPage ?? 1)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
