// シーク秒数
const SEEK_DURATION_SEC = 10
// 音量増減幅
const VOLUME_CHANGE_AMOUNT = 0.05
// フルスクリーン状態
let isFullScreen = false

/**
 * ショートカットキーのイベント登録
 * @param videoElem
 */
const registerShortcutKeys = (videoElem) => {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            videoElem.currentTime += SEEK_DURATION_SEC
			e.preventDefault()
			e.stopPropagation() // プレイリストの前後に遷移する動作をキャンセルする
			return false
        } else if (e.key === 'ArrowLeft') {
            videoElem.currentTime -= SEEK_DURATION_SEC
			e.preventDefault()
			e.stopPropagation()
			return false
		} else if (e.key === 'f') {
			if (isFullScreen) {
				videoElem.webkitExitFullScreen()
				isFullScreen = false
			} else {
				videoElem.webkitRequestFullScreen()
				isFullScreen = true
			}
			e.preventDefault()
		} else if (e.key === 'ArrowUp') {
            const prev = videoElem.volume
			videoElem.volume = Math.min(1, prev + VOLUME_CHANGE_AMOUNT)
			e.preventDefault()
        } else if (e.key === 'ArrowDown') {
			const prev = videoElem.volume
            videoElem.volume = Math.max(0, prev - VOLUME_CHANGE_AMOUNT)
			e.preventDefault()
        } else if (e.key === ' ') {
            if (videoElem.paused) {
                videoElem.play()
            } else {
                videoElem.pause()
            }
			e.preventDefault()
        }
    }, true)
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
