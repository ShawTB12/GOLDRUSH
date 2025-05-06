console.log('音声アニメーション設定完了')

// 音声テスト用のスクリプト
function playTestSound() {
  console.log('音声テスト開始');
  
  try {
    const audio = new Audio('/sounds/goldrush-startup-backup.mp3');
    audio.volume = 1.0;
    
    // 音声を再生
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('音声再生成功');
        })
        .catch(err => {
          console.error('音声再生エラー:', err);
          // 2回目の試行
          audio.play().catch(e => console.error('2回目の再生試行も失敗:', e));
        });
    }
  } catch (err) {
    console.error('音声再生中にエラーが発生しました:', err);
  }
}

// グローバルに関数を公開
window.playTestSound = playTestSound;

console.log('音声テスト関数が定義されました。playTestSound()で実行できます。');
