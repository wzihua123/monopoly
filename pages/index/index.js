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
      exp: 0,
      // 每个等级需要的经验值
      levelExp: [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500],
      // 等级称号
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
      ]
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
        const finalNumber = Math.floor(Math.random() * 6) + 1;
        const newPosition = (this.data.player.position + finalNumber) % this.data.mapCells.length;
        
        setTimeout(() => {
          this.setData({
            diceNumber: finalNumber,
            diceAnimating: false,
            'player.position': newPosition
          });
          
          this.handlePlayerMove();
        }, 800); // 等待动画完成
      }
    }, 100);
  },

  // 处理玩家移动后的事件
  handlePlayerMove() {
    const currentCell = this.data.mapCells[this.data.player.position];

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

    // 检查是否达到胜利条件
    if (this.data.player.score >= this.data.targetScore) {
      this.gameWin();
    }
  },

  // 处理起点奖励
  handleStart() {
    this.setData({
      'player.money': this.data.player.money + 200
    });
    wx.showToast({
      title: '经过起点获得200金币！',
      icon: 'success'
    });
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

  // 处理幸运格
  handleLucky(cell) {
    this.setData({
      'player.money': this.data.player.money + cell.reward
    });
    this.showRewardAnimation(`+${cell.reward} 金币！`);
    this.gainExp(20); // 获得金币时得到经验
  },

  // 处理成就
  handleAchievement(cell) {
    if (!this.data.player.achievements.includes(cell.achievement)) {
      const newAchievements = [...this.data.player.achievements, cell.achievement];
      this.setData({
        'player.achievements': newAchievements,
        'player.score': this.data.player.score + cell.score
      });
      this.showRewardAnimation(`获得成就：${cell.achievement}！`);
      this.gainExp(50); // 获得成就时得到更多经验
    }
  },

  // 处理机会
  handleChance() {
    const rewards = [
      { type: 'money', amount: 100, text: '获得100金币' },
      { type: 'money', amount: 200, text: '获得200金币' },
      { type: 'score', amount: 50, text: '获得50分' }
    ];
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    if (reward.type === 'money') {
      this.setData({
        'player.money': this.data.player.money + reward.amount
      });
    } else {
      this.setData({
        'player.score': this.data.player.score + reward.amount
      });
    }
    
    wx.showToast({
      title: reward.text,
      icon: 'success'
    });
  },

  // 处理陷阱
  handleTrap(cell) {
    const penalty = cell.penalty;
    const newMoney = Math.max(0, this.data.player.money - penalty);
    this.setData({
      'player.money': newMoney
    });
    this.showRewardAnimation(`失去${penalty}金币！😱`);
  },

  // 处理宝箱
  handleTreasure() {
    const treasures = [
      { type: 'money', amount: 1000, text: '获得1000金币！' },
      { type: 'score', amount: 100, text: '获得100分！' },
      { type: 'special', text: '获得双倍奖励卡！' }
    ];
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    
    if (treasure.type === 'money') {
      this.setData({
        'player.money': this.data.player.money + treasure.amount
      });
    } else if (treasure.type === 'score') {
      this.setData({
        'player.score': this.data.player.score + treasure.amount
      });
    }
    
    this.showRewardAnimation(`宝箱开启：${treasure.text}🎉`);
    this.gainExp(30); // 开宝箱得到经验
  },

  // 处理传送门
  handlePortal() {
    const newPosition = Math.floor(Math.random() * this.data.mapCells.length);
    this.setData({
      'player.position': newPosition
    });
    this.showRewardAnimation('随机传送！🌀');
    // 处理新位置的效果
    setTimeout(() => {
      this.handlePlayerMove();
    }, 1000);
  },

  // 处理赌场
  handleCasino() {
    const currentMoney = this.data.player.money;
    const win = Math.random() > 0.5;
    
    if (win) {
      this.setData({
        'player.money': currentMoney * 2
      });
      this.showRewardAnimation('赌场获胜！金币翻倍！🎰');
      this.gainExp(40); // 赌场获胜得到经验
    } else {
      this.setData({
        'player.money': Math.floor(currentMoney / 2)
      });
      this.showRewardAnimation('赌场失败！失去一半金币！😭');
    }
  },

  // 处理商店
  handleShop() {
    wx.showActionSheet({
      itemList: ['购买护盾（300金币）', '购买加分卡（500金币）', '购买传送卡（200金币）'],
      success: (res) => {
        const currentMoney = this.data.player.money;
        switch(res.tapIndex) {
          case 0:
            if (currentMoney >= 300) {
              this.setData({
                'player.money': currentMoney - 300,
                // 这里可以添加护盾效果的实现
              });
              this.showRewardAnimation('购买了护盾！🛡️');
            } else {
              this.showRewardAnimation('金币不足！');
            }
            break;
          case 1:
            if (currentMoney >= 500) {
              this.setData({
                'player.money': currentMoney - 500,
                'player.score': this.data.player.score + 100
              });
              this.showRewardAnimation('使用加分卡，获得100分！📈');
            } else {
              this.showRewardAnimation('金币不足！');
            }
            break;
          case 2:
            if (currentMoney >= 200) {
              this.setData({
                'player.money': currentMoney - 200
              });
              this.handlePortal();
            } else {
              this.showRewardAnimation('金币不足！');
            }
            break;
        }
      }
    });
  },

  // 游戏胜利
  gameWin() {
    this.setData({ gameOver: true });
    wx.showModal({
      title: '恭喜',
      content: '你已经达到目标分数，游戏胜利！',
      showCancel: false
    });
  },

  // 显示游戏规则
  showRules() {
    wx.showModal({
      title: '游戏规则',
      content: `1. 点击"掷骰子"开始游戏

2. 等级系统：
   - 完成不同动作获得经验值
   - 升级可获得金币和分数奖励
   - 解锁不同的冒险家称号

3. 不同格子效果：
   🏠 起点：经过获得200金币
   🎁 小奖励：获得100金币
   💰 大奖励：获得500金币
   🏆 成就点：获得分数和成就
   ❓ 机会：随机奖励
   🏪 商店：购买道具
   ⚡ 陷阱：损失金币
   📦 宝箱：随机宝物
   🎲 赌场：赌博翻倍
   🌀 传送门：随机传送
   
4. 目标：
   获得${this.data.targetScore}分即可通关！
   
5. 经验获取：
   - 获得金币：+20经验
   - 完成成就：+50经验
   - 开启宝箱：+30经验
   - 赌场胜利：+40经验`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#1890ff'
    });
  },

  // 添加获取经验值的方法
  gainExp(exp) {
    let currentExp = this.data.player.exp + exp;
    let currentLevel = this.data.player.level;
    const maxLevel = this.data.player.levelTitles.length;

    // 检查是否可以升级
    while (currentLevel < maxLevel && 
           currentExp >= this.data.player.levelExp[currentLevel]) {
      currentLevel++;
      this.levelUp(currentLevel);
    }

    // 更新经验值
    this.setData({
      'player.exp': currentExp,
      'player.level': currentLevel
    });
  },

  // 升级效果
  levelUp(newLevel) {
    const rewards = {
      money: newLevel * 200,
      score: newLevel * 50
    };

    this.setData({
      'player.money': this.data.player.money + rewards.money,
      'player.score': this.data.player.score + rewards.score
    });

    // 显示升级提示
    wx.showModal({
      title: '🎉 升级啦！',
      content: `恭喜晋升为${this.data.player.levelTitles[newLevel - 1]}！\n获得奖励：\n${rewards.money}金币\n${rewards.score}分数`,
      showCancel: false,
      confirmText: '太棒了',
      confirmColor: '#1890ff'
    });
  },
}); 