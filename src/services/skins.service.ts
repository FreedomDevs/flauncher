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

    async getSkinType(userName: string){
        return await axios.get(`${this.url}/${userName}/type`, {})
    }

    async changeSkinType(userName: string, type: boolean) {
        return await axios.post(`${this.url}/${userName}/type`, {
            type,
        })
    }

    async changeSkin(userName: string, file: FormData) {
        try {
            const response = await axios.post(`${this.url}/${userName}/upload`, file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const { fileName } = response.data;
            return { fileName };
        } catch (error) {
            console.error("Ошибка при загрузке скина:", error);
            throw new Error("Ошибка при загрузке скина");
        }
    }


    changeCape() {
    }

}

export const skinsService = new SkinsService();
