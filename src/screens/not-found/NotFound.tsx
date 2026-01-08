import {Link} from "react-router";
import { Home } from "lucide-react";
import Snowfall from "react-snowfall";

const NotFoundPage = () => {


    return (
        <>
            <Snowfall color="#7986CB"/> {/* Winter Theme */}
        <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 text-center transition-colors bg-white text-gray-800 `}
        >

            <h1 className={`text-9xl font-bold leading-none text-gray-900 `}>
                404
            </h1>

            <p className={`mt-4 text-xl max-w-lg  text-gray-700`}>
                Oops! The page you are looking for does not exist.
            </p>

            <p className={`mt-2  text-gray-500 `}>
                It might have been moved or deleted.
            </p>

            <Link to={"/dashboard"}>
            <button
                className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors  bg-indigo-500 hover:bg-indigo-600 text-white `}
            >
                <Home size={20} /> Go Back
            </button>
            </Link>
        </div>
        </>

    );
};

export default NotFoundPage;
