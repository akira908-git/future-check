document.getElementById("healthForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  // 1〜10の質問スコア合計
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const val = formData.get(`q${i}`);
    if (!val) {
      alert('全ての質問に回答してください');
      return;
    }
    total += val === 'above' ? 2 : (val === 'standard' ? 1 : 0);
  }

  // 体型スコア
  const bodyType = formData.get('bodyType');
  if (!bodyType) {
    alert('体型を選択してください');
    return;
  }
  const bodyScoreMap = { slim: 0, normal: 1, overweight: 2 };
  total += bodyScoreMap[bodyType] ?? 0;

  // 平均スコア
  const avg = total / 11;
  let result = avg >= 1.5 ? 'good' : avg >= 1.0 ? 'average' : 'bad';

  // 性別・年代
  const gender = formData.get('gender');
  const generation = formData.get('generation');

  // 各質問の回答マップ
  const sleepMap = {
    below: "6時間未満",
    standard: "6〜8時間",
    above: "8時間以上"
  };
  const exerciseMap = {
    below: "週30分未満",
    standard: "週30分〜2時間",
    above: "週2時間以上"
  };
  const walkMap = {
    below: "歩く時間ほとんどなし",
    standard: "30分程度",
    above: "1時間以上"
  };
  const dietMap = {
    below: "野菜不足",
    standard: "普通の野菜摂取",
    above: "十分な野菜摂取"
  };
  const appetiteMap = {
    below: "食欲低下",
    standard: "普通",
    above: "食欲旺盛"
  };
  const fatigueMap = {
    below: "疲れやすい",
    standard: "普通",
    above: "疲れにくい"
  };
  const moodMap = {
    below: "気分が悪いことが多い",
    standard: "普通",
    above: "気分が良い"
  };
  const depressionMap = {
    below: "よく落ち込む",
    standard: "時々落ち込む",
    above: "ほとんど落ち込まない"
  };
  const concentrationMap = {
    below: "集中力・記憶力低下",
    standard: "普通",
    above: "集中力・記憶力良好"
  };
  const conditionMap = {
    below: "体調不良",
    standard: "普通",
    above: "体調良好"
  };

  // 回答取得＆文字列変換
  const sleep = sleepMap[formData.get('q1')] ?? "不明";
  const exercise = exerciseMap[formData.get('q2')] ?? "不明";
  const walk = walkMap[formData.get('q3')] ?? "不明";
  const diet = dietMap[formData.get('q4')] ?? "不明";
  const appetite = appetiteMap[formData.get('q5')] ?? "不明";
  const fatigue = fatigueMap[formData.get('q6')] ?? "不明";
  const mood = moodMap[formData.get('q7')] ?? "不明";
  const depression = depressionMap[formData.get('q8')] ?? "不明";
  const concentration = concentrationMap[formData.get('q9')] ?? "不明";
  const condition = conditionMap[formData.get('q10')] ?? "不明";

  const payload = {
    result,
    gender,
    generation,
    bodyType,
    sleep,
    exercise,
    walk,
    diet,
    appetite,
    fatigue,
    mood,
    depression,
    concentration,
    condition,
  };

  localStorage.setItem('healthResult', JSON.stringify(payload));
  window.location.href = 'result.html';
});
