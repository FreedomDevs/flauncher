import React, {useEffect, useState} from "react";
import style from "./style.module.css"
import MinecraftSkinViewer from "../../SkinsLib/MinecraftSkinViewer.tsx";
import {skinsService} from "../../../services/skins.service.ts";
import {useProfile} from "../../../hooks/useProfile.ts";
import {toast} from "react-toastify";

export const SkinSection: React.FC = () => {
    const {data} = useProfile();
    const [skinUrl, setSkinUrl] = useState<string | null>(null);
    const [skinType, setSkinType] = useState(false);

    async function fetchSkin() {
        try {
            if (!data) return;
            const skin = await skinsService.getSkinURL(data.name);
            setSkinUrl(skin);
        } catch (error) {
            console.error("Failed to load skin:", error);
        }
    }

    async function fetchSkinType() {
        try {
            if (!data) return;
            const skinType = await skinsService.getSkinType(data.name);
            setSkinType(skinType.data.type);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchSkin();
        fetchSkinType()
        console.log("Fetch skin")
    }, [skinType]);

    const onClick: () => void = () => {
        if (!data) return;
        if (skinType) {
            skinsService.changeSkinType(data.name, false)
            setSkinType(false);
            fetchSkinType()

        } else {
            skinsService.changeSkinType(data.name, true)
            setSkinType(true);
            fetchSkinType()
        }
    }

    function handleFileChange(e: any) {
        const file = e.target.files[0];
        if (file && !file.name.endsWith('.png')) {
            alert('Пожалуйста, выбери .png файл!');
            e.target.value = '';
        }

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            skinsService.changeSkin(data?.name || "", formData)
                .then((response) => {
                    console.log(response.fileName);
                    toast.success("Скин успешно установленн.")
                    fetchSkin();
                })
                .catch((error) => {
                    console.error("Ошибка при загрузке скина:", error);
                    toast.error("Ошибка при загрузке скина.")
                });
        }
    }

    return (<section className={style.skin_wrapper}>
        <div className={style.skin}>
            <MinecraftSkinViewer
                skinURL={skinUrl ?? ''}
                skinType={skinType}
            />
        </div>
        <div className={style.button_wrapper}>
            <button onClick={onClick} className={style.button}>{skinType ? "Default" : "Slim"}</button>
            <label className={style.input}>
                <input type="file" accept=".png" hidden onChange={handleFileChange}/>
                Загрузить скин
            </label>
            <button className={style.button}>Установить плащ</button>
        </div>
    </section>)
}
