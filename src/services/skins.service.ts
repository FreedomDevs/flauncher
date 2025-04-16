import { apiConfig } from "../configs/api.config.ts";
import axios from "../utils/axios.ts";

class SkinsService {
    private readonly url: string = `${apiConfig.baseURL}${apiConfig.skins}`;

    async getSkinURL(userName: string): Promise<string> {
        const response = await axios.get(`${this.url}/${userName}`, {
            responseType: "blob",
        });

        return URL.createObjectURL(response.data);
    }

    changeSkin() {
    }

    changeCape() {
    }

}

export const skinsService = new SkinsService();
