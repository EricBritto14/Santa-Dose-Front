import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LockReset, Logout, AccountBox, AccountCircle } from '@mui/icons-material';

import Title from "@Components/Title";
import Input from "@Components/Input";
import Switch from "@Components/Switch";
import Menu, { OptionMenuType } from '@Components/Menu';
import Notification, { NotificationType } from "@Components/Notification";
import Loading from "@Components/Loading";

import { User } from "@Models/user";
import { getUser, updateUser, createUser } from "@Api/services/users";

import './style.sass';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "success"
    });
    const [user, setUser] = useState<User>({
        idUsuario: null,
        username: "",
        email: "",
        senha: "",
        is_admin: false
    })

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    const changeUserParams = (key : string, value : string | boolean) => {
        setUser(prevState => ({
            ...prevState,
            [key] : value
        }));
    }

    async function getSelectUser() {
        if(id) {
            setLoading(true);
            const data = await getUser(parseInt(id));

            if(data.error) {
                setNote({
                    message: `${data.response.response.data.detail}`,
                    show: true,
                    type: "error"
                });
                setTimeout(() => setNote(prevState => ({
                    ...prevState,
                    show: false,
                })), 3000);
            } else {
                setUser(data[1])
            }
            setLoading(false);
        }
    }

    async function handleSubmit() {
        if(
            user.email !== ""
            && user.senha !== ""
            && user.username !== ""
        ) {
            setLoading(true);
            if(user.idUsuario) {
                console.log("upda")
                const respUpdate = await updateUser(user);
                console.log("response update: ", respUpdate);
                if(respUpdate.error) {
                    setNote({
                        message: `${respUpdate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                    setTimeout(() => setNote(prevState => ({
                        ...prevState,
                        show: false,
                    })), 3000);
                } else {
                    localStorage.setItem("user-operation", "Usuário atualizado!");
                    navigate("/user-list");
                }
            } else {
                const respCreate = await createUser(user);
                console.log("response create: ", respCreate);
                if(respCreate.error) {
                    setNote({
                        message: `${respCreate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                    setTimeout(() => setNote(prevState => ({
                        ...prevState,
                        show: false,
                    })), 3000);
                } else {
                    localStorage.setItem("user-operation", "Usuário criado!");
                    navigate("/user-list");
                }
            }
            setLoading(false);
        } else {
            setNote({
                message: "Preencha os campos corretamente",
                show: true,
                type: "warning"
            });
            setTimeout(() => setNote(prevState => ({
                ...prevState,
                show: false,
            })), 3000);
        }
    }

    useEffect(() => {
        getSelectUser();
    }, []);

    return (
        <div id='user-form-page-main'>
            <div id="user-form-header">
                <Title
                    title="Cadastro de usuário"
                    subTitle="Cadastre ou edite um usuário no sistema preenchendo o formulário"
                />
                <Menu
                    icon={<AccountCircle style={{ color: "#9A9494" }}/>}
                    options={[
                        { label: "Editar perfil", onPress: () => navigate("/profile-form"), icon: <AccountBox/> },
                        { label: "Trocar senha", onPress: () => navigate("/change-password"), icon: <LockReset/> },
                        { label: "Sair", onPress: () => logout(), icon: <Logout/> }
                    ] as OptionMenuType[]}
                    style={{
                        margin: "0px 10px 0px 20px"
                    }}
                />
            </div>
            <form id="user-form-content" onSubmit={handleSubmit}>
                <div id="user-form-container">
                    <Input
                        title="Nome do usuário"
                        value={user.username}
                        setValue={(value : string) => changeUserParams('username', value)}
                        width="45%"
                    />
                    <Input
                        title="E-mail"
                        value={user.email}
                        setValue={(value : string) => changeUserParams('email', value)}
                        width="45%"
                        type="email"
                    />
                </div>
                <div id="user-form-container">
                    <Input
                        title="Senha"
                        value={user.senha}
                        setValue={(value : string) => changeUserParams('senha', value)}
                        width="45%"
                        type="password"
                    />
                    <div id="user-form-switch-container">
                        <label>Permissão de administrador:</label>
                        <Switch
                            value={user.is_admin}
                            setValue={(value : boolean) => changeUserParams('is_admin', value)}
                        />
                    </div>
                </div>
                <button type="submit">
                    Salvar
                </button>
            </form>
            {
                loading && <Loading/>
            }
            <Notification note={note}/>
        </div>
    )
}

export default UserForm;