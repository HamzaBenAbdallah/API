import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { EC_API_KEY, EC_MOVIE_BASE_URL } = process.env;

export const getDetails = async (req, res) => {
    const { id } = req.query;
    const url = `${EC_MOVIE_BASE_URL}/movie/${id}?api_key=${EC_API_KEY}`;
    const similarUrl = `${EC_MOVIE_BASE_URL}/movie/${id}/similar?api_key=${EC_API_KEY}`;
    const castUrl = `${EC_MOVIE_BASE_URL}/movie/${id}/credits?api_key=${EC_API_KEY}`;

    try {
        const response = await axios(url);

        const similar = await axios(similarUrl);
        const { data: similarData } = similar;

        const cast = await axios(castUrl);
        const { data: castData } = cast;

        const director = castData.crew.find(
            (member) => member.job === "Director"
        );
        const crew = castData.crew.filter(
            (member) => member.job !== "Director"
        );
        const returnData = {
            ...response.data,
            related: similarData.results.slice(0, 5),
            cast: castData.cast.slice(0, 12),
            director: director ? director.name : "",
            crew: crew.slice(0, 5),
        };

        if (response.data) {
            res.status(200).json(returnData);
        } else {
            res.status(404).json({
                status: 404,
                message: "No results found, please enter a valid genre id",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: `Internal server error`,
        });
    }
};
