const CarrierCardSkeleton = () => {
    return (
        <div className="rounded-xl bg-base-100 p-4 shadow animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="h-4 w-20 rounded bg-base-300" />
                <div className="h-6 w-12 rounded bg-base-300" />
            </div>

            <div className="h-5 w-3/4 rounded bg-base-300 mb-3" />

            <div className="space-y-2 mb-4">
                <div className="h-4 w-full rounded bg-base-300" />
                <div className="h-4 w-5/6 rounded bg-base-300" />
            </div>

            <div className="flex justify-between items-center">
                <div className="h-8 w-24 rounded bg-base-300" />
                <div className="h-8 w-8 rounded bg-base-300" />
            </div>
        </div>
    );
};

export default CarrierCardSkeleton;
