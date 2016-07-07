let slotMachine = (config) => {

	let canvas, context, winnerDiv,
		width, height,
		numReels, itemsPerReel,
		reelItemWidth, reelItemHeight,
		reelImgWidth, reelImgHeight, imgXOffset, imgYOffset,
		reels, winningRow, winningRowId, timerId


	let init = (initReels) => {
		//initialize canvas
		canvas = document.getElementById(config.canvasId)
		context = canvas.getContext('2d')
		context.clearRect(0,0,width,height)
		//get winner div node
		winnerDiv = document.getElementById(config.winnerId)
		winnerDiv.innerHTML = ""
		//set width and height
		width = canvas.width = config.width
		height = canvas.height = config.height
		//num reels is number of columns
		numReels = config.numReels
		//items per reel is number of rows
		itemsPerReel = config.itemsPerReel
		//width of each slot
		reelItemWidth = width / numReels
		//height of each slot
		reelItemHeight = height / itemsPerReel
		//width of img wihtin each slot
		reelImgWidth = reelItemWidth / 2
		//height of img within each slot
		reelImgHeight = reelItemHeight / 2
		//canvas x offset to draw image in the slot
		imgXOffset = reelImgWidth / 2
		//canvas y offset to draw image in the slot
		imgYOffset = reelImgHeight / 2

		reels = initReels
		winningRow = []
		winningRowId = config.winningRowId
		//render each reel
		reels.forEach((reel, id) => {
			renderReel(id, reel)
		})
	}

	//sets the winning message in the provided div
	let setWinner = () => {
		let first = winningRow[0]
		if(winningRow.every((item) => item.type === first.type)){
			winnerDiv.innerHTML = `<p> Congrats! You have won a cup of <span style='color: ${first.color}'> ${first.type} </span> </p>`
		}
	}

	//render each real
	let renderReel = (id, reel) => {
		//move last slot to the front before each render
		reel.unshift(reel.pop())
		//clear the reel to be rendered
		context.clearRect(id * width / numReels, 0, width / numReels, height)

		//calculate canvas x coordinate to render reel slots
		let imgX = imgXOffset + id * width / numReels
		reel.forEach((item, idx) => {
			//canvas y coordinates depends on the slot currently rendered
			let imgY = (imgYOffset + idx * height / itemsPerReel)

			//render background of the slot
			context.globalAlpha = 0.5
			context.fillStyle = item.color
			context.fillRect(
				id * width / numReels,
				idx * height / itemsPerReel,
				reelItemWidth,
				reelItemHeight
			)
			//save previous state and render the image
			context.save()
			context.globalAlpha = 1
			context.drawImage(item.image, imgX, imgY, reelImgWidth, reelImgHeight)
			context.restore()
		})
	}

	//randomizer that calls the render function
	let renderer = (id, delay) => {
		renderReel(id, reels[id])
		//increase delay randomly by upto 1.6 times each time
		//this gives an effect of the reel slowing down
		delay = delay * (Math.random() * (1.6 - 1) + 1)
		//stop rendering once delay is more than 3/4 sec
		if(delay < 750)
			timerId = setTimeout(renderer, delay, id, delay)
		else {
			timerId = null
			//accumulate slots
			winningRow.push(reels[id][winningRowId])
			//set winner message if any
			winningRow.length === numReels && setWinner()
		}
	}

	//interface for spinning the slot
	let spin = () => {
		//clear winner each time
		winningRow = []
		winnerDiv.innerHTML = ""
		reels.forEach((reel, id) => {
			renderer(id, 0.1)
		})
	}

	return {
		init: init,
		spin: spin
	}

}

export default slotMachine
