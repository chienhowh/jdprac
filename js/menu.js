//menu
class Menu {
    constructor(id){
        this.box = document.querySelector(id)
        this.ul = this.box.querySelector('ul')
        this.lis = this.box.querySelectorAll('li')
        this.index = 1
        this.init()
    }

    init(){
        this.lis.forEach(li => {
            li.addEventListener('mouseenter', (e) => {
                const target = e.target
                console.log(target.children[1])
                target.classList.add('active')
            })
            li.addEventListener('mouseleave', (e) => {
                const target = e.target 
                target.classList.remove('active')
            })
        })
       
    }
}

//carosul
class Carousel {
    constructor(id){
        this.box = document.querySelector(id)
        this.ul = this.box.querySelector('ul')
        this.ulLen = this.ul.children.length//for stop carousel
        this.lis = this.ul.querySelectorAll('li')
        this.ol = this.box.querySelector('ol')
        this.sliderWidth = this.box.clientWidth //sliderbox寬度 
        this.index = 1
        this.animated = false//避免重複setinterval
        this.auto = null//for autoplaycheck
        this.init()
    }

    init(){
        this.generateIcon()
        this.makeCarousel()
        this.leftRight()
        this.autoPlay()
    }
    
    // generate li icon
    generateIcon(){
        const num = this.lis.length
        const frg = document.createDocumentFragment()
        for(let i = 0; i < num; i++){
            const li = document.createElement('li')
            if(i == 0) li.classList.add('active')
            li.setAttribute('data-index', i+1)
            frg.appendChild(li)
        }
        this.ol.appendChild(frg)
        this.ol.style.width = num * 10 * 2 + 'px'
        // add click
        this.ol.addEventListener('click', (e) => {
            const pointIndex = e.target.dataset.index
            // const leftMove = -this.sliderWidth * this.index
            // console.log(leftMove)
            // this.ul.style.left = leftMove + 'px'
            let offset = ((pointIndex - this.index) * this.sliderWidth)
            this.index = pointIndex
            this.move(offset)
        })
    }
    // makeCarousel
    makeCarousel(){
        console.log(this.lis)
        const first = this.ul.firstElementChild.cloneNode(true)
        const last = this.ul.lastElementChild.cloneNode(true)
        console.log(last)
        this.ul.insertBefore(last, this.ul.firstElementChild)
        this.ul.appendChild(first)
        this.ul.style.width = this.sliderWidth * this.ul.children.length + 'px'
        this.ul.style.left = -1 * this.sliderWidth + 'px'
    }
    //slider move
    move(offset){
        this.slide(offset)
        const num = this.ol.children.length
        //for icon
        for(let i = 0; i < num; i++){
            this.ol.children[i].className = ''
        }
        this.ol.children[this.index-1].className = 'active'
    }

    slide(offset){
        const time = 300//總切換時間
        const rate = 10//100位移一次
        let speed = offset / (time / rate)//move px per rate
        let goal = parseFloat(this.ul.style.left) - offset
        this.animated = true
        let animate = setInterval(() => {
            if(parseFloat(this.ul.style.left) == goal || Math.abs(Math.abs(parseFloat(this.ul.style.left)) - Math.abs(goal)) < Math.abs(speed)/*避免速度不是整數*/){
                this.ul.style.left = goal + 'px'
                clearInterval(animate)
                this.animated = false

                //change 5 to 5
                if(parseFloat(this.ul.style.left) == 0){
                    this.ul.style.left = -this.ulLen * this.sliderWidth + 'px'
                }else if(parseFloat(this.ul.style.left) == -(this.ulLen + 1) * this.sliderWidth){
                    this.ul.style.left = -this.sliderWidth + 'px'
                }
            }else{
            this.ul.style.left = parseFloat(this.ul.style.left) - speed + 'px'
            }
        }, rate)
    }
    //arrow click change
    leftRight(){
        this.box.querySelector('.left-box').addEventListener('click', () => {
            if(this.animated == true) return
            if(this.index - 1 < 1){
                this.index = this.ulLen
            }else{
                this.index --
            }
            
            this.move(-this.sliderWidth)
        })
        this.box.querySelector('.right-box').addEventListener('click', () => {
            if(this.animated == true) return
            if(this.index + 1 > this.ulLen){
                this.index = 1
            }else{
                this.index ++
            }
            this.move(this.sliderWidth)
        })
    }

    autoPlay(){
        this.auto = setInterval(() => {
            this.box.querySelector('.right-box').click()
        },2000)

        this.box.addEventListener('mouseenter', () => {
            clearInterval(this.auto)
        })
        this.box.addEventListener('mouseleave', ()=> {
            this.auto = setInterval(() => {
                this.box.querySelector('.right-box').click()
            },2000)
        })
    }
}