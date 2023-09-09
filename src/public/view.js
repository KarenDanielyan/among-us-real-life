// Get a reference to the user list container
const userListContainer = document.getElementById('user-list');

// Connect to the server with Socket.io
const socket = io({
	query: {
		role: 'VIEWER'
	}
});

// Function to add a user to the list
function addUserToUserList(username, role) {
	const userListItem = document.createElement('div');
	userListItem.id = 'user-list-item';
	userListItem.textContent = `${username} - ${role}`;
	userListContainer.appendChild(userListItem);
}

// Listen for an event that provides the list of users and their roles
socket.on('user-list', userListData => {
	// Clear the existing list
	userListContainer.innerHTML = '';

	// Iterate through the user list data and add users to the list
	userListData.forEach(({ username, role }) => {
		addUserToUserList(username, role);
	});
});
