/*
 * ============================================================
 * ЦИФРЫ И ЧИСЛА
 * ============================================================
 * Раздел содержит числа от 1 до 100.
 * Числа разбиты на небольшие блоки, чтобы их было удобно
 * изучать поэтапно. Озвучка выполняется через speakEN().
 * ============================================================
 */

const NUMBERS_BLOCKS = [
  { title:'1–20', from:1, to:20 },
  { title:'21–30', from:21, to:30 },
  { title:'31–40', from:31, to:40 },
  { title:'41–50', from:41, to:50 },
  { title:'51–60', from:51, to:60 },
  { title:'61–70', from:61, to:70 },
  { title:'71–80', from:71, to:80 },
  { title:'81–90', from:81, to:90 },
  { title:'91–100', from:91, to:100 }
];

const NUMBER_ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const NUMBER_TENS = {
  20:'twenty',
  30:'thirty',
  40:'forty',
  50:'fifty',
  60:'sixty',
  70:'seventy',
  80:'eighty',
  90:'ninety'
};

const NUMBER_RU_ONES = [
  '', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять',
  'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать',
  'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
];

const NUMBER_RU_TENS = {
  20:'двадцать',
  30:'тридцать',
  40:'сорок',
  50:'пятьдесят',
  60:'шестьдесят',
  70:'семьдесят',
  80:'восемьдесят',
  90:'девяносто'
};

function numberEnglish(n){
  if(n < 20) return NUMBER_ONES[n];
  if(n < 100){
    const tens = Math.floor(n / 10) * 10;
    return n % 10 ? NUMBER_TENS[tens] + '-' + NUMBER_ONES[n % 10] : NUMBER_TENS[tens];
  }
  return 'one hundred';
}

function numberRussian(n){
  if(n < 20) return NUMBER_RU_ONES[n];
  if(n < 100){
    const tens = Math.floor(n / 10) * 10;
    return n % 10 ? NUMBER_RU_TENS[tens] + ' ' + NUMBER_RU_ONES[n % 10] : NUMBER_RU_TENS[tens];
  }
  return 'сто';
}

const NUMBER_PRONUNCIATION = {
  1:['/wʌn/','уан'], 2:['/tuː/','ту'], 3:['/θriː/','сри'], 4:['/fɔːr/','фор'],
  5:['/faɪv/','файв'], 6:['/sɪks/','сикс'], 7:['/ˈsevən/','сэвэн'], 8:['/eɪt/','эйт'],
  9:['/naɪn/','найн'], 10:['/ten/','тэн'], 11:['/ɪˈlevən/','илэвэн'], 12:['/twelv/','твэлв'],
  13:['/ˌθɜːrˈtiːn/','сёртин'], 14:['/ˌfɔːrˈtiːn/','фортин'], 15:['/ˌfɪfˈtiːn/','фифтин'],
  16:['/ˌsɪksˈtiːn/','сикстин'], 17:['/ˌsevənˈtiːn/','сэвэнтин'], 18:['/ˌeɪˈtiːn/','эйтин'],
  19:['/ˌnaɪnˈtiːn/','найнтин'],
  20:['/ˈtwenti/','твэнти'], 30:['/ˈθɜːrti/','сёрти'], 40:['/ˈfɔːrti/','форти'],
  50:['/ˈfɪfti/','фифти'], 60:['/ˈsɪksti/','сиксти'], 70:['/ˈsevənti/','сэвэнти'],
  80:['/ˈeɪti/','эйти'], 90:['/ˈnaɪnti/','найнти'], 100:['/wʌn ˈhʌndrəd/','уан хандрэд']
};

const NUMBER_TENS_IPA = {
  20:'/ˈtwenti/', 30:'/ˈθɜːrti/', 40:'/ˈfɔːrti/', 50:'/ˈfɪfti/',
  60:'/ˈsɪksti/', 70:'/ˈsevənti/', 80:'/ˈeɪti/', 90:'/ˈnaɪnti/'
};

const NUMBER_TENS_RU = {
  20:'твэнти', 30:'сёрти', 40:'форти', 50:'фифти',
  60:'сиксти', 70:'сэвэнти', 80:'эйти', 90:'найнти'
};

function numberPronunciation(n){
  if(NUMBER_PRONUNCIATION[n]) return {
    ipa: NUMBER_PRONUNCIATION[n][0],
    ru: NUMBER_PRONUNCIATION[n][1]
  };
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  const one = NUMBER_PRONUNCIATION[ones];
  return {
    ipa: NUMBER_TENS_IPA[tens].slice(0,-1) + ' ' + one[0].replace(/^\//,''),
    ru: NUMBER_TENS_RU[tens] + '-' + one[1]
  };
}

const NUMBERS_DATA = Array.from({length:100}, (_, i) => {
  const number = i + 1;
  return {
    number,
    english: numberEnglish(number),
    translation: numberRussian(number), pronunciation: numberPronunciation(number)
  };
});

let numbersBlock = '1–20';

/* Рисуем весь раздел «Цифры». */
function renderNumbers(){
  const box = $('numbers-content');
  if(!box) return;

  const block = NUMBERS_BLOCKS.find(x => x.title === numbersBlock) || NUMBERS_BLOCKS[0];
  const items = NUMBERS_DATA.filter(x => x.number >= block.from && x.number <= block.to);

  $('numbers-blocks').innerHTML = NUMBERS_BLOCKS.map(x => `
    <button
      class="${x.title === numbersBlock ? 'active' : ''}"
      onclick="selectNumbersBlock('${x.title}')">
      ${x.title}
    </button>
  `).join('');

  box.innerHTML = items.map(item => `
    <div class="number-card">
      <div class="number-value">${item.number}</div>
      <div class="number-main">
        <div class="number-english">${item.english}</div>
        <div class="number-pronunciation">${item.pronunciation.ipa} — ${item.pronunciation.ru}</div>\n        <div class="number-translation">${item.translation}</div>
      </div>
      <button
        class="number-speak"
        onclick="speakNumber(${item.number})"
        aria-label="Произнести ${item.english}">
        🔊
      </button>
    </div>
  `).join('');
}

function selectNumbersBlock(blockTitle){
  numbersBlock = blockTitle;
  renderNumbers();
}

function speakNumber(number){
  const item = NUMBERS_DATA.find(x => x.number === Number(number));
  if(item) speakEN(item.english);
}
