const Debugger = require('../../utils/debugger.js');

Page({
  data: {
    // 玩家数据
    player: {
      name: '玩家',
      money: 1000,
      position: 0,
      score: 0,
      achievements: [],
      level: 1,
      exp: 0
    },
    // 骰子点数
    diceNumber: 1,
    // 目标分数
    targetScore: 1000,
    // 地图格子
    mapCells: [
      { id: 0, name: '起点', type: 'start', description: '每次经过获得200金币', icon: '🏠' },
      { id: 1, name: '小奖励', type: 'lucky', reward: 100, description: '获得100金币', icon: '🎁' },
      { id: 2, name: '初探险', type: 'achievement', achievement: '初次探索', score: 50, description: '获得50分', icon: '🏆' },
      { id: 3, name: '机会', type: 'chance', description: '随机奖励', icon: '❓' },
      { id: 4, name: '商店', type: 'shop', description: '可以购买道具', icon: '🏪' },
      { id: 5, name: '大奖励', type: 'lucky', reward: 500, description: '获得500金币', icon: '💰' },
      { id: 6, name: '冒险家', type: 'achievement', achievement: '勇往直前', score: 100, description: '获得100分', icon: '🌟' },
      { id: 7, name: '陷阱', type: 'trap', penalty: 200, description: '失去200金币', icon: '⚡' },
      { id: 8, name: '休息站', type: 'rest', description: '恢复体力', icon: '☕' },
      { id: 9, name: '宝箱', type: 'treasure', description: '随机获得宝物', icon: '📦' },
      { id: 10, name: '探险家', type: 'achievement', achievement: '探险达人', score: 150, description: '获得150分', icon: '🎯' },
      { id: 11, name: '机会', type: 'chance', description: '随机奖励', icon: '❓' },
      { id: 12, name: '赌场', type: 'casino', description: '赌上全部身家', icon: '🎲' },
      { id: 13, name: '传送门', type: 'portal', description: '随机传送', icon: '🌀' },
      { id: 14, name: '大师', type: 'achievement', achievement: '冒险大师', score: 200, description: '获得200分', icon: '👑' },
      { id: 15, name: '终点', type: 'end', description: '完成一圈', icon: '🏁' }
    ],
    gameOver: false,
    // 添加动画相关数据
    diceAnimating: false,
    showReward: false,
    rewardText: '',
    // 骰子面显示
    diceFaces: {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅'
    },
    diceRotation: 0,  // 骰子旋转角度
    achievements: {
      // 基础成就
      basic: [
        { id: 'first_move', name: '初次启程', desc: '完成第一次移动', score: 50, unlocked: false },
        { id: 'rich_100', name: '小财主', desc: '累计获得1000金币', score: 100, unlocked: false },
        { id: 'rich_500', name: '大富豪', desc: '累计获得5000金币', score: 200, unlocked: false }
      ],
      // 探险成就
      adventure: [
        { id: 'visit_all', name: '环游世界', desc: '访问过所有类型的格子', score: 150, unlocked: false },
        { id: 'lucky_5', name: '幸运之星', desc: '触发5次幸运格', score: 100, unlocked: false },
        { id: 'treasure_3', name: '寻宝达人', desc: '开启3次宝箱', score: 100, unlocked: false }
      ],
      // 赌场成就
      casino: [
        { id: 'casino_win_3', name: '赌神', desc: '在赌场连续获胜3次', score: 200, unlocked: false },
        { id: 'casino_profit', name: '稳赚不赔', desc: '在赌场获得1000金币', score: 150, unlocked: false }
      ],
      // 等级成就
      level: [
        { id: 'level_5', name: '成长之路', desc: '达到5级', score: 150, unlocked: false },
        { id: 'level_max', name: '登峰造极', desc: '达到最高等级', score: 300, unlocked: false }
      ]
    },
    // 成就统计
    stats: {
      totalMoney: 0,
      luckyTimes: 0,
      treasureTimes: 0,
      casinoWinStreak: 0,
      casinoProfit: 0,
      visitedCells: []
    },
    levelExp: [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500],  // 每级所需经验值
    levelTitles: [
      '新手冒险家',
      '初级探险家',
      '熟练冒险家',
      '高级探险家',
      '冒险专家',
      '探险大师',
      '传奇冒险家',
      '冒险王者',
      '探险之神',
      '终极冒险家'
    ],
    levelDescriptions: {
      1: '初来乍到，开始你的冒险之旅',
      2: '逐渐适应，掌握基本玩法',
      3: '小有成就，展现冒险天赋',
      4: '经验丰富，游刃有余',
      5: '技艺精湛，驾轻就熟',
      6: '登峰造极，无所不能',
      7: '传说之境，威名远扬',
      8: '神话传说，无人能及',
      9: '超凡入圣，举世无双',
      10: '冒险之神，永垂不朽'
    },
    env: 'prod',  // 默认为生产环境
    expPercentage: 0,
    scorePercentage: 0,
    // 添加新的数据字段
    gameInitialized: false,
    gameTarget: {
      difficulty: '',
      totalTarget: 0,
      moneyTarget: 0,
      happyTarget: 0,
      honorTarget: 0
    },
    difficultySettings: {
      easy: { total: 60, name: '初等' },
      medium: { total: 80, name: '中等' },
      hard: { total: 100, name: '高等' }
    },
    targetSetup: {
      moneyTarget: 0,
      happyTarget: 0,
      honorTarget: 0
    },
    showTargetSetup: false,
    remaining: 0
  },

  onLoad() {
    this.showDifficultySelect();
  },

  showDifficultySelect() {
    wx.showActionSheet({
      itemList: [
        '初等难度 (总分60，适合新手)',
        '中等难度 (总分80，有一定挑战)',
        '高等难度 (总分100，极具挑战)'
      ],
      success: (res) => {
        const difficulties = ['easy', 'medium', 'hard'];
        const difficulty = difficulties[res.tapIndex];
        const totalTarget = this.data.difficultySettings[difficulty].total;
        
        this.setData({
          'gameTarget.difficulty': difficulty,
          'gameTarget.totalTarget': totalTarget,
          'targetSetup.moneyTarget': 0,
          'targetSetup.happyTarget': 0,
          'targetSetup.honorTarget': 0,
          showTargetSetup: true,
          gameInitialized: false,
          remaining: totalTarget
        });
      }
    });
  },

  adjustTarget(e) {
    const { type, action } = e.currentTarget.dataset;
    const currentValue = parseInt(this.data.targetSetup[`${type}Target`]) || 0;
    const remaining = this.getRemainingTarget();
    
    let newValue = currentValue;
    if (action === 'plus' && remaining > 0) {
      newValue = currentValue + 1;
    } else if (action === 'minus' && currentValue > 0) {
      newValue = currentValue - 1;
    }
    
    this.setData({
      [`targetSetup.${type}Target`]: newValue
    });
  },

  onTargetInput(e) {
    const { type } = e.currentTarget.dataset;
    const value = parseInt(e.detail.value) || 0;
    const currentValue = parseInt(this.data.targetSetup[`${type}Target`]) || 0;
    const remaining = this.getRemainingTarget();
    const maxPossible = currentValue + remaining;
    
    if (value >= 0 && value <= maxPossible) {
      this.setData({
        [`targetSetup.${type}Target`]: value
      });
    } else {
      wx.showToast({
        title: `最大可设置值为${maxPossible}`,
        icon: 'none'
      });
    }
  },

  confirmTargets() {
    const remaining = this.getRemainingTarget();
    if (remaining !== 0) {
      wx.showToast({
        title: `还有${remaining}分未分配`,
        icon: 'error'
      });
      return;
    }
    
    const { moneyTarget, happyTarget, honorTarget } = this.data.targetSetup;
    
    this.setData({
      'gameTarget.moneyTarget': parseInt(moneyTarget) || 0,
      'gameTarget.happyTarget': parseInt(happyTarget) || 0,
      'gameTarget.honorTarget': parseInt(honorTarget) || 0,
      showTargetSetup: false,
      gameInitialized: true
    }, () => {
      this.startGame();
    });
  },

  // 开始游戏
  startGame() {
    const { difficulty, moneyTarget, happyTarget, honorTarget } = this.data.gameTarget;
    const difficultyName = this.data.difficultySettings[difficulty].name;
    
    wx.showModal({
      title: '游戏开始！',
      content: `难度：${difficultyName}\n\n目标：\n金钱值：${moneyTarget}\n幸福值：${happyTarget}\n名誉值：${honorTarget}\n\n开始你的冒险吧！`,
      showCancel: false,
      success: () => {
        this.initGame();
      }
    });
  },

  initGame() {
    const targetScore = this.getTargetScore();
    this.setData({
      targetScore: targetScore,
      scorePercentage: 0,
      expPercentage: 0,
      'player.moneyScore': 0,
      'player.happyScore': 0,
      'player.honorScore': 0
    });
  },

  getTargetScore() {
    const level = this.data.player.level;
    return 1000 * Math.max(1, Math.floor(level / 2));
  },

  getRewardMultiplier() {
    return Math.max(1, Math.floor(this.data.player.level / 2));
  },

  gainScore(score) {
    const levelMultiplier = this.getRewardMultiplier();
    const adjustedScore = score * levelMultiplier;
    const newScore = this.data.player.score + adjustedScore;
    const targetScore = this.getTargetScore();
    
    this.setData({
      'player.score': newScore,
      targetScore: targetScore,
      scorePercentage: Math.min((newScore / targetScore) * 100, 100)
    });

    this.showRewardAnimation(`+${adjustedScore} 分数 ⭐`);

    // 检查游戏胜利条件
    if (newScore >= targetScore) {
      this.gameWin();
    }
  },

  getExpPercentage() {
    const currentLevel = this.data.player.level;
    if (currentLevel >= 10) return 100;
    
    const currentExp = this.data.player.exp;
    const currentLevelExp = this.data.levelExp[currentLevel - 1] || 0;
    const nextLevelExp = this.data.levelExp[currentLevel];
    
    const expNeeded = nextLevelExp - currentLevelExp;
    const expProgress = currentExp - currentLevelExp;
    
    return Math.min(Math.max((expProgress / expNeeded) * 100, 0), 100);
  },

  gainExp(exp) {
    const currentLevel = this.data.player.level;
    const maxLevel = this.data.levelTitles.length;
    
    if (currentLevel >= maxLevel) return;

    const newExp = this.data.player.exp + exp;
    let newLevel = currentLevel;
    
    while (newLevel < maxLevel && newExp >= this.data.levelExp[newLevel]) {
      newLevel++;
    }

    const targetScore = this.getTargetScore();
    
    this.setData({
      'player.exp': newExp,
      'player.level': newLevel,
      expPercentage: this.getExpPercentage(),
      targetScore: targetScore,
      scorePercentage: Math.min((this.data.player.score / targetScore) * 100, 100)
    });

    if (newLevel > currentLevel) {
      this.levelUp(newLevel);
    }
  },

  // 掷骰子
  rollDice() {
    if (this.data.gameOver || this.data.diceAnimating) return;
    
    this.setData({ 
      diceAnimating: true,
      diceRotation: 0
    });
    
    // 骰子动画
    let count = 0;
    const animateInterval = setInterval(() => {
      const tempNumber = Math.floor(Math.random() * 6) + 1;
      const rotation = Math.random() * 360;
      
      this.setData({ 
        diceNumber: tempNumber,
        diceRotation: rotation
      });
      
      count++;
      
      if (count > 10) {
        clearInterval(animateInterval);
        const finalNumber = Debugger.getDiceNumber();
        const currentPosition = this.data.player.position;
        const newPosition = (currentPosition + finalNumber) % this.data.mapCells.length;
        
        this.movePlayer(currentPosition, newPosition, finalNumber);
      }
    }, 100);
  },

  // 添加角色移动动画方法
  movePlayer(start, end, steps) {
    let currentPos = start;
    let moveCount = 0;
    
    const moveInterval = setInterval(() => {
      currentPos = (currentPos + 1) % this.data.mapCells.length;
      moveCount++;
      
      this.setData({
        'player.position': currentPos,
        diceNumber: steps
      });
      
      if (moveCount >= steps) {
        clearInterval(moveInterval);
        this.setData({ diceAnimating: false });
        
        // 只在移动结束时显示最终格子信息和处理效果
        const finalCell = this.data.mapCells[currentPos];
        this.showCellInfo(finalCell);
        setTimeout(() => {
          this.handlePlayerMove();
        }, 500);
      }
    }, 300);
  },

  // 添加显示格子信息的方法
  showCellInfo(cell) {
    let infoText = `到达【${cell.name}】\n${cell.description}`;
    
    switch(cell.type) {
      case 'lucky':
        infoText += `\n奖励：${cell.reward}金币`;
        break;
      case 'achievement':
        infoText += `\n成就：${cell.achievement}`;
        break;
      case 'trap':
        infoText += `\n损失：${cell.penalty}金币`;
        break;
      case 'start':
        infoText += '\n奖励：200金币';
        break;
    }
    
    this.showRewardAnimation(infoText);
  },

  // 处理玩家移动后的事件
  handlePlayerMove: function() {
    const currentCell = this.data.mapCells[this.data.player.position];

    // 记录访问过的格子类型
    let visitedCells = this.data.stats.visitedCells;
    if (!visitedCells.includes(currentCell.type)) {
      visitedCells.push(currentCell.type);
      this.setData({
        'stats.visitedCells': visitedCells
      });
    }

    switch(currentCell.type) {
      case 'start':
        this.handleStart();
        break;
      case 'lucky':
        this.handleLucky(currentCell);
        break;
      case 'achievement':
        this.handleAchievement(currentCell);
        break;
      case 'chance':
        this.handleChance();
        break;
      case 'trap':
        this.handleTrap(currentCell);
        break;
      case 'treasure':
        this.handleTreasure();
        break;
      case 'portal':
        this.handlePortal();
        break;
      case 'casino':
        this.handleCasino();
        break;
      case 'shop':
        this.handleShop();
        break;
    }

    this.checkGameProgress();
  },

  // 修改处理起点奖励
  handleStart() {
    const levelMultiplier = Math.max(1, Math.floor(this.data.player.level / 2));
    const reward = 200 * levelMultiplier;  // 基础奖励 * 等级倍数
    
    this.setData({
      'player.money': this.data.player.money + reward,
      'stats.totalMoney': this.data.stats.totalMoney + reward
    });
    
    this.showRewardAnimation(`经过起点获得${reward}金币！💰`);
    this.gainExp(20 * levelMultiplier);  // 基础经验 * 等级倍数
  },

  // 显示奖励动画
  showRewardAnimation(text) {
    this.setData({
      showReward: true,
      rewardText: text
    });
    
    setTimeout(() => {
      this.setData({
        showReward: false,
        rewardText: ''
      });
    }, 2000);
  },

  // 修改处理幸运格的方法
  handleLucky(cell) {
    const reward = cell.reward * Math.max(1, Math.floor(this.data.player.level / 2));  // 根据等级提升奖励
    
    this.setData({
      'player.money': this.data.player.money + reward,
      'stats.totalMoney': this.data.stats.totalMoney + reward,
      'stats.luckyTimes': this.data.stats.luckyTimes + 1
    });

    this.showRewardAnimation(`获得${reward}金币！💰`);
    
    setTimeout(() => {
      this.gainExp(20 * Math.max(1, Math.floor(this.data.player.level / 3)));  // 根据等级提升经验
    }, 1000);
  },

  // 修改处理成就的方法
  handleAchievement(cell) {
    if (!this.data.player.achievements.includes(cell.achievement)) {
      const levelMultiplier = this.getRewardMultiplier();
      const scoreReward = cell.score * levelMultiplier;
      const newAchievements = [...this.data.player.achievements, cell.achievement];
      
      this.setData({
        'player.achievements': newAchievements
      });

      // 使用gainScore来处理分数增加
      this.gainScore(cell.score);
      this.showRewardAnimation(`获得成就：${cell.achievement}\n+${scoreReward}分 🏆`);
      
      // 延迟给予经验
      setTimeout(() => {
        this.gainExp(50 * levelMultiplier);
      }, 1000);
    }
  },

  // 修改处理机会的方法
  handleChance() {
    const levelMultiplier = this.getRewardMultiplier();
    const rewards = [
      { type: 'money', amount: 100 * levelMultiplier, text: '金币' },
      { type: 'money', amount: 200 * levelMultiplier, text: '金币' },
      { type: 'score', amount: 50, text: '分数' }  // 基础分数，会在gainScore中计算倍率
    ];
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    if (reward.type === 'money') {
      this.setData({
        'player.money': this.data.player.money + reward.amount
      });
      this.showRewardAnimation(`获得${reward.amount}${reward.text}`);
    } else {
      this.gainScore(reward.amount);
    }
  },

  // 修改处理陷阱
  handleTrap(cell) {
    const levelMultiplier = Math.max(1, Math.floor(this.data.player.level / 2));
    const penalty = cell.penalty * levelMultiplier;
    const newMoney = Math.max(0, this.data.player.money - penalty);
    
    this.setData({
      'player.money': newMoney
    });
    
    this.showRewardAnimation(`失去${penalty}金币！😱`);
  },

  // 修改处理宝箱的方法
  handleTreasure() {
    const levelMultiplier = this.getRewardMultiplier();
    const treasures = [
      { type: 'money', amount: 1000 * levelMultiplier, text: '金币' },
      { type: 'score', amount: 100, text: '分数' },  // 基础分数，会在gainScore中计算倍率
      { type: 'special', text: '双倍奖励卡' }
    ];
    
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    
    if (treasure.type === 'money') {
      this.setData({
        'player.money': this.data.player.money + treasure.amount
      });
      this.showRewardAnimation(`宝箱开启：获得${treasure.amount}${treasure.text}！`);
    } else if (treasure.type === 'score') {
      this.gainScore(treasure.amount);
    } else {
      this.showRewardAnimation(`宝箱开启：${treasure.text}！`);
    }
    
    this.gainExp(30 * levelMultiplier);
    this.setData({
      'stats.treasureTimes': this.data.stats.treasureTimes + 1
    });
  },

  // 处理传送门
  handlePortal() {
    const currentPosition = this.data.player.position;
    let newPosition;
    
    do {
      newPosition = Math.floor(Math.random() * this.data.mapCells.length);
    } while (newPosition === currentPosition);

    this.setData({
      'player.position': newPosition
    });

    const cell = this.data.mapCells[newPosition];
    this.showRewardAnimation(`传送到【${cell.name}】！🌀`);
  },

  // 修改处理赌场
  handleCasino() {
    const currentMoney = this.data.player.money;
    const levelMultiplier = Math.max(1, Math.floor(this.data.player.level / 2));
    const win = Math.random() > 0.5;
    
    if (win) {
      const profit = currentMoney * levelMultiplier;  // 赢得金币也受等级影响
      this.setData({
        'player.money': currentMoney + profit,
        'stats.casinoWinStreak': this.data.stats.casinoWinStreak + 1,
        'stats.casinoProfit': this.data.stats.casinoProfit + profit
      });
      this.showRewardAnimation(`赌场获胜！获得${profit}金币！🎰`);
      this.gainExp(40 * levelMultiplier);
    } else {
      const loss = Math.floor(currentMoney / 2);
      this.setData({
        'player.money': currentMoney - loss,
        'stats.casinoWinStreak': 0
      });
      this.showRewardAnimation('赌场失败，损失一半金币...😢');
    }
  },

  // 修改处理商店
  handleShop() {
    const levelMultiplier = this.getRewardMultiplier();
    const items = [
      { 
        name: '护盾', 
        price: 300 * levelMultiplier, 
        reward: 500 * levelMultiplier,
        icon: '🛡️' 
      },
      { 
        name: '加分卡', 
        price: 500 * levelMultiplier, 
        reward: 100,  // 基础分数，会在gainScore中计算倍率
        icon: '📈' 
      },
      { 
        name: '传送卡', 
        price: 200 * levelMultiplier,
        icon: '🌀' 
      }
    ];

    const itemList = items.map(item => `${item.icon} ${item.name}（${item.price}金币）`);

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const currentMoney = this.data.player.money;
        const selectedItem = items[res.tapIndex];

        if (currentMoney >= selectedItem.price) {
          switch(res.tapIndex) {
            case 0: // 护盾
              this.setData({
                'player.money': currentMoney - selectedItem.price + selectedItem.reward
              });
              this.showRewardAnimation(`使用${selectedItem.name}！\n-${selectedItem.price}金币\n+${selectedItem.reward}金币💰`);
              break;

            case 1: // 加分卡
              this.setData({
                'player.money': currentMoney - selectedItem.price
              });
              this.gainScore(selectedItem.reward);
              break;

            case 2: // 传送卡
              this.setData({
                'player.money': currentMoney - selectedItem.price
              });
              this.handlePortal();
              break;
          }
          this.gainExp(30 * levelMultiplier);
        } else {
          this.showRewardAnimation('金币不足！💔');
        }
      }
    });
  },

  // 升级效果
  levelUp: function(newLevel) {
    const rewards = {
      money: newLevel * 200,
      score: newLevel * 50
    };

    this.setData({
      'player.money': this.data.player.money + rewards.money,
      'player.score': this.data.player.score + rewards.score
    });

    wx.showModal({
      title: '🎉 升级啦！',
      content: `恭喜晋升为${this.data.levelTitles[newLevel - 1]}！

等级特权：
${this.data.levelDescriptions[newLevel]}

获得奖励：
${rewards.money}金币
⭐ ${rewards.score}分数

当前进度：
${this.data.player.exp}/${this.data.levelExp[newLevel]}`,
      showCancel: false,
      confirmText: '太棒了',
      confirmColor: '#1890ff'
    });

    // 在升级后重新计算进度条
    this.setData({
      scorePercentage: Math.min((this.data.player.score / this.getTargetScore()) * 100, 100)
    });
  },

  // 检查游戏进度
  checkGameProgress: function() {
    const targetScore = this.getTargetScore();
    const currentScore = this.data.player.score;
    
    this.setData({
      targetScore: targetScore,
      scorePercentage: Math.min((currentScore / targetScore) * 100, 100)
    });

    if (currentScore >= targetScore) {
      this.gameWin();
    }
  },

  // 游戏胜利检查
  gameWin: function() {
    const targetScore = this.getTargetScore();
    this.setData({ gameOver: true });
    wx.showModal({
      title: '恭喜',
      content: `你已经达到目标分数${targetScore}分，游戏胜利！\n当前等级：${this.data.player.level}\n总金币：${this.data.player.money}`,
      showCancel: false
    });
  },

  // 显示规则
  showRules() {
    const multiplier = this.getRewardMultiplier();
    wx.showModal({
      title: '游戏规则',
      content: `1. 点击"掷骰子"开始游戏\n\n2. 等级系统：\n   - 当前等级：${this.data.player.level}\n   - 奖励倍率：${multiplier}倍\n   - 目标分数：${this.getTargetScore()}\n\n3. 不同格子效果：\n   🏠 起点：经过获得${200 * multiplier}金币\n   🎁 小奖励：获得${100 * multiplier}金币\n   💰 大奖励：获得${500 * multiplier}金币\n   🏆 成就点：获得分数和成就\n   ❓ 机会：随机奖励\n   🏪 商店：购买道具\n   ⚡ 陷阱：损失金币\n   📦 宝箱：随机宝物\n   🎲 赌场：赌博翻倍\n   🌀 传送门：随机传送\n\n4. 目标：\n   获得${this.getTargetScore()}分即可通关！\n\n5. 当前状态：\n   金币：${this.data.player.money}\n   分数：${this.data.player.score}/${this.getTargetScore()}\n   等级：${this.data.player.level}`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#1890ff'
    });
  },

  // 添加成就检查方法
  checkAchievements() {
    let updated = false;
    const stats = this.data.stats;
    const achievements = this.data.achievements;
    const level = this.data.player.level;
    const multiplier = this.getRewardMultiplier();

    // 检查基础成就
    if (!achievements.basic[0].unlocked) {
      achievements.basic[0].unlocked = true;
      this.unlockAchievement(achievements.basic[0]);
      updated = true;
    }
    
    // 动态调整金币成就阈值
    if (stats.totalMoney >= (1000 * multiplier) && !achievements.basic[1].unlocked) {
      achievements.basic[1].unlocked = true;
      this.unlockAchievement(achievements.basic[1]);
      updated = true;
    }
    if (stats.totalMoney >= (5000 * multiplier) && !achievements.basic[2].unlocked) {
      achievements.basic[2].unlocked = true;
      this.unlockAchievement(achievements.basic[2]);
      updated = true;
    }

    // 检查探险成就
    if (stats.visitedCells.length === new Set(this.data.mapCells.map(cell => cell.type)).size 
        && !achievements.adventure[0].unlocked) {
      achievements.adventure[0].unlocked = true;
      this.unlockAchievement(achievements.adventure[0]);
      updated = true;
    }
    if (stats.luckyTimes >= 5 && !achievements.adventure[1].unlocked) {
      achievements.adventure[1].unlocked = true;
      this.unlockAchievement(achievements.adventure[1]);
      updated = true;
    }
    if (stats.treasureTimes >= 3 && !achievements.adventure[2].unlocked) {
      achievements.adventure[2].unlocked = true;
      this.unlockAchievement(achievements.adventure[2]);
      updated = true;
    }

    // 检查赌场成就
    if (stats.casinoWinStreak >= 3 && !achievements.casino[0].unlocked) {
      achievements.casino[0].unlocked = true;
      this.unlockAchievement(achievements.casino[0]);
      updated = true;
    }
    if (stats.casinoProfit >= 1000 && !achievements.casino[1].unlocked) {
      achievements.casino[1].unlocked = true;
      this.unlockAchievement(achievements.casino[1]);
      updated = true;
    }

    // 检查等级成就
    if (this.data.player.level >= 5 && !achievements.level[0].unlocked) {
      achievements.level[0].unlocked = true;
      this.unlockAchievement(achievements.level[0]);
      updated = true;
    }
    if (this.data.player.level >= 10 && !achievements.level[1].unlocked) {
      achievements.level[1].unlocked = true;
      this.unlockAchievement(achievements.level[1]);
      updated = true;
    }

    if (updated) {
      this.setData({ achievements: achievements });
    }
  },

  // 解锁成就
  unlockAchievement(achievement) {
    const newScore = this.data.player.score + achievement.score;
    
    this.setData({
      'player.score': newScore
    });

    wx.showModal({
      title: '🏆 解锁成就',
      content: `${achievement.name}\n${achievement.desc}\n奖励：${achievement.score}分`,
      showCancel: false,
      confirmText: '太棒了',
      success: () => {
        // 延迟显示经验获得提示
        setTimeout(() => {
          this.gainExp(50);
        }, 500);
      }
    });
  },

  // 添加查看成就列表方法
  showAchievements() {
    let achievementList = '';
    const categories = ['basic', 'adventure', 'casino', 'level'];
    
    categories.forEach(category => {
      this.data.achievements[category].forEach(achievement => {
        const status = achievement.unlocked ? '✅' : '🔒';
        achievementList += `${status} ${achievement.name}\n${achievement.desc}\n\n`;
      });
    });

    wx.showModal({
      title: '成就列表',
      content: achievementList,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 添加查看等级说明方法
  showLevelInfo() {
    let levelInfo = '等级系统说明：\n\n';
    
    for (let i = 1; i <= 10; i++) {
      levelInfo += `${i}级 ${this.data.levelTitles[i-1]}\n`;
      levelInfo += `需要经验：${this.data.levelExp[i]}\n`;
      levelInfo += `${this.data.levelDescriptions[i]}\n\n`;
    }

    wx.showModal({
      title: '等级说明',
      content: levelInfo,
      showCancel: false,
      confirmText: '明白了'
    });
  },

  // 修改玩家属性方法
  setPlayerAttribute(e) {
    const { attribute, value } = e.currentTarget.dataset;
    const currentValue = this.data.player[attribute];
    const newValue = currentValue + parseInt(value);
    
    this.setData({
      [`player.${attribute}`]: newValue,
      // 同步更新进度条
      expPercentage: attribute === 'exp' ? this.getExpPercentage() : this.data.expPercentage,
      scorePercentage: attribute === 'score' ? (newValue / this.data.targetScore) * 100 : this.data.scorePercentage
    });
  },

  // 获取剩余可分配分数
  getRemainingTarget() {
    const totalTarget = this.data.gameTarget.totalTarget;
    const { moneyTarget, happyTarget, honorTarget } = this.data.targetSetup;
    return totalTarget - (parseInt(moneyTarget) || 0) - (parseInt(happyTarget) || 0) - (parseInt(honorTarget) || 0);
  }
}); 