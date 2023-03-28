import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { EC_API_KEY, EC_MOVIE_BASE_URL } = process.env;

export const getDiscover = async (req, res) => {
    const { params } = req.body;

    try {
        const url = `${EC_MOVIE_BASE_URL}discover/movie`;

        const { data } = await axios(url, {
            params: {
                api_key: EC_API_KEY,
                with_genres: params?.with_genres || "",
                sort_by: params?.sort_by || "popularity.desc",
                certification_country: params?.certification_country || "US",
                certification: params?.certification || "",
                "primary_release_date.gte": params?.fromDate || "",
                "primary_release_date.lte": params?.toDate || "",
                "vote_average.gte": params?.minRating || 0,
                "vote_average.lte": params?.maxRating || 10,
            },
        });
        res.status(200).json(data.results);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: `Internal server error`,
        });
    }
};
