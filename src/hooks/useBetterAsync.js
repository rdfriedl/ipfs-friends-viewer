import { useCallback } from "react";
import { useAsync } from "react-use";

export function useBetterAsync(fn, deps = [], enabled = true){
	const wrapper = useCallback(async () => {
		return enabled ? fn() : null;
	}, [fn, enabled]);
	const state = useAsync(wrapper, [...deps, enabled]);

	return { ...state, enabled };
}
