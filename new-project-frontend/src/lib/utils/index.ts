import apiRequest from "../api";

export const getCredits = async (userId: string) => {

    try {
        const response = await apiRequest('GET', `/user/credit/${userId}`);
        return response.credits
    } catch (error) {

        return null

    }

};

