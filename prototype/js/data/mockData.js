// 模拟数据生成器

// 真实人名数据
const realNames = [
    "李志强", "王建国", "张伟", "刘德华", "陈东海", "杨军", "黄海平", "赵文明", "周国平", "吴德文",
    "李思源", "王子轩", "张晓峰", "刘明辉", "陈家豪", "杨博文", "黄凯旋", "赵天成", "周建华", "吴俊杰",
    "郑智勇", "孙志伟", "钱学良", "周海洋", "吴承恩", "郭明亮", "何宇航", "马超", "林志峰", "王浩然",
    "张云飞", "刘思远", "陈奕然", "杨明哲", "黄博文", "赵鑫磊", "周泽明", "吴思远", "郑博远", "孙长青",
    "李雨泽", "王子墨", "张浩然", "刘天宇", "陈思远", "杨雨泽", "黄晨阳", "赵瑞祥", "周子豪", "吴宇轩",
    "郑明哲", "孙浩宇", "钱辰皓", "周子墨", "吴博文", "郭天翔", "何宇轩", "马晨阳", "林子轩", "王博远",
    "张志强", "刘雨晨", "陈浩宇", "杨子默", "黄天佑", "赵子豪", "周浩然", "吴明轩", "郑子轩", "孙浩轩",
    "李晓峰", "王浩宇", "张雨轩", "刘子豪", "陈志远", "杨博远", "黄浩轩", "赵明哲", "周博文", "吴子轩",
    "郑浩然", "孙天成", "钱志远", "周博远", "吴天宇", "郭子轩", "何浩然", "马天翔", "林浩宇", "王子轩",
    "张浩轩", "刘博远", "陈子轩", "杨天宇", "黄博远", "赵浩然", "周天宇", "吴浩然", "郑天宇", "孙浩然"
];

// 中文姓名到拼音的映射
const pinyinMap = {
    "李": "li", "王": "wang", "张": "zhang", "刘": "liu", "陈": "chen", "杨": "yang", "黄": "huang", "赵": "zhao", "周": "zhou", "吴": "wu",
    "郑": "zheng", "孙": "sun", "钱": "qian", "郭": "guo", "何": "he", "马": "ma", "林": "lin",
    "志": "zhi", "强": "qiang", "建": "jian", "国": "guo", "伟": "wei", "德": "de", "华": "hua", "东": "dong", "海": "hai", "军": "jun", "平": "ping", "文": "wen", "明": "ming",
    "思": "si", "源": "yuan", "子": "zi", "轩": "xuan", "晓": "xiao", "峰": "feng", "辉": "hui", "家": "jia", "豪": "hao", "博": "bo", "凯": "kai", "旋": "xuan", "天": "tian", "成": "cheng", "俊": "jun", "杰": "jie",
    "智": "zhi", "勇": "yong", "学": "xue", "良": "liang", "承": "cheng", "恩": "en", "亮": "liang", "宇": "yu", "航": "hang", "超": "chao", "浩": "hao", "然": "ran",
    "云": "yun", "飞": "fei", "远": "yuan", "奕": "yi", "哲": "zhe", "鑫": "xin", "磊": "lei", "泽": "ze",
    "雨": "yu", "墨": "mo", "宁": "ning", "晨": "chen", "阳": "yang", "瑞": "rui", "祥": "xiang", "皓": "hao",
    "长": "chang", "青": "qing", "默": "mo", "佑": "you", "隆": "long", "霖": "lin"
};

// 获取姓名的拼音缩写
function getNamePinyin(name) {
    let pinyin = '';
    for(let i = 0; i < name.length; i++) {
        const char = name.charAt(i);
        if(pinyinMap[char]) {
            pinyin += pinyinMap[char];
        } else {
            // 如果没有对应的拼音，保留原字符
            pinyin += char;
        }
    }
    return pinyin;
}

// 获取随机真实人名
function getRandomRealName() {
    return realNames[Math.floor(Math.random() * realNames.length)];
}

// 随机日期生成
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 先初始化一个空的mockData对象，避免循环引用问题
window.mockData = {};

