export type Puzzle = {
    "game": {
        "clock": string,
        "id": string,
        "perf"?: {
            "key": string,
            "name": string
        },
        "pgn": string,
        "players":
        {
            "color": string,
            "flair"?: string,
            "id": string,
            "name": string,
            "patron"?: true,
            "rating": number,
            "title"?: string
        }[],
        "rated": boolean
    },
    "puzzle": {
        "id": string,
        "initialPly": number,
        "plays": number,
        "rating": number,
        "solution": string[],
        "themes": string[]
    }
}