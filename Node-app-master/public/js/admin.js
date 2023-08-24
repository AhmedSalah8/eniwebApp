const btns = document.querySelectorAll('.delete-btn');
btns.forEach(btn => {
	btn.addEventListener('click', () => {
		const projId = btn.parentNode.querySelector('[name=projectId]').value;
		const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
		const projectElement = btn.closest('article');
		fetch(`/admin/project/${projId}`, {
			method: 'DELETE',
			headers: {
				'csrf-token': csrf,
			},
		})
			.then(result => {
				return result.json();
			})
			.then(data => {
				projectElement.parentNode.removeChild(projectElement);
			})
			.catch(err => {
				console.log(err);
			});
	});
});

function cityCheck(opt) {
	if (opt.value != 'sustainability' && opt.value != 'business') {
		document.querySelector('.area').style.display = 'block';
	} else {
		document.querySelector('.area').style.display = 'none';
	}
}
