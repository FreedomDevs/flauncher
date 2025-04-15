import React, { useState } from "react";
import style from "./style.module.css"
import MinecraftSkinViewer from "../../SkinsLib/MinecraftSkinViewer.tsx";

export const SkinSection: React.FC = () => {
    const [handType, setHandType] = useState(true);

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
                skinURL={"Skins/Foks_f.png"}
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
