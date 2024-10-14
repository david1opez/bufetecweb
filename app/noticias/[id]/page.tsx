"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { useParams, useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();
    const params = useParams();

    const [currentNew, setCurrentNew] = useState<any>({});
    const [otherNews, setOtherNews] = useState<any>([]);

    useEffect(() => {        
        fetch(`https://buffetec-api.vercel.app/getNoticias`)
        .then(res => res.json())
        .then(res => {
            res?.articles.forEach((article: any) => {
                if(article["_id"] === params.id) {
                    setCurrentNew(article);
                } else {
                    setOtherNews((prev: any) => [...prev, article]);
                }
            })
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <div className={styles.imageContainer}>
                <svg width="60" height="29" viewBox="0 0 60 29" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logo}>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4752 11.437C29.9999 12.6564 28.817 13.4615 27.498 13.4615C22.9721 13.5009 14.1319 13.5009 14.1319 13.5009C13.2459 13.5009 12.4695 12.9146 12.2339 12.0693C11.9975 11.2232 12.36 10.3244 13.1199 9.87379L28.0654 1.00043C29.9891 -0.140913 32.3433 -0.316062 34.4179 0.528433L59.0449 10.5604C59.7251 10.8375 60.1133 11.5537 59.9706 12.2691C59.828 12.9854 59.195 13.5009 58.4592 13.5009C58.4592 13.5009 49.2897 13.5009 44.6642 13.5009C43.3287 13.5009 42.1309 12.686 41.6497 11.451C40.8409 9.18224 38.6493 7.57384 36.0811 7.57384C33.5129 7.57384 31.3213 9.18224 30.4752 11.437ZM28.0389 16.3724C28.6079 15.379 29.6714 14.7648 30.8236 14.7648C35.4474 14.7344 45.8687 14.7344 45.8687 14.7344C46.7538 14.7344 47.5311 15.3207 47.7667 16.166C48.0031 17.0121 47.6397 17.9109 46.8807 18.3615L31.9352 27.2349C30.0115 28.3762 27.6565 28.5514 25.5827 27.7069L0.955688 17.6749C0.274648 17.3978 -0.112741 16.6816 0.0291083 15.9662C0.171787 15.2499 0.539911 15 1.2757 15C1.2757 15 10.4629 14.7344 14.6686 14.7344C15.8208 14.7344 16.8851 15.3429 17.4633 16.3313C18.4902 18.1831 20.5491 19.428 22.8087 19.428C25.0576 19.428 27.0186 18.1938 28.0389 16.3724Z" fill="white"/>
                </svg>

                <img src={currentNew?.urlToImage} alt="" className={styles.image}/>

                <div className={styles.headerContainer}>
                    <h1 className={styles.title}>{currentNew?.title}</h1>
                    <p className={styles.date}>{
                        currentNew?.date?.replace("Fri", "Vie")
                            .replace("Sat", "Sáb")
                            .replace("Sun", "Dom")
                            .replace("Mon", "Lun")
                            .replace("Tue", "Mar")
                            .replace("Wed", "Mié")
                            .replace("Thu", "Jue")
                    }</p>
                </div>
            </div>

            <p className={styles.body}>{currentNew?.description}</p>

            <p className={styles.moreNewsLabel}>Ver más Noticias:</p>
            
            <div className={styles.moreNewsContainer}>
                {
                    otherNews.map((article: any) => (
                        <div
                            className={styles.previewContainer}
                            onClick={() => router.push(`/noticias/${article["_id"]}`)}
                        >
                            <img src={article?.urlToImage} className={styles.previewImage}></img>
                            <h3 className={styles.previewTitle}>{article?.title}</h3>
                            <p className={styles.previewDate}>{article?.date}</p>
                            <p className={styles.previewBody}>{article?.description.substring(0,120)}...</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page
