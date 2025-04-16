import React, {useEffect, useState} from "react";
import style from "./style.module.css"
import MinecraftSkinViewer from "../../SkinsLib/MinecraftSkinViewer.tsx";
import {skinsService} from "../../../services/skins.service.ts";
import {useProfile} from "../../../hooks/useProfile.ts";

export const SkinSection: React.FC = () => {
    const { data } = useProfile();
    const [handType, setHandType] = useState(true);
    const [skinUrl, setSkinUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSkin() {
            try {
                if (!data) return;
                const skin = await skinsService.getSkinURL(data.name);
                setSkinUrl(skin);
            } catch (error) {
                console.error("Failed to load skin:", error);
            }
        }

        fetchSkin();
    }, []);

    const onClick: () => void = () => {
        if (handType) {
            setHandType(false);
            // TODO: сделать обработку на сервере
            console.log(handType);
        } else {
            setHandType(true);
            // TODO: сделать обработку на сервере
            console.log(handType);
        }
    }

    function handleFileChange(e: any) {
        const file = e.target.files[0];
        if (file && !file.name.endsWith('.png')) {
            alert('Пожалуйста, выбери .png файл!');
            e.target.value = ''; // сбросить выбранный файл
        }
    }

    return (<section className={style.skin_wrapper}>
        <div className={style.skin}>
            <MinecraftSkinViewer
                skinURL={skinUrl}
            />
        </div>
        <div className={style.button_wrapper}>
            <button onClick={onClick} className={style.button}>{handType ? "Default" : "Slim"}</button>
            <label className={style.input}>
                <input type="file" accept=".png" hidden onChange={handleFileChange} />
                Загрузить скин
            </label>
            <button className={style.button}>Установить плащ</button>
        </div>
    </section>)
}
