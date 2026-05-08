'use strict';

// Haircut1000美学7軸診断の質問データ
// 各質問は1つの軸に紐づき、回答（0-3点）がその軸のスコアになる
const CHOICES = [
  { label: 'とても面白い', score: 3 },
  { label: 'まあ面白い', score: 2 },
  { label: '微妙', score: 1 },
  { label: '無理', score: 0 },
];

const QUESTIONS = [
  {
    axis: 'α',
    text: '岡田斗司夫が「今日、好きになりました。」を真面目に解説する動画があったら、どう感じる？',
    choices: CHOICES,
  },
  {
    axis: 'β',
    text: '「lainちゃん、お父さん作るときにコンビニで何買いだめしたの？」という考察動画は？',
    choices: CHOICES,
  },
  {
    axis: 'γ',
    text: 'みんながもう触らなくなった『100日後に死ぬワニ』を、4コマ目で毎回死なせる二次創作は？',
    choices: CHOICES,
  },
  {
    axis: 'δ',
    text: '女性声優の服を紹介するアカウントを見て、その服でファッションショーのは？',
    choices: CHOICES,
  },
  {
    axis: 'ε',
    text: 'ポケモン全種の見た目と名前を平均化して「平均のポケモン」を一匹つくるのは？',
    choices: CHOICES,
  },
  {
    axis: 'ζ',
    text: '「悲しいニュースとどうでもいい話、交互にしよう」というLove2000フォーマットの縛り大喜利は？',
    choices: CHOICES,
  },
  {
    axis: 'η',
    text: '架空世界「下腦」の地名を覚えるために語呂合わせを作るのは？',
    choices: CHOICES,
  },
];
