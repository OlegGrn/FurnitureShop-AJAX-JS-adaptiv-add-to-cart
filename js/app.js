function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});


// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
//! Общие функции
//* Разделение числа на разряды 
// переменная х - это вид разделителя. Писать в виде строки, например "." точка " " пробел и т.д.
// Пример: let test = 12345; console.log(test.toDivide(".")) 12.345 *****
Number.prototype.toDivide = function (x) {
	let int = String(Math.trunc(this));
	if (int.length <= 3) return int;
	let space = 0;
	let number = '';

	for (let i = int.length - 1; i >= 0; i--) {
		if (space == 3) {
			number = x + number;
			space = 0;
		}
		number = int.charAt(i) + number;
		space++;
	}

	return number;
}
//============================================================


function addActive(...args) {
	for (let arg of args) arg.classList.add("_active");
}
function removeActive(...args) {
	for (let arg of args) arg.classList.remove("_active");
}

function toggleActive(...args) {
	for (let arg of args) arg.classList.toggle("_active");
}


function addPading(arr) {

	let wrapper = document.querySelector(".wrapper");
	let body = document.querySelector("body");


	let lockPaddingValue = window.innerWidth - wrapper.offsetWidth + 'px';//вычисляем ширину скрола
	body.style.paddingRight = lockPaddingValue;// добавляем падинг body,  устраняем дергание экрана при body.style: overflow: hidden

	// добавляем падинг элементам массива arr, если есть необходимость (обычно это в header)
	if (arr.length > 0) {
		for (let el of arr) el.style.paddingRight = lockPaddingValue;
	}
}


function removePading(arr) {
	let body = document.querySelector("body");

	body.style.paddingRight = '0px';//удаляем паддинг, устраняем дергание экрана при body.style: overflow: hidden;

	// удаляем добавленный падинг элементам массива  arr, если есть необходимость
	if (arr.length > 0) {
		for (let el of arr) el.style.paddingRight = '0px';
	}
}

function addClassName(className, ...el) {
	for (let e of el) e.classList.add(className);
}

function removeClassName(className, ...el) {
	for (let e of el) e.classList.remove(className);
}

function toggleClassName(className, ...el) {
	for (let e of el) e.classList.toggle(className);
}


//?==== SlideToggle  =======================================================================================

//SlideToggle  if () {
//  _slideToggle(elem) 
// } 
//========================================================================

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}

let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//? Проверка устройства ======================
let isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};
//!***********************************************************************************************

