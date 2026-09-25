/*
 * ============================================================
 * АНГЛИЙСКИЙ АЛФАВИТ
 * ============================================================
 * Буквы воспроизводятся из MP3:
 *   ./audio/alphabet/A1.mp3 ... ./audio/alphabet/Z1.mp3
 *
 * Примеры слов по-прежнему произносятся через speakEN().
 * ============================================================
 */

const ALPHABET_DATA = [
  { letter:'A', pronunciation:'/eɪ/ — эй',          word:'apple',      translation:'яблоко' },
  { letter:'B', pronunciation:'/biː/ — би',          word:'ball',       translation:'мяч' },
  { letter:'C', pronunciation:'/siː/ — си',          word:'cat',        translation:'кот' },
  { letter:'D', pronunciation:'/diː/ — ди',          word:'dog',        translation:'собака' },
  { letter:'E', pronunciation:'/iː/ — и',            word:'elephant',   translation:'слон' },
  { letter:'F', pronunciation:'/ɛf/ — эф',            word:'fish',       translation:'рыба' },
  { letter:'G', pronunciation:'/dʒiː/ — джи',         word:'girl',       translation:'девочка' },
  { letter:'H', pronunciation:'/eɪtʃ/ — эйч',         word:'house',      translation:'дом' },
  { letter:'I', pronunciation:'/aɪ/ — ай',            word:'ice cream',  translation:'мороженое' },
  { letter:'J', pronunciation:'/dʒeɪ/ — джей',        word:'juice',      translation:'сок' },
  { letter:'K', pronunciation:'/keɪ/ — кей',          word:'kite',       translation:'воздушный змей' },
  { letter:'L', pronunciation:'/ɛl/ — эл',            word:'lion',       translation:'лев' },
  { letter:'M', pronunciation:'/ɛm/ — эм',            word:'monkey',     translation:'обезьяна' },
  { letter:'N', pronunciation:'/ɛn/ — эн',            word:'nose',       translation:'нос' },
  { letter:'O', pronunciation:'/oʊ/ — оу',            word:'orange',     translation:'апельсин' },
  { letter:'P', pronunciation:'/piː/ — пи',           word:'pencil',     translation:'карандаш' },
  { letter:'Q', pronunciation:'/kjuː/ — кью',         word:'queen',      translation:'королева' },
  { letter:'R', pronunciation:'/ɑːr/ — ар',            word:'rabbit',     translation:'кролик' },
  { letter:'S', pronunciation:'/ɛs/ — эс',            word:'sun',        translation:'солнце' },
  { letter:'T', pronunciation:'/tiː/ — ти',           word:'tiger',      translation:'тигр' },
  { letter:'U', pronunciation:'/juː/ — ю',            word:'umbrella',   translation:'зонт' },
  { letter:'V', pronunciation:'/viː/ — ви',           word:'van',        translation:'фургон' },
  { letter:'W', pronunciation:'/ˈdʌbəl.juː/ — дабл-ю', word:'window', translation:'окно' },
  { letter:'X', pronunciation:'/ɛks/ — экс',          word:'xylophone',  translation:'ксилофон' },
  { letter:'Y', pronunciation:'/waɪ/ — уай',          word:'yellow',     translation:'жёлтый' },
  { letter:'Z', pronunciation:'/zed/ — зед',          word:'zebra',      translation:'зебра' }
];

/* Рисуем карточки алфавита. */
function renderAlphabet(){
  const box = $('alphabet-list');
  if(!box) return;

  box.innerHTML = ALPHABET_DATA.map(item => `
    <div class="alphabet-card">
      <button
        class="alphabet-letter"
        onclick="alphabetPlayLetter('${item.letter}')"
        aria-label="Произнести букву ${item.letter}">
        <span class="alphabet-upper">${item.letter}</span>
        <span class="alphabet-lower">${item.letter.toLowerCase()}</span>
      </button>

      <div class="alphabet-main">
        <div class="alphabet-name">${item.pronunciation}</div>
        <button
          class="alphabet-word"
          onclick="alphabetSpeakWord('${item.word}')">
          <span>
            <b>${item.word}</b>
            <span class="alphabet-translation">${item.translation}</span>
          </span>
          <span class="alphabet-speak">🔊</span>
        </button>
      </div>
    </div>
  `).join('');
}

/* Проигрываем настоящую запись буквы. */
let alphabetAudio = null;

function alphabetPlayLetter(letter){
  const upper = String(letter).toUpperCase();

  /*
   * Сейчас файл L загружен как l1.mp3.
   * Поддерживаем это имя, чтобы L уже работала.
   */
  const fileName = upper === 'L' ? 'l1.mp3' : `${upper}1.mp3`;
  const src = `./audio/alphabet/${fileName}`;

  if(alphabetAudio){
    alphabetAudio.pause();
    alphabetAudio.currentTime = 0;
  }

  alphabetAudio = new Audio(src);
  alphabetAudio.preload = 'auto';
  alphabetAudio.play().catch(error => {
    console.warn('Не удалось воспроизвести запись буквы:', src, error);
  });
}

/* Пример слова оставляем на обычном TTS. */
function alphabetSpeakWord(word){
  speakEN(word);
}
