// シーク秒数
const SEEK_DURATION_SEC = 10
// 音量増減幅
const VOLUME_CHANGE_AMOUNT = 0.05

/**
 * ショートカットキーのイベント登録
 * @param targetVideoElement
 */
const registerShortcutKeys = (targetVideoElement) => {
	addEventListener('keydown', (event) => {
		if (event.key === 'ArrowRight') {
			targetVideoElement.currentTime += SEEK_DURATION_SEC
		}
		if (event.key === 'ArrowLeft') {
			targetVideoElement.currentTime -= SEEK_DURATION_SEC
		}
		if (event.key === 'ArrowUp') {
			targetVideoElement.volume += VOLUME_CHANGE_AMOUNT
			event.preventDefault()
		}
		if (event.key === 'ArrowDown') {
			targetVideoElement.volume -= VOLUME_CHANGE_AMOUNT
			event.preventDefault()
		}
		if (event.key === ' ') {
			if (targetVideoElement.paused) {
				targetVideoElement.play()
			} else {
				targetVideoElement.pause()
			}
			event.preventDefault()
		}
	})
}

/**
 * ページを定期監視し、Video要素が利用可能になったらイベント登録を行う
 */
const watchPageAndInitialize = () => {
	let isReady = false
	setInterval(() => {
		if (!isReady) {
			video = document.querySelector('video')
			if (video != null) {
				registerShortcutKeys(video)
				isReady = true
			}
		}
	}, 500)
}

// 実行
watchPageAndInitialize()
