(function () {
  const modules = [
    {
      title: "第一部分：对公司与 Rivex 整体方向的判断",
      short: "方向",
      note: "对方向、壁垒和关键风险的判断。",
      accent: "var(--gold)",
      questions: [
        {
          id: "q1",
          type: "radio",
          title: "1. 你看完材料后，对公司整体业务和 Rivex 方向的整体判断更接近哪一种？",
          options: [
            "A. 方向清晰，而且有机会做成一件比较大的事",
            "B. 整体方向有潜力，但需要进一步聚焦几个最关键的模块",
            "C. 概念和方向有意思，但落地路径还需要进一步打磨",
            "D. 目前还需要更多观察和理解"
          ]
        },
        {
          id: "q2",
          type: "checkbox",
          title: "2. 在你看来，Rivex 最有机会建立壁垒的核心是什么？",
          options: [
            "A. 收藏品数字化与资产身份",
            "B. 资产标准化 / metadata / 证据包",
            "C. Origin / Passport / 链上查验",
            "D. 系统化协议 / API / 工作流",
            "E. 交易闭环与链上分润",
            "F. 估值、RRS 与风险框架",
            "G. 收藏品借贷与金融化",
            "H. 资产池打包 / RWA / ABS 可选路径",
            "I. 机构资金接入",
            "J. 品牌与市场影响力",
            { label: "K. 其他（请补充）", other: true }
          ]
        },
        {
          id: "q3",
          type: "textarea",
          title: "3. 你认为 Rivex 从“收藏品科技项目”走向“另类资产金融基础设施 / on-chain asset infrastructure”，最关键的前提是什么？"
        },
        {
          id: "q4",
          type: "textarea",
          title: "4. 在你看来，这个方向最大的风险或最难的地方是什么？"
        }
      ]
    },
    {
      title: "第二部分：你倾向的角色定位",
      short: "角色",
      note: "角色定位、重点贡献方向和 6 个月优先事项。",
      accent: "var(--cyan)",
      questions: [
        {
          id: "q5",
          type: "radio",
          title: "5. 在你参与 Rivex 的设想中，哪种角色最自然？",
          options: [
            "A. RIVEX Chief Strategy Officer (CSO) / Partner",
            "B. MOCE Capital Partner + RIVEX CSO",
            "C. Partner, Structured Credit & Asset Finance",
            "D. Build Partner / Business Line Partner",
            "E. 先以明确阶段进入，再根据投入与成果升级"
          ]
        },
        {
          id: "q6",
          type: "matrix",
          title: "6. 你对以下角色定位的接受度如何？",
          rows: [
            "RIVEX Chief Strategy Officer (CSO)",
            "RIVEX Partner, Asset Standardization / Protocol / Structured Credit",
            "MOCE Capital Partner",
            "Partner, On-chain Transaction & Revenue Sharing",
            "Build Partner / Business Line Partner",
            "Strategic Advisor（仅作为过渡或轻参与形态）"
          ]
        },
        {
          id: "q7",
          type: "checkbox",
          title: "7. 由你来定义，你最希望和公司共同搭建哪一块？",
          options: [
            "A. 资产标准化 / metadata / evidence package",
            "B. Origin / Passport / 链上查验协议",
            "C. 系统化工作流 / API / 节点治理",
            "D. 交易闭环与链上分润模型",
            "E. 风险、RRS、授信与金融化",
            "F. 资产池 / RWA / ABS 可选路径",
            "G. 机构资金 / strategic capital 对接",
            "H. 公司整体战略升级 / MOCE 资源协同",
            { label: "I. 其他（请补充）", other: true }
          ]
        },
        {
          id: "q8",
          type: "textarea",
          title: "8. 未来 6 个月只能优先推进三件事时，你建议最先做哪三件？"
        }
      ]
    },
    {
      title: "第三部分：投入时间与参与方式",
      short: "投入",
      note: "现实投入强度、参与场景和未来升级可能性。",
      accent: "var(--green)",
      questions: [
        {
          id: "q9",
          type: "radio",
          title: "9. 未来 3-6 个月，你现实中大概可以投入多少时间？",
          options: [
            "A. 每周固定 1 天",
            "B. 每周固定 2 天",
            "C. 每周 2 天以上",
            "D. 不固定，但可以围绕关键事项深度参与",
            "E. 目前还不确定"
          ]
        },
        {
          id: "q10",
          type: "checkbox",
          title: "10. 除固定时间外，你可以参与以下哪些事项？",
          options: [
            "A. 资产标准 / Passport / 系统化协议讨论",
            "B. 链上交易 / 分润账本 / 节点经济模型",
            "C. 关键融资 / 资金方 / 第三方财务公司会议",
            "D. 产品和系统架构讨论",
            "E. 外部合作方沟通",
            "F. 风险框架 / RRS / 授信设计",
            "G. 重要内部策略会议",
            "H. 团队招聘或组织搭建",
            { label: "I. 其他（请补充）", other: true }
          ]
        },
        {
          id: "q11",
          type: "radio",
          title: "11. 你更偏好的参与方式是？",
          options: [
            "A. 固定时间、稳定参与",
            "B. 围绕关键事项深度参与",
            "C. 偏战略层、低频高质量参与",
            "D. 视合作进展逐步增加投入"
          ]
        },
        {
          id: "q12",
          type: "radio",
          title: "12. 在合作推进顺利的情况下，你未来 6-12 个月提升投入强度的可能性如何？",
          options: [
            "A. 是，可以明显提升",
            "B. 有可能，但取决于进展",
            "C. 暂时不太确定",
            "D. 目前不考虑明显提升"
          ]
        }
      ]
    },
    {
      title: "第四部分：你对公司未来的期待",
      short: "未来",
      note: "公司形态、长期价值和个人位置的想象。",
      accent: "var(--blue)",
      questions: [
        {
          id: "q13",
          type: "textarea",
          title: "13. 你希望公司未来 2-3 年最有可能成长成什么样的形态？"
        },
        {
          id: "q14",
          type: "textarea",
          title: "14. 对你来说，一家值得长期投入的公司，至少应该具备哪些条件？"
        },
        {
          id: "q15",
          type: "textarea",
          title: "15. 你希望自己在这样的平台里，未来扮演什么样的位置？"
        },
        {
          id: "q16",
          type: "checkbox",
          title: "16. 你最看重这件事的哪一类长期价值？",
          options: [
            "A. 平台本身的长期成长空间",
            "B. 新业务线的成长空间",
            "C. 对行业的影响力",
            "D. 长期股权价值",
            "E. 现金回报",
            "F. 个人角色与决策权",
            "G. 与创始人的长期合作关系",
            { label: "H. 其他（请补充）", other: true }
          ]
        }
      ]
    },
    {
      title: "第五部分：你对 compensation / equity / economics 的偏好",
      short: "结构",
      note: "用偏好和区间理解合作结构。",
      accent: "var(--orange)",
      questions: [
        {
          id: "q17",
          type: "radio",
          title: "17. 对你来说，在 build phase 阶段，以下哪种合作结构更自然？",
          options: [
            "A. 较低现金 + 较强长期股权 / ownership",
            "B. 中等现金 + 中等股权",
            "C. 较高现金 + 较低股权",
            "D. 更偏业务分成 / deal economics",
            "E. 分阶段逐步升级",
            "F. 视具体职责而定"
          ]
        },
        {
          id: "q18",
          type: "ranking",
          title: "18. 在现阶段，build phase 的合作方式里，你更看重哪一项？",
          items: [
            "现金报酬",
            "长期股权 / option",
            "业务分成 / economics",
            "title",
            "决策权与影响力",
            "平台成长空间"
          ]
        },
        {
          id: "q19",
          type: "textarea",
          title: "19. 从你的角度看，什么样的现金安排会让你觉得这段合作是认真而合理的？"
        },
        {
          id: "q20",
          type: "textarea",
          title: "20. 从你的角度看，什么样的股权 / option 安排会让你觉得这是一个真正长期一致的合作？"
        },
        {
          id: "q21",
          type: "radio",
          title: "21. 现阶段做一个取向时，你更偏向：",
          options: [
            "A. 更看重长期股权价值",
            "B. 更看重当前现金回报",
            "C. 两者都重要，需要平衡",
            "D. 更看重业务线本身的 economics",
            "E. 取决于角色与投入强度"
          ]
        },
        {
          id: "q22",
          type: "radio",
          title: "22. 你对分阶段结构的接受度如何：",
          options: [
            "A. 先以 build phase 进入，后续根据投入与成果升级现金 / 股权 / 角色",
            "B. 可以接受，但需要非常清楚升级条件",
            "C. 更倾向一开始就确定长期结构",
            "D. 暂时不确定"
          ]
        },
        {
          id: "q23",
          type: "radio",
          title: "23. 你对“固定现金 + 股权 / option + 业务分成”这种三层结构的接受度如何？",
          options: [
            "A. 很接受",
            "B. 基本接受",
            "C. 需要看具体设计",
            "D. 不太偏好",
            { label: "E. 其他（请补充）", other: true }
          ]
        }
      ]
    },
    {
      title: "第六部分：你对“合伙人”这件事的理解",
      short: "合伙",
      note: "Partner relationship 对你意味着什么。",
      accent: "var(--violet)",
      questions: [
        {
          id: "q24",
          type: "checkbox",
          title: "24. 对你来说，“合伙人”更重要的是什么？",
          options: [
            "A. title",
            "B. ownership",
            "C. 决策权",
            "D. 长期业务共同体",
            "E. 业务分成与经济参与",
            "F. 共同对外代表公司",
            "G. 与创始人之间的长期信任关系"
          ]
        },
        {
          id: "q25",
          type: "radio",
          title: "25. 你更希望自己的回报，主要与哪一类结果挂钩？",
          options: [
            "A. 公司整体长期价值",
            "B. 自己直接搭建出来的业务线",
            "C. 短中期业务成果",
            "D. 多种方式结合"
          ]
        },
        {
          id: "q26",
          type: "textarea",
          title: "26. 什么样的合作结构，会让你觉得这是真正意义上的 partner relationship？"
        }
      ]
    },
    {
      title: "第七部分：MOCE Capital Partner title 与资源协同",
      short: "平台",
      note: "确认 MOCE Capital 层面的 Partner title、投资 / FA 资源共享，以及它与 Rivex 的协同方式。",
      accent: "var(--green)",
      questions: [
        {
          id: "q27",
          type: "checkbox",
          title: "27. 你希望 MOCE Capital 平台层面能够为你提供哪些支持？",
          options: [
            "A. MOCE Capital Partner title",
            "B. 投资项目 / deal flow 资源共享",
            "C. FA 项目与资本方资源共享",
            "D. 客户、产业合作方与战略合作网络",
            "E. 品牌与平台背书",
            "F. 新业务线搭建平台与团队支持",
            "G. 资本市场机会",
            { label: "H. 其他（请补充）", other: true }
          ]
        },
        {
          id: "q28",
          type: "textarea",
          title: "28. 你怎么看 MOCE Capital Partner 身份、投资 / FA 资源与 Rivex 之间未来的协同方式？"
        },
        {
          id: "q29",
          type: "radio",
          title: "29. 未来以 partner 身份参与 MOCE Capital 平台层面的业务时，你更期待哪一种方式？",
          options: [
            "A. MOCE Capital Partner title + 资源协同",
            "B. 投资 / FA deal-by-deal economics",
            "C. 长期业务合伙人路径",
            "D. 与 RIVEX CSO / Partner 角色形成组合",
            "E. 未来再逐步明确",
            { label: "F. 其他（请补充）", other: true }
          ]
        }
      ]
    },
    {
      title: "第八部分：最后三个关键问题",
      short: "确认",
      note: "下一次讨论最重要的答案。",
      accent: "var(--rose)",
      questions: [
        {
          id: "q30",
          type: "textarea",
          title: "30. 进入深度参与阶段后，你最希望在这里做成的一件代表性事情是什么？"
        },
        {
          id: "q31",
          type: "textarea",
          title: "31. 你对这段合作目前最大的顾虑是什么？"
        },
        {
          id: "q32",
          type: "textarea",
          title: "32. 下一次见面时，你认为最需要聊清楚哪几个问题？"
        }
      ]
    }
  ];

  const questions = modules.flatMap((module, moduleIndex) =>
    module.questions.map((question) => ({ ...question, moduleIndex, module }))
  );

  window.RivexJimQuestionnaire = {
    modules,
    questions
  };
})();
