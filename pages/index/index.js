const Debugger = require('../../utils/debugger.js');

Page({
  data: {
    // 玩家数据
    player: {
      name: '玩家',
      money: 0,        // 实际金币
      moneyScore: 0,   // 金币积分（每100金币=1积分）
      position: 0,
      score: 0,
      achievements: [],
      level: 1,
      exp: 0,
      happyScore: 0,   // 幸福值
      honorScore: 0,   // 名誉值
      hasShield: false,
      skillCount: 0,
      channelHistory: {}
    },
    // 骰子点数
    diceNumber: 1,
    // 目标分数
    targetScore: 1000,
    // 地图格子
    mapCells: {
      outer: [
        { id: 0, type: 'start', name: '梦的起点', icon: '/resource/w1.png', desc: '选择获得：1000金币/1点幸福值/1点名誉值' },
        { id: 1, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 2, type: 'tax', name: '依法纳税', icon: '/resource/w3.png', desc: '根据金币数量缴纳税款' },
        { id: 3, type: 'chance', name: '机会', icon: '/resource/w4.png', desc: '抽取机会卡' },
        { id: 4, type: 'entrance', name: '就业入口', icon: '/resource/w5.png', channelId: 'F', desc: '开发绿色农产品，付500金币进入' },
        { id: 5, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 6, type: 'carShow', name: '新能源汽车展销会', icon: '/resource/w7.png', desc: '每1000金币购车可得1名誉值' },
        { id: 7, type: 'entrance', name: '技能学习入口', icon: '/resource/w8.png', channelId: 'A', desc: '交500学费入学' },
        { id: 8, type: 'hospital', name: '医院', icon: '/resource/w9.png', desc: '1.不可使用经验卡或机会卡出院\n2.骰子点数<3可出院\n3.或支付50%金币出院', 
          rules: {
            diceLimit: 3,
            costRate: 0.5,
            noCards: true
          }
        },
        { id: 9, type: 'chance', name: '机会卡', icon: '/resource/w4.png', desc: '抽取机会卡' },
        { id: 10, type: 'fee', name: '所有人缴纳娱乐费', icon: '/resource/w11.png', 
          desc: '根据幸福值缴纳费用：\n1-5点：3000金币\n6-20点：2000金币\n21点以上：1000金币',
          feeRules: [
            { min: 1, max: 5, fee: 3000 },
            { min: 6, max: 20, fee: 2000 },
            { min: 21, max: 999, fee: 1000 }
          ]
        },
        { id: 11, type: 'entrance', name: '就业入口：经营企业', icon: '/resource/w12.png', channelId: 'B',
          desc: '条件：3次学习技能经历/付5000金币/已有本通道经历',
          requirements: {
            skillCount: 3,
            fee: 5000
          }
        },
        { id: 12, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 13, type: 'phone', name: '换新手机', icon: '/resource/w14.png',
          desc: '3000金币换一台，每台获得骰子点数的幸福值，最多换两台',
          cost: 3000,
          maxCount: 2
        },
        { id: 14, type: 'entrance', name: '就业入口：开发旅游目的地', icon: '/resource/w15.png', channelId: 'C',
          desc: '条件：付500金币或已有本通道经历',
          requirements: {
            fee: 500
          }
        },
        { id: 15, type: 'chance', name: '机会', icon: '/resource/w4.png', desc: '抽取机会卡' },
        { id: 16, type: 'tourist', name: '旅游区', icon: '/resource/w17.png',
          desc: '获得2点幸福值，可选择停留获得3点幸福值，最多停留两轮',
          initialHappy: 2,
          stayHappy: 3,
          maxStay: 2
        },
        { id: 17, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 18, type: 'lottery', name: '购买福利彩票', icon: '/resource/w19.png',
          desc: '花费1000金币投骰子，点数为6时获得6000金币',
          cost: 1000,
          reward: 6000,
          winNumber: 6
        },
        { id: 19, type: 'entrance', name: '就业入口：担任公职', icon: '/resource/w20.png', channelId: 'D',
          desc: '条件：付5000金币/3次学习技能经历/已有本通道经历',
          requirements: {
            fee: 5000,
            skillCount: 3
          }
        },
        { id: 20, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 21, type: 'consume', name: '消费', icon: '/resource/w22.png',
          desc: '骰子点数×300金币消费，获得等量名誉值和幸福值',
          multiplier: 300
        },
        { id: 22, type: 'entrance', name: '就业入口：乡村振兴电商创业', icon: '/resource/w23.png', channelId: 'E',
          desc: '条件：付500金币或已有本通道经历',
          requirements: {
            fee: 500
          }
        },
        { id: 23, type: 'chance', name: '机会', icon: '/resource/w4.png', desc: '抽取机会卡' },
        { id: 24, type: 'park', name: '公园', icon: '/resource/w25.png',
          desc: '不可使用卡片，骰子点数<4可离开',
          rules: {
            diceLimit: 4,
            noCards: true
          }
        },
        { id: 25, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 26, type: 'stock', name: '股票市场', icon: '/resource/w27.png',
          desc: '2000金币买入，骰子点数×1000金币卖出',
          cost: 2000,
          multiplier: 1000
        },
        { id: 27, type: 'entrance', name: '就业入口：开发绿色能源', icon: '/resource/w29.png', channelId: 'F',
          desc: '条件：付5000金币/3次学习技能经历/已有本通道经历',
          requirements: {
            fee: 5000,
            skillCount: 3
          }
        },
        { id: 28, type: 'exp', name: '经验', icon: '/resource/w2.png', desc: '抽取经验卡' },
        { id: 29, type: 'exchange', name: '心灵驿站', icon: '/resource/w30.png',
          desc: '1000金币可兑换1名誉值或1幸福值',
          cost: 1000
        },
        { id: 30, type: 'entrance', name: '就业入口：参与载人航天', icon: '/resource/w32.png', channelId: 'G',
          desc: '条件：付5000金币/3次学习技能经历/已有本通道经历',
          requirements: {
            fee: 5000,
            skillCount: 3
          }
        },
        { id: 31, type: 'award', name: '获得五一劳动奖章', icon: '/resource/w31.png',
          desc: '根据名誉值获得幸福值：\n<10点：3点\n11-20点：5点\n≥21点：8点',
          rewards: [
            { max: 10, happy: 3 },
            { min: 11, max: 20, happy: 5 },
            { min: 21, happy: 8 }
          ]
        }
      ],
      channels: {
        F: [ // 开发绿色能源通道
          { id: 'F1', type: 'bonus', name: '发现优质风能', icon: '🌪️', desc: '获得8幸福值', happy: 8 },
          { id: 'F2', type: 'action', name: '建设新的风电场', icon: '⚡', desc: '再摇一次骰子' },
          { id: 'F3', type: 'penalty', name: '施工道路局部塌方', icon: '⚠️', desc: '强制停止30秒', stopTime: 30 },
          { id: 'F4', type: 'bonus', name: '发现新品种植物', icon: '🌿', desc: '获得2点名誉值和4点幸福值', honor: 2, happy: 4 },
          { id: 'F5', type: 'exp', name: '用最新数字技术设计机组', icon: '💻', desc: '抽2张经验卡', expCount: 2 },
          { id: 'F6', type: 'bonus', name: '改进施工技术', icon: '🔧', desc: '获得10点幸福值', happy: 10 },
          { id: 'F7', type: 'transfer', name: '日夜赶工累倒了', icon: '😫', desc: '跳转到外圈《医院》', target: 'hospital' },
          { id: 'F8', type: 'bonus', name: '技术降本增效', icon: '💰', desc: '获得10000金币', money: 10000 },
          { id: 'F9', type: 'bonus', name: '技术分享报告', icon: '🎤', desc: '获得2点名誉值和4点幸福值', honor: 2, happy: 4 },
          { id: 'F10', type: 'bonus', name: '徒弟比赛获奖', icon: '🏆', desc: '获得6点幸福值', happy: 6 },
          { id: 'F11', type: 'bonus', name: '获评"工匠大师"', icon: '👑', desc: '获得10点幸福值', happy: 10 }
        ],
        A: [ // 技能学习通道
          { id: 'A1', type: 'bonus', name: '参加感兴趣的技能培训', icon: '📝', desc: '获得4点幸福值', happy: 4 },
          { id: 'A2', type: 'penalty', name: '新的学习法不太适应', icon: '😕', desc: '强制暂停30秒', stopTime: 30 },
          { id: 'A3', type: 'bonus', name: '作业得到老师肯定', icon: '👍', desc: '获得2点名誉值', honor: 2 },
          { id: 'A4', type: 'penalty', name: '加班搞清楚技术难题', icon: '💪', desc: '扣除骰子点数相同的幸福值', happyPenalty: 'dice' },
          { id: 'A5', type: 'bonus', name: '掌握技术', icon: '💡', desc: '获得1000金币', money: 1000 },
          { id: 'A6', type: 'bonus', name: '获评技术学习标兵', icon: '🎖️', desc: '获得6点名誉值', honor: 6 },
          { id: 'A7', type: 'chance', name: '得到优质实习机会', icon: '🎯', desc: '抽两次机会卡', chanceCount: 2 }
        ],
        B: [ // 经营企业通道
          { id: 'B1', type: 'exp', name: '被公司录用，试用期', icon: '/resource/w1.png', desc: '抽两张经验卡', expCount: 2 },
          { id: 'B2', type: 'bonus', name: '向客户做简报，获得领导赏识', icon: '/resource/w1.png', desc: '获得4点幸福值', happy: 4 },
          { id: 'B3', type: 'bonus', name: '开出首单，获得奖金', icon: '💰', desc: '获得5000金币', money: 5000 },
          { id: 'B4', type: 'penalty', name: '与客户沟通不良造成损失', icon: '😓', desc: '强制停留30秒', stopTime: 30 },
          { id: 'B5', type: 'bonus', name: '助力新产品研发获奖', icon: '🏆', desc: '获得6点名誉值', honor: 6 },
          { id: 'B6', type: 'bonus', name: '与大客户签约合作', icon: '📝', desc: '获得10000金币', money: 10000 },
          { id: 'B7', type: 'bonus', name: '准确投资', icon: '📈', desc: '获得4000金币', money: 4000 },
          { id: 'B8', type: 'transfer', name: '平时疏于陪伴家人，休假弥补', icon: '👨‍👩‍👧‍👦', desc: '角色调至旅游区', target: 'tourist' },
          { id: 'B9', type: 'bonus', name: '工作表现突出，职位晋升', icon: '📈', desc: '获得2点名誉值和2点幸福值', honor: 2, happy: 2 },
          { id: 'B10', type: 'penalty', name: '下属品管不周，客户退货', icon: '📦', desc: '扣除50%金币', moneyPenaltyRate: 0.5 },
          { id: 'B11', type: 'bonus', name: '认真整改，争取新订单', icon: '✍️', desc: '获得6000金币', money: 6000 }
        ],
        C: [ // 开发旅游目的地通道
          { id: 'C1', type: 'transfer', name: '长途跋涉累倒', icon: '/resource/w1.png', desc: '角色跳转至医院', target: 'hospital' },
          { id: 'C2', type: 'bonus', name: '发现天然温泉', icon: '/resource/w1.png', desc: '获得2点幸福值', happy: 2 },
          { id: 'C3', type: 'exp', name: '向公司提交开发报告', icon: '📑', desc: '抽两张经验卡', expCount: 2 },
          { id: 'C4', type: 'penalty', name: '开发计划受到当地村民质疑', icon: '😠', desc: '失去骰子相同点数的幸福值', happyPenalty: 'dice' },
          { id: 'C5', type: 'bonus', name: '耐心和村民沟通，得到认可和支持', icon: '🤝', desc: '获得6点名誉值', honor: 6 },
          { id: 'C6', type: 'bonus', name: '开始营业', icon: '🎉', desc: '获得6点名誉值', honor: 6 },
          { id: 'C7', type: 'bonus', name: '客流开门红', icon: '💫', desc: '获得骰子点数×1000金币', moneyMultiplier: 1000 },
          { id: 'C8', type: 'bonus', name: '成为网红打卡地', icon: '📸', desc: '获得2名誉值和4幸福值', honor: 2, happy: 4 },
          { id: 'C9', type: 'bonus', name: '受到公司嘉奖', icon: '🎖️', desc: '获得1000金币', money: 1000 }
        ],
        D: [ // 担任公职通道
          { id: 'D1', type: 'bonus', name: '到基层实习得到居民认可', icon: '/resource/w1.png', desc: '获得4幸福值', happy: 4 },
          { id: 'D2', type: 'bonus', name: '提出有效工作建议受领导嘉奖', icon: '/resource/w1.png', desc: '获得与骰子点数相同的名誉值', honorMultiplier: 1 },
          { id: 'D3', type: 'bonus', name: '为社区留守儿童心理健康项目募捐', icon: '🧸', desc: '获得6000金币', money: 6000 },
          { id: 'D4', type: 'bonus', name: '考取公职', icon: '📜', desc: '获得6点名誉值', honor: 6 },
          { id: 'D5', type: 'transfer', name: '工作繁忙累倒', icon: '😫', desc: '角色跳转至医院', target: 'hospital' },
          { id: 'D6', type: 'exp', name: '协助上级单位举办活动', icon: '🎪', desc: '抽两张经验卡', expCount: 2 },
          { id: 'D7', type: 'penalty', name: '表现突出，单位推荐外出进修', icon: '📚', desc: '强制暂停30秒', stopTime: 30 },
          { id: 'D8', type: 'bonus', name: '下乡担任乡村振兴驻村第一书记', icon: '🏡', desc: '获得10名誉值', honor: 10 },
          { id: 'D9', type: 'penalty', name: '资助当地孤儿学技术', icon: '👶', desc: '失去骰子点数×1000金币', moneyPenaltyMultiplier: 1000 },
          { id: 'D10', type: 'bonus', name: '资助的学生在技能大赛中获奖', icon: '🏆', desc: '获得10幸福值', happy: 10 },
          { id: 'D11', type: 'bonus', name: '职位获得晋升', icon: '📈', desc: '获得6点名誉值和6点幸福值', honor: 6, happy: 6 }
        ],
        E: [ // 乡村振兴电商创业通道
          { id: 'E1', type: 'exp', name: '返乡电商创业，打造农产品IP', icon: '/resource/w1.png', desc: '抽两张经验卡', expCount: 2 },
          { id: 'E2', type: 'bonus', name: '产品获得顾客认可', icon: '/resource/w1.png', desc: '获得2000金币', money: 2000 },
          { id: 'E3', type: 'bonus', name: '获得达人推荐，产品大卖', icon: '🌟', desc: '获得4000金币', money: 4000 },
          { id: 'E4', type: 'penalty', name: '部分顾客不喜欢产品', icon: '😕', desc: '失去50%的幸福值', happyPenaltyRate: 0.5 },
          { id: 'E5', type: 'bonus', name: '许多回头客加入了粉丝社群', icon: '👥', desc: '获得2点名誉值和2点幸福值', honor: 2, happy: 2 },
          { id: 'E6', type: 'penalty', name: '部分售后未及时处理', icon: '⚠️', desc: '失去50%的名誉值', honorPenaltyRate: 0.5 },
          { id: 'E7', type: 'bonus', name: '作为创业的典范，受到当地媒体报道', icon: '📰', desc: '获得4点名誉值和4点幸福值', honor: 4, happy: 4 },
          { id: 'E8', type: 'bonus', name: '得到当地创业基金扶持', icon: '💰', desc: '获得2000金币', money: 2000 },
          { id: 'E9', type: 'bonus', name: '产品打入高端超市', icon: '🏪', desc: '获得1000金币', money: 1000 }
        ],
        G: [ // 参与载人航天通道
          { id: 'G1', type: 'bonus', name: '运载火箭制造完成', icon: '/resource/w1.png', desc: '获得6幸福值', happy: 6 },
          { id: 'G2', type: 'exp', name: '成功发射', icon: '/resource/w1.png', desc: '抽2张经验卡', expCount: 2 },
          { id: 'G3', type: 'bonus', name: '身体素质过硬，克服失重环境', icon: '💪', desc: '获得5名誉值', honor: 5 },
          { id: 'G4', type: 'penalty', name: '联地通讯设备故障', icon: '📡', desc: '失去3000金币', money: -3000 },
          { id: 'G5', type: 'bonus', name: '紧急抢修恢复正常', icon: '🔧', desc: '获得2点名誉值和4点幸福值', honor: 2, happy: 4 },
          { id: 'G6', type: 'bonus', name: '驾驶技术卓越完美躲避太空障碍', icon: '🎯', desc: '获得6名誉值', honor: 6 },
          { id: 'G7', type: 'bonus', name: '飞船与空间站对接成功', icon: '🛰️', desc: '获得骰子相同点数的幸福值', happyMultiplier: 1 },
          { id: 'G8', type: 'bonus', name: '发现新的太空细菌', icon: '🔬', desc: '获得10名誉值', honor: 10 },
          { id: 'G9', type: 'bonus', name: '与地面亲友进行音视频交流', icon: '📹', desc: '获得10幸福值', happy: 10 },
          { id: 'G10', type: 'bonus', name: '成功完成在轨科研项目', icon: '📊', desc: '获得10000金币', money: 10000 },
          { id: 'G11', type: 'bonus', name: '成功返回地球', icon: '🌍', desc: '获得6名誉值和4幸福值', honor: 6, happy: 4 },
          { id: 'G12', type: 'transfer', name: '发成持续性骨丢失症', icon: '🦴', desc: '角色跳转至医院', target: 'hospital' },
          { id: 'G13', type: 'bonus', name: '把经历写成畅销书', icon: '📖', desc: '获得5000金币', money: 5000 }
        ],
        H: [ // 开发绿色农产品通道
          { id: 'H1', type: 'bonus', name: '发现新品优质农产品', icon: '/resource/w1.png', desc: '获得2幸福值', happy: 2 },
          { id: 'H2', type: 'exp', name: '引进家乡试种', icon: '/resource/w1.png', desc: '抽两张经验卡', expCount: 2 },
          { id: 'H3', type: 'bonus', name: '采用有机种植法', icon: '🌿', desc: '获得5幸福值', happy: 5 },
          { id: 'H4', type: 'bonus', name: '第一次收成', icon: '🌾', desc: '获得骰子点数×1000金币', moneyMultiplier: 1000 },
          { id: 'H5', type: 'bonus', name: '受到消费者好评', icon: '👍', desc: '获得2点名誉值和4点幸福值', honor: 2, happy: 4 },
          { id: 'H6', type: 'penalty', name: '物流包装不当发生损耗', icon: '📦', desc: '失去2000金币', money: -2000 },
          { id: 'H7', type: 'bonus', name: '第二次收成', icon: '🌾', desc: '获得5000金币', money: 5000 },
          { id: 'H8', type: 'penalty', name: '申请绿色认证未获批准', icon: '❌', desc: '失去一半的幸福值', happyPenaltyRate: 0.5 },
          { id: 'H9', type: 'bonus', name: '受邀为亲友培训推广新品种', icon: '👨‍🏫', desc: '获得1000金币', money: 1000 }
        ]
      },
      chanceCards: [
        { id: 'C1', type: 'transfer', target: 'F', name: '开发绿色农产品', desc: '直达就业入口' },
        { id: 'C2', type: 'transfer', target: 'A', name: '学习技能', desc: '直达学习技能入口' },
        { id: 'C3', type: 'transfer', target: 'B', name: '经营企业', desc: '直达就业入口' },
        { id: 'C4', type: 'transfer', target: 'C', name: '开发旅游目的地', desc: '直达就业入口' },
        { id: 'C5', type: 'transfer', target: 'D', name: '担任公职', desc: '直达就业入口' },
        { id: 'C6', type: 'transfer', target: 'E', name: '乡村振兴电商创业', desc: '直达就业入口' },
        { id: 'C7', type: 'transfer', target: 'F', name: '开发绿色能源', desc: '直达就业入口' },
        { id: 'C8', type: 'transfer', target: 'G', name: '参与载人航天', desc: '直达就业入口' },
        { id: 'C9', type: 'shield', name: '保护卡', desc: '进入就业入口后免除一次损失' }
      ],
      expCards: [
        { id: 'E1', type: 'move', steps: 1, desc: '向前移动1步' },
        { id: 'E2', type: 'move', steps: 2, desc: '向前移动2步' },
        { id: 'E3', type: 'move', steps: 3, desc: '向前移动3步' }
      ]
    },
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
    remaining: 0,
    lottery: {
      isSpinning: false,
      showLottery: false,
      rewards: [
        { value: 500, text: '500金币' },
        { value: 1000, text: '1000金币' },
        { value: 1500, text: '1500金币' }
      ],
      selectedIndex: 0
    },
    isRolling: false,
    currentChannel: null,
    showChannelEnter: false,
    showStayOption: false
  },

  onLoad() {
    this.showDifficultySelect();
    // 验证图片路径
    wx.getImageInfo({
      src: '/resource/w1.png',
      success: (res) => {
        console.log('图片加载成功:', res);
      },
      fail: (err) => {
        console.error('图片加载失败:', err);
        // 如果加载失败，使用默认图标
        this.setDefaultIcons();
      }
    });
    
    this.showGameRules();
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
    wx.showModal({
      title: '游戏开始！',
      content: `难度：${this.data.difficultySettings[difficulty].name}\n\n目标：\n金钱值：${moneyTarget}\n幸福值：${happyTarget}\n名誉值：${honorTarget}\n\n让我们先抽取你的起始资金吧！`,
      showCancel: false,
      success: () => {
        this.setData({
          'lottery.showLottery': true,
          'lottery.selectedIndex': 0
        });
      }
    });
  },

  // 开始抽奖
  startLottery() {
    if (this.data.lottery.isSpinning) return;
    
    this.setData({
      'lottery.isSpinning': true
    });

    // 随机转动次数（6-10圈）
    const rounds = 6 + Math.floor(Math.random() * 5);
    // 随机最终位置（0-2）
    const finalIndex = Math.floor(Math.random() * 3);
    // 计算总步数
    const totalSteps = rounds * 3 + finalIndex;
    
    let currentStep = 0;
    const spinInterval = setInterval(() => {
      currentStep++;
      this.setData({
        'lottery.selectedIndex': currentStep % 3
      });

      if (currentStep >= totalSteps) {
        clearInterval(spinInterval);
        this.setData({
          'lottery.isSpinning': false
        });
        
        const reward = this.data.lottery.rewards[finalIndex];
        setTimeout(() => {
          wx.showModal({
            title: '恭喜！',
            content: `你获得了 ${reward.text}！`,
            showCancel: false,
            success: () => {
              this.updatePlayerMoney(reward.value);
              this.setData({
                'lottery.showLottery': false
              });
              this.initGame();
            }
          });
        }, 500);
      }
    }, 100);
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
    if (this.data.isRolling || this.data.isWaiting) {
      wx.showToast({
        title: '请等待当前操作完成',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ 
      isRolling: true,
      diceNumber: null
    });
    
    // 播放骰子音效（可选）
    const audio = wx.createInnerAudioContext();
    audio.src = '/resource/dice.mp3'; // 如果有骰子音效的话
    audio.play();
    
    // 动画效果
    let count = 0;
    const finalNumber = Math.floor(Math.random() * 6) + 1;
    
    const rollInterval = setInterval(() => {
      const tempNumber = Math.floor(Math.random() * 6) + 1;
      this.setData({
        diceNumber: tempNumber
      });
      count++;
      
      if (count >= 10) {
        clearInterval(rollInterval);
        this.setData({ 
          isRolling: false,
          diceNumber: finalNumber
        }, () => {
          setTimeout(() => {
            this.movePlayer(finalNumber);
          }, 500);
        });
      }
    }, 100);
  },

  // 移动玩家
  movePlayer(steps) {
    if (this.data.currentChannel) {
      this.moveInChannel(steps);
    } else {
      this.moveInOuterCircle(steps);
    }
  },

  // 在外圈移动
  moveInOuterCircle(steps) {
    const newPosition = (this.data.player.position + steps) % this.data.mapCells.outer.length;
    
    this.setData({
      'player.position': newPosition
    }, () => {
      const currentCell = this.data.mapCells.outer[newPosition];
      this.handleCellEffect(currentCell);
      
      // 检查是否可以进入通道
      if (currentCell.type === 'entrance') {
        this.checkChannelEntrance(currentCell.channelId);
      }
    });
  },

  // 在通道内移动
  moveInChannel(steps) {
    const channel = this.data.mapCells.channels[this.data.currentChannel];
    const currentIndex = channel.findIndex(cell => cell.id === this.data.player.channelPosition);
    const newIndex = currentIndex + steps;
    
    if (newIndex >= channel.length) {
      // 通道结束，返回外圈
      this.exitChannel();
    } else {
      this.setData({
        'player.channelPosition': channel[newIndex].id
      }, () => {
        this.handleChannelCell(channel[newIndex]);
      });
    }
  },

  // 检查通道入口条件
  checkChannelEntrance(channelId) {
    const channel = this.data.mapCells.channels[channelId];
    const requirements = channel.requirements;
    const history = this.data.player.channelHistory;
    
    let canEnter = false;
    let message = '';
    
    if (history[channelId]) {
      canEnter = true;
      message = '你已经有本通道经历';
    } else if (this.data.player.skillCount >= requirements.skillCount) {
      canEnter = true;
      message = '你已达到技能要求';
    } else if (this.data.player.money >= requirements.fee) {
      canEnter = true;
      message = `需支付${requirements.fee}金币入场`;
    }
    
    if (canEnter) {
      this.setData({ showChannelEnter: true });
      wx.showModal({
        title: '可以进入通道',
        content: message,
        confirmText: '进入',
        cancelText: '继续外圈',
        success: (res) => {
          if (res.confirm) {
            this.enterChannel(channelId, requirements.fee);
          }
        }
      });
    }
  },

  // 进入通道
  enterChannel(channelId, fee) {
    if (fee) {
      this.updatePlayerMoney(-fee);
    }
    
    this.setData({
      currentChannel: channelId,
      'player.channelPosition': this.data.mapCells.channels[channelId][0].id,
      'player.channelHistory[channelId]': true,
      showChannelEnter: false
    });
  },

  // 退出通道
  exitChannel() {
    this.setData({
      currentChannel: null,
      'player.channelPosition': null
    });
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
      'player.moneyScore': this.data.player.moneyScore + Math.floor(reward / 100),
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
      'player.moneyScore': this.data.player.moneyScore + Math.floor(reward / 100),
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
        'player.money': this.data.player.money + reward.amount,
        'player.moneyScore': this.data.player.moneyScore + Math.floor(reward.amount / 100)
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
      'player.money': newMoney,
      'player.moneyScore': this.data.player.moneyScore - Math.floor(penalty / 100)
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
        'player.money': this.data.player.money + treasure.amount,
        'player.moneyScore': this.data.player.moneyScore + Math.floor(treasure.amount / 100)
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
        'player.moneyScore': this.data.player.moneyScore + Math.floor(profit / 100),
        'stats.casinoWinStreak': this.data.stats.casinoWinStreak + 1,
        'stats.casinoProfit': this.data.stats.casinoProfit + profit
      });
      this.showRewardAnimation(`赌场获胜！获得${profit}金币！🎰`);
      this.gainExp(40 * levelMultiplier);
    } else {
      const loss = Math.floor(currentMoney / 2);
      this.setData({
        'player.money': currentMoney - loss,
        'player.moneyScore': this.data.player.moneyScore - Math.floor(loss / 100),
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
        icon: '��' 
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
                'player.money': currentMoney - selectedItem.price + selectedItem.reward,
                'player.moneyScore': this.data.player.moneyScore + Math.floor(selectedItem.reward / 100)
              });
              this.showRewardAnimation(`使用${selectedItem.name}！\n-${selectedItem.price}金币\n+${selectedItem.reward}金币💰`);
              break;

            case 1: // 加分卡
              this.setData({
                'player.money': currentMoney - selectedItem.price,
                'player.moneyScore': this.data.player.moneyScore - Math.floor(selectedItem.price / 100)
              });
              this.gainScore(selectedItem.reward);
              break;

            case 2: // 传送卡
              this.setData({
                'player.money': currentMoney - selectedItem.price,
                'player.moneyScore': this.data.player.moneyScore - Math.floor(selectedItem.price / 100)
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
      'player.moneyScore': this.data.player.moneyScore + Math.floor(rewards.money / 100),
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
      content: `1. 点击"掷骰子"开始游戏\n\n2. 等级系统：\n   - 当前等级：${this.data.player.level}\n   - 奖励倍率：${multiplier}倍\n   - 目标分数：${this.getTargetScore()}\n\n3. 不同格子效果：\n   🏠 起点：经过获得${200 * multiplier}金币\n   🎁 小奖励：获得${100 * multiplier}金币\n   💰 大奖励：获得${500 * multiplier}金币\n   🏆 成就点：获得分数和成就\n   ❓ 机会：随机奖励\n   🏪 商店：购买道具\n   ⚡ 陷阱：损失金币\n   📦 宝箱：随机宝物\n   �� 赌场：赌博翻倍\n   🌀 传送门：随机传送\n\n4. 目标：\n   获得${this.getTargetScore()}分即可通关！\n\n5. 当前状态：\n   金币：${this.data.player.money}\n   分数：${this.data.player.score}/${this.getTargetScore()}\n   等级：${this.data.player.level}`,
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
    if (stats.visitedCells.length === new Set(this.data.mapCells.outer.map(cell => cell.type)).size 
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
  },

  // 更新玩家状态的方法
  updatePlayerStatus(type, amount) {
    switch(type) {
      case 'money':
        this.updatePlayerMoney(amount);
        break;
      case 'happy':
        this.setData({
          'player.happyScore': Math.max(0, this.data.player.happyScore + amount)
        });
        break;
      case 'honor':
        this.setData({
          'player.honorScore': Math.max(0, this.data.player.honorScore + amount)
        });
        break;
    }
    
    this.checkGameProgress();
  },

  // 更新玩家金币和积分
  updatePlayerMoney(amount) {
    const newMoney = Math.max(0, this.data.player.money + amount);
    const newMoneyScore = Math.floor(newMoney / 100); // 每100金币=1积分
    
    this.setData({
      'player.money': newMoney,
      'player.moneyScore': newMoneyScore
    });
  },

  // 处理格子效果
  handleCellEffect(cell) {
    switch(cell.type) {
      case 'start':
        this.handleStartCell();
        break;
      case 'exp':
        this.drawExpCard();
        break;
      case 'tax':
        this.handleTaxPayment();
        break;
      case 'chance':
        this.drawChanceCard();
        break;
      case 'entrance':
        this.handleChannelEntrance(cell);
        break;
      case 'carShow':
        this.handleCarShow();
        break;
      case 'bonus':
        this.handleBonus(cell);
        break;
      case 'penalty':
        this.handlePenalty(cell);
        break;
      case 'transfer':
        this.handleTransfer(cell);
        break;
      case 'action':
        this.handleAction(cell);
        break;
    }
  },

  // 处理起点格子
  handleStartCell() {
    wx.showActionSheet({
      itemList: ['获得1000金币', '获得1点幸福值', '获得1点名誉值'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0:
            this.updatePlayerMoney(1000);
            break;
          case 1:
            this.updatePlayerStatus('happy', 1);
            break;
          case 2:
            this.updatePlayerStatus('honor', 1);
            break;
        }
      }
    });
  },

  // 抽取经验卡
  drawExpCard() {
    const cards = this.data.mapCells.expCards;
    const card = cards[Math.floor(Math.random() * cards.length)];
    wx.showModal({
      title: '抽取经验卡',
      content: card.desc,
      showCancel: false,
      success: () => {
        this.movePlayer(card.steps);
      }
    });
  },

  // 处理纳税
  handleTaxPayment() {
    const money = this.data.player.money;
    let tax = 0;
    
    if (money <= 3000) {
      tax = 200;
    } else if (money <= 6000) {
      tax = 1500;
    } else {
      tax = 3000;
    }
    
    wx.showModal({
      title: '依法纳税',
      content: `需缴纳税款：${tax}金币`,
      showCancel: false,
      success: () => {
        this.updatePlayerMoney(-tax);
      }
    });
  },

  // 抽取机会卡
  drawChanceCard() {
    const cards = this.data.mapCells.chanceCards;
    const card = cards[Math.floor(Math.random() * cards.length)];
    wx.showModal({
      title: '抽取机会卡',
      content: card.desc,
      showCancel: false,
      success: () => {
        if (card.type === 'transfer') {
          this.transferToChannel(card.target);
        } else if (card.type === 'shield') {
          this.setData({
            'player.hasShield': true
          });
        }
      }
    });
  },

  // 处理通道入口
  handleChannelEntrance(cell) {
    const channelId = cell.channelId;
    const entranceFee = 500;
    
    if (this.data.player.channelsPaid && this.data.player.channelsPaid[channelId]) {
      this.enterChannel(channelId);
      return;
    }
    
    wx.showModal({
      title: '进入通道',
      content: `需支付${entranceFee}金币作为启动资金，是否进入？`,
      success: (res) => {
        if (res.confirm && this.data.player.money >= entranceFee) {
          this.updatePlayerMoney(-entranceFee);
          this.setData({
            [`player.channelsPaid.${channelId}`]: true
          });
          this.enterChannel(channelId);
        }
      }
    });
  },

  // 处理新能源汽车展销会
  handleCarShow() {
    const money = this.data.player.money;
    const maxCars = Math.floor(money / 1000);
    
    if (maxCars === 0) {
      wx.showModal({
        title: '新能源汽车展销会',
        content: '金币不足，无法购车。将损失1点名誉值。',
        showCancel: false,
        success: () => {
          this.updatePlayerStatus('honor', -1);
        }
      });
      return;
    }
    
    wx.showModal({
      title: '新能源汽车展销会',
      content: `每1000金币可购买一辆车并获得1点名誉值\n当前最多可购买${maxCars}辆\n是否购买？`,
      success: (res) => {
        if (res.confirm) {
          this.showCarPurchaseDialog(maxCars);
        } else {
          this.updatePlayerStatus('honor', -1);
        }
      }
    });
  },

  // 显示购车数量选择
  showCarPurchaseDialog(maxCars) {
    const items = Array.from({length: maxCars}, (_, i) => `购买${i + 1}辆 (${(i + 1) * 1000}金币)`);
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const count = res.tapIndex + 1;
        this.updatePlayerMoney(-count * 1000);
        this.updatePlayerStatus('honor', count);
      }
    });
  },

  // 处理奖励效果
  handleBonus(cell) {
    if (cell.money) {
      this.updatePlayerMoney(cell.money);
    }
    if (cell.happy) {
      this.updatePlayerStatus('happy', cell.happy);
    }
    if (cell.honor) {
      this.updatePlayerStatus('honor', cell.honor);
    }
    
    wx.showToast({
      title: cell.desc,
      icon: 'success'
    });
  },

  // 处理惩罚效果
  handlePenalty(cell) {
    if (this.data.player.hasShield) {
      wx.showModal({
        title: '使用保护卡',
        content: '是否使用保护卡抵消本次损失？',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              'player.hasShield': false
            });
            return;
          }
          this.executePenalty(cell);
        }
      });
    } else {
      this.executePenalty(cell);
    }
  },

  // 执行惩罚
  executePenalty(cell) {
    if (cell.stopTime) {
      this.handleStopTime(cell.stopTime);
    }
    if (cell.money) {
      this.updatePlayerMoney(-cell.money);
    }
    if (cell.happy) {
      this.updatePlayerStatus('happy', -cell.happy);
    }
    if (cell.honor) {
      this.updatePlayerStatus('honor', -cell.honor);
    }
  },

  // 处理停留时间
  handleStopTime(seconds) {
    this.setData({
      isWaiting: true,
      waitTime: seconds
    });
    
    let timer = setInterval(() => {
      this.setData({
        waitTime: this.data.waitTime - 1
      });
      
      if (this.data.waitTime <= 0) {
        clearInterval(timer);
        this.setData({
          isWaiting: false,
          waitTime: 0
        });
      }
    }, 1000);
  },

  // 处理通道格子效果
  handleChannelCell(cell) {
    switch(cell.type) {
      case 'bonus':
        this.handleChannelBonus(cell);
        break;
      case 'penalty':
        this.handleChannelPenalty(cell);
        break;
      case 'exp':
        this.handleChannelExp(cell);
        break;
      case 'transfer':
        this.handleChannelTransfer(cell);
        break;
    }
  },

  // 处理通道内奖励
  handleChannelBonus(cell) {
    let bonusText = '获得：';
    
    // 处理金币奖励
    if (cell.money) {
      this.updatePlayerMoney(cell.money);
      bonusText += `\n${cell.money}金币`;
    }
    
    // 处理基于骰子的金币奖励
    if (cell.moneyMultiplier) {
      const diceNum = this.rollDice();
      const moneyBonus = diceNum * cell.moneyMultiplier;
      this.updatePlayerMoney(moneyBonus);
      bonusText += `\n${moneyBonus}金币(骰子点数:${diceNum})`;
    }
    
    // 处理幸福值奖励
    if (cell.happy) {
      this.updatePlayerStatus('happy', cell.happy);
      bonusText += `\n${cell.happy}点幸福值`;
    }
    
    // 处理基于骰子的幸福值奖励
    if (cell.happyMultiplier) {
      const diceNum = this.rollDice();
      this.updatePlayerStatus('happy', diceNum);
      bonusText += `\n${diceNum}点幸福值(骰子点数:${diceNum})`;
    }
    
    // 处理名誉值奖励
    if (cell.honor) {
      this.updatePlayerStatus('honor', cell.honor);
      bonusText += `\n${cell.honor}点名誉值`;
    }
    
    wx.showModal({
      title: cell.name,
      content: bonusText,
      showCancel: false
    });
  },

  // 处理通道内惩罚
  handleChannelPenalty(cell) {
    let penaltyText = '失去：';
    
    // 处理金币惩罚
    if (cell.money < 0) {
      this.updatePlayerMoney(cell.money);
      penaltyText += `\n${Math.abs(cell.money)}金币`;
    }
    
    // 处理基于骰子的金币惩罚
    if (cell.moneyPenaltyMultiplier) {
      const diceNum = this.rollDice();
      const moneyPenalty = -(diceNum * cell.moneyPenaltyMultiplier);
      this.updatePlayerMoney(moneyPenalty);
      penaltyText += `\n${Math.abs(moneyPenalty)}金币(骰子点数:${diceNum})`;
    }
    
    // 处理比例金币惩罚
    if (cell.moneyPenaltyRate) {
      const penalty = Math.floor(this.data.player.money * cell.moneyPenaltyRate);
      this.updatePlayerMoney(-penalty);
      penaltyText += `\n${penalty}金币(${cell.moneyPenaltyRate * 100}%)`;
    }
    
    // 处理幸福值惩罚
    if (cell.happyPenalty === 'dice') {
      const diceNum = this.rollDice();
      this.updatePlayerStatus('happy', -diceNum);
      penaltyText += `\n${diceNum}点幸福值(骰子点数:${diceNum})`;
    }
    
    // 处理比例幸福值惩罚
    if (cell.happyPenaltyRate) {
      const penalty = Math.floor(this.data.player.happyScore * cell.happyPenaltyRate);
      this.updatePlayerStatus('happy', -penalty);
      penaltyText += `\n${penalty}点幸福值(${cell.happyPenaltyRate * 100}%)`;
    }
    
    // 处理比例名誉值惩罚
    if (cell.honorPenaltyRate) {
      const penalty = Math.floor(this.data.player.honorScore * cell.honorPenaltyRate);
      this.updatePlayerStatus('honor', -penalty);
      penaltyText += `\n${penalty}点名誉值(${cell.honorPenaltyRate * 100}%)`;
    }
    
    // 处理停留时间
    if (cell.stopTime) {
      this.handleStopTime(cell.stopTime);
      penaltyText += `\n强制停留${cell.stopTime}秒`;
    }
    
    wx.showModal({
      title: cell.name,
      content: penaltyText,
      showCancel: false
    });
  },

  // 处理通道内经验卡
  handleChannelExp(cell) {
    const count = cell.expCount || 1;
    let expText = '';
    
    for (let i = 0; i < count; i++) {
      const card = this.drawExpCard();
      expText += `\n${i + 1}. ${card.desc}`;
    }
    
    wx.showModal({
      title: cell.name,
      content: `抽取${count}张经验卡：${expText}`,
      showCancel: false,
      success: () => {
        // 可能需要在这里处理经验卡效果
      }
    });
  },

  // 处理通道内转移
  handleChannelTransfer(cell) {
    wx.showModal({
      title: cell.name,
      content: cell.desc,
      showCancel: false,
      success: () => {
        this.transferPlayer(cell.target);
      }
    });
  },

  // 转移玩家位置
  transferPlayer(target) {
    // 根据目标位置类型处理
    if (target === 'hospital') {
      // 转移到医院
      this.moveToHospital();
    } else if (target === 'tourist') {
      // 转移到旅游区
      this.moveToTourist();
    }
  },

  // 投掷骰子
  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  },

  // 设置默认图标（如果图片加载失败）
  setDefaultIcons() {
    const defaultIcon = '/resource/default.png'; // 或其他备用图片
    
    // 更新外圈格子图标
    const outer = this.data.mapCells.outer.map(cell => ({
      ...cell,
      icon: defaultIcon
    }));
    
    // 更新所有通道格子图标
    const channels = {};
    Object.keys(this.data.mapCells.channels).forEach(key => {
      channels[key] = this.data.mapCells.channels[key].map(cell => ({
        ...cell,
        icon: defaultIcon
      }));
    });
    
    this.setData({
      'mapCells.outer': outer,
      'mapCells.channels': channels
    });
  }
}); 