export default function shuffle<T>(items: T[]) {
	const result = [...items];
	let currentIndex = result.length;
	let temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = result[currentIndex];
		result[currentIndex] = result[randomIndex];
		result[randomIndex] = temporaryValue;
	}
	return result;
}
