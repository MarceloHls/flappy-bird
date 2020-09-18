function criarElemento(tag, classe) {
  let elemento = document.createElement(tag)
  elemento.className = classe
  return elemento
}


//////////////// Criando canoss ////////////////////

function CriarBarreira(reverse = false) {
  this.elemento = criarElemento('div', 'barreira')

  const borda = criarElemento('div', 'borda')
  const corpo = criarElemento('div', 'corpo')

  this.elemento.appendChild(reverse ? corpo : borda)
  this.elemento.appendChild(reverse ? borda : corpo)

  this.setAltura = altura => corpo.style.height = `${altura}px`

}

////////////////////////////// Criando a dupla de canos ////////////////////////////////////

function CriarParBarreira(altura, abertura, x) {
  this.elemento = criarElemento('div', 'par-de-barreiras')

  this.superior = new CriarBarreira(true)
  this.inferior = new CriarBarreira(false)

  this.elemento.appendChild(this.superior.elemento)
  this.elemento.appendChild(this.inferior.elemento)

  this.sortearAbertura = () => {
    const altSuperior = Math.random() * (altura - abertura)
    const altInferior = altura - altSuperior - abertura
    this.superior.setAltura(altSuperior)
    this.inferior.setAltura(altInferior)
  }

  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = x => this.elemento.style.left = `${x}px`
  this.getLargura = () => this.elemento.clientWidth

  this.sortearAbertura()
  this.setX(x)
}

//////////////////////// Criando conjto de canos /////////////////////////

function Barreiras(altura, largura, abertura, espaco, ponto) {
  this.pares = [
    new CriarParBarreira(altura, abertura, largura),
    new CriarParBarreira(altura, abertura, largura + espaco),
    new CriarParBarreira(altura, abertura, largura + espaco * 2),
    new CriarParBarreira(altura, abertura, largura + espaco * 3)
  ]
  const deslocamento = 5
  this.animar = () => {

    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)

      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }

      const meio = largura / 2
      const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
      
      if (cruzouMeio) ponto()

    })
  }

}

function Passaro(alturadojogo) {
  let voando = false

  this.elemento = criarElemento('img', 'passaro')
  this.elemento.src = 'imgs/passaro.png'

  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
  this.setY = y => this.elemento.style.bottom = `${y}px`

  window.onkeydown = e => voando = true
  window.onkeyup = e => voando = false

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5)
    const alturaMaxima = alturadojogo - this.elemento.clientHeight

    if (novoY <= 0) {
      this.setY(0)
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima)
    } else {
      this.setY(novoY)
    }
  }
  this.setY(alturadojogo / 2)
}


function Placar() {
this.elemento = criarElemento('span','progresso')
this.atulizarpontos = pontos=>{
  this.elemento.innerHTML = pontos
}

this.atulizarpontos(0)
  

}


function sobreposição(eleA,eleB){
  const a = eleA.getBoundingClientRect()
  const b = eleB.getBoundingClientRect()

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

  return horizontal && vertical



}

function colidiu(passaro,barreira){
  let colidiu = false

  barreira.pares.forEach(par => {
    if(!colidiu){
      const superior = par.superior.elemento
      const inferior = par.inferior.elemento

      colidiu = sobreposição(passaro.elemento,superior) || sobreposição(passaro.elemento,inferior)


    }

  })
  return colidiu

}

function Game(){
  let pontos = 1

  const aredoJogo = document.querySelector('[wm-flappy]')

  let altura = aredoJogo.clientHeight
  let largura = aredoJogo.clientWidth

  const placar = new Placar()
  const barreira = new Barreiras(altura,largura,200,400, ()=> placar.atulizarpontos(pontos++))
  const passaro = new Passaro(altura)

  aredoJogo.appendChild(placar.elemento)
  aredoJogo.appendChild(passaro.elemento)
  barreira.pares.forEach(par => aredoJogo.appendChild(par.elemento))

  this.start = ()=>{
    const time = setInterval(() => {
      barreira.animar()
      passaro.animar()

      if(colidiu(passaro,barreira)){
        clearInterval(time)
      }
  
      
    }, 20);

 
  }
  

}

new Game().start()