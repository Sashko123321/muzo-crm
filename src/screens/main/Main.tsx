import { Link } from "react-router";

const Main = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
            <div className="max-w-3xl bg-white p-10 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Вітаємо, команда!
                </h1>

                <p className="text-lg text-gray-700 mb-4 leading-7">
                    Це внутрішня CRM-система нашої компанії, створена для
                    щоденної роботи диспетчерів, операторів та менеджерів.
                    Тут ви можете відстежувати заявки, працювати з водіями,
                    переглядати звіти та виконувати інші робочі процеси.
                </p>

                <p className="text-lg text-gray-700 mb-4 leading-7">
                    Наша система розроблена спеціально під потреби нашої
                    організації, щоб забезпечити чітку координацію, швидку
                    взаємодію та стабільний робочий процес.
                </p>

                <p className="text-lg text-gray-700 mb-8 leading-7">
                    Якщо ви є співробітником компанії, увійдіть у свій профіль,
                    щоб продовжити роботу.
                </p>

                <div className="text-right">
                    <Link to="/muzo-crm/dashboard">
                        <button className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition">
                            Увійти в профіль
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Main;
