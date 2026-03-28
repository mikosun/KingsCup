const suits = ['♠', '♥', '♦', '♣']; // スペード、ハート、ダイヤ、クラブ
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let drawnCards = new Set();
let currentCard = null;
let jokerCount = 0;

// デッキの初期化
function initializeDeck() {
    deck = [];
    // 通常のカード
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit, rank, isJoker: false });
        }
    }
    // ジョーカー (2枚)
    deck.push({ suit: 'JOKER', rank: 'JOKER', isJoker: true });
    deck.push({ suit: 'JOKER', rank: 'JOKER', isJoker: true });
}

// カードを引く
function drawCard() {
    // 引かれていないカードをインデックス付きで取得
    const availableCardsWithIndex = deck
        .map((card, index) => ({ card, index }))
        .filter(elt => !drawnCards.has(elt.index));
    
    if (availableCardsWithIndex.length === 0) {
        alert('すべてのカードが引かれました！');
        return;
    }

    // ランダムにカードを選択
    const randomIndex = Math.floor(Math.random() * availableCardsWithIndex.length);
    const { card: selectedCard, index: deckIndex } = availableCardsWithIndex[randomIndex];

    drawnCards.add(deckIndex);
    currentCard = selectedCard;
    displayCard(selectedCard);
    updateStats();
}

// カードを表示
function displayCard(card) {
    const cardDisplay = document.getElementById('cardDisplay');
    const cardInfo = document.getElementById('cardInfo');
    const rulesList = document.querySelector('.rules-list');

    // 前のハイライトを削除
    document.querySelectorAll('.rule.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });

    if (card.isJoker) {
        jokerCount++;
        cardDisplay.innerHTML = '🃏';
        cardDisplay.className = 'card joker';
        cardDisplay.removeAttribute('data-rank');
        if (jokerCount === 1) {
            cardInfo.textContent = '次にJOKERが出たらショット2杯！';
        } else {
            cardInfo.textContent = 'JOKER2回目！ショット2杯！';
        }
        // JOKERのルールをハイライト
        const jokerRules = rulesList.querySelectorAll('[data-rank="JOKER"]');
        jokerRules.forEach(rule => rule.classList.add('highlighted'));
    } else {
        const suitSymbol = card.suit;
        const rankText = card.rank;
        const isRed = card.suit === '♥' || card.suit === '♦';
        
        cardDisplay.innerHTML = `<div class="card-suit">${suitSymbol}</div><div class="card-rank">${rankText}</div>`;
        cardDisplay.className = `card ${isRed ? 'red' : 'black'}`;
        cardDisplay.setAttribute('data-rank', rankText);
        cardInfo.textContent = `${rankText}${suitSymbol} - ${validateRule(card)}`;
        
        // 対応するルールをハイライト
        const targetRules = rulesList.querySelectorAll(`[data-rank="${rankText}"]`);
        targetRules.forEach(rule => rule.classList.add('highlighted'));
    }
}

// ルールを取得
function validateRule(card) {
    const rank = card.rank;
    const rules = {
        'A': '引いた人以外がグイ',
        '2': '指名された人がグイ',
        '3': '引いた人がグイ',
        '4': '女子がグイ',
        '5': '引いた人の左右がグイ',
        '6': '男子がグイ',
        '7': '出たら片手を上げて遅い人がグイ',
        '8': '連帯責任の相棒を決める',
        '9': '好きなゲーム',
        '10': '次のターン3枚引く',
        'J': '好きなルール作る',
        'Q': 'クエスチョンマスター',
        'K': '4枚目を引いた人がショットをグイ'
    };
    return rules[rank] || '';
}

// 統計を更新
function updateStats() {
    const total = deck.length;
    const remaining = total - drawnCards.size;
    document.getElementById('stats').textContent = `残りのカード: ${remaining}/${total}`;
}

// リセット
function reset() {
    drawnCards.clear();
    currentCard = null;
    jokerCount = 0;
    
    // ハイライトを削除
    document.querySelectorAll('.rule.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    
    const cardDisplay = document.getElementById('cardDisplay');
    cardDisplay.innerHTML = '?';
    cardDisplay.className = 'card empty-card';
    cardDisplay.removeAttribute('data-rank');
    document.getElementById('cardInfo').textContent = '';
    updateStats();
}

// イベントリスナー
document.getElementById('drawBtn').addEventListener('click', drawCard);
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('本当にリセットしますか？')) {
        reset();
    }
});

// 初期化
initializeDeck();
updateStats();