// 预定义函数，避免循环依赖
function generatePositions(count) {
    // 职位数据生成实现
    const positions = [];
    const titles = [
        '前端开发工程师', '后端开发工程师', 'UI/UX设计师', '产品经理', '运维工程师', 
        '数据分析师', '项目经理', '测试工程师', '全栈工程师', 'DevOps工程师', 
        '安全工程师', '人工智能工程师', '大数据工程师', '云计算架构师', '网络工程师',
        '移动端开发工程师', '系统架构师', 'Java开发工程师', 'Python开发工程师', '算法工程师',
        '技术总监', '运营专员', '销售经理', 'HR专员', '市场营销专员'
    ];
    const companies = ['阿里巴巴', '腾讯', '百度', '京东', '小米', '华为', '字节跳动', '美团', '滴滴', '网易', '快手', '拼多多'];
    const statuses = [0, 1, 2, 3]; // 0-关闭, 1-开放, 2-暂停, 3-完成
    
    for (let i = 1; i <= count; i++) {
        // 确保有足够的"完成"状态职位
        let status;
        if (i % 5 === 0) { // 每5个职位中有1个是完成状态
            status = 3; // 完成状态
        } else {
            status = statuses[Math.floor(Math.random() * 3)]; // 随机选择前三种状态(关闭、开放、暂停)
        }
        
        positions.push({
            id: i,
            title: titles[Math.floor(Math.random() * titles.length)],
            company: companies[Math.floor(Math.random() * companies.length)],
            status: status,
            recruiter: Math.floor(Math.random() * 10) + 1,
            customer: Math.floor(Math.random() * 20) + 1,
            customerContact: getRandomRealName(),
            contactMethod: `1381234${(1000 + i).toString().substring(1)}`,
            requirements: `这是职位${i}的要求描述，包含技能要求、经验要求等信息。`,
            createTime: randomDate(new Date(2023, 0, 1), new Date())
        });
    }
    
    return positions;
}

function generateResumes(count) {
    // 简历数据生成实现
    const resumes = [];
    const genders = [0, 1, 2]; // 0-男, 1-女, 2-保密
    const ages = Array.from({length: 30}, (_, i) => i + 20); // 20-49岁
    const degrees = [0, 1, 2, 3, 4]; // 0-高中, 1-专科, 2-本科, 3-硕士, 4-博士
    const experiences = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 0-10年
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '重庆'];
    const statuses = [0, 1, 2, 3]; // 0-待业中, 1-在职-不考虑机会, 2-在职-考虑新机会, 3-未知
    const sources = ['人才库', '猎头搜集', '企业推荐', '本人投递', '合作伙伴', '其他'];
    const positions = [
        '前端开发工程师', '后端开发工程师', 'UI/UX设计师', '产品经理', '运维工程师', 
        '数据分析师', '项目经理', '测试工程师', '全栈工程师', 'DevOps工程师', 
        '安全工程师', '人工智能工程师', '大数据工程师', '云计算架构师', '网络工程师',
        '移动端开发工程师', '系统架构师', 'Java开发工程师', 'Python开发工程师', '算法工程师',
        '技术总监', '运营专员', '销售经理', 'HR专员', '市场营销专员'
    ];
    
    for (let i = 1; i <= count; i++) {
        // 按顺序从realNames数组中获取人名
        const name = realNames[i - 1] || realNames[i % realNames.length];
        const namePinyin = getNamePinyin(name);
        const createTime = randomDate(new Date(2023, 0, 1), new Date());
        
        // 生成创建时间之后1分钟到3个月内的随机时间
        const minUpdateTime = new Date(createTime.getTime() + 60 * 1000); // 创建时间后1分钟
        const maxUpdateTime = new Date(createTime.getTime() + 90 * 24 * 60 * 60 * 1000); // 创建时间后3个月
        const updateTime = randomDate(minUpdateTime, maxUpdateTime);
        
        resumes.push({
            id: i,
            name: name,
            gender: genders[Math.floor(Math.random() * genders.length)],
            age: ages[Math.floor(Math.random() * ages.length)],
            phone: `1381234${(1000 + i).toString().substring(1)}`,
            email: `${namePinyin}@qq.com`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
            degree: degrees[Math.floor(Math.random() * degrees.length)],
            experience: experiences[Math.floor(Math.random() * experiences.length)],
            salary: Math.floor(Math.random() * 901) + 100, // 100~1000之间随机
            city: cities[Math.floor(Math.random() * cities.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            notes: `这是简历${i}的备注信息，包含特殊情况说明等。`,
            createTime: createTime,
            updateTime: updateTime
        });
    }
    
    return resumes;
}

function generateUsers(count) {
    // 用户数据生成实现
    const users = [];
    const genders = [0, 1, 2]; // 0-男, 1-女, 2-保密
    const roles = [0, 1, 2]; // 0-管理员, 1-招聘经理, 2-招聘专员
    
    for (let i = 1; i <= count; i++) {
        const name = getRandomRealName();
        const namePinyin = getNamePinyin(name);
        
        users.push({
            id: i,
            username: `user${i}`,
            passwordSummary: `******`,
            name: name,
            gender: genders[Math.floor(Math.random() * genders.length)],
            email: `${namePinyin}@qq.com`,
            phone: `1381234${(1000 + i).toString().substring(1)}`,
            role: roles[Math.floor(Math.random() * roles.length)],
            joinTime: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
            leaveTime: Math.random() > 0.9 ? randomDate(new Date(2023, 0, 1), new Date()) : null,
            createTime: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1))
        });
    }
    
    return users;
}

