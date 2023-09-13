const socket = io({
	query: {
		role: 'ADMIN'
	}
});

const startGame$ = document.querySelector('#start-game');
const impostorsInput = document.getElementById('impostor');
const setImpostorsButton = document.getElementById('impostor-button');
const player = document.getElementById('players');

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