// Encontra a caixa de seleção que controla a abertura da tela inicial.
const introToggle = document.querySelector("#entrar");

// Encontra a tela inicial inteira para adicionar os eventos de interação.
const welcomeScreen = document.querySelector(".welcome-screen");

const themeToggle = document.querySelector(".theme-toggle");

function updateThemeToggle(isLightMode) {
	if (!themeToggle) return;

	themeToggle.setAttribute("aria-pressed", String(isLightMode));
	themeToggle.setAttribute("aria-label", isLightMode ? "Ativar modo escuro" : "Ativar modo claro");
}

const savedTheme = window.localStorage.getItem("portfolio-theme");
const prefersLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
const initialLightMode = savedTheme ? savedTheme === "light" : prefersLightMode;

document.body.classList.toggle("light-mode", initialLightMode);
updateThemeToggle(initialLightMode);

themeToggle?.addEventListener("click", () => {
	const isLightMode = document.body.classList.toggle("light-mode");

	window.localStorage.setItem("portfolio-theme", isLightMode ? "light" : "dark");
	updateThemeToggle(isLightMode);
});

// Cria os fragmentos que se espalham quando a tela inicial é tocada.
function createScreenFragments() {
	const fragmentCount = 36;
	const columns = 6;
	const rows = fragmentCount / columns;

	for (let index = 0; index < fragmentCount; index += 1) {
		const fragment = document.createElement("span");
		const column = index % columns;
		const row = Math.floor(index / columns);

		fragment.className = "screen-fragment";
		fragment.style.setProperty("--fragment-x", `${column * (100 / columns)}%`);
		fragment.style.setProperty("--fragment-y", `${row * (100 / rows)}%`);
		fragment.style.setProperty("--fragment-width", `${100 / columns + .2}%`);
		fragment.style.setProperty("--fragment-height", `${100 / rows + .2}%`);
		fragment.style.setProperty("--fragment-delay", `${(column + row) * 18}ms`);
		fragment.style.setProperty("--fragment-angle", `${(index % 2 ? 1 : -1) * (8 + (index % 4) * 4)}deg`);
		fragment.style.setProperty("--fragment-distance", `${70 + (index % 5) * 24}px`);
		welcomeScreen.append(fragment);
	}
}

createScreenFragments();

let hasEntered = false;

// Marca a caixa de seleção e faz a tela inicial desaparecer pelo CSS.
function enterPortfolio() {
	if (hasEntered) return;

	hasEntered = true;
	welcomeScreen.classList.add("is-fragmenting");

	window.setTimeout(() => {
		introToggle.checked = true;
	}, 700);
}

// Permite entrar no portfólio clicando ou tocando 
// em qualquer ponto da tela inicial.
welcomeScreen.addEventListener("click", enterPortfolio);

// Permite usar a tela inicial pelo teclado.
welcomeScreen.addEventListener("keydown", (event) => {
	// Verifica se a tecla pressionada foi Enter ou Espaço.
	if (event.key === "Enter" || event.key === " ") {
		// Impede o comportamento padrão da tecla Espaço, 
		// que poderia rolar a página.
		event.preventDefault();

		// Abre o portfólio usando a mesma função do clique.
		enterPortfolio();
	}
});

// Acompanha o movimento do mouse ou de outro ponteiro 
// sobre a tela inicial.
welcomeScreen.addEventListener("pointermove", (event) => {
	// Guarda a posição horizontal do ponteiro em uma variável CSS.
	welcomeScreen.style.setProperty("--mouse-x", `${event.clientX}px`);

	// Guarda a posição vertical do ponteiro em outra variável CSS.
	welcomeScreen.style.setProperty("--mouse-y", `${event.clientY}px`);
});

const skillsSection = document.querySelector(".skills");
const skillIcons = [...document.querySelectorAll(".skill-icon")];
let skillsVisible = false;
let skillsHidden = false;

function setSkillIconsVisible(visible) {
	skillIcons.forEach((icon, index) => {
		window.setTimeout(() => icon.classList.toggle("is-visible", visible), index * 140);
	});
}

function updateSkillsAnimation() {
	if (!skillsSection) return;

	const sectionBounds = skillsSection.getBoundingClientRect();
	const isEntering = sectionBounds.top < window.innerHeight * .78;
	const isLeaving = sectionBounds.bottom < window.innerHeight * .28;

	if (isEntering && !skillsVisible && !isLeaving) {
		setSkillIconsVisible(true);
		skillsVisible = true;
		skillsHidden = false;
	}

	if (isLeaving && !skillsHidden) {
		setSkillIconsVisible(false);
		skillsHidden = true;
	}

	if (!isLeaving && skillsHidden) {
		setSkillIconsVisible(true);
		skillsHidden = false;
	}

	if (!isEntering && skillsVisible) {
		skillsVisible = false;
	}
}

window.addEventListener("scroll", updateSkillsAnimation, { passive: true });
updateSkillsAnimation();
