const products = document.querySelectorAll('.product');

if (products.length) {
	products.forEach(product => {
		const imageSwitch = product.querySelector('.image-switch');
		const imageSwitchItems = product.querySelectorAll('.image-switch__item');
		const imagePagination = product.querySelector('.image-pagination');
		const productImage = product.querySelector('.product__image');

		if (!imageSwitch || imageSwitchItems.length <= 1 || !imagePagination || !productImage) return;

		let currentIndex = 0;
		imagePagination.innerHTML = '';

		const setActiveSlide = (index) => {
			currentIndex = index;
			imageSwitchItems.forEach((item, idx) => {
				item.classList.toggle('image-switch__item--active', idx === index);
			});
			imagePagination.querySelectorAll('.image-pagination__item').forEach((dot, idx) => {
				dot.classList.toggle('image-pagination__item--active', idx === index);
			});
		};

		imageSwitchItems.forEach((item, index) => {
			item.setAttribute('data-index', index);
			const paginationItem = document.createElement('li');
			paginationItem.className = `image-pagination__item ${index === 0 ? 'image-pagination__item--active' : ''}`;
			paginationItem.dataset.index = index;
			imagePagination.appendChild(paginationItem);

			item.addEventListener('mouseenter', () => setActiveSlide(index));
			item.addEventListener('focus', () => setActiveSlide(index));
			item.addEventListener('click', (e) => {
				e.preventDefault();
				setActiveSlide(index);
			});
		});

		imagePagination.addEventListener('click', (event) => {
			const target = event.target.closest('.image-pagination__item');
			if (!target) return;
			event.preventDefault();
			setActiveSlide(Number(target.dataset.index));
		});

		productImage.addEventListener('mouseleave', () => setActiveSlide(0));

		let touchStartX = 0;
		let touchStartY = 0;
		let isSwiping = false;

		const touchThreshold = 30;

		const handleTouchStart = (event) => {
			if (event.touches.length !== 1) return;
			touchStartX = event.touches[0].clientX;
			touchStartY = event.touches[0].clientY;
			isSwiping = true;
		};

		const handleTouchMove = (event) => {
			if (!isSwiping) return;
			const diffX = event.touches[0].clientX - touchStartX;
			const diffY = event.touches[0].clientY - touchStartY;

			if (Math.abs(diffX) > Math.abs(diffY)) {
				event.preventDefault();
			}
		};

		const handleTouchEnd = (event) => {
			if (!isSwiping) return;
			const diffX = event.changedTouches[0].clientX - touchStartX;
			const diffY = event.changedTouches[0].clientY - touchStartY;

			if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > touchThreshold) {
				if (diffX < 0 && currentIndex < imageSwitchItems.length - 1) {
					setActiveSlide(currentIndex + 1);
				} else if (diffX > 0 && currentIndex > 0) {
					setActiveSlide(currentIndex - 1);
				}
			}
			isSwiping = false;
		};

		const handleTouchCancel = () => {
			isSwiping = false;
		};

		productImage.addEventListener('touchstart', handleTouchStart, { passive: true });
		productImage.addEventListener('touchmove', handleTouchMove, { passive: false });
		productImage.addEventListener('touchend', handleTouchEnd);
		productImage.addEventListener('touchcancel', handleTouchCancel);

		setActiveSlide(0);
	});
}