function generateInterviews(count) {
    const interviews = [];
    const locations = ['线上面试', '总部会议室A', '总部会议室B', '分部会议室', '电话面试'];
    const rounds = [1, 2, 3, 4]; // 1-第一轮, 2-第二轮, 3-第三轮, 4-终面
    const statuses = [0, 2, 3, 4]; // 0-已安排, 2-已通过, 3-已取消, 4-未通过
    
    // 获取已生成的简历和职位
    const resumes = generateResumes(count);
    const positions = generatePositions(count);
    
    for (let i = 1; i <= count; i++) {
        // 随机选择简历和职位
        const resumeIndex = Math.floor(Math.random() * resumes.length);
        const positionIndex = Math.floor(Math.random() * positions.length);
        
        // 创建时间为过去3个月内随机时间
        const createTime = randomDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date());
        
        // 面试时间为创建时间之后的1-14天
        const interviewTime = new Date(createTime);
        interviewTime.setDate(interviewTime.getDate() + Math.floor(Math.random() * 14) + 1);
        
        // 设置时间为15分钟的倍数
        const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        const hours = 9 + Math.floor(Math.random() * 8); // 9点到16点之间
        interviewTime.setHours(hours, minutes, 0, 0);
        
        // 随机决定状态，但按一定比例分布
        let status;
        const rand = Math.random();
        if (rand < 0.35) { // 35%已安排
            status = 0;
        } else if (rand < 0.65) { // 30%已通过
            status = 2;
        } else if (rand < 0.85) { // 20%已取消
            status = 3;
        } else { // 15%未通过
            status = 4;
        }
        
        interviews.push({
            id: i,
            resumeId: resumes[resumeIndex].id,
            resumeName: resumes[resumeIndex].name,
            positionId: positions[positionIndex].id,
            positionTitle: positions[positionIndex].title,
            time: interviewTime,
            location: locations[Math.floor(Math.random() * locations.length)],
            round: rounds[Math.floor(Math.random() * rounds.length)],
            status: status,
            feedback: `这是面试${i}的反馈记录，包含评价和建议。`,
            createTime: createTime
        });
    }
    
    return interviews;
}

function generateRecommendations(count) {
    // 推荐数据生成实现
    const recommendations = [];
    
    // 获取已生成的简历和职位
    const resumes = generateResumes(count);
    const positions = generatePositions(count);
    
    // 为每个职位随机生成3-5个推荐
    positions.forEach(position => {
        // 只为开放和暂停状态的职位生成推荐
        if (position.status === 1 || position.status === 2) {
            // 随机生成推荐数量(3-5个)
            const recommendCount = Math.floor(Math.random() * 3) + 3;
            
            // 已选择的简历ID，避免重复推荐
            const selectedResumeIds = new Set();
            
            for (let i = 0; i < recommendCount; i++) {
                // 随机选择一个简历
                let resumeIndex;
                do {
                    resumeIndex = Math.floor(Math.random() * resumes.length);
                } while (selectedResumeIds.has(resumeIndex));
                
                // 添加到已选择集合
                selectedResumeIds.add(resumeIndex);
                
                const resume = resumes[resumeIndex];
                
                // 生成随机匹配分数(60-95)
                const score = Math.floor(Math.random() * 36) + 60;
                
                // 生成推荐理由
                const reasons = [
                    `${resume.name}的${resume.position}经验与${position.title}岗位要求匹配度高。`,
                    `${resume.name}具备${position.title}所需的技能和经验。`,
                    `${resume.name}的教育背景和工作经历与${position.title}职位需求相符。`,
                    `${resume.name}在${resume.position}领域有丰富经验，适合${position.title}职位。`,
                    `${resume.name}的专业技能与${position.title}岗位要求高度匹配。`
                ];
                
                // 随机选择一个推荐理由
                const randomReasonIndex = Math.floor(Math.random() * reasons.length);
                
                // 推荐人
                const creators = ['系统推荐', 'AI智能匹配', '猎头推荐', '内部推荐'];
                const createdBy = creators[Math.floor(Math.random() * creators.length)];
                
                // 创建推荐记录
                recommendations.push({
                    id: recommendations.length + 1,
                    positionId: position.id,
                    resumeId: resume.id,
                    score: score,
                    comment: reasons[randomReasonIndex],
                    createdBy: createdBy,
                    createTime: randomDate(new Date(2023, 0, 1), new Date())
                });
            }
        }
    });
    
    return recommendations;
}

