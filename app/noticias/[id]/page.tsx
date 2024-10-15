"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Article {
  _id: string;
  title: string;
  description: string;
  urlToImage: string;
  date: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const [currentNews, setCurrentNews] = useState<Article | null>(null);
  const [otherNews, setOtherNews] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`https://buffetec-api.vercel.app/getNoticias`)
      .then((res) => res.json())
      .then((res: { articles: Article[] }) => {
        const current = res.articles.find(
          (article) => article._id === params.id
        );
        setCurrentNews(current || null);
        setOtherNews(
          res.articles.filter((article) => article._id !== params.id)
        );
      })
      .catch((err) => console.error(err));
  }, [params.id]);

  const formatDate = (dateString: string): string => {
    const days: { [key: string]: string } = {
      Fri: "Vie",
      Sat: "Sáb",
      Sun: "Dom",
      Mon: "Lun",
      Tue: "Mar",
      Wed: "Mié",
      Thu: "Jue",
    };
    return dateString.replace(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g,
      (day) => days[day] || day
    );
  };

  if (!currentNews)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );

  return (
    <div className="">
      <div className="relative w-full bg-white">
        <svg
          width="60"
          height="29"
          viewBox="0 0 60 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute z-10 right-4 top-4 w-12 h-6 sm:w-16 sm:h-8"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.4752 11.437C29.9999 12.6564 28.817 13.4615 27.498 13.4615C22.9721 13.5009 14.1319 13.5009 14.1319 13.5009C13.2459 13.5009 12.4695 12.9146 12.2339 12.0693C11.9975 11.2232 12.36 10.3244 13.1199 9.87379L28.0654 1.00043C29.9891 -0.140913 32.3433 -0.316062 34.4179 0.528433L59.0449 10.5604C59.7251 10.8375 60.1133 11.5537 59.9706 12.2691C59.828 12.9854 59.195 13.5009 58.4592 13.5009C58.4592 13.5009 49.2897 13.5009 44.6642 13.5009C43.3287 13.5009 42.1309 12.686 41.6497 11.451C40.8409 9.18224 38.6493 7.57384 36.0811 7.57384C33.5129 7.57384 31.3213 9.18224 30.4752 11.437ZM28.0389 16.3724C28.6079 15.379 29.6714 14.7648 30.8236 14.7648C35.4474 14.7344 45.8687 14.7344 45.8687 14.7344C46.7538 14.7344 47.5311 15.3207 47.7667 16.166C48.0031 17.0121 47.6397 17.9109 46.8807 18.3615L31.9352 27.2349C30.0115 28.3762 27.6565 28.5514 25.5827 27.7069L0.955688 17.6749C0.274648 17.3978 -0.112741 16.6816 0.0291083 15.9662C0.171787 15.2499 0.539911 15 1.2757 15C1.2757 15 10.4629 14.7344 14.6686 14.7344C15.8208 14.7344 16.8851 15.3429 17.4633 16.3313C18.4902 18.1831 20.5491 19.428 22.8087 19.428C25.0576 19.428 27.0186 18.1938 28.0389 16.3724Z"
            fill="white"
          />
        </svg>

        <div className="relative w-full h-60 sm:h-64 md:h-96">
          <img
            src={currentNews.urlToImage}
            alt=""
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 max-w-[90%]">
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-2">
            {currentNews.title}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg font-medium">
            {formatDate(currentNews.date)}
          </p>
        </div>
      </div>

      <p className="mt-6 mb-8 text-base sm:text-lg md:text-xl text-justify px-5">
        {currentNews.description}
      </p>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#14397F] px-5">
        Ver más Noticias:
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 pb-10">
        {otherNews.map((article) => (
          <div
            key={article._id}
            className="border-2 border-[#14397F] rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => router.push(`/noticias/${article._id}`)}
          >
            <img
              src={article.urlToImage}
              className="w-full h-48 object-cover brightness-65 saturate-0 bg-black bg-opacity-20"
              alt=""
            />
            <div className="p-4">
              <h3 className="font-bold text-lg sm:text-xl text-[#14397F] mb-2">
                {article.title}
              </h3>
              <p className="font-semibold text-sm text-[#14397F] mb-2">
                {formatDate(article.date)}
              </p>
              <p className="text-sm sm:text-base text-[#14397F]">
                {article.description.substring(0, 120)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
