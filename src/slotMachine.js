let slotMachine = (config) => {	
	
	let canvas, context, winnerDiv, 
		width, height, numReels, itemsPerReel, imgXOffset, imgYOffset,
		reelItemHeight, reelItemWidth, reelImgHeight, reelImgWidth,
		winningRow, tid

	let reels = []
	
	let init = () => {
		debugger
		winnerDiv = document.getElementById(config.winnerId)
		winningRow = []
		winnerDiv.innerHTML = ""

		canvas = document.getElementById(config.canvasId)
		context = canvas.getContext('2d')
		width = canvas.width = config.width
		height = canvas.height = config.height
		context.clearRect(0,0,width,height)

		numReels = config.numReels	
		itemsPerReel = config.itemsPerReel	


		reelItemWidth = width / numReels
		reelItemHeight = height / itemsPerReel

		reelImgWidth = reelItemWidth / 2
		reelImgHeight = reelItemHeight / 2
		imgXOffset = reelImgWidth / 2
		imgYOffset = reelImgHeight / 2

		//context.rect(0, height / (numReels * 2), width, height - 2 * (height / numReels))
		//context.clip()

		reels.forEach((reel, id) => {
			renderReel(id, reel)
		})
	}

	let setWinner = () => {
		let first = winningRow[0].type
		if(winningRow.every((item) => item.type === first)){
			winnerDiv.innerHTML = "<span>" + first + "</span>"
		}
	}

	let renderReel = (id, reel) => {
		reel.unshift(reel.pop())	
		context.clearRect(id * width / numReels, 0, width / numReels, height)

		let imgX = imgXOffset + id * width / numReels		
		reel.forEach((item, idx) => {
			let imgY = (imgYOffset + idx * height / itemsPerReel)

			context.globalAlpha = 0.5
			context.fillStyle = item.color
			context.fillRect(	
				id * width / numReels, 
				idx * height / itemsPerReel, 
				reelItemWidth, 
				reelItemHeight
			)

			context.save()
			context.globalAlpha = 1
			context.drawImage(item.image, imgX, imgY, reelImgWidth, reelImgHeight)
			context.restore()
		})
	}

	let renderer = (id, delay) => {
		renderReel(id, reels[id])
		delay = delay * (Math.random() * (1.6 - 1) + 1)
		if(delay < 750)
			tid = setTimeout(renderer, delay, id, delay)
		else {
			tid = null
			winningRow.push(reels[id][1])
			winningRow.length === numReels && setWinner()
		}
	}

	let addReel = (reel) => {
		return new Promise((resolve, reject) => {
			Promise.all(reel).then((data) => {
				reels.push(data)
				resolve()
			})
		})
	}

	let spin = () => {
		winningRow = []
		winnerDiv.innerHTML = ""
		reels.forEach((reel, id) => {
			renderer(id, 0.1)
		})
	}

	return {
		init: init,
		addReel: addReel,
		spin: spin
	}

}

export default slotMachine