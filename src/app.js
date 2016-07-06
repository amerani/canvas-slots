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

	let slot = slotMachine(config)

	let reels = initReels().map((reel) => {
		return new Promise((resolve, reject) => {
			Promise.all(reel).then((reelWithImg) => {
				resolve(reelWithImg)
			})
		})
	})

	let enableSpin = () => {
		document.getElementById('spin').disabled = false
	}

	Promise.all(reels).then((data) => {
		slot.init(data)
		enableSpin()
	})

	let spinHandler = (ev) => {
			slot.spin()
			return false
	}

	document.getElementById("spin")	
		.addEventListener("click", spinHandler, false)			
}

function initReels(){

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