function generateCommunications(count) {
    // 沟通记录数据生成实现
    const communications = [];
    const types = ['电话', '邮件', '微信', 'QQ', '视频会议', '面对面', '其他'];
    const results = ['有意向', '无意向', '待定', '未响应', '进一步沟通'];
    
    // 获取已生成的简历
    const resumes = generateResumes(count);
    
    for (let i = 1; i <= count; i++) {
        // 随机选择简历
        const resumeIndex = Math.floor(Math.random() * resumes.length);
        const resume = resumes[resumeIndex];
        
        // 创建时间为过去3个月内随机时间
        const date = randomDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date());
        
        communications.push({
            id: i,
            resumeId: resume.id,
            type: types[Math.floor(Math.random() * types.length)],
            date: date,
            content: `与${resume.name}进行了沟通，讨论了职位需求、薪资期望等相关事项。${i % 3 === 0 ? '候选人对我们的职位很感兴趣。' : ''}${i % 5 === 0 ? '需要进一步跟进。' : ''}`,
            result: results[Math.floor(Math.random() * results.length)],
            notes: i % 4 === 0 ? `后续需要与${resume.name}保持联系，关注其求职动态。` : ''
        });
    }
    
    return communications;
}

function generateCustomers(count) {
    // 客户数据生成实现
    const customers = [];
    const companyNames = [
        '阿里巴巴', '腾讯', '百度', '京东', '小米', '华为', '字节跳动', '美团', '滴滴', '网易', 
        '快手', '拼多多', '联想', 'OPPO', 'vivo', '携程', '新浪', '搜狐', '网易', '360',
        '爱奇艺', '哔哩哔哩', '知乎', '小红书', '虎牙', '斗鱼', '完美世界', '巨人网络', '盛大游戏', '腾讯游戏'
    ];
    
    for (let i = 1; i <= count; i++) {
        const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
        const contactPerson = getRandomRealName();
        const namePinyin = getNamePinyin(contactPerson);
        
        customers.push({
            id: i,
            name: companyName,
            contactPerson: contactPerson,
            phone: `1381234${(1000 + i).toString().substring(1)}`,
            email: `${namePinyin}@${companyName.toLowerCase().replace(/[^\w]/g, '')}.com`,
            address: `${['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)]}市${['朝阳区', '海淀区', '浦东新区', '福田区', '西湖区'][Math.floor(Math.random() * 5)]}`,
            description: `这是${companyName}公司的描述信息，包含公司简介、业务范围等内容。`,
            createTime: randomDate(new Date(2020, 0, 1), new Date())
        });
    }
    
    return customers;
}

