import { useMemo } from "react";
import { cn } from "../helpers/cn.ts";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const avarageVal = (a: number, b: number) => Math.floor((a + b) / 2);

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        siblingCount = 1
                    }: PaginationProps) => {

    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount * 2 + 5;
        if (totalPageNumbers >= totalPages) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldLeftDots = leftSiblingIndex > 2;
        const shouldRightDots = rightSiblingIndex < totalPages - 1;

        if (!shouldLeftDots && shouldRightDots) {
            const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
            return [...leftRange, { isMiddleBtn: true, page: avarageVal(leftRange.length - 1, lastPageIndex) }, lastPageIndex];
        }

        if (shouldLeftDots && !shouldRightDots) {
            const rightRange = Array.from(
                { length: 3 + 2 * siblingCount },
                (_, i) => totalPages - (3 + 2 * siblingCount) + 1 + i
            );
            return [firstPageIndex, { isMiddleBtn: true, page: avarageVal(firstPageIndex, rightRange[0]) }, ...rightRange];
        }

        if (shouldLeftDots && shouldRightDots) {
            const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [
                firstPageIndex,
                { isMiddleBtn: true, page: avarageVal(firstPageIndex, middleRange[0]) },
                ...middleRange,
                { isMiddleBtn: true, page: avarageVal(middleRange[middleRange.length - 1], lastPageIndex) },
                lastPageIndex
            ];
        }

        return [];
    }, [currentPage, totalPages, siblingCount]);

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
                ←
            </button>

            {paginationRange.map((page, i) =>
                typeof page !== "number" && page?.isMiddleBtn ? (
                    <span
                        key={i}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-400 select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={i}
                        onClick={() => onPageChange(page as number)}
                        className={cn(
                            "px-3 py-1 rounded transition-colors",
                            page === currentPage
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                    >
                        {page as number}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;