//открываем по клику и закрываем по клику вне элемента
document.addEventListener("DOMContentLoaded", () => {


	document.addEventListener("click", (e) => {
		let elTarget = e.target;
		let searchIcon = document.querySelector(".search-form__icon");
		//let searchBtn = document.querySelector(".search-form__btn");

		//* переменные для активации бургера
		const burger = document.querySelector(".burger");
		const body = document.querySelector("body");
		const menuBody = document.querySelector(".menu__body");
		//const menuItem = document.querySelector(".menu__item");

		//* переменные для "при клике на content-product активируем cart-product__hover"
		const arrContentProduct = document.querySelectorAll(".content-product");

		//* открываем подменю в шапке на устройствах по клику (без ховера)
		if (isMobile.any() && window.innerWidth > 768) {
			if (elTarget.closest(".menu__item")) {
				elTarget.closest(".menu__item").classList.toggle("_hover");
			} else if (document.querySelectorAll("._hover").length > 0) {
				document.querySelectorAll("._hover").forEach(item => {
					item.classList.remove("_hover");
				})
			}
		}

		//*открытие строки поиска при ширине max-width: $md3
		if (elTarget.closest('.search-form__icon')) {
			searchIcon.classList.add("_active");
			searchIcon.parentElement.classList.add("_active");
		} else if (elTarget.closest('.search-form__btn') || !elTarget.closest('.search-form__input')) {
			searchIcon.classList.remove("_active");
			searchIcon.parentElement.classList.remove("_active");

		}

		//* активируем бургер
		if (elTarget.closest(".burger")) {
			toggleActive(burger, menuBody, body);
		} else if (!elTarget.closest(".menu__item")) {
			removeActive(burger, menuBody, body);
		}


		//* при клике на content-product активируем cart-product__hover на
		//* устройствах без мышки
		if (arrContentProduct.length > 0 && isMobile.any()) {
			if (elTarget.closest(".content-product") &&
				elTarget.closest(".content-product").classList.contains("_active")) {
				removeActive(elTarget.closest(".content-product"))
			} else if (elTarget.closest(".content-product")) {
				arrContentProduct.forEach(item => {
					removeActive(item);
				})
				addActive(elTarget.closest(".content-product"));
			} else {
				arrContentProduct.forEach(item => {
					removeActive(item);
				})
			}
		}

		//* ловим клик для AJAX
		if (e.target.classList.contains('products__link')) {
			getProducts(e.target); // ищи далее в AJAX
			e.preventDefault();
		}
	});

	//* прячем меню при скролле
	const hideMenu = function (entries) {
		entries.forEach((entry) => {
			const { target, isIntersecting } = entry; // получаем свойства, которые доступны в объекте entry
			if (isIntersecting) {
				target.classList.remove('_scroll');
			} else {
				target.classList.add('_scroll');// удаляем класс, когда элемент из неё выходит  
			}
		})
	}

	const headerObserver = new IntersectionObserver(hideMenu);
	headerObserver.observe(document.querySelector(".header"));
	//==================================================================

	//* вставляем номер слайда в слайд
	let sliderRooms = document.querySelector(".slider-rooms__body");
	if (sliderRooms) {
		let arrSlyde = sliderRooms.querySelectorAll(".slyde-room");
		arrSlyde.forEach((item, index, arr) => {
			let number = index + 1;
			let elNum = item.querySelector(".cart-slyde-room__number");
			let allNum = arr.length;
			//let atributNum = item.getAttribute('data-swiper-slide-index');

			elNum.innerHTML = "0" + number + " /" + " 0" + allNum;
		})
	}

	//* двигаем блок против движения мыши
	const furniture = document.querySelector('.furniture__body');
	if (furniture && !isMobile.any()) {
		const furnitureItems = document.querySelector('.furniture__row');
		const furnitureColumn = document.querySelectorAll('.furniture__item');

		//скорость анимации из атрибута в html
		const speed = furniture.dataset.speed;

		//переменные позиций
		let positionX = 0;
		let coordXprocent = 0;

		function setMouseGalleryStyle() {
			let funitureItemsWidth = 0;
			furnitureColumn.forEach(item => {
				funitureItemsWidth += item.offsetWidth;
			});

			const furnitureDifferent = funitureItemsWidth - furniture.offsetWidth;
			const distX = Math.floor(coordXprocent - positionX);

			positionX = positionX + (distX * speed);
			let position = furnitureDifferent / 200 * positionX;

			furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

			if (Math.abs(distX) > 0) {
				requestAnimationFrame(setMouseGalleryStyle);
			} else {
				furniture.classList.remove('_init');
			}
		}

		furniture.addEventListener("mousemove", function (e) {
			// получаем значение ширины
			const furnitureWidth = furniture.offsetWidth;

			// ноль по середине
			const coordX = e.pageX - furnitureWidth / 2;

			//получаем проценты
			coordXprocent = coordX / furnitureWidth * 200;

			if (!furniture.classList.contains('_init')) {
				requestAnimationFrame(setMouseGalleryStyle);
				furniture.classList.add('_init');
			}
		})
	}
});








const spollersArray = document.querySelectorAll("[data-spollers]");

