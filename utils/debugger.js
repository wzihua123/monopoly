// 测试模式管理器
const Debugger = {
  // 测试总开关，设置为 false 将完全禁用所有测试功能
  ENABLE_DEBUG: false,  
  
  // 测试模式状态
  debugMode: false,    // 默认关闭测试模式
  testDiceNumber: 1,  // 测试用骰子点数
  clickCount: 0,       // 点击计数
  clickTimer: null,   // 点击计时器
  page: null,

  // 初始化测试模式
  init(page) {
    // 如果测试功能被禁用，直接返回
    if (!this.ENABLE_DEBUG) {
      return;
    }

    this.page = page;
    this.debugMode = false;
    
    // 初始化页面状态
    this.page.setData({
      debugMode: this.debugMode,
      testDiceNumber: this.testDiceNumber,
      // 只在允许测试且为开发环境时显示测试功能
      env: this.ENABLE_DEBUG && __wxConfig.envVersion === 'develop' ? 'dev' : 'prod'
    });
    
    this.setupClickDetection();
  },

  // 设置点击检测
  setupClickDetection() {
    const originalRollDice = this.page.rollDice;
    this.page.rollDice = function() {
      if (!Debugger.debugMode) {
        Debugger.handleClick();
        if (Debugger.debugMode) return;
      }
      originalRollDice.call(this);
    };
  },

  // 处理连续点击
  handleClick() {
    this.clickCount++;
    clearTimeout(this.clickTimer);
    
    if (this.clickCount >= 5) {
      this.enableDebugMode();
      this.clickCount = 0;
      return;
    }

    this.clickTimer = setTimeout(() => {
      this.clickCount = 0;
    }, 3000);
  },

  // 启用测试模式
  enableDebugMode() {
    this.debugMode = true;
    this.page.setData({ debugMode: true });
    wx.showToast({
      title: '测试模式已开启',
      icon: 'none'
    });

    // 注入测试方法
    this.injectDebugMethods();
  },

  // 注入测试方法
  injectDebugMethods() {
    this.page.setTestDiceNumber = function(e) {
      const number = parseInt(e.detail.value);
      if (number >= 1 && number <= 6) {
        this.setData({ testDiceNumber: number });
      }
    };

    this.page.setPlayerAttribute = function(e) {
      const { attribute, value } = e.currentTarget.dataset;
      const currentValue = this.data.player[attribute];
      this.setData({
        [`player.${attribute}`]: currentValue + parseInt(value)
      });
    };

    // 添加更多测试功能
    this.page.resetGame = function() {
      this.setData({
        'player.money': 1000,
        'player.score': 0,
        'player.exp': 0,
        'player.level': 1,
        'player.position': 0,
        'player.achievements': []
      });
    };

    this.page.setPosition = function(e) {
      const position = parseInt(e.detail.value);
      if (position >= 0 && position < this.data.mapCells.length) {
        this.setData({
          'player.position': position
        });
      }
    };
  },

  // 获取当前骰子点数
  getDiceNumber() {
    return this.debugMode ? this.testDiceNumber : (Math.floor(Math.random() * 6) + 1);
  }
};

module.exports = Debugger; 

