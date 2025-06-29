  document.addEventListener("DOMContentLoaded", () => {
    // ローカルストレージからデータを取得
    const data = JSON.parse(localStorage.getItem('healthResult') || '{}');
    const box = document.getElementById('resultBox');
    const insightsContainer = document.getElementById('insightsContainer');

    // データが不足している場合の処理
    if (!data.result || !data.bodyType) {
      box.innerHTML = '<p>データがありませんでした。</p>';
      insightsContainer.innerHTML = '';
      return;
    }

    // 画像キーとファイルパスを設定
    const key = `${data.result}_${data.gender}_${data.generation}_${data.bodyType}`;
    const imgSrc = `images/${key}.png`;

    // 画像ごとの名称
    const imageNames = {
      good_male_10_slim: '輝く筋肉',
      good_male_30s_normal: '理想の姿',
      good_male_10_overweight: '躍動の変化',
      average_male_10_slim: '挑戦の軌跡',
      average_male_30s_normal: '変化の波',
      average_male_10_overweight: '進化の兆し',
      bad_male_10_slim: '警戒の影',
      bad_male_10_normal: '変わりゆく体調',
      bad_male_10_overweight: '注意の時期'
    };

    // 体型ごとの絵文字
    const bodyTypeEmojis = {
      slim: '✨',
      normal: '👍',
      overweight: '⚠️'
    };

    // ベースメッセージ
    const baseMessages = {
      good: '未来のあなたは元気で健康的！',
      average: 'まずまずの健康状態です。',
      bad: '健康に注意が必要です。'
    };

    // 表示名と結果メッセージの構築
    const uniqueName = imageNames[key] || '未知の未来';
    const emoji = bodyTypeEmojis[data.bodyType] || '';
    const messageToShow = `
      <span class="unique-name">${uniqueName}</span><br />
      ${emoji} ${baseMessages[data.result] || '結果データに問題があります。'}
    `;

    // 生活習慣インサイトの文章
    const insightsText = {
      good: 
        '【総合評価：非常に良好】\n' +
        'あなたの現在の生活習慣は非常に良好で、将来の健康にとって大きな財産となります。バランスの取れた食事、適度な運動、十分な休息がうまく保たれている証拠です。\n' +
        'このままの生活リズムを保つことで、年齢を重ねても活力に満ちた毎日を送ることができるでしょう。\n' +
        '今後もこの良い習慣を継続し、ストレス管理や心のケアにも目を向けることで、より一層健やかな未来を築けるはずです。',

      average: 
        '【総合評価：おおむね良好】\n' +
        'あなたの生活習慣はおおむね整っており、大きな問題は見受けられません。ただし、さらに健康的な未来を目指すためには、いくつかの工夫が効果的です。\n' +
        '例えば、食事の栄養バランスを意識することや、軽い運動を生活の中に取り入れることが挙げられます。\n' +
        '無理のない範囲で改善を積み重ねることで、体調や気分も安定し、将来の自分への大きなプレゼントとなるでしょう。',

      bad: 
        '【総合評価：要注意】\n' +
        '現在の生活習慣には、見直すべき点がいくつかあるようです。体調や気分の変化は日々の生活の影響を大きく受けています。\n' +
        '例えば、夜更かしや偏った食事、運動不足が続くと、健康リスクが高まる恐れがあります。\n' +
        'まずは毎日の睡眠や食事の時間を安定させるなど、小さな改善から始めてみましょう。\n' +
        '自分のペースで少しずつ生活を整えていくことが、未来の健康を守る第一歩になります。必要に応じて専門家のアドバイスを受けることも有効です。'
    };

    // 質問ごとの回答データ（例）
    const answers = {
      sleep: data.sleep,           // 例: "6時間未満", "6〜8時間", "8時間以上"
      exercise: data.exercise,
      walk: data.walk,
      diet: data.diet,
      appetite: data.appetite,
      fatigue: data.fatigue,
      mood: data.mood,
      depression: data.depression,
      concentration: data.concentration,
      condition: data.condition
    };

    // 質問ごとのアドバイスマップ（例）
    const adviceMap = {
    sleep: {
      "6時間未満": "現在の睡眠時間はかなり短めで、身体の回復や脳の休息に十分な時間が確保できていません。慢性的な睡眠不足は免疫力の低下や集中力の低下、さらには生活習慣病のリスク増加にもつながります。できるだけ毎晩7〜8時間の睡眠を目標にし、寝る前のスマホやパソコン使用を控えるなど、質の良い睡眠をとるための環境づくりを心がけましょう。例えば、就寝前のリラックス習慣や部屋の暗さ、温度調整も重要です。",
      "6〜8時間": "適切な睡眠時間が確保できており、身体の回復や心身のリフレッシュに良い状態です。この睡眠リズムを崩さずに維持することが大切です。ただし、睡眠の質も重要なので、寝つきが悪かったり途中で目覚めることがある場合は改善方法を検討しましょう。規則正しい生活リズムを続けることや、カフェインの摂取タイミングに気をつけることもおすすめです。",
      "8時間以上": "十分な睡眠時間が確保できているのは良いことですが、寝すぎも体調不良の原因になる場合があります。例えば、日中の倦怠感や頭痛、逆にだるさを感じることがあるなら、睡眠時間の見直しや生活リズムの調整を検討しましょう。睡眠時間だけでなく、起床時間の一定化や深い眠りを促す生活習慣も意識してみてください。"
    },
    exercise: {
      "週30分未満": "現在の運動量はかなり不足しているため、筋力低下や体力低下のリスクがあります。適度な運動は心臓血管系の健康維持、ストレス解消、睡眠の質向上など多くのメリットをもたらします。無理のない範囲でウォーキングやストレッチ、軽い筋トレを毎日少しずつ取り入れていきましょう。例えば、通勤時に一駅分歩く、家事の合間に体を動かすなど、日常生活での活動量を増やす工夫も効果的です。",
      "週30分〜2時間": "週に30分以上の運動を実施できているのは良好な状態です。運動の頻度や種類を見直して、筋力トレーニングや有酸素運動のバランスを取ることもおすすめです。さらに運動強度を少しずつ上げることで体力向上や代謝アップが期待できます。運動後のストレッチやクールダウンも取り入れて、怪我の防止や疲労回復にも配慮しましょう。",
      "週2時間以上": "十分な運動量を確保できており、健康維持や体力向上に非常に効果的です。これを継続することで心身ともに良好な状態を維持できるでしょう。運動の種類をバラエティ豊かにして、筋肉の偏りや過度の負担を避けることも大切です。また、疲労のサインには敏感になり、休息日を設けるなど適切なセルフケアも忘れずに行いましょう。"
    },
    walk: {
      "歩く時間ほとんどなし": "日常的に歩く機会が非常に少ないため、心肺機能の低下や筋力の衰えを招きやすい状態です。歩行は手軽にできる有酸素運動であり、血流改善や代謝促進に効果があります。意識的に歩く時間を増やすために、エレベーターを使わず階段を利用したり、買い物や通勤での徒歩を取り入れましょう。少しずつ歩数を増やし、習慣化できると良いですね。",
      "30分程度": "30分程度の歩行が習慣化されており、健康維持に役立っています。ウォーキングは心身のリラックス効果も高く、ストレス軽減にも効果的です。今後は歩く速度を上げるなど少し負荷を増やすことで、更なる体力アップやダイエット効果が期待できます。また、自然の多い場所での散歩は精神的なリフレッシュにも繋がるのでおすすめです。",
      "1時間以上": "1時間以上の歩行は素晴らしい習慣で、心肺機能向上や血糖値コントロールにも好影響があります。長時間の歩行は膝や足腰への負担もあるため、適度にストレッチや筋力トレーニングでサポートすることが望ましいです。歩くルートに変化をつけるなど、楽しみながら継続していく工夫も取り入れてみてください。"
    },
    diet: {
      "野菜不足": "野菜の摂取量が不足していることは、ビタミン・ミネラル・食物繊維の不足に繋がり、免疫力低下や便秘、生活習慣病のリスクを高めます。毎食の献立に彩り豊かな野菜を意識的に取り入れることが重要です。生野菜だけでなく、蒸し野菜やスープにして摂る方法も効果的です。また、季節の旬の野菜を選ぶことで栄養価も高く、飽きずに続けやすくなります。",
      "普通の野菜摂取": "日常的に野菜を摂取できているのは良好ですが、さらに多様な種類の野菜や果物を取り入れることで栄養バランスが向上します。特に緑黄色野菜や根菜類、海藻類などを意識的に増やすことで、抗酸化作用や代謝促進効果が期待できます。加工食品や高脂肪食を控え、自然な食材中心の食事を続けましょう。",
      "十分な野菜摂取": "十分な野菜摂取は健康維持の大きな助けとなります。これを継続しつつ、調理方法に気をつけて、塩分や脂質の過剰摂取を避けるようにしましょう。新しいレシピを試すなど、楽しみながらバリエーションを増やすこともおすすめです。また、季節の変わり目に体調を崩さないように、バランスの良い食事を心がけてください。"
    },
    appetite: {
      "食欲低下": "食欲が低下している場合は、身体の不調やストレスのサインである可能性があります。無理に食べようとせず、少量でも栄養価の高い食事を心がけましょう。また、食欲低下が長期間続く場合は、専門家に相談することが大切です。精神的な原因や病気が隠れている場合もあるため、早めの対応が健康回復に繋がります。",
      "普通": "食欲が正常範囲にあり、健康的な状態です。規則正しい食事時間やバランスの良い献立を維持し、体調管理に努めましょう。食欲の変化に気づいたら、その都度体調を振り返り、無理なく調整することがポイントです。",
      "食欲旺盛": "食欲旺盛で元気な状態は良い兆候ですが、食べ過ぎによる体重増加や生活習慣病のリスクを避けるため、バランスの取れた食事を心がけてください。特に脂肪分や糖分の過剰摂取を控え、適度な運動を組み合わせることが重要です。食欲のコントロールも健康維持の大切な要素です。"
    },
    fatigue: {
      "疲れやすい": "疲労感が強いと感じる場合は、睡眠不足や過度なストレス、運動不足が原因となっている可能性があります。十分な休息をとり、リラックスできる時間を確保しましょう。また、軽い運動やストレッチは血行促進や疲労回復に効果的です。栄養バランスにも気を配り、必要なら専門家の助言も検討してください。",
      "普通": "適度に疲労を感じることは自然なことで、身体が適応している証拠です。疲労感が過度でない限りは問題ありませんが、疲れを感じたら無理せず休息を取るようにしましょう。規則正しい生活習慣やストレス管理を継続し、体調を崩さないように心がけてください。",
      "疲れにくい": "体力があり疲れにくい状態は健康的で素晴らしいことです。これを維持するために、バランスの良い食事と適度な運動、質の良い睡眠を継続しましょう。急激な負荷増加やストレスは避け、心身ともに良好な状態を保つよう意識してください。"
    },
    mood: {
      "気分が良い": "気分が良好であることは、心身の健康にとって重要です。この調子を維持するために、リラックスできる時間や趣味の活動を続けましょう。ストレスを感じた時は、深呼吸や軽い運動を取り入れるのも効果的です。",
      "普通": "気分が普通であるのは自然な状態です。気分の変動が大きくなる前に、自分のペースで無理せず過ごしましょう。周囲のサポートを受けることも時には有効です。",
      "気分が悪いことが多い": "気分が優れない状態が続く場合は、ストレスや疲労が原因の可能性があります。十分な休息と適切な相談窓口の利用を検討してください。専門家への相談も視野に入れましょう。"
    },
    depression: {
      "とんど落ち込まない": "落ち込みを感じる頻度が少ないのは良い状態です。引き続き規則正しい生活とストレス管理に努めましょう。",
      "時々落ち込む": "時折落ち込みを感じるのは誰にでもあることですが、長引く場合は注意が必要です。気分転換や周囲の人とのコミュニケーションを増やし、改善に努めましょう。",
      "よく落ち込む": "落ち込みが頻繁にある場合は、うつ症状の可能性もあります。早めに専門家に相談し、適切な支援を受けることをおすすめします。"
    },
    concentration: {
      "集中力・記憶力低下": "集中力や記憶力が良好であるのは素晴らしいことです。引き続き規則正しい生活や適度な休憩を取りながら維持しましょう。",
      "普通": "集中力や記憶力に波がある場合は、疲労やストレスのサインかもしれません。適度な休息や気分転換を意識しましょう。",
      "集中力・記憶力良好": "集中力や記憶力が低下していると感じる場合は、睡眠や栄養、ストレスの管理が必要です。改善が見られない場合は専門家の相談も検討してください。"
    },
    condition: {
      "体調良好": "体調が良好であることは健康の基本です。この状態を保つために、バランスの良い食事と適度な運動を続けましょう。",
      "普通": "体調が普通である場合も、体調管理は大切です。無理をせず休息をとり、体調の変化に注意しましょう。",
      "体調不良": "体調が優れない場合は、早めに原因を探り、適切な対処をしましょう。必要に応じて医療機関の受診をおすすめします。"
    }
  };


    // 質問タイトルを日本語でマッピング
  const questionTitles = {
    sleep: "睡眠時間",
    exercise: "運動量",
    walk: "歩行時間",
    diet: "食事内容",
    appetite: "食欲",
    fatigue: "疲労感",
    mood: "気分",
    depression: "落ち込み頻度",
    concentration: "集中力・記憶力",
    condition: "体調"
  };

  // 質問ごとのアドバイスを生成
  let adviceHtml = '<h3>質問ごとのアドバイス</h3><ul>';
  for (const key in answers) {
    const ans = answers[key];
    const advice = adviceMap[key]?.[ans] || '情報が不足しています。';
    const title = questionTitles[key] || key;  // 日本語タイトル or キー名
    adviceHtml += `<li><strong>${title}:</strong> ${ans}<br>アドバイス: ${advice}</li>`;
  }
  adviceHtml += '</ul>';


    // 結果ボックスの描画
  box.innerHTML = `
      <h2>${messageToShow}</h2>
      <img src="${imgSrc}" alt="30年後のあなた" />
      <p>（画像ファイル名: ${key}.png）</p>
    `;

    // インサイトメッセージ描画
      insightsContainer.innerHTML = `
      <h2>未来のあなたの生活を分析！</h2>
      <div class="insight">
        <p>${insightsText[data.result]}</p>
      </div>
      <div class="advice-section">
        ${adviceHtml}
      </div>
    `;
  });