if (spollersArray.length > 0) {
	//получение обычных спойллеров
	const spollersRegular = Array.from(spollersArray).filter(item => !item.dataset.spollers.split(",")[0]);
	// инициализация обычных спойллеров
	if (spollersRegular.length > 0) initSpollers(spollersRegular);

	//получение спойллеров c медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(item => item.dataset.spollers.split(",")[0]);
	// инициализация спойллеров c медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = []; // массив объектов с полной инфой по медиа запросам (тип, число, элемент)
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// получаем уникальные медиа запросы без повторений из собранного breakpointsArray 
		let midiaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + '-width:' + item.value + 'px),' + item.value + ',' + item.type;
		});
		let setmidiaQueries = new Set(midiaQueries);// Set особый вид коллекции без повторений		
		midiaQueries = Array.from(setmidiaQueries);// массив уникальных значений из Set
		// например  ['(min-width:650px),650,min', '(max-width:800px),800,max']

		// работа с каждым уникальным значением массива midiaQueries
		midiaQueries.forEach(item => {
			const paramsArray = item.split(",");
			const mediaValue = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// собираем массив объектов (спойлеров) с нужными условиями
			const spollersArr = breakpointsArray.filter(item => {
				if (item.value == mediaValue && item.type == mediaType) {
					return true;
				}
			});

			// вешаем обработчик на массив спойллеров по медиазапросу
			matchMedia.addListener(function () {
				initSpollers(spollersArr, matchMedia)

			});
			initSpollers(spollersArr, matchMedia);
		});
	}
}


function initSpollers(arr, mql = false) {
	arr.forEach(spollersBlock => {
		spollersBlock = mql ? spollersBlock.item : spollersBlock;
		if (mql.matches || !mql) {
			spollersBlock.classList.add('_init');
			initSpollerBody(spollersBlock);
			spollersBlock.addEventListener("click", setSpollerAction);
		} else {
			spollersBlock.classList.remove('_init');
			initSpollerBody(spollersBlock, false);
			spollersBlock.removeEventListener("click", setSpollerAction);
		}
	});
}

function initSpollerBody(block, hide = true) {
	const allSpolerTitles = block.querySelectorAll("[data-spoller]");
	if (allSpolerTitles.length > 0) {
		allSpolerTitles.forEach(title => {
			if (hide) {
				title.removeAttribute("tabindex");
				if (!title.classList.contains("_active")) {
					title.nextElementSibling.hidden = true;
				}
			} else {
				title.setAttribute("tabindex", "-1");
				title.nextElementSibling.hidden = false;
			}
		})
	}

}

function setSpollerAction(e) {
	const el = e.target;
	if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
		const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
		const spollerBlock = spollerTitle.closest('[data-spollers]');
		const oneSpoller = spollerBlock.hasAttribute('data-one-spoller') ? true : false;
		if (!spollerBlock.querySelectorAll('._slide').length) {

			if (oneSpoller && !spollerTitle.classList.contains('_active')) {
				hideSpollerBody(spollerBlock);
			}
			spollerTitle.classList.toggle("_active");
			_slideToggle(spollerTitle.nextElementSibling, 500);
		}
		e.preventDefault();
	}
}

function hideSpollerBody(block) {
	const spollerActiveTitle = block.querySelector('[data-spoller]._active');
	if (spollerActiveTitle) {
		spollerActiveTitle.classList.remove('_active');
		_slideUp(spollerActiveTitle.nextElementSibling, 500);
	}
}
//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('lightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}


function sliders_bild_callback(params) { }

let mainslider = new Swiper('.main-slider__body', {

	observer: true,
	observeParents: true,
	/*количество слайдов на просмотре*/
	slidesPerView: 1,
	spaceBetween: 0,
	//autoHeight: true,
	speed: 800,
	//loop: true,
	spaceBetween: 30,
	parallax: true,

	// Dotts
	pagination: {
		el: '.control-main__bullets',
		clickable: true,
	},
	//Arrows
	navigation: {
		nextEl: '.control-main__arows .control-main__arow_next',
		prevEl: '.control-main__arows .control-main__arow_prew',
	},

});

