import { useEffect, useState } from "react";
export function useFetch(fetcher) {
    const [state, setState] = useState({ status: "loading", data: null, error: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        setState((previous) => ({ ...previous, status: "loading", error: null }));

        fetcher({ signal: controller.signal })
            .then((data) => setState({ status: "success", data, error: null }))
            .catch((error) => {
                if (error.name === "AbortError") return; // sengaja dibatalkan: abaikan
                setState({ status: "error", data: null, error });
            });

        return () => controller.abort();
    }, [fetcher, attempt]);

    return { ...state, reload: () => setAttempt((n) => n + 1) };
}
