// const map = L.map('map').setView([27.1805801, 31.6902284], 6);
const map = L.map('map', {
	scrollWheelZoom: false,
}).setView([27.1805801, 30.3902284], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
}).addTo(map);

const Stadia_AlidadeSmoothDark = L.tileLayer(
	'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
	{
		maxZoom: 20,
	}
).addTo(map);
//adding marker

const goldIcon = new L.Icon({
	iconUrl:
		'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
	shadowUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const portSaidMarker = L.marker([31.263773, 32.294213], { icon: goldIcon }).addTo(map);
const damittaMarker = L.marker([31.44619, 31.525031], { icon: goldIcon }).addTo(map);
const gizaMarker = L.marker([30.0136, 31.205165], { icon: goldIcon }).addTo(map);
const westDesertMarker = L.marker([29.847369, 26.988741], { icon: goldIcon }).addTo(map);
const atTurMarker = L.marker([28.270677, 33.280803], { icon: goldIcon }).addTo(map);

//add popup message

const portSaidProjects = document.querySelectorAll('.portsaid');
const damiettaProjects = document.querySelectorAll('.damietta');
const gizaProjects = document.querySelectorAll('.cairo');
const westDesertProjects = document.querySelectorAll('.desert');
const atTurProjects = document.querySelectorAll('.sinai');
const myMap = document.querySelector('.myMap');
const closeBtns = document.querySelectorAll('.close');
const nextBtns = document.querySelectorAll('.perimary-btn');
const article = document.querySelector('.article');
const marks = [portSaidMarker, damittaMarker, gizaMarker, westDesertMarker, atTurMarker];
const projects = [
	portSaidProjects,
	damiettaProjects,
	gizaProjects,
	westDesertProjects,
	atTurProjects,
];

let count = 0;
const portCount = document.querySelectorAll('.portsaid-count');
portCount.forEach((counts, index) => {
	counts.textContent = `${count + 1 + index}/${portSaidProjects.length}`;
});
const damiettaCount = document.querySelectorAll('.damietta-count');
damiettaCount.forEach((counts, index) => {
	counts.textContent = `${count + 1 + index}/${damiettaProjects.length}`;
});
const cairoCount = document.querySelectorAll('.cairo-count');
cairoCount.forEach((counts, index) => {
	counts.textContent = `${count + 1 + index}/${gizaProjects.length}`;
});
const desertCount = document.querySelectorAll('.desert-count');
desertCount.forEach((counts, index) => {
	counts.textContent = `${count + 1 + index}/${westDesertProjects.length}`;
});
const sinaiCount = document.querySelectorAll('.sinai-count');
sinaiCount.forEach((counts, index) => {
	counts.textContent = `${count + 1 + index}/${westDesertProjects.length}`;
});

//	Events

marks.forEach((mark, index) => {
	mark.addEventListener('click', () => {
		for (let i = 0; i < projects.length; i++) {
			for (let j = 0; j < projects[i].length; j++) {
				projects[i][j].classList.add('hidden');
			}
		}
		projects[index][0].classList.toggle('hidden');
		count = 0;
	});
});
nextBtns.forEach(nextBtn => {
	nextBtn.addEventListener('click', e => {
		let index;
		if (e.target.classList.contains('port')) {
			index = 0;
			for (let i = 0; i < portSaidProjects.length; i++) {
				projects[index][i].classList.add('hidden');
			}
			if (count < portSaidProjects.length - 1) {
				count++;
			} else {
				count = 0;
			}
		} else if (e.target.classList.contains('dami')) {
			index = 1;
			for (let i = 0; i < damiettaProjects.length; i++) {
				projects[index][i].classList.add('hidden');
			}
			if (count < damiettaProjects.length - 1) {
				count++;
			} else {
				count = 0;
			}
		} else if (e.target.classList.contains('cai')) {
			index = 2;
			for (let i = 0; i < gizaProjects.length; i++) {
				projects[index][i].classList.add('hidden');
			}
			if (count < gizaProjects.length - 1) {
				count++;
			} else {
				count = 0;
			}
		} else if (e.target.classList.contains('des')) {
			index = 3;
			for (let i = 0; i < westDesertProjects.length; i++) {
				projects[index][i].classList.add('hidden');
			}
			if (count < westDesertProjects.length - 1) {
				count++;
			} else {
				count = 0;
			}
		} else if (e.target.classList.contains('sina')) {
			index = 4;
			for (let i = 0; i < atTurProjects.length; i++) {
				projects[index][i].classList.add('hidden');
			}
			if (count < atTurProjects.length - 1) {
				count++;
			} else {
				count = 0;
			}
		}
		projects[index][count].classList.remove('hidden');
	});
});

closeBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		for (let i = 0; i < projects.length; i++) {
			for (let j = 0; j < projects[i].length; j++) {
				projects[i][j].classList.add('hidden');
			}
		}
	});
});
