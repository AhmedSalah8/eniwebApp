const link = $('.pagination__link');
link.on('click', function () {
	link.removeClass('is_active');
	$(this).addClass('is_active');
});

const historyContainers = document.querySelectorAll('.egypt-history-container');
const paginationBullets = document.querySelectorAll('.pagination__link');

paginationBullets.forEach(bullet => {
	bullet.addEventListener('click', () => {
		$(`.history-${bullet.textContent}`).removeClass('toggle-transition');
		if (bullet.textContent == 1) {
			$(`.history-2`).addClass('toggle-transition');
		} else {
			$(`.history-1`).addClass('toggle-transition');
		}
	});
});

const screenWidth = window.screen.width;
function slideNumbers() {
	let n;
	if (screenWidth >= 1200) {
		n = 4;
	} else if (screenWidth >= 769) {
		n = 3;
	} else if (screenWidth >= 460) {
		n = 2;
	} else {
		n = 1;
	}
	return n;
}
const swiper = new Swiper('.mySwiper', {
	slidesPerView: slideNumbers(),
	spaceBetween: 30,
	// slidesPerGroup: slideNumbers(),
	loop: true,
	loopFillGroupWithBlank: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
