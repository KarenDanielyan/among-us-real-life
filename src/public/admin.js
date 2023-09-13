const socket = io({
	query: {
		role: 'ADMIN'
	}
});

const startGame$ = document.querySelector('#start-game');
const impostorsInput = document.getElementById('impostor');
const setImpostorsButton = document.getElementById('impostor-button');
const player = document.getElementById('players');

const TASKS = [
	"1. There is a mouse missing in C2R5S1, find and place it, where it’s supposed to be",
	"2. The monitors are turned around in C2R9, make sure all of them are placed right",
	"3. A chair is missing in C1R2S2, find and place it where it is supposed to be",
	"4. Fix the keyboards in C2R4",
	"5. Place the rag that is on C1R1S2 in its right place (on the empty table)",
	"6. Place the rag that is on C2R1S2 in its right place (on the empty table)",
	"7. Fix the keyboards in C1R3",
	"8. The monitors are turned around in C1R1, make sure all of them are placed right",
	"9. There is a white chess knight next to the keyboard in C2R5S4, find and place it on the chess rug",
	"10. There is a black chess queen in C2R10, find and place it on the chess rug",
	"11. There is a cleaning substance next to C1R1S2, place it in its right place(on the empty table)",
	"12. There is a cleaning substance next to C2R1S2, place it in its right place(on the empty table)",
	"13. There is a black chess king next to the microwave, find and place it on the chess rug",
	"14. Close the microwaves door",
	"15. There is a black chess bishop in the fridge, find and place it on the chess rug",
	"16. There is a white chess bishop in the freezer, find and place it on the chess rug",
	"17. There is a black chess pawn in the first cupboard",
	"18. There is a white chess pawn in the second cupboard",
	"19. The lockers are open, close them",
	"20. The napkins on the kitchen table are missing, find and place them",
	"21. There is white chess pawn under the kitchen table, find and place it on the chess rug",
	"22. The macs in C2R12 are disconnected from the electricity, turn them on",
	"23. The macs in C1R1 are disconnected from the electricity, turn them on",
	"24. The stove is empty, fill it with water",
	"25. The blue sofa is rotated, make sure it is placed right",
	"26. Find the blue armchairs pillow",
	"27. Fold the chairs and place them where they are supposed to be",
	"28. Place two armchairs under the whiteboard on the 0 floor",
	"29. There is a black chess pawn in C2R1S1, find and place it on the chess rug",
	"30. There is a black chess pawn in C1R1S2, find and place it on the chess rug",
	"31. Find the black chess rook on the road to the 2 floor and place it on the chess rug",
	"32. Find the white chess pawn on the road to the 2 floor and place it on the chess rug",
	"33. There is a white chess rook in the microwave, find and place it on the chess rug",
	"34. There is a black chess king on the red fire box, find and place it on the chess rug",
	"35. There is a white chess king on one of the whiteboards, find and place it on the chess rug",
	"36. Find the balls in the first floor and place them next to the staffs room",
	"37. Find the white chess knight on the road to the 1 floor and place it on the chess rug",
	"38. The tables in the incubation room are irregularly placed, place them in the corner, under the window",
	"39. The napkin in the incubation room is missing, find and place it on the table",
	"40. Find the white pawn in the third cupboard and place it on the chess rug",
	"41. Find the books and place them into the safe",
	"42. There is a black chess knight in the safe, find and place it on the chess rug",
	"43. There is a black chess pawn in the safe, find and place it on the chess rug",
	"44. The flowers in the kitchen are missing, find and place them on the table",
	"45. There is a white chess bishop on one of the shelfs, find and place it on the chess rug",
	"46. Write a code on C, that prints “Hello world!” on the whiteboard in the incubation room",
	"47. Solve the problem on the whiteboard (next to TV)",
	"48. Solve the problem on the whiteboard (next to water fountain)",
	"49. There is a white chess pawn on the water fountain, find and place it on the chess rug",
	"50. Fix the hangers near incubation room and place them in the corner"
];

const ul = document.getElementById("tasks");
console.log(ul);

for (const t of TASKS) {
		const task$ = document.createElement('li');
		const label$ = document.createElement('label');

		const checkbox$ = document.createElement('input');
		checkbox$.type = 'checkbox';
		label$.appendChild(checkbox$);
		label$.appendChild(document.createTextNode(t));

		task$.appendChild(label$);
		ul.appendChild(task$);
}

startGame$.addEventListener('click', () => {
	socket.emit('start-game');
});

setImpostorsButton.addEventListener('click', () => {
	const nImpostors = parseInt(impostorsInput.value);
	localStorage.setItem('impostors', nImpostors);
	socket.emit('set-impostors', nImpostors);
});

window.onload = () => {
	const savedImpostors = localStorage.getItem('impostors');
	if (savedImpostors) {
		impostorsInput.value = savedImpostors;
	}
};

window.onunload = () => {
	socket.emit('disconnect');
}

/**
 * Sounds
 */

async function wait(milliseconds) {
	await new Promise(resolve => {
		setTimeout(() => resolve(), milliseconds);
	});
}

const SOUNDS = {
	meeting: new Audio('/sounds/meeting.mp3'),
	sabotage: new Audio('/sounds/sabotage.mp3'),
	start: new Audio('/sounds/start.mp3'),
	sussyBoy: new Audio('/sounds/sussy-boy.mp3'),
	voteResult: new Audio('/sounds/vote-result.mp3'),
	youLose: new Audio('/sounds/you-lose.mp3'),
	youWin: new Audio('/sounds/you-win.mp3')
};

socket.on('play-meeting', async () => {
	await SOUNDS.meeting.play();
	await wait(2000);
	await SOUNDS.sussyBoy.play();
});

socket.on('play-win', async () => {
	await SOUNDS.youWin.play();
});

socket.on('player-change', nplayer => {
	player.value = nplayer;
});

socket.on('show-tasks', () => {

});