class GameCatalog {
    constructor() {
        this.blocks = [];
        this.observer = null;
        this.isMobile = window.matchMedia("(max-width: 767px)").matches;

        this.init();
    }

    init() {
        const sections = document.querySelectorAll(".game-catalog__list-inner");

        if (!sections.length) return;

        sections.forEach((section) => {
            const items = section.querySelectorAll(
                ".game-catalog__list-item--card",
            );
            const img = section.querySelector(".game-catalog__img");

            this.blocks.push({
                section,
                items,
                img,
                animated: false,
            });

            if (this.isMobile) {
                items.forEach((item) => {
                    item.style.opacity = "1";
                });
                if (img) img.style.opacity = "1";
            }
        });

        if (this.isMobile) return;

        this.createObserver();
    }

    createObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const block = this.blocks.find(
                        (b) => b.section === entry.target,
                    );
                    if (!block) return;

                    if (entry.isIntersecting && !block.animated) {
                        this.animateBlock(block);
                        block.animated = true;
                    }

                    if (!entry.isIntersecting && block.animated) {
                        const rect = entry.boundingClientRect;
                        const vh = window.innerHeight;

                        const fullyOut = rect.bottom <= 0 || rect.top >= vh;

                        if (fullyOut) {
                            this.resetBlock(block);
                            block.animated = false;
                        }
                    }
                });
            },
            {
                threshold: 0,
            },
        );

        this.blocks.forEach((block) => {
            this.observer.observe(block.section);
        });
    }

    animateBlock(block) {
        block.items.forEach((item, index) => {
            const isLeft =
                item.closest(".game-catalog__list")?.previousElementSibling ===
                null;

            setTimeout(() => {
                item.style.animation = isLeft
                    ? "game-catalog-slide-in-left 0.6s ease forwards"
                    : "game-catalog-slide-in-right 0.6s ease forwards";
            }, index * 150);
        });

        if (block.img) {
            const side = block.img.previousElementSibling ? "right" : "left";

            setTimeout(() => {
                block.img.style.animation =
                    side === "left"
                        ? "game-catalog-slide-in-left 0.6s ease forwards"
                        : "game-catalog-slide-in-right 0.6s ease forwards";
            }, 300);
        }
    }

    resetBlock(block) {
        block.items.forEach((item) => {
            item.style.animation = "";
            item.style.opacity = "0";
        });

        if (block.img) {
            block.img.style.animation = "";
            block.img.style.opacity = "0";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GameCatalog();
});
