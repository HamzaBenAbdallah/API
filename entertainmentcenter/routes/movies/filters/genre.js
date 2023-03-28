import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { EC_API_KEY, EC_MOVIE_BASE_URL } = process.env;

export const getGenre = async (req, res) => {
    const url = `${EC_MOVIE_BASE_URL}/genre/movie/list?api_key=${EC_API_KEY}`;

    try {
        const { data } = await axios(url);
        res.status(200).json(data.genres);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: `Internal server error`,
        });
    }
};