function generateEducations(count) {
    // 教育经历数据生成函数
    const educations = [];
    const schools = [
        '北京大学', '清华大学', '上海交通大学', '复旦大学', '浙江大学', 
        '南京大学', '武汉大学', '中国科学技术大学', '哈尔滨工业大学', '西安交通大学',
        '同济大学', '中山大学', '南开大学', '华中科技大学', '四川大学',
        '厦门大学', '东南大学', '中南大学', '山东大学', '吉林大学',
        '北京航空航天大学', '华东师范大学', '北京师范大学', '华南理工大学', '天津大学'
    ];
    const majors = [
        '计算机科学与技术', '软件工程', '信息与计算科学', '信息管理与信息系统', '数据科学与大数据技术',
        '网络工程', '物联网工程', '人工智能', '电子信息工程', '电气工程及其自动化',
        '自动化', '通信工程', '机械工程', '材料科学与工程', '土木工程',
        '工商管理', '市场营销', '会计学', '财务管理', '人力资源管理',
        '国际经济与贸易', '金融学', '法学', '英语', '日语'
    ];
    
    // 为简历生成教育经历
    const resumes = window.mockData.resumes;
    
    // ID计数器
    let idCounter = 1;
    
    resumes.forEach(resume => {
        // 为每个简历随机生成1-3条教育经历
        const eduCount = Math.floor(Math.random() * 3) + 1;
        
        // 根据简历的学历生成合理的教育轨迹
        // degree: 0-高中, 1-专科, 2-本科, 3-硕士, 4-博士
        const resumeDegree = resume.degree;
        
        // 构建可能的学历路径
        const possibleDegrees = [];
        
        // 确保至少有本科学历
        possibleDegrees.push(2); // 本科
        
        // 根据简历中的最高学历添加更高学历
        if (resumeDegree >= 3) {
            possibleDegrees.push(3); // 硕士
        }
        if (resumeDegree >= 4) {
            possibleDegrees.push(4); // 博士
        }
        
        // 如果教育经历数量多于可能的学历路径，添加专科或高中
        if (eduCount > possibleDegrees.length) {
            if (Math.random() > 0.5) {
                possibleDegrees.unshift(1); // 专科
            } else {
                possibleDegrees.unshift(0); // 高中
            }
        }
        
        // 确保教育经历数量不超过可能的学历路径
        const actualEduCount = Math.min(eduCount, possibleDegrees.length);
        
        // 年龄计算：假设22岁本科毕业，25岁硕士毕业，28岁博士毕业
        const currentYear = new Date().getFullYear();
        let graduationYear = currentYear - (resume.age - 22);
        
        // 逆序生成学历（先博士，后硕士，再本科...）
        for (let i = possibleDegrees.length - 1; i >= possibleDegrees.length - actualEduCount; i--) {
            const degree = possibleDegrees[i];
            const school = schools[Math.floor(Math.random() * schools.length)];
            const major = majors[Math.floor(Math.random() * majors.length)];
            
            // 根据学历设置就读时间
            let startYear, endYear;
            
            switch (degree) {
                case 4: // 博士
                    endYear = graduationYear;
                    startYear = endYear - 3;
                    graduationYear = startYear;
                    break;
                case 3: // 硕士
                    endYear = graduationYear;
                    startYear = endYear - 3;
                    graduationYear = startYear;
                    break;
                case 2: // 本科
                    endYear = graduationYear;
                    startYear = endYear - 4;
                    graduationYear = startYear;
                    break;
                case 1: // 专科
                    endYear = graduationYear;
                    startYear = endYear - 3;
                    graduationYear = startYear;
                    break;
                case 0: // 高中
                    endYear = graduationYear;
                    startYear = endYear - 3;
                    graduationYear = startYear;
                    break;
            }
            
            // 创建教育经历记录
            educations.push({
                id: idCounter++,
                resumeId: resume.id,
                school: school,
                degree: degree,
                major: major,
                startDate: new Date(`${startYear}-09-01`),
                endDate: new Date(`${endYear}-07-01`),
                createTime: new Date(resume.createTime)
            });
        }
    });
    
    return educations;
}

