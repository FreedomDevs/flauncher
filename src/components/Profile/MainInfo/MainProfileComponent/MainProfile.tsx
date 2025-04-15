import { FC, useEffect, useState } from "react";
import style from "./style.module.css";
import { useProfile } from "../../../../hooks/useProfile.ts";
import { apiConfig } from "../../../../configs/api.config.ts";
import Modal from "../../../Modal/Modal.tsx";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../utils/axios.ts";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {toast} from "react-toastify";

const placeholderImage: string = "https://i.pinimg.com/736x/7e/a1/90/7ea190a9e0f8caa40c88fdb3868ff15a.jpg";

export const MainProfile: FC = () => {
    const [modalActive, setModalActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch } = useForm();
    const { data } = useProfile();
    const queryClient = useQueryClient();

    const imageFile = watch("file");

    useEffect(() => {
        if (!imageFile || !imageFile.length) {
            setPreview(null);
            return;
        }

        const file = imageFile[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result as string);
        };

        reader.readAsDataURL(file);

        return () => {
            reader.abort();
        };
    }, [imageFile]);

    const onSubmit = async () => {
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
            setUploadError("Пожалуйста, выберите файл");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            setIsUploading(true);
            setUploadError(null);

            await axiosInstance.post("user/upload/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            await queryClient.invalidateQueries({ queryKey: ['profile'] });

            setModalActive(false);
            reset();
            setPreview(null);
        } catch (error: unknown) {
            console.error("Ошибка загрузки:", error);

            if (isAxiosError(error)) {
                setUploadError(
                    error.response?.data?.message ||
                    "Произошла ошибка при загрузке аватара"
                );
            } else {
                setUploadError("Произошла неизвестная ошибка");
            }
        } finally {
            setIsUploading(false);
            toast.success("Вы успешно установили аватарку!")
        }
    };

    const handleClose = () => {
        reset();
        setPreview(null);
        setUploadError(null);
        setModalActive(false);
    };

    if (!data) {
        return <p>Загрузка...</p>;
    }

    const roleNames: Record<string, string> = {
        USER: "Игрок",
        MODERATOR: "Модератор",
        ADMIN: "Админ",
    };

    const date = new Date(data?.createdAt);
    const formattedDate = `${String(date.getUTCDate()).padStart(2, "0")}.${String(date.getUTCMonth() + 1).padStart(2, "0")}.${date.getUTCFullYear()}`;

    const avatar = data && data.avatar
        ? apiConfig.baseURL + apiConfig.images + data.avatar
        : placeholderImage;

    return (
        <section className={style.main_profile}>
            <img
                src={avatar}
                alt="Аватар"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = placeholderImage;
                }}
            />
            <div className={style.profile_content}>
                <p>{data?.roles?.map(role => roleNames[role] || role).join(", ")}</p>
                <h1>{data?.name}</h1>
                <h2>Дата регистрации:<br></br> {formattedDate}</h2>
                <button onClick={() => setModalActive(true)}>Установить аватарку</button>
            </div>

            <Modal active={modalActive} setActive={handleClose}>
                <div className={style.avatar_modal}>
                    <h2>Смена аватара</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className={style.avatar_form}>
                        <label htmlFor="file-upload" className={style.upload_label}>
                            {preview ? "Изменить изображение" : "Выберите изображение"}
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            {...register("file")}
                            disabled={isUploading}
                            className={style.file_input}
                        />

                        {preview && (
                            <div className={style.preview_wrapper}>
                                <img
                                    src={preview}
                                    alt="Предпросмотр"
                                    className={style.preview_image}
                                />
                            </div>
                        )}

                        {uploadError && (
                            <p className={style.error_message}>{uploadError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isUploading}
                            className={style.submit_button}
                        >
                            {isUploading ? "Загрузка..." : "Сохранить"}
                        </button>
                    </form>
                </div>
            </Modal>
        </section>
    );
};