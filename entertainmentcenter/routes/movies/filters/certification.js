import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { EC_API_KEY, EC_MOVIE_BASE_URL } = process.env;

export const getCertification = async (req, res) => {
    const url = `${EC_MOVIE_BASE_URL}certification/movie/list?api_key=${EC_API_KEY}`;

    try {
        const { data } = await axios(url);
        res.status(200).json(data.certifications.US);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: `Internal server error`,
        });
    }
};