function generateWorkExperiences(count) {
    // 工作经历数据生成函数
    const workExperiences = [];
    const companies = [
        '阿里巴巴', '腾讯', '百度', '京东', '小米', '华为', '字节跳动', '美团', '滴滴', '网易', 
        '快手', '拼多多', '联想', 'OPPO', 'vivo', '携程', '新浪', '搜狐', '网易', '360',
        '爱奇艺', '哔哩哔哩', '知乎', '小红书', '虎牙', '斗鱼', '完美世界', '巨人网络', '盛大游戏', '腾讯游戏'
    ];
    const departments = [
        '技术部', '研发中心', '产品部', '设计部', '运营部', 
        '市场部', '销售部', '客服部', '人力资源部', '财务部',
        '法务部', '战略发展部', '数据分析部', '质量控制部', '供应链管理部'
    ];
    const positions = [
        '前端开发工程师', '后端开发工程师', 'UI/UX设计师', '产品经理', '运维工程师', 
        '数据分析师', '项目经理', '测试工程师', '全栈工程师', 'DevOps工程师', 
        '安全工程师', '人工智能工程师', '大数据工程师', '云计算架构师', '网络工程师',
        '移动端开发工程师', '系统架构师', 'Java开发工程师', 'Python开发工程师', '算法工程师',
        '技术总监', '运营专员', '销售经理', 'HR专员', '市场营销专员'
    ];
    const descriptions = [
        '负责{company}的{position}相关工作，参与多个核心项目的开发与维护。',
        '在{company}担任{position}，主导了团队的技术升级与架构优化，提升了系统性能。',
        '作为{company}的{position}，负责产品从设计到上线的全流程工作，推动了多个重要功能的落地。',
        '在{company}{department}任职{position}，参与了公司核心业务系统的开发与优化。',
        '担任{company}的{position}，负责团队管理和项目协调，成功交付了多个重要项目。',
        '作为{company}{department}的{position}，主导技术选型和架构设计，解决了系统的关键性能问题。',
        '在{company}担任{position}，负责核心算法的研发与优化，提升了产品的竞争力。'
    ];
    
    // 为简历生成工作经历
    const resumes = window.mockData.resumes;
    
    // ID计数器
    let idCounter = 1;
    
    resumes.forEach(resume => {
        // 为每个简历随机生成1-5条工作经历
        let expCount = Math.floor(Math.random() * 5) + 1;
        
        // 如果简历中的工作经验年限为0，则只生成0-1条工作经历
        if (resume.experience === 0) {
            expCount = Math.min(expCount, 1);
        }
        
        // 根据简历中的工作经验年限，限制总工作经历长度
        // 假设每份工作平均1-3年
        const maxYearsToAllocate = resume.experience;
        let yearsAllocated = 0;
        
        // 如果工作经验为0但需要生成工作经历，则假设是实习或短期工作
        if (maxYearsToAllocate === 0 && expCount === 1) {
            yearsAllocated = 0.5; // 半年实习
        }
        
        // 获取最早可能的工作开始年份（基于年龄和教育背景）
        // 假设22岁开始工作
        const currentYear = new Date().getFullYear();
        const earliestWorkYear = currentYear - (resume.age - 22);
        
        // 从最近的工作开始逆序生成
        let latestEndDate = new Date();
        
        for (let i = 0; i < expCount && yearsAllocated < maxYearsToAllocate; i++) {
            // 随机公司、部门和职位
            const company = companies[Math.floor(Math.random() * companies.length)];
            const department = departments[Math.floor(Math.random() * departments.length)];
            const position = positions[Math.floor(Math.random() * positions.length)];
            
            // 确定工作时长（1-3年，但不超过剩余可分配年限）
            let workDuration = Math.floor(Math.random() * 2) + 1; // 1-3年
            workDuration = Math.min(workDuration, maxYearsToAllocate - yearsAllocated);
            
            // 特殊处理：如果是第一份工作且当前在职，则没有结束日期
            const isCurrent = i === 0 && Math.random() > 0.3;
            
            // 计算开始和结束日期
            let endDate = isCurrent ? null : new Date(latestEndDate);
            
            // 随机生成月份（1-12）和日期（1-28）
            const startMonth = Math.floor(Math.random() * 12) + 1;
            const startDay = Math.floor(Math.random() * 28) + 1;
            const endMonth = Math.floor(Math.random() * 12) + 1;
            const endDay = Math.floor(Math.random() * 28) + 1;
            
            // 如果有结束日期，则从上一份工作的结束日期前推
            if (endDate) {
                // 为工作之间增加1-3个月的间隔
                const gapMonths = Math.floor(Math.random() * 3) + 1;
                endDate.setMonth(endDate.getMonth() - gapMonths);
                endDate.setDate(endDay);
            }
            
            // 计算开始日期
            const startDate = new Date(endDate || latestEndDate);
            startDate.setFullYear(startDate.getFullYear() - workDuration);
            startDate.setMonth(startMonth - 1);
            startDate.setDate(startDay);
            
            // 更新最晚结束日期为当前工作的开始日期
            latestEndDate = new Date(startDate);
            
            // 增加已分配的工作年限
            yearsAllocated += workDuration;
            
            // 生成工作描述
            let description = descriptions[Math.floor(Math.random() * descriptions.length)];
            description = description.replace('{company}', company)
                                   .replace('{department}', department)
                                   .replace('{position}', position);
            
            // 创建工作经历记录
            workExperiences.push({
                id: idCounter++,
                resumeId: resume.id,
                company: company,
                position: position,
                department: department,
                startDate: startDate,
                endDate: endDate,
                current: isCurrent,
                description: description,
                createTime: new Date(resume.createTime)
            });
        }
    });
    
    return workExperiences;
}