let sliderRooms = new Swiper('.slider-rooms__body', {

	observer: true,
	observeParents: true,
	/*количество слайдов на просмотре*/
	slidesPerView: 'auto',

	//autoHeight: true,
	speed: 800,
	//loop: true,
	spaceBetween: 24,
	//parallax: true,

	// Dotts
	pagination: {
		el: '.slider-rooms__dots',
		clickable: true,

	},
	//Arrows
	navigation: {
		nextEl: '.slider-rooms__arrows .slider-rooms__arrow_next',
		prevEl: '.slider-rooms__arrows .slider-rooms__arrow_prev',
	},


});

let sliderTips = new Swiper('.slider-tips__body', {

	observer: true,
	observeParents: true,
	/*количество слайдов на просмотре*/
	slidesPerView: 3,

	centeredSlides: true,

	//autoHeight: true,
	speed: 800,
	loop: true,
	spaceBetween: 32,
	//parallax: true,

	// Dotts
	pagination: {
		el: '.slider-tips__dots',
		clickable: true,

	},


	//Arrows
	navigation: {
		nextEl: '.slider-tips__arrow_next',
		prevEl: '.slider-tips__arrow_prev',
	},

	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 3,


		},
		600: {
			slidesPerView: 2,
			spaceBetween: 16,

		},

		1024: {
			slidesPerView: 3,
			spaceBetween: 32,

		},
	},

});


