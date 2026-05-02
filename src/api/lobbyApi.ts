import axios from "axios"

const api = axios.create({
    baseURL: "https://mulimp-e8c6exakdgfza3dm.centralus-01.azurewebsites.net",
});

export type CreateLobbyResponse = {
    lobbyId: string,
    playerId: string,
    players: string[]
}

export type JoinLobbyResponse = {
    lobbyId: string,
    playerId: string,
    players: string[]
}

export type GetLobbyResponse = {
    lobbyId: string,
    players: string[]
}

export async function createLobby(username: string) {
    const res = await api.post<CreateLobbyResponse>("/lobby", {
        username: username,
    });
    return res.data;
}

export async function joinLobby(lobbyId: string, username: string) {
    const res = await api.post<JoinLobbyResponse>(`/lobby/${lobbyId}/players`, {
        lobbyId: lobbyId,
        username: username
    });
    return res.data;
}

export async function getLobby(lobbyId: string) {
    const res = await api.get<GetLobbyResponse>(`/lobby/${lobbyId}`, {});
    return res.data;
}

export async function leaveLobby(lobbyId: string, playerId: string) {
    await api.delete(`/lobby/${lobbyId}/players/${playerId}`);
}

