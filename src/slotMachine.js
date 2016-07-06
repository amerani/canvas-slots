let slotMachine = (config) => {	
	
	let canvas, context, winnerDiv, 
		width, height, 
		numReels, itemsPerReel, 
		reelItemWidth, reelItemHeight, 
		reelImgWidth, reelImgHeight, imgXOffset, imgYOffset,
		reels, winningRow, winningRowId, timerId

	
	let init = (initReels) => {

		canvas = document.getElementById(config.canvasId)
		context = canvas.getContext('2d')		
		context.clearRect(0,0,width,height)
		winnerDiv = document.getElementById(config.winnerId)
		winnerDiv.innerHTML = ""

		width = canvas.width = config.width
		height = canvas.height = config.height

		numReels = config.numReels	
		itemsPerReel = config.itemsPerReel	

		reelItemWidth = width / numReels
		reelItemHeight = height / itemsPerReel

		reelImgWidth = reelItemWidth / 2
		reelImgHeight = reelItemHeight / 2
		imgXOffset = reelImgWidth / 2
		imgYOffset = reelImgHeight / 2

		reels = initReels
		winningRow = []
		winningRowId = config.winningRowId

		//context.rect(0, height / (numReels * 2), width, height - 2 * (height / numReels))
		//context.clip()

		reels.forEach((reel, id) => {
			renderReel(id, reel)
		})
	}

	let setWinner = () => {
		let first = winningRow[0].type
		if(winningRow.every((item) => item.type === first)){
			winnerDiv.innerHTML = `<span> Congrats! You have won a cup of ${first}. </span>`
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
			timerId = setTimeout(renderer, delay, id, delay)
		else {
			timerId = null
			winningRow.push(reels[id][winningRowId])
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