document.addEventListener("DOMContentLoaded", () => {

	//* для корзины - проверка товаров в корзине	
	function choseBasket() {
		let block = document.querySelector(".basket-header");
		let allItem = block.querySelectorAll(".choosing-list__item");
		let cartCount = block.querySelector(".cart-count");// спат счетчика корзины

		if (allItem.length > 0) {
			if (!cartCount.classList.contains('cart-count__full')) {
				addClassName('cart-count__full', cartCount)// добавили класс спану в корзине
			}
			cartCount.innerHTML = allItem.length; // добавляем колличесвто в счетчик
		} else {
			if (cartCount.classList.contains('cart-count__full')) {
				removeClassName('cart-count__full', cartCount)// удалили класс спана в корзине
			}
		}
	}

	//*клонирования и наложение поверх оригинала 
	function cloneItem(item) {
		let fotoItem = item.querySelector(".cart-product__foto");//ищем фото лля клонирования
		//размер и координаты фотки лля клонирования:
		let placeFotoItem = fotoItem.getBoundingClientRect();
		let leftPlaceFotoItem = placeFotoItem.left;
		let topPlaceFotoItem = placeFotoItem.top;
		let widthFotoItem = placeFotoItem.width;
		let heightFotoItem = placeFotoItem.height;

		let cloneFotoItem = fotoItem.cloneNode(true);// клонируем фотографию
		cloneFotoItem.className = "cart-product__clone-foto _ibg";// меняем класс клона
		// для клона устанавливаем высоту/ширину и вставляем клон поверх исходной фотки:
		cloneFotoItem.style.left = leftPlaceFotoItem + "px";
		cloneFotoItem.style.top = topPlaceFotoItem + "px";
		cloneFotoItem.style.width = widthFotoItem + "px";
		cloneFotoItem.style.height = heightFotoItem + "px";
		cloneFotoItem.style.opacity = 1;
		cloneFotoItem.style.zIndex = 5;
		cloneFotoItem.style.position = 'fixed';
		cloneFotoItem.style.display = 'block';
		cloneFotoItem.style.pointerEvents = 'none';

		document.body.append(cloneFotoItem); // вставляем клон в документ

		return cloneFotoItem;
	}

	//* перемещаем клон в корзину и удаляем из документа
	function moveCloneToBascet(clone) {
		// точка куда нужно переместить
		let placeEnd = document.querySelector('.basket-header__icon');
		let top = placeEnd.getBoundingClientRect().top;
		let right = placeEnd.getBoundingClientRect().right;

		clone.style.left = right + "px";
		clone.style.top = top + 'px';
		clone.style.width = '0px';
		clone.style.height = '0px';
		clone.style.opacity = 0;

		setTimeout(() => {
			clone.remove();
		}, 1000)
	}

	//* для корзины - удаляет товар из корзины
	function removeItemFromCart(target) {
		let item = target.closest(".choosing-list__item");
		let checkoutValue = document.querySelector('.checkout__value');
		let priceItem = item.querySelector(".choosing-list__price-new").innerHTML;
		let arrItem = document.querySelectorAll(".choosing-list__item");
		let basketBody = document.querySelector(".basket-header__body");
		let elIconBasket = document.querySelector(".basket-header__icon");



		let numberPriceItem = strPriceToNumber(priceItem); // получаем числовое значение цены из строки
		let totalPrice = totalPriceBasket.del(numberPriceItem);// считаем корзину
		checkoutValue.innerHTML = totalPrice.toDivide(".");// добаваляем общую цифру в HTML c метотодом преобразущем
		// внешний вид числа (его разрядности)

		if (arrItem.length > 1) {
			_slideUp(item, 300);
			setTimeout(() => {
				item.remove();
				choseBasket();
			}, 300);
		} else {
			_slideUp(basketBody);
			basketBody.addEventListener('transitionstart', () => {
				removeClassName('_open_cart', basketBody, elIconBasket);
			})
			setTimeout(() => {
				item.remove();
				choseBasket();
			}, 300);
		}
	}

	//* для корзины - добавляет товар в корзину
	function addItemCart(item) {
		let basketBody = document.querySelector(".basket-header__body");
		let srcImg = item.querySelector("._choose_img").getAttribute("src");
		let nameItem = item.querySelector(".content-product__name").innerHTML;
		let priceItem = item.querySelector(".content-product__price_new").innerHTML;
		let choosingList = basketBody.querySelector(".choosing-list");
		let checkoutValue = document.querySelector('.checkout__value');

		let cloneFotoItem = cloneItem(item);// создаем клон		
		moveCloneToBascet(cloneFotoItem);// перемещаем клон в корзину

		choosingList.insertAdjacentHTML("beforeend", `	
		  <li class="choosing-list__item">
		  <a href="#" class="choosing-list__foto  _ibg">
			<img src="${srcImg}" alt="foto" class="_ibg__foto">
		  </a>
		  <p class="choosing-list__name">${nameItem}</p>
		   <p class="choosing-list__price-new">${priceItem}</p>
		   <button class="choosing-list__btn"><span class="choosing-list__close">Delete</span></button>
		   </li>`
		)

		let numberPriceItem = strPriceToNumber(priceItem); // получаем числовое значение цены из строки	
		let totalPrice = totalPriceBasket.add(numberPriceItem);// считаем корзину
		checkoutValue.innerHTML = totalPrice.toDivide('.');// добаваляем общую цифру в HTML

		//получаем последний элемент в корзине
		let allCretItem = choosingList.querySelectorAll(".choosing-list__item");
		let lastCretItem = allCretItem[allCretItem.length - 1];
		_slideDown(lastCretItem, 300);//плавно открываем последний элемент в корзине		
		choseBasket();// перепроверяем коризину
	}

	//* получаем числовое значение цены из строки
	function strPriceToNumber(priceItem) {
		// преобразуем в массив . убираем точку из массива . получаем обратно строку и преобразуем в число
		let risult = +priceItem.split('').filter(item => item >= 0).join('');
		return risult;
	}

	//* счетчик для общей цены в корзине
	function counterBasket() {
		let price = 0;
		let counter = {
			add(value) {
				price += value;
				return price;
			},
			del(value) {
				price -= value;
				return price;
			}
		}
		return counter;
	}
	let totalPriceBasket = counterBasket();
	//================================================================


	//*активируем корзину при клике на товар
	document.addEventListener("click", (e) => {

		let elTarget = e.target;
		let basketBody = document.querySelector(".basket-header__body");
		let btnClick = e.target.classList.contains("cart-product__btn"); // true || false  - клик по кнопке в товаре
		let iconBasket = e.target.classList.contains("basket-header__icon"); // true || false  - клик по иконке корзины
		let removeItem = e.target.classList.contains("choosing-list__close"); // true || false  - клик по крестику удаления товара
		let productsItem = e.target.closest(".products__item"); // карочка товара
		let choosingList = basketBody.querySelector(".choosing-list");
		let elIconBasket = document.querySelector(".basket-header__icon");

		//*-------------------------------------------------------
		if (btnClick) {

			addItemCart(productsItem);//добавляет товар в корзину

			// if (!productsItem.classList.contains('_add_to_cart')) {

			// 	addItemCart(productsItem);//добавляет товар в корзину
			// }
		}
		//*-------------------------------------------------------
		if (iconBasket && choosingList.querySelectorAll(".choosing-list__item").length > 0 &&
			!basketBody.classList.contains("_open_cart")) {

			_slideDown(basketBody, 400);
			// отслеживает заершение/начало свойства transition
			basketBody.addEventListener('transitionstart', () => {
				addClassName('_open_cart', basketBody, elIconBasket);

			})

		} else if (iconBasket && choosingList.querySelectorAll(".choosing-list__item").length > 0 &&
			basketBody.classList.contains("_open_cart")) {

			_slideUp(basketBody, 400);
			basketBody.addEventListener('transitionstart', () => {
				removeClassName('_open_cart', basketBody, elIconBasket);
			})

		} else if ((!e.target.closest(".basket-header__body") && basketBody.classList.contains('_open_cart')) &&
			!e.target.closest(".cart-product__btn")) {

			_slideUp(basketBody, 400);
			basketBody.addEventListener('transitionstart', () => {
				removeClassName('_open_cart', basketBody, elIconBasket);
			})
		}
		//*-------------------------------------------------------
		if (removeItem) {
			removeItemFromCart(elTarget);
		}
		//*-------------------------------------------------------
		if (elTarget.classList.contains("checkout__link")) {

			_slideUp(basketBody, 400);
			basketBody.addEventListener('transitionstart', () => {
				removeClassName('_open_cart', basketBody, elIconBasket);
			})
		}
		//*-------------------------------------------------------

	})
});


