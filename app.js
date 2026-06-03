document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------
    // CONFIGURACIÓN DE LA CUENTA REGRESIVA
    // ----------------------------------------------------------------
    // Fecha del matrimonio: Viernes 20 de Noviembre de 2026, 18:00 (Hora de Santiago de Chile, UTC-3)
    // El formato ISO con '-03:00' garantiza que el navegador lo interprete en la zona horaria chilena
    const targetDate = new Date("2026-11-20T18:00:00-03:00").getTime();

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownTimer);
            document.getElementById("countdown").innerHTML = "<div class='wedding-started'>¡Hoy es el gran día!</div>";
            return;
        }

        // Cálculos de tiempo
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Actualizar HTML
        document.getElementById("days").innerText = days.toString().padStart(2, "0");
        document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
    }, 1000);

    // ----------------------------------------------------------------
    // HISTORIA DE AMOR: PILAS DE FOTOS INTERACTIVAS (CARD STACK)
    // ----------------------------------------------------------------
    const cardStacks = document.querySelectorAll(".card-stack");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    cardStacks.forEach(stack => {
        // Al hacer clic, desliza la carta superior y la envía al fondo
        stack.addEventListener("click", (e) => {
            const clickedCard = e.target.closest(".card");
            if (!clickedCard) return;

            // Evitar clics múltiples mientras está en animación
            if (clickedCard.classList.contains("swipe-out")) return;

            const cards = Array.from(stack.querySelectorAll(".card"));
            const maxZ = cards.length;

            // Añadir la clase de animación
            clickedCard.classList.add("swipe-out");

            // Obtener el z-index de la carta actual cliqueada (debería ser el más alto)
            const clickedZ = parseInt(clickedCard.style.getPropertyValue("--z") || maxZ);

            setTimeout(() => {
                clickedCard.classList.remove("swipe-out");

                // Mover la carta actual al fondo (--z = 1) y subir las demás
                cards.forEach(card => {
                    let z = parseInt(card.style.getPropertyValue("--z") || 1);
                    if (card === clickedCard) {
                        card.style.setProperty("--z", 1);
                        card.style.zIndex = 1;
                    } else {
                        if (z < clickedZ) {
                            card.style.setProperty("--z", z + 1);
                            card.style.zIndex = z + 1;
                        }
                    }
                });
            }, 600); // 600ms coincide con la duración de la animación en CSS
        });

        // Al hacer doble clic en una foto, se abre en tamaño completo (Lightbox)
        stack.addEventListener("dblclick", (e) => {
            const clickedCard = e.target.closest(".card");
            if (!clickedCard) return;

            const imgSrc = clickedCard.getAttribute("data-src");
            lightboxImg.src = imgSrc;
            lightbox.classList.add("show");
            document.body.style.overflow = "hidden"; // Deshabilita scroll de fondo
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove("show");
        document.body.style.overflow = "auto"; // Habilita scroll
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Cerrar lightbox con la tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox && lightbox.classList.contains("show")) {
            closeLightbox();
        }
    });

    // ----------------------------------------------------------------
    // COPIAR CÓDIGO DE NOVIOS
    // ----------------------------------------------------------------
    const btnCopyCode = document.getElementById("btn-copy-code");
    const weddingCode = document.getElementById("wedding-code");

    if (btnCopyCode && weddingCode) {
        btnCopyCode.addEventListener("click", () => {
            const codeText = weddingCode.innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                const btnText = btnCopyCode.querySelector(".copy-text");
                const originalText = btnText.innerText;
                
                btnText.innerText = "¡Copiado!";
                btnCopyCode.style.backgroundColor = "var(--primary)";
                
                setTimeout(() => {
                    btnText.innerText = originalText;
                    btnCopyCode.style.backgroundColor = ""; // Vuelve a los estilos hover normales de CSS
                }, 2000);
            }).catch(err => {
                console.error("Error al copiar el código: ", err);
            });
        });
    }

    // ----------------------------------------------------------------
    // REPRODUCTOR DE MÚSICA
    // ----------------------------------------------------------------
    const musicBtn = document.getElementById("music-btn");
    const bgMusic = document.getElementById("bg-music");

    if (musicBtn && bgMusic) {
        const playIcon = musicBtn.querySelector(".play-icon");
        const pauseIcon = musicBtn.querySelector(".pause-icon");
        const btnText = musicBtn.querySelector(".music-btn-text");

        musicBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicBtn.classList.add("playing");
                    playIcon.classList.add("hidden");
                    pauseIcon.classList.remove("hidden");
                    btnText.innerText = "Pausar Música";
                }).catch(err => {
                    console.error("No se pudo iniciar la reproducción: ", err);
                    alert("Para reproducir la música, asegúrate de colocar el archivo 'perfect.mp3' en la carpeta 'assets'. El botón buscará el archivo en 'assets/perfect.mp3'.");
                });
            } else {
                bgMusic.pause();
                musicBtn.classList.remove("playing");
                playIcon.classList.remove("hidden");
                pauseIcon.classList.add("hidden");
                btnText.innerText = "Escuchar Canción";
            }
        });
    }
});
