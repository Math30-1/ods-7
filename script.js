// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navMenu = document.getElementById("navMenu")

mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  const icon = mobileMenuBtn.querySelector("i")
  icon.classList.toggle("fa-bars")
  icon.classList.toggle("fa-times")
})

// Smooth Scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.backgroundColor = "white"
    header.style.backdropFilter = "none"
  }
})

// Animação de contadores na seção de estatísticas
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number")
  const speed = 200

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = counter.innerText
      const count = +counter.getAttribute("data-count") || 0

      const targetNumber = Number.parseInt(target.replace(/[^\d]/g, ""))

      if (!targetNumber) return

      const inc = targetNumber / speed

      if (count < targetNumber) {
        counter.setAttribute("data-count", Math.ceil(count + inc))

        if (target.includes("R$")) {
          counter.innerText = `R$ ${Math.ceil(count + inc).toLocaleString("pt-BR")}`
        } else if (target.includes("MW")) {
          counter.innerText = `${Math.ceil(count + inc)}MW`
        } else if (target.includes("milhões")) {
          counter.innerText = `${Math.ceil(count + inc)} milhões`
        } else if (target.includes("+")) {
          counter.innerText = `${Math.ceil(count + inc).toLocaleString("pt-BR")}+`
        } else {
          counter.innerText = Math.ceil(count + inc).toLocaleString("pt-BR")
        }

        setTimeout(updateCount, 1)
      } else {
        counter.innerText = target
      }
    }

    updateCount()
  })
}

// Intersection Observer para animações
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("stats")) {
        animateCounters()
      }

      const cards = entry.target.querySelectorAll(".feature-card, .solution-card")
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }, index * 100)
      })
    }
  })
}, observerOptions)

document.querySelectorAll(".features, .stats, .solutions").forEach((section) => {
  observer.observe(section)
})

document.querySelectorAll(".feature-card, .solution-card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "all 0.6s ease"
})

// Simulador de economia (placeholder)
document.querySelectorAll("button").forEach((button) => {
  if (button.textContent.includes("Calcular") || button.textContent.includes("Simular")) {
    button.addEventListener("click", () => {
      alert("Simulador em desenvolvimento! Em breve você poderá calcular sua economia com energia limpa.")
    })
  }

  if (button.textContent.includes("Orçamento")) {
    button.addEventListener("click", () => {
      alert("Formulário de orçamento em desenvolvimento! Entre em contato pelo telefone (11) 3000-0000.")
    })
  }

  if (button.textContent.includes("Especialista")) {
    button.addEventListener("click", () => {
      alert("Chat com especialista em desenvolvimento! Entre em contato pelo email contato@ecoenergia.com.br.")
    })
  }
})

// Adicionar CSS para menu mobile
const style = document.createElement("style")
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu a {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
        }
        
        .nav-menu a:last-child {
            border-bottom: none;
        }
    }
`
document.head.appendChild(style)

// ==============================
// 3) LOGIN E CONSUMO DA API
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const email = document.getElementById("email").value
      const senha = document.getElementById("senha").value

      try {
        const resposta = await fetch("https://sua-api-privada.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        })

        if (!resposta.ok) throw new Error("Login falhou")

        const dados = await resposta.json()
        localStorage.setItem("token", dados.token)

        alert("Login realizado com sucesso!")
        window.location.href = "index.html"
      } catch (erro) {
        alert("Erro: " + erro.message)
      }
    })
  }
})

async function carregarDados() {
  const token = localStorage.getItem("token")
  if (!token) return

  try {
    const resposta = await fetch("https://sua-api-privada.com/dados", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (!resposta.ok) throw new Error("Erro ao buscar dados")

    const dados = await resposta.json()
    const container = document.getElementById("dadosApi")
    if (container) {
      container.innerHTML = `
        <p><strong>Usuário:</strong> ${dados.usuario}</p>
        <p><strong>Consumo Atual:</strong> ${dados.consumo} kWh</p>
        <p><strong>Economia Estimada:</strong> R$ ${dados.economia}</p>
      `
    }
  } catch (erro) {
    console.error("Erro:", erro)
  }
}

document.addEventListener("DOMContentLoaded", carregarDados)