// 实现数据持久化的函数
function loadPersistedData() {
    try {
        // 尝试从localStorage获取数据
        const persistedData = localStorage.getItem('recruitmentSystemData');
        
        // 如果存在已保存的数据，解析并返回
        if (persistedData) {
            const parsedData = JSON.parse(persistedData);
            
            // 将字符串日期转换回Date对象
            if (parsedData.resumes) {
                parsedData.resumes.forEach(resume => {
                    resume.createTime = new Date(resume.createTime);
                    resume.updateTime = new Date(resume.updateTime);
                });
            }
            
            if (parsedData.positions) {
                parsedData.positions.forEach(position => {
                    position.createTime = new Date(position.createTime);
                });
            }
            
            if (parsedData.users) {
                parsedData.users.forEach(user => {
                    user.joinTime = new Date(user.joinTime);
                    user.createTime = new Date(user.createTime);
                    if (user.leaveTime) {
                        user.leaveTime = new Date(user.leaveTime);
                    }
                });
            }
            
            if (parsedData.interviews) {
                parsedData.interviews.forEach(interview => {
                    interview.time = new Date(interview.time);
                    interview.createTime = new Date(interview.createTime);
                });
            }
            
            if (parsedData.communications) {
                parsedData.communications.forEach(comm => {
                    comm.date = new Date(comm.date);
                });
            }
            
            if (parsedData.workExperiences) {
                parsedData.workExperiences.forEach(exp => {
                    exp.startDate = new Date(exp.startDate);
                    if (exp.endDate) {
                        exp.endDate = new Date(exp.endDate);
                    }
                    exp.createTime = new Date(exp.createTime);
                });
            }
            
            if (parsedData.educations) {
                parsedData.educations.forEach(edu => {
                    edu.startDate = new Date(edu.startDate);
                    edu.endDate = new Date(edu.endDate);
                    edu.createTime = new Date(edu.createTime);
                });
            }
            
            if (parsedData.recommendations) {
                parsedData.recommendations.forEach(rec => {
                    rec.createTime = new Date(rec.createTime);
                });
            }
            
            console.log('已从本地存储加载数据');
            return parsedData;
        }
    } catch (error) {
        console.error('从本地存储加载数据时出错:', error);
    }
    
    // 如果没有已保存的数据或发生错误，返回null
    return null;
}

// 保存数据到localStorage的函数
function persistData(data) {
    try {
        // 将数据转换为JSON字符串并保存到localStorage
        localStorage.setItem('recruitmentSystemData', JSON.stringify(data));
        console.log('数据已保存到本地存储');
    } catch (error) {
        console.error('保存数据到本地存储时出错:', error);
    }
}

// 立即初始化所有模拟数据
(function initMockData() {
    // 尝试从本地存储加载数据
    const loadedData = loadPersistedData();
    
    if (loadedData) {
        // 使用加载的数据
        window.mockData = loadedData;
    } else {
        // 生成新数据
        // 生成至少50个数据，以确保有足够的选项可以选择
        const count = 50;
        
        // 先生成基础数据
        window.mockData.positions = generatePositions(count);
        window.mockData.resumes = generateResumes(count);
        window.mockData.users = generateUsers(20);
        
        // 生成依赖基础数据的数据
        window.mockData.interviews = generateInterviews(count);
        window.mockData.recommendations = generateRecommendations(count);
        window.mockData.communications = generateCommunications(count);
        window.mockData.customers = generateCustomers(20);
        window.mockData.educations = generateEducations(count);
        window.mockData.workExperiences = generateWorkExperiences(count);
        
        // 将数据保存到本地存储
        persistData(window.mockData);
    }
    
    console.log('Mock data initialized:', window.mockData);
})();

// 添加一个导出函数，便于其他地方调用
window.saveMockData = function() {
    persistData(window.mockData);
}; 