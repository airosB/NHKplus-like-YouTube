// シーク秒数
const SEEK_DURATION_SEC = 10;
// 音量増減幅
const VOLUME_CHANGE_AMOUNT = 0.05;
// フルスクリーン状態
let isFullScreen = false;
// 再生エリアのショートカットキー登録状態
let isVideoShortcutRegistered = false;
// ロゴの置き換え状態
let isLogoReplaced = false;

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
		} else if (e.key === 'ArrowUp') {
            const prev = videoElem.volume
			videoElem.volume = Math.min(1, prev + VOLUME_CHANGE_AMOUNT)
			e.preventDefault()
        } else if (e.key === 'ArrowDown') {
			const prev = videoElem.volume
            videoElem.volume = Math.max(0, prev - VOLUME_CHANGE_AMOUNT)
			e.preventDefault()
        } else if (e.key === 'f') {
            if (isFullScreen) {
                document.webkitExitFullscreen()
                isFullScreen = false
            } else {
                videoElem.webkitRequestFullscreen()
                isFullScreen = true
            }
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
 * Videoに対するショートカットキーを登録する
 */
const initializeVideoShortcuts = () => {
    console.log('[NLY] searching for video');
    const video = document.querySelector('video');
    if (video) {
        registerShortcutKeys(video);
        isVideoShortcutRegistered = true;
        console.log('[NLY] loaded');
    }
}

/**
 * clickイベントで遷移する左上のロゴを、普通のリンクで置き換える
 * こうすることでブラウザの通常のクリック挙動が使えるようになり、ctrl+clickとかが効くようになる
 */
const replaceLogoWithNormalLink = () => {
    console.log('[NLY] searching for logo');
    const logoDivs = document.getElementsByClassName('global_header--logo');

    for (let logo of logoDivs) {
        const clonedElement = logo.cloneNode(true);
        const wrapperAnchor = document.createElement('a');
        wrapperAnchor.appendChild(clonedElement);
        wrapperAnchor.href = '/';
        logo.parentNode.replaceChild(wrapperAnchor, logo);

        isLogoReplaced = true;
        console.log('[NLY] logo replaced');
    }
};

/**
 * DOM監視して変更があれば初期化を試みる
 */
const observeDOMForVideo = () => {
    const observer = new MutationObserver((mutations, obs) => {
        if (!isVideoShortcutRegistered) {
            initializeVideoShortcuts();
        }
        if (!isLogoReplaced) {
            replaceLogoWithNormalLink();
        }

        // 一度初期化に成功したら以後の監視は不要なので停止
        if (isVideoShortcutRegistered && isLogoReplaced) {
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true, // 直接の子要素
        subtree: true, // すべての子孫要素
        attributes: false
    });
}

/**
 * 番組の終わりまで視聴するとVideo要素が削除されてコントロールが効かなくなる問題の対策
 * Videoの削除を監視して再登録ルートにのせる
 */
const observeVideoElementRemoving = () => {
    // ページ内のvideo要素が存在するかどうかを監視する
    let lastVideoCount = document.getElementsByTagName('video').length;

    // 定期的にvideo要素の数をチェックして削除されていたらフラグを折る
    setInterval(() => {
        const currentVideoCount = document.getElementsByTagName('video').length;
        if (currentVideoCount < lastVideoCount) {
            console.log('[NLY] video');
            isVideoShortcutRegistered = false;
            observeDOMForVideo();
        }
        lastVideoCount = currentVideoCount;
    }, 100);
}

// DOM監視開始
observeDOMForVideo();
observeVideoElementRemoving();






