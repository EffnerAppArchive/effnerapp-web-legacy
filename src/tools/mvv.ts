import axios from 'axios';

const fetchDepartures = async (stopId: string): Promise<Departure[]> => {
    const time = Math.round(Date.now() / 1000);

    const url = 'https://www.mvv-muenchen.de/' +
        '?eID=departuresFinder' +
        '&action=get_departures' +
        '&stop_id=' + stopId +
        '&requested_timestamp=' + time +
        // parameter 'lines' is required, but can be empty
        '&lines=';

    const response = await axios.get(url);

    return response.data.departures;
};

const findStop = async (query: string): Promise<Stop[]> => {
    const url = 'https://www.mvv-muenchen.de/?eID=stopFinder&query=' + query;

    const response = await axios.get(url);

    return response.data.results;
};

export {
    fetchDepartures,
    findStop
};
