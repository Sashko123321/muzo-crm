import type {FC, PropsWithChildren} from "react";
import TanstackQueryProvider from "./TanstackQueryProvider.tsx";

const Providers: FC<PropsWithChildren> = ({children}) => {
    return (
        <TanstackQueryProvider>
            {children}
        </TanstackQueryProvider>
    );
};

export default Providers;