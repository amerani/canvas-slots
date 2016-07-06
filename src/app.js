import reels from './reels'
import slotMachine from './slotMachine'

initSlotMachine()

function initSlotMachine(){
	let config = {
		canvasId: "canvas",
		winnerId: "winner",
		width: window.innerWidth  / 3,
		height: window.innerHeight / 3,
		numReels: 3,
		itemsPerReel: 3,
		winningRowId: 1
	}

	let slot = new slotMachine(config)

	let enableSpin = () => {
		document.getElementById('spin').disabled = false
	}

	Promise.all(initReels(slot)).then((data) => {
		slot.init()
		enableSpin()
	})

	let spinHandler = (ev) => {
			slot.spin()
			return false
	}

	document.getElementById("spin")	
		.addEventListener("click", spinHandler, false)			
}

function initReels(slot){

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
			.map((reel) => {
				return slot.addReel(reel)
			})		
}