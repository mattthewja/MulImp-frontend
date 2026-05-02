import axios from "axios"
// http://localhost:8080
const api = axios.create({
    baseURL: "https://mulimp-e8c6exakdgfza3dm.centralus-01.azurewebsites.net",
});

export type GameState = "IN_LOBBY" | "ANSWERING" | "DISCUSSION" | "RESULTS"

export type PlayerAnswerPair = {
    username: string,
    answer: string
}

export type GameResult = {
    imposterName: string,
    votedOutName: string | null
}

export type PostPlayerAnswerRequest = {
    answer: string
}

// boolean
export async function startGame(lobbyId: string) {
    const res = await api.post(`/lobby/${lobbyId}/game/start`);
    return res.data;
}

/**
 * Response format
 * GameState gameState
 * List<String> players
 * List<PlayerAnswerPair> answers | null
 * GameResult gameResult | null
 */
export async function getState(lobbyId: string) {
    const res = await api.get(`/lobby/${lobbyId}/game/state`);
    return res.data;
}

/**
 * GameState gameState
 * String question
 * boolean hasAnswered
 * boolean hasVoted
 */
export async function getPlayerState(lobbyId: string, playerId: string) {
    const res = await api.get(`/lobby/${lobbyId}/game/players/${playerId}/state`);
    return res.data;
}

/**
 * returns success or throws if failure, so useless...
 */
export async function postAnswer(lobbyId: string, playerId: string, answer: string) {
    const res = await api.post(`/lobby/${lobbyId}/game/players/${playerId}/answer`, {
        answer: answer
    });
    return res.data;
}

/**
 * returns success or throws if failure
 */
export async function postVote(lobbyId: string, playerId: string, vote: string) {
    const res = await api.post(`/lobby/${lobbyId}/game/players/${playerId}/vote`, {
        vote: vote
    });
    return res.data;
}