document.addEventListener("DOMContentLoaded", () => {

	document.addEventListener("click", (e) => {
		let productsItem = e.target.closest(".products__item"); // карочка товара
		let wishHeader = document.querySelector('.wish-header');


		//*---------------------------
		if (e.target.classList.contains("cart-product__link-icon") && !(e.target.closest('._chose-item'))
			&& !e.target.classList.contains('_lock_item')) {

			addClassName('_chose-item', productsItem);
			addItemWish(productsItem);

		} else if (e.target.classList.contains("wish-list__btn")) {
			deletiItemWish(e.target);

		} else if (e.target.classList.contains('wish-header__icon')) {

			if (document.querySelector('.wish-count__full') && !wishHeader.classList.contains("_open_wish")) {
				addClassName('_open_wish', wishHeader)

			} else if (document.querySelector('.wish-count__full') && wishHeader.classList.contains("_open_wish")) {
				removeClassName("_open_wish", wishHeader)
			}
		} else if (e.target.classList.contains("cart-product__link-icon") && !e.target.closest('._lock_item')) {

			addClassName('_lock_item', e.target);//!защита ложных нажатий
			deletiItemWish(e.target);

		}
		//*---------------------------
		if (!e.target.closest('.wish-header') && !e.target.closest('.cart-product__link-icon')) {

			removeClassName("_open_wish", wishHeader);


		}


	});

	//============================================================================
	//*стчечик и проверка корзины (листа желаний)
	function chooseWish() {
		let span = document.querySelector(".wish-count");
		let quolity = 0;

		let counter = {
			add() {
				choose(++quolity);
				span.innerHTML = quolity;
				return quolity;
			},
			del() {
				choose(--quolity);
				span.innerHTML = quolity;
			}
		}
		function choose(i) {
			if (i === 0) {
				if (!span.classList.contains("wish-count__full")) {
					return
				} else {
					removeClassName('_open_wish', document.querySelector('.wish-header'));
					removeClassName("wish-count__full", span)
				}

			} else if (i > 0) {
				if (span.classList.contains("wish-count__full")) {
					return
				} else addClassName("wish-count__full", span)

			} else return
		}
		return counter;
	}
	let counterWish = chooseWish();
	//============================================================================


	//*удалаяем товар из корзины желний 
	function deletiItemWish(el) {
		let item;
		let lincIcon;
		if (el.classList.contains('wish-list__btn')) {
			item = el.closest('.wish-list__item')

		} else if (el.closest('.cart-product__link-icon')) {
			let productsItem = el.closest('.products__item ');
			let numWish = productsItem.getAttribute('wish');
			item = document.querySelector(`[num = '${numWish}']`);
			lincIcon = el;
		}

		let numItem = item.getAttribute('num');
		let wishNum = document.querySelector(`[wish = '${numItem}']`);// получаем элемент по атрибуту для удаления класса


		//удаление через анимацию в CSS  (минус этого - надо знать высоту удаляемого, она задана в анимации)
		addClassName("wish-list__del", item);//добавляем класс для активации анимации
		// слушатель анимации - по ее концу будет удаление элемента
		item.addEventListener('animationend', () => {
			item.remove();
			removeClassName('_chose-item', wishNum);
			wishNum.removeAttribute('wish');
			if (lincIcon) removeClassName('_lock_item', lincIcon);

			counterWish.del();// уменьшаем счетчик


		});

		//counterWish.del();// уменьшаем счетчик
	}

	//* добавляем товар в корзину желаний item = products__item
	function addItemWish(item) {
		let nameItem = item.querySelector(".content-product__name").innerHTML;
		let textItem = item.querySelector(".content-product__midl-text").innerHTML;
		let srcImg = item.querySelector(".cart-product__foto img").getAttribute("src");

		counterWish.add();
		let indexItem = numItemWish(); //увеличиваем счетчик + получаем уникальный индекс

		document.querySelector(".wish-list").insertAdjacentHTML('beforeend', `
		<li class="wish-list__item" num='${indexItem}'>
		<button type="button" class="wish-list__btn">Delete</button>
		<p class="wish-list__name">${nameItem}</p>
		<a href="#" class="wish-list__foto _ibg">
			<img src="${srcImg}" alt="foto" class="_ibg__foto">
		</a>
		<p class="wish-list__text">${textItem}</p>
	   </li>`);

		item.setAttribute(`wish`, `${indexItem}`);// устанавливаем атрибут с индексом (для связки эл и корзины)
	}

	//*счетчик присваивания уникальных номеров товaрам
	function counter() {
		let num = 0;
		return function () {
			num++;
			return num;
		}
	}
	let numItemWish = counter();
	//===================================================================

});

//*навороченная функция схлопывания элемента до нуля
	// удаление через JS анимамцию
	// let heightItem = item.offsetHeight;// высота удаляемого элемента
	// let start = Date.now(); // запомнить время начала

	// let timer = setInterval(() => {
	// 	// сколько времени прошло с начала анимации?
	// 	let timePassed = Date.now() - start;

	// 	if (timePassed >= 200) {
	// 		clearInterval(timer); //закончить анимацию через 3 секунды
	// 		return
	// 	}
	// 	delet(timePassed, heightItem);
	// }, 20);

	// // item.remove();

	// function delet(time, height) {

	// 	// let k = 200 / (height);
	// 	// item.style.height = (height - time / k) + "px";

	// 	item.style.height = Math.ceil(heightItem + time / 5) + "px";


	// }
// клик по кнопке для начала скрипта в файлу scripts.js

async function getProducts(target) {
	if (!target.classList.contains('_hold')) {
		addClassName("_hold", target);

		const file = "json/products.json"; 
		//const file = "https://github.com/OlegGrn/test_Funiture/blob/1b31576ff5c247fd78419a103f7860427a2b7fcb/json/products.json";




		let response = await fetch(file, {
			method: "GET"
		});
		if (response.ok) {
			let risult = await response.json();
			loadProducts(risult);
			removeClassName("_hold", target);

		} else {
			alert("Ошибка загрузки");
			removeClassName("_hold", target);
		}
	}

}

