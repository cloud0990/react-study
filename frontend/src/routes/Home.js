import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Loading from "components/Loading";
import Slide from "components/Slide";
import navList from "atom/NavList";

import style from "styles/routes/Home.module.css";

function Home() {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState([]);

    /*
        // async-await
        const getMovies = async () => {
            const responseJson = await (
                await fetch('https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year')
            ).json();

            setMovie(responseJson.data.movies);
            setLoading(false);
        };
    */

    useEffect(() => {

        const request = navList.map(({path}) => {
            return axios.get('https://yts.mx/api/v2/list_movies.json?' + path, {
                params: {
                    limit: 10,
                    sort_by: 'year'
                }
            })
        });

        axios.all(request)
            .then(axios.spread(async (...response) => {
                const data = response.map(res => {
                    if (res.status === 200) {
                        return res.data.data.movies;
                    }
                });

                setMovie(data);
                setLoading(false);
            }));
    }, []);

    return (
        <div className={style.container}>
            {navList.map((slide, idx) => (
                        <div className={style.slide__box} key={idx}>
                            <h4 className={style.title}>
                                <Link to={`/page/${slide.path}/1`}>
                                    <i className="fas fa-external-link-alt"></i>
                                    <span>{slide.title} Movie</span>
                                </Link>
                            </h4>
                            { movie && movie.length === 0 ? (
                                    <Loading />
                                ) : (
                                    <Slide movie={movie[idx]} />
                                )
                            }
                        </div>
                    )
                )
            }
        </div>
    )
}

export default Home;
