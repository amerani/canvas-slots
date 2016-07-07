import reels from './reels'
import slotMachine from './slotMachine'

let slot = loadSlotMachine()

function loadSlotMachine(){

	//config options to setup the slotmachine
	let config = {
		canvasId: "canvas",
		winnerId: "winner",
		width: window.innerWidth  / 3,
		height: window.innerHeight / 3,
		numReels: 3,
		itemsPerReel: 3,
		winningRowId: 1
	}

	//private handle for slot machine
	let slot = slotMachine(config)

	//even handler for click on spin button
	let spinHandler = (ev) => {
		slot.spin()
		return false
	}

	//bind event for spin click
	document.querySelector("button#spin")
		.addEventListener("click", spinHandler, false)

	//map image promises into one promise for each reel
	let reels = loadReels().map((reel) => {
		return new Promise((resolve, reject) => {
			Promise.all(reel).then((reelWithImg) => {
				resolve(reelWithImg)
			})
		})
	})

	//initialize slot with reels when resolved
	Promise.all(reels).then((data) => {
		slot.init(data)
	})

	//return handle to slot and
	//destroy funciton to clean up
	return {
		machine: slot,
		destroy: () => {
			slot = null
			document.querySelector("button#spin")
				.removeEventListener("click", spinHandler)
		}
	}
}

function loadReels(){
	//load images given the url in the reels array
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

	//returns a 2d array of promises
	//that resolve when images are loaded
	return reels
			.map((reel) => {
				return reel.map((item) => {
					return loadImage(item)
				})
			})
}

//handle screen resize
window.onresize = () => {
	slot.destroy()
	slot = loadSlotMachine()
}
