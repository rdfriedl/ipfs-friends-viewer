import { useEffect, useState } from "react";

export function useObjectUrl(object?: Blob) {
	const [url, setUrl] = useState<string | undefined>();

	useEffect(() => {
		if (object) {
			const url = URL.createObjectURL(object);
			setUrl(url);
		}
		else {
			setUrl(undefined);
		}

		return () => {
			url && URL.revokeObjectURL(url);
		};
	}, [object, setUrl]);

	return url;
}
