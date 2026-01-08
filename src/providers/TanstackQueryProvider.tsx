import type {FC, PropsWithChildren} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000000,
            refetchInterval: 1000000,
        },
    },
});

const TanstackQueryProvider: FC<PropsWithChildren> = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default TanstackQueryProvider;