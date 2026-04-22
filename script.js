const DUMMY_LOGIN = {
  nama: "Pak RT",
  alamat: "Tenggarong",
  password: "poskam123#!"
};

const hero = document.getElementById("hero");
const loginPanel = document.getElementById("login-panel");
const openLoginButton = document.querySelector(".js-open-login");
const backHeroButton = document.querySelector(".js-back-hero");
const form = document.getElementById("desa-login-form");
const passwordInput = document.getElementById("password");
const statusMessage = document.getElementById("status-message");

const parallaxItems = {
  clouds: document.querySelector(".parallax-clouds"),
  hills: document.querySelector(".parallax-hills"),
  village: document.querySelector(".parallax-village"),
  trees: document.querySelector(".parallax-trees")
};

function animateIntro() {
  const animatedNodes = [
    document.querySelector(".js-header-text"),
    document.querySelector(".js-header-menu"),
    document.querySelector(".js-anim-subtitle"),
    document.querySelector(".js-anim-title"),
    document.querySelector(".js-anim-desc")
  ];

  animatedNodes.forEach((node, index) => {
    if (!node) {
      return;
    }

    node.classList.add("animate-in");
    node.style.animationDelay = `${index * 0.12}s`;
  });
}

function openLoginSection() {
  loginPanel.classList.add("is-visible");
  loginPanel.setAttribute("aria-hidden", "false");
  loginPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function backToHero() {
  hero.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getLevel(steps, count) {
  return Math.max(...steps.map((value, index) => (count >= value ? index : 0)));
}

function checkPasswordStrength(password) {
  const specialCount = [...password].filter((char) => !/^[a-zA-Z0-9]+$/.test(char)).length;
  const numberCount = [...password].filter((char) => /^[0-9]+$/.test(char)).length;
  const uppercaseCount = [...password].filter((char) => /^[A-Z]+$/.test(char)).length;

  return {
    length: getLevel([0, 6, 10, 16], password.length),
    uppercases: getLevel([0, 1, 2, 3], uppercaseCount),
    specials: getLevel([0, 1, 2, 3], specialCount),
    numbers: getLevel([0, 1, 2, 3], numberCount)
  };
}

function renderPasswordMeter(password) {
  const levels = checkPasswordStrength(password);

  Object.keys(levels).forEach((key) => {
    const target = document.querySelector(`[data-carac="${key}"]`);
    if (target) {
      target.setAttribute("data-level", String(levels[key]));
    }
  });
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("is-error", "is-success");

  if (type) {
    statusMessage.classList.add(type === "error" ? "is-error" : "is-success");
  }
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function validateDummyLogin(params) {
  return (
    normalize(params.get("nama") || "") === normalize(DUMMY_LOGIN.nama) &&
    normalize(params.get("alamat") || "") === normalize(DUMMY_LOGIN.alamat) &&
    (params.get("password") || "") === DUMMY_LOGIN.password
  );
}

function fillFormFromQuery(params) {
  const nama = params.get("nama");
  const alamat = params.get("alamat");
  const password = params.get("password");

  if (nama) {
    document.getElementById("nama").value = nama;
  }

  if (alamat) {
    document.getElementById("alamat").value = alamat;
  }

  if (password) {
    passwordInput.value = password;
    renderPasswordMeter(password);
  }
}

function handleQueryResult() {
  const params = new URLSearchParams(window.location.search);
  const submitted = params.get("submitted");

  if (submitted !== "1") {
    return;
  }

  fillFormFromQuery(params);
  openLoginSection();

  if (validateDummyLogin(params)) {
    showStatus("Login dummy berhasil. Data tadi sudah terkirim lewat HTTP dan bisa dianalisis di Wireshark.", "success");
    setTimeout(() => {
      backToHero();
    }, 900);
  } else {
    showStatus("Data dummy belum cocok. Gunakan Nama, Alamat, dan Password yang tertera di kartu akun dummy.", "error");
  }

  setTimeout(() => {
    const cleanUrl = `${window.location.pathname}#hero`;
    window.history.replaceState({}, document.title, cleanUrl);
  }, 1200);
}

function handleParallax(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  parallaxItems.clouds.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
  parallaxItems.hills.style.transform = `translate(${x * 16}px, ${y * 10}px)`;
  parallaxItems.village.style.transform = `translate(${x * 24}px, ${y * 14}px)`;
  parallaxItems.trees.style.transform = `translate(${x * 28}px, ${y * 16}px)`;
}

openLoginButton.addEventListener("click", openLoginSection);
backHeroButton.addEventListener("click", backToHero);

form.addEventListener("submit", (event) => {
  const nama = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const password = passwordInput.value.trim();

  if (!nama || !alamat || !password) {
    event.preventDefault();
    showStatus("Semua field harus diisi dulu sebelum data dikirim.", "error");
    openLoginSection();
  }
});

passwordInput.addEventListener("input", (event) => {
  renderPasswordMeter(event.target.value);
});

window.addEventListener("mousemove", handleParallax);

document.addEventListener("DOMContentLoaded", () => {
  animateIntro();
  renderPasswordMeter("");
  handleQueryResult();
});
