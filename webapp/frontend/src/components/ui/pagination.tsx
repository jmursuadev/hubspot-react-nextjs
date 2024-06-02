import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
	<nav
		role="navigation"
		aria-label="pagination"
		className={cn("mx-auto flex w-full justify-center", className)}
		{...props}
	/>
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
	({ className, ...props }, ref) => (
		<ul ref={ref} className={cn("flex flex-row items-center flex-wrap gap-1", className)} {...props} />
	)
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
	({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<ButtonProps, "size"> &
	React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
	<a
		aria-current={isActive ? "page" : undefined}
		className={cn(
			buttonVariants({
				variant: "ghost",
				size,
			}),
			className,
			"text-base",
			"text-[#5C6578]",
			isActive ? "bg-[#F9FAFB]" : null
		)}
		{...props}
	/>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
	className,
	size = "default",
	...props
}: React.ComponentProps<"a"> & Pick<ButtonProps, "size">) => (
	<a
		aria-label="Go to previous page"
		className={cn(
			buttonVariants({
				variant: "outline",
				size,
			}),
			cn("gap-1 pr-2.5", className),
			"rounded-[1px]",
			"border-[#D0D5DD]",
			"py-[8px]",
			"px-[14px]"
		)}
		{...props}
	>
		<ArrowLeftIcon className="h-4 w-4" />
		<span>Previous</span>
	</a>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
	className,
	size = "default",
	...props
}: React.ComponentProps<"a"> & Pick<ButtonProps, "size">) => (
	<a
		aria-label="Go to next page"
		className={cn(
			buttonVariants({
				variant: "outline",
				size,
			}),
			cn("gap-1 pr-2.5", className),
			"rounded-[1px]",
			"border-[#D0D5DD]",
			"py-[8px]",
			"px-[14px]"
		)}
		{...props}
	>
		<span>Next</span>
		<ArrowRightIcon className="h-4 w-4" />
	</a>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
	<span
		aria-hidden
		className={cn("flex h-9 w-9 items-center justify-center", className)}
		{...props}
	>
		<DotsHorizontalIcon className="h-4 w-4" />
		<span className="sr-only">More pages</span>
	</span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};
