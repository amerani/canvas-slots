import reels from './reels'
import slotMachine from './slotMachine'

let slot = loadSlotMachine()

function loadSlotMachine(){
	let config = {
		canvasId: "canvas",
		winnerId: "winner",
		width: window.innerWidth  / 3,
		height: window.innerHeight / 3,
		numReels: 3,
		itemsPerReel: 3,
		winningRowId: 1
	}

	let slot = slotMachine(config)
	let ct = 0
	let spinHandler = (ev) => {
		slot.spin()
		return false
	}

	document.querySelector("button#spin")
		.addEventListener("click", spinHandler, false)

	let enableSpin = () => {
		document.querySelector("button#spin").disabled = false
	}

	let reels = loadReels().map((reel) => {
		return new Promise((resolve, reject) => {
			Promise.all(reel).then((reelWithImg) => {
				resolve(reelWithImg)
			})
		})
	})

	Promise.all(reels).then((data) => {
		slot.init(data)
		enableSpin()
	})

	return {
		destroy: () => {
			slot = null
			let spinBtn = document.querySelector("button#spin")
			spinBtn.removeEventListener("click", spinHandler)
			spinBtn.disabled = true
		}
	}
}

function loadReels(){

	let loadImage = (reel) => {
		return new Promise((resolve, reject) => {
			let img = new Image()
			img.onload = () => {
				reel.image = img
				resolve(reel)
			}
			img.src = reel.imageSrc
		})
	}

	return reels
			.map((reel) => {
				return reel.map((item) => {
					return loadImage(item)
				})
			})
}

window.onresize = () => {
	slot.destroy()
	slot = loadSlotMachine()
}