function loadProducts(risult) {

	risult.products.forEach(item => {
		const productUrl = item.url;
		const productTitle = item.title;
		const productText = item.text;
		const productlabels = item.labels;
		const productImage = item.image;
		const productPrice = item.price;
		const productShareUrl = item.shareUrl;

		let cart = ''; //! куда будет собираться карточка товара
		//! 1
		let cartStart = '<div style = "opacity: 0;" class="products__item _load_new-item"><div class="cart-product">';
		//! 2
		let cartLabel = '';
		if (productlabels) {
			let cartLabelStart = '<div class="cart-product__label label-product">';
			let cartLabelEnd = '</div>';
			let cartLabelBody = '';

			productlabels.forEach(item => {
				let oneLabel = `<a href="#" class="label-product__${item.type}"><span>${item.value}</span></a>`;
				cartLabelBody = cartLabelBody + oneLabel;
			});
			cartLabel = cartLabel + cartLabelStart;
			cartLabel = cartLabel + cartLabelBody;
			cartLabel = cartLabel + cartLabelEnd;
		}
		//! 3
		let cartFotoTitlText = `<a href="${productUrl}" class="cart-product__foto _ibg">
		<img src="img/products/${productImage}" alt="${productTitle}" class="_choose_img _ibg__foto"></a>
	   <div class="cart-product__content content-product">
		<p class="content-product__name">${productTitle}</p>
		<p class="content-product__midl-text">${productText}</p>`;
		//! 4
		let cartPrice = '';
		let cartPriceUp = '<div class="content-product__price">';
		let cartPriceEnd = '</div>';
		let cartPriceBody = '';
		productPrice.forEach(item => {
			let onePrice = `<p class="content-product__price_${item.type}">${item.value}</p>`;
			cartPriceBody += onePrice;
		});
		cartPrice += cartPriceUp;
		cartPrice += cartPriceBody;
		cartPrice += cartPriceEnd;
		//! 5
		let cartEnd = `<div class="cart-product__hover"><button type="button" class="cart-product__btn">Add to cart</button>
		<div class="cart-product__icons"><a href="${productShareUrl}" class="cart-product__link-in _icon_share">Share</a>
			<button type="button" class="cart-product__link-icon _icon_favorite">Like</button></div></div></div></div></div>`;

		cart += cartStart;
		cart += cartLabel;
		cart += cartFotoTitlText;
		cart += cartPrice;
		cart += cartEnd;

		let productsGrid = document.querySelector('.products__grid');// блок в HTML в конец которого будем грузить карточки
		productsGrid.insertAdjacentHTML('beforeend', cart);// загружаем карточки 

		//! opacity с анимацией 
		let newIt = document.querySelector("._load_new-item");
		removeClassName('_load_new-item', newIt);
		opacityAnim(newIt, 600);

	});
}
//! opacity с анимацией !!!!!  *********************************
function opacityAnim(el, time = 500, interval = 20) {
	let start = Date.now();
	let timer = setInterval(() => {
		let timePassed = Date.now() - start;
		el.style.opacity = timePassed / time;
		if (timePassed >= time) clearInterval(timer);
	}, interval);
}






