class CardsSection {
    constructor() {
        this.items = document.querySelectorAll(".cards__item");
        this.popup = document.getElementById("cardsPopup");
        this.popupClose = document.getElementById("cardsPopupClose");
        this.section = document.querySelector(".cards");

        this.openedCount = 0;
        this.isVisible = false;
        this.animationTimeout = null;

        this.init();
    }

    init() {
        // Обработчики кликов по картам
        this.items.forEach((item) => {
            item.addEventListener("click", () => this.handleCardClick(item));
        });

        // Закрытие попапа по клику на фон
        this.popup.addEventListener("click", (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });

        // Закрытие попапа по крестику (без анимации появления)
        this.popupClose.addEventListener("click", () => this.closePopup());

        // Отслеживание видимости секции
        window.addEventListener("scroll", () => this.handleScroll());
        window.addEventListener("resize", () => this.checkVisibility());
        window.addEventListener("load", () => this.checkVisibility());
    }

    handleCardClick(item) {
        if (!item.classList.contains("cards__item--flipped")) {
            item.classList.add("cards__item--flipped");
            this.openedCount++;

            // Показываем попап, когда все карты открыты
            if (this.openedCount === this.items.length) {
                setTimeout(() => {
                    this.popup.classList.add("cards__popup--active");
                }, 500);
            }
        }
    }

    closePopup() {
        this.popup.classList.remove("cards__popup--active");
    }

    resetCards() {
        this.items.forEach((item) => {
            item.classList.remove(
                "cards__item--animate-in",
                "cards__item--animate-out",
                "cards__item--flipped",
            );
            item.style.opacity = "0";
            item.style.transform = "translateX(200px) scale(0.9)";
        });
        this.openedCount = 0;
    }

    animateCardsOut() {
        clearTimeout(this.animationTimeout);

        this.items.forEach((item) => {
            item.classList.remove("cards__item--animate-in");
            item.classList.add("cards__item--animate-out");
        });
    }

    animateCardsIn() {
        clearTimeout(this.animationTimeout);

        // Сброс карт
        this.resetCards();

        // Запуск анимации появления
        this.animationTimeout = setTimeout(() => {
            this.items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove("cards__item--animate-out");
                    item.classList.add("cards__item--animate-in");
                }, index * 100);
            });
        }, 50);
    }

    checkVisibility() {
        const rect = this.section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Секция считается видимой, если ее середина в области просмотра
        const sectionMiddle = rect.top + rect.height / 2;
        const sectionVisible =
            sectionMiddle >= 0 && sectionMiddle <= windowHeight;

        if (sectionVisible && !this.isVisible) {
            this.isVisible = true;
            this.animateCardsIn();
        } else if (!sectionVisible && this.isVisible) {
            this.isVisible = false;
            this.animateCardsOut();
        }
    }

    handleScroll() {
        this.checkVisibility();
    }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    new CardsSection();
});
