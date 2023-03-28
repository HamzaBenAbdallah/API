import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { EC_API_KEY, EC_MOVIE_BASE_URL } = process.env;

export const getMovieById = async (id) => {
    const url = `${EC_MOVIE_BASE_URL}/movie/${id}?api_key=${EC_API_KEY}`;

    try {
        const response = await axios(url);

        return response.data;
    } catch (err) {
        return err;
    }
};
