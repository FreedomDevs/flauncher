import React, {useState} from "react";
import style from "./style.module.css"
import MinecraftSkinViewer from "../../SkinsLib/MinecraftSkinViewer.tsx";

 export const SkinSection: React.FC = () => {
     const [handType, setHandType] = useState(true);
     // Slim и на оборот

     const onClick: () => void = ()=>  {
        
     }

    return (<section className={style.skin_wrapper}>
        <div className={style.skin}>
            <MinecraftSkinViewer
                skinURL={"Skins/Foks_f.png"}
            />
        </div>
        <div className={style.button_wrapper}>
            <button onClick={onClick} className={style.button}>{handType ? "Default" : "Slim"}</button>
            <button className={style.button}>Загрузить скин</button>
            <button className={style.button}>Установить плащ</button>
        </div>
    </section>)